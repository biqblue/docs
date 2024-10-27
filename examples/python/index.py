from google.cloud import bigquery
import os
import asyncio

from dotenv import load_dotenv
load_dotenv()

import pick
import json

# You need at least 2 projects: one for on-demand and one for reservation autoscaling
bigquery_on_demand = bigquery.Client(project=os.getenv("ON_DEMAND_PROJECT_ID"))
bigquery_reservation = bigquery.Client(project=os.getenv("RESERVATION_PROJECT_ID"))

async def run_query(query):

    # choose the project based on the pick result
    pick_result = await pick.get_from_query(query)
    target = bigquery_reservation if pick_result == "RESERVATION" else bigquery_on_demand
    
    job = target.query(query, job_config=bigquery.QueryJobConfig(use_query_cache=False))
    result = job.result()

    # One the query is done, update the pick
    job2 = target.get_job(job.job_id) # get the last metadata
    job2.total_slot_ms = sum([stage.slot_ms for stage in job2.query_plan]) if job2.query_plan else "N/A"
    print(f"{pick_result} : totalSlotMs: {job2.total_slot_ms}, totalBytesProcessed: {job2.total_bytes_processed}, query: {query}")
    await pick.update_from_query(query, job2)
    
async def main():
    queries = [
        'select "hello";',
        'select *, "yooo" as yo from `bigquery-public-data.bbc_news.fulltext`;',
    ]
    await asyncio.gather(*[run_query(query) for query in queries])

if __name__ == "__main__":
    asyncio.run(main())
