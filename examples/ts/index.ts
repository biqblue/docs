import * as fs from 'fs';
import { BigQuery, Job } from '@google-cloud/bigquery';
import { config } from 'dotenv';
import * as pick from './pick';

config();

const jsonOnDemand = require(process.env.ON_DEMAND_KEY_FILE || '');
const jsonReservation = require(process.env.RESERVATION_KEY_FILE || '');

const bigqueryOnDemand = new BigQuery({ projectId: jsonOnDemand.project_id, keyFilename: process.env.ON_DEMAND_KEY_FILE });
const bigqueryReservation = new BigQuery({ projectId: jsonReservation.projectId, keyFilename: process.env.RESERVATION_KEY_FILE });

async function runQuery(query: string) {

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

    if (job.id) {

      // get the last metadata
      const [job2] = await target.job(job.id, { location: process.env.REGION }).get();
      await pick.updateFromQuery(query, job2);

      // show cost to confirm that pick is right
      const totalBytesProcessed = job2.metadata.statistics?.totalBytesProcessed || 0;
      const totalSlotMs = job2.metadata.statistics?.totalSlotMs || 0;
      const biEngineMode = job2.metadata.statistics?.biEngineStatistics?.biEngineMode || '';

      // ON-DEMAND:
      // bigquery bills minimum 10MB / query
      // 10MB = 10 * 1024 * 1024 = 10485760 bytes
      // minimum cost = 10MB * $6.25 / TB = $0.00005960464
      const costOnDemand = totalBytesProcessed > 0 && totalBytesProcessed < 10485760 ? 0.00005960464 : (totalBytesProcessed / (1024 ** 4)) * 6.25;
      const costSlot = totalSlotMs * (0.06 / 3600000);
      let best = "ON-DEMAND";

      if (biEngineMode === "FULL") {
          best = "ON-DEMAND";
      } else if (costSlot < costOnDemand) {
          best = "RESERVATION";
      }

      console.log('Job:', `${job2.metadata.jobReference.projectId}:${job2.metadata.jobReference.location}:${job2.metadata.jobReference.jobId}`);
      console.log(`- OnDemand: $${costOnDemand}`, `(totalBytesProcessed: ${totalBytesProcessed})`);
      console.log(`- Reservation: $${costSlot}`, `(totalSlotMs: ${totalSlotMs})`);
      console.log();

      if (best === pickResult && best === "RESERVATION") {
          console.log('🎉', 'Pick was right!', `This query costs -${(100 * ((costOnDemand - costSlot) / costOnDemand)).toFixed(2)}% using a slot reservation`);
      }
    } else {
      throw new Error("Job ID is undefined");
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
