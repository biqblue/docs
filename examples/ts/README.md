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

```sh
npm install
npm start
```

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