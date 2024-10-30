import { BigQuery } from "@google-cloud/bigquery";
const bigqueryOnDemand = new BigQuery({projectId: process.env.ON_DEMAND_PROJECT_ID});
const bigqueryReservation = new BigQuery({projectId: process.env.RESERVATION_PROJECT_ID});
import "dotenv/config";
import * as pick from "./pick";

async function runQuery(query: string) {
  const pickResult = await pick.getFromQuery(query); // get target
  const target = pickResult === "RESERVATION" ? bigqueryReservation : bigqueryOnDemand;
  const [job] = await target.createQueryJob({
    query,
    useQueryCache: false,
  });

  // Wait for the query to finish
  const [rows] = await job.getQueryResults();

  if (job.id) {
    const [job2] = await target.job(job.id).get(); // get the last metadata
    console.log(pickResult, ':', 'totalSlotMs:', job2.metadata.statistics.totalSlotMs, 'totalBytesProcessed:', job2.metadata.statistics.totalBytesProcessed, 'query:', query, );
    await pick.updateFromQuery(query, job2); // update pick
  } else {
    throw new Error("Job ID is undefined");
  }
}

async function main() {
  const queries = [
    `select "hello";`,
    `select *, "yooo" as yo from bigquery-public-data.bbc_news.fulltext;`,
  ];
  const promises = queries.map(runQuery);
  await Promise.all(promises);
}

main();