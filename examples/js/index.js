const fs = require('fs');
require("dotenv/config");

const { BigQuery } = require("@google-cloud/bigquery");
const jsonOnDemand = require(process.env.ON_DEMAND_KEY_FILE);
const jsonReservation = require(process.env.RESERVATION_KEY_FILE);
const bigqueryOnDemand = new BigQuery({ projectId: jsonOnDemand.project_id, keyFilename: process.env.ON_DEMAND_KEY_FILE });
const bigqueryReservation = new BigQuery({ projectId: jsonReservation.projectId, keyFilename: process.env.RESERVATION_KEY_FILE });

const pick = require("./pick");

async function runQuery(query) {

  // ask Pick API which project to use
  const pickResult = await pick.getFromQuery(query);
  const target = pickResult === "RESERVATION" ? bigqueryReservation : bigqueryOnDemand;

  console.log('Checking configuration...');
  console.log('- OnDemand project_id:', await bigqueryOnDemand.getProjectId(), `(${process.env.ON_DEMAND_KEY_FILE})`);
  console.log('- Reservation project_id:', await bigqueryReservation.getProjectId(), `(${process.env.RESERVATION_KEY_FILE})`);
  console.log();
  console.log('☝️ Pick says: use', pickResult);
  console.log();

  const [job] = await target.createQueryJob({
    query,
    location: process.env.REGION,
  });

  // Wait for the query to finish
  await job.getQueryResults();

  // get the last metadata
  const [job2] = await target.job(job.id, {location: process.env.REGION}).get();
  await pick.updateFromQuery(query, job2); // update pick

  // show cost to confirm that pick is right
  const total_bytes_processed = job2.metadata.statistics.totalBytesProcessed;
  const total_slot_ms = job2.metadata.statistics.totalSlotMs;
  const bi_engine_mode = job2.metadata.statistics.bi_engine_statistics ? job2.metadata.statistics.bi_engine_statistics.bi_engine_mode : '';

  // ON-DEMAND:
  // bigquery bills minimum 10MB / query
  // 10MB = 10 * 1024 * 1024 = 10485760 bytes
  // minimum cost = 10MB * $6.25 / TB = $0.00005960464
  const costOnDemand =
    total_bytes_processed > 0 && total_bytes_processed < 10485760
      ? 0.00005960464
      : (total_bytes_processed / 1024 / 1024 / 1024 / 1024) * 6.25;
  const costSlot = total_slot_ms * (0.06 / 60 / 60 / 1000); // $0.06 / slot hour
  let best = "ON-DEMAND"; // by default

  if (bi_engine_mode === "FULL") {
    // stay ON-DEMAND, it's going to use BI-Engine
    best = "ON-DEMAND";
  } else if (costSlot < costOnDemand) {
    best = "RESERVATION";
  }

  // print information
  console.log('Job:', `${job2.metadata.jobReference.projectId}:${job2.metadata.jobReference.location}:${job2.metadata.jobReference.jobId}`);
  console.log(`- OnDemand: $${costOnDemand}`, `(totalBytesProcessed: ${job2.metadata.statistics.totalBytesProcessed})`);
  console.log(`- Reservation: $${costSlot}`, `(totalSlotMs: ${job2.metadata.statistics.totalSlotMs})`);
  console.log();

  if (best === pickResult && best === "RESERVATION") {
    console.log('🎉', 'Pick was right!', `This query costs -${(100*((costOnDemand-costSlot)/costOnDemand)).toFixed(2)}% using a slot reservation`);
  }
}

async function main() {
  const query = fs.readFileSync('query.sql', 'utf8');
  await runQuery(query);
}

main().catch(error => {
  console.error('❌', error.toString());
  process.exit(1);
});
