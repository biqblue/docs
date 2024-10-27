import hashlib
import os
import requests

def call_pick_api(path, body):
    try:
        api_url = os.getenv("PICK_API_URL")
        api_key = os.getenv("PICK_API_KEY")
        if not api_url or not api_key:
            raise ValueError("PICK_API_URL or PICK_API_KEY is not set")

        response = requests.post(
            f"{api_url}{path}",
            json=body,
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {api_key}",
            }
        )
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"[pick.biq.blue] Error {e} at {path}")
        return None

async def should_pick(hash):
    res = call_pick_api("/pick", {"hash": hash})
    if not res or not res.get("pick"):
        return "ON-DEMAND"  # Défaut à "ON-DEMAND"
    return res["pick"]

async def write_query(body):
    call_pick_api("/write", body)

# GET
async def get_from_hash(hash):
    return await should_pick(hash)

async def get_from_query(query):
    # Calculer le hash de la requête
    hash = hashlib.sha256(query.encode()).hexdigest()
    return await get_from_hash(hash)

# UPDATE
async def update_from_hash(hash, job):
    if not job.job_id:
        print(f"[pick.biq.blue] No job id for {hash}")
    else:
        await write_query({
            "hash": hash,
            "job_id": job.job_id,
            "creation_time": job.created.isoformat(),
            "start_time": job.started.isoformat(),
            "end_time": job.ended.isoformat(),
            "total_slot_ms": job.total_slot_ms,
            "total_bytes_billed": job.total_bytes_billed,
            "total_bytes_processed": job.total_bytes_processed,
            "bi_engine_mode": getattr(job, "bi_engine_statistics", {}).get("bi_engine_mode", None),
            "reservation_id": None,
        })

async def update_from_query(query, job):
    hash = hashlib.sha256(query.encode()).hexdigest()
    await update_from_hash(hash, job)
