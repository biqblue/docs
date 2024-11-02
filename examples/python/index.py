from google.cloud import bigquery
import os
import asyncio

from dotenv import load_dotenv
load_dotenv()

import pick
import json

# You need at least 2 projects: one for on-demand and one for reservation autoscaling
region = os.getenv("REGION")
bigquery_on_demand = bigquery.Client.from_service_account_json(os.getenv("ON_DEMAND_KEY_FILE"), location=region)
bigquery_reservation = bigquery.Client.from_service_account_json(os.getenv("RESERVATION_KEY_FILE"), location=region)

async def run_query(query):

    # ask Pick API which project to use
    pick_result = await pick.get_from_query(query)
    target = bigquery_reservation if pick_result == "RESERVATION" else bigquery_on_demand

    print("Checking configuration...")
    print(f"- OnDemand project_id: {bigquery_on_demand.project}")
    print(f"- Reservation project_id: {bigquery_reservation.project}\n")
    print(f"☝️ Pick says: use {pick_result}\n")
    
    # Wait for the query to finish
    job = target.query(query, job_config=bigquery.QueryJobConfig(use_query_cache=False))
    result = job.result()

    # One the query is done, update the pick
    job2 = target.get_job(job.job_id) # get the last metadata
    job2.total_slot_ms = sum([stage.slot_ms for stage in job2.query_plan]) if job2.query_plan else "N/A"
    await pick.update_from_query(query, job2)

    # show cost to confirm that pick is right
    total_bytes_processed = job2.total_bytes_processed
    total_slot_ms = job2.total_slot_ms
    bi_engine_mode = getattr(job2, "bi_engine_statistics", {}).get("bi_engine_mode", '')

    # ON-DEMAND:
    # bigquery bills minimum 10MB / query
    # 10MB = 10 * 1024 * 1024 = 10485760 bytes
    # minimum cost = 10MB * $6.25 / TB = $0.00005960464
    cost_on_demand = 0.00005960464 if 0 < total_bytes_processed < 10485760 else (total_bytes_processed / (1024 ** 4)) * 6.25
    cost_slot = total_slot_ms * (0.06 / 3600000)
    best = "ON-DEMAND" if bi_engine_mode == "FULL" or cost_on_demand <= cost_slot else "RESERVATION"

    print(f"Job: {job2.job_id}")
    print(f"- OnDemand: ${cost_on_demand} (totalBytesProcessed: {total_bytes_processed})")
    print(f"- Reservation: ${cost_slot} (totalSlotMs: {total_slot_ms})\n")

    if best == pick_result and best == "RESERVATION":
        gain = round(100*((cost_on_demand-cost_slot)/cost_on_demand), 2)
        print(f"🎉 Pick was right! This query costs -{gain}% using a slot reservation")

    
async def main():
    with open("query.sql", "r") as file:
        query = file.read()
    await asyncio.gather(*[run_query(query) for query in [query]])

if __name__ == "__main__":
    asyncio.run(main())
