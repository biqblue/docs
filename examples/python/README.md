# PICK BLUE

Pick is an API to simply know if you should run your query in an on-demand project or in a slot reservation project.

## How to run this example project?

### .ENV

Add a `.ENV` file at the root of the project:

```sh
PICK_API_URL=https://pick.biq.blue
PICK_API_KEY=<YOUR_API_KEY>
ON_DEMAND_PROJECT_ID=<YOUR_ON-DEMAND_PROJECT_ID>
RESERVATION_PROJECT_ID=<YOUR_RESERVATION_PROJECT_ID>
```

### Start

Install dependencies:
- python-dotenv
- google-cloud-bigquery

```sh
python index.py
```

## How to implement Pick API in your project?

Add `pick.py` file to your project, then you have to call 2 methods.

### pick.get_from_query()

Returns "ON-DEMAND" or "RESERVATION".

```py
    pick_result = await pick.get_from_query(query)
    target = bigquery_reservation if pick_result == "RESERVATION" else bigquery_on_demand
    job = target.query(...)
```

### pick.update_from_query()

Send metadata to pick.

```py
result = job.result()  # wait for the end

if job.job_id:
    job = target.get_job(job.job_id)  # get last metadata
    await pick.update_from_query(query, job)  # update pick
```