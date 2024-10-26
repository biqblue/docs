const crypto = require("crypto");
const fetch = require("node-fetch");

async function callPickApi(path, body) {
  try {
    if (!process.env.PICK_API_URL || !process.env.PICK_API_KEY) {
      throw new Error("PICK_API_URL or PICK_API_KEY is not set");
    }
    const response = await fetch(`${process.env.PICK_API_URL}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.PICK_API_KEY}`,
      },
      body: JSON.stringify(body),
    });
    return response.json();
  } catch (e) {
    console.log(`[pick.biq.blue] Error ${e.message} at ${path}`);
  }
  return null;
}

async function shouldPick(hash) {
  const res = await callPickApi("/pick", { hash });
  if (!res || !res.pick) {
    return "ON-DEMAND"; // always default to on-demand
  }
  return res.pick === "ON-DEMAND" ? "ON-DEMAND" : "RESERVATION";
}

async function writeQuery(body) {
  await callPickApi("/write", body);
}

// GET
async function getFromHash(hash) {
  return shouldPick(hash);
}

async function getFromQuery(query) {
  const hash = crypto.createHash("sha256").update(query).digest("hex");
  return getFromHash(hash);
}

// UPDATE
async function updateFromHash(hash, job) {
  if (!job.id) {
    console.log(`[pick.biq.blue] No job id for ${hash}`);
  } else {
    return writeQuery({
      hash,
      job_id: job.id,
      creation_time: job.metadata.statistics.creationTime,
      start_time: job.metadata.statistics.startTime,
      end_time: job.metadata.statistics.endTime,
      total_slot_ms: job.metadata.statistics.totalSlotMs,
      total_bytes_billed: job.metadata.statistics.query.totalBytesBilled,
      total_bytes_processed: job.metadata.statistics.query.totalBytesProcessed,
      bi_engine_mode: job.metadata.statistics.query.biEngineStatistics ? job.metadata.statistics.query.biEngineStatistics.biEngineMode : null,
      reservation_id: null,
    });
  }
}

async function updateFromQuery(query, job) {
  const hash = crypto.createHash("sha256").update(query).digest("hex");
  return updateFromHash(hash, job);
}

module.exports = { getFromHash, getFromQuery, updateFromHash, updateFromQuery };
