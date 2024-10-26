const { BigQuery } = require("@google-cloud/bigquery");
const bigqueryOnDemand = new BigQuery({ projectId: process.env.ON_DEMAND_PROJECT_ID});
const bigqueryReservation = new BigQuery({ projectId: process.env.RESERVATION_PROJECT_ID});
require("dotenv/config");
const pick = require("./pick");

async function runQuery(query) {
  const pickResult = await pick.getFromQuery(query);
  const target = pickResult === "RESERVATION" ? bigqueryReservation : bigqueryOnDemand; // choose which project to use
  const [job] = await target.createQueryJob({
    query,
    useQueryCache: false,
  });

  // Wait for the query to finish
  const [rows] = await job.getQueryResults();

  const [job2] = await target.job(job.id).get(); // get the last metadata
  console.log(pickResult, ':', 'totalSlotMs:', job2.metadata.statistics.totalSlotMs, 'totalBytesProcessed:', job2.metadata.statistics.totalBytesProcessed, 'query:', query);
  await pick.updateFromQuery(query, job2); // update pick
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
