# PICK BLUE

Pick is an API that helps determine whether your query should run in an On-Semand project or in a Slot Reservation project. To get the big picture, follow this [tutorial](http://biq.blue/blog/compute/how-to-implement-bigquery-autoscaling-reservation-in-10-minutes).

## How to run this example project?

### Create .ENV

Add a `.ENV` file at the root of the project:

```sh
PICK_API_URL=https://pick.biq.blue
PICK_API_KEY=<YOUR_API_KEY>
ON_DEMAND_KEY_FILE=<PATH TO THE SERVICE-ACCOUNT.JSON FOR YOUR ON-DEMAND PROJECT>
RESERVATION_KEY_FILE=<PATH TO THE SERVICE-ACCOUNT.JSON FOR YOUR AUTOSCALING PROJECT>
REGION=<YOUR REGION (can be: us/eu/europe-west1/...)>
```

### Modify query.sql

The `query.sql` file contains the test query. Choose a query in Biq Blue that is currently running On-Demand but would be more cost-effective in a Slot Reservation. Copy this query into `query.sql`.

### Start

Install dependencies:
- python-dotenv
- google-cloud-bigquery

```sh
virtualenv <env>
source <env>/bin/activate
python index.py
```

Start it twice to see the query runs into the reservation the second time.

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
    job2 = target.get_job(job.job_id)  # get last metadata
    await pick.update_from_query(query, job2)  # update pick
```