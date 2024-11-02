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

```sh
npm install
npm start
```

Start it twice to see the query runs into the reservation the second time.

## How to implement Pick API in your project?

Add `pick.ts` file to your project, then you have to call 2 methods.

### pick.getFromQuery()

Returns "ON-DEMAND" or "RESERVATION".

```ts
const pickResult = await pick.getFromQuery(query);
const target = pickResult === "RESERVATION" ? bigqueryReservation : bigqueryOnDemand; // choose which project to use
const [job] = await target.createQueryJob(...)
```

### pick.updateFromQuery()

Send metadata to pick.

```ts
// Wait for the query to finish
const [rows] = await job.getQueryResults();

// update pick with metadata
const [job2] = await target.job(job.id).get();
await pick.updateFromQuery(query, job2);
```