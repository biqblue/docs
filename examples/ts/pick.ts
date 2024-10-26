import crypto from "crypto";
import { Job } from "@google-cloud/bigquery";

async function callPickApi<T>(path: string, body: any): Promise<T | null> {
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
  } catch (e: any) {
    console.log(`[pick.biq.blue] Error ${e.message} at ${path}`);
  }
  return null;
}

async function shouldPick(hash: string): Promise<"ON-DEMAND" | "RESERVATION"> {
  const res = await callPickApi<{
    hash: string;
    pick: "ON-DEMAND" | "RESERVATION";
  }>("/pick", { hash });
  if (!res || !res.pick) {
    // always default to on-demand
    return "ON-DEMAND";
  }
  return res.pick === "ON-DEMAND" ? "ON-DEMAND" : "RESERVATION";
}

async function writeQuery(body: {
  hash: string;
  job_id: string;
  creation_time: string;
  start_time: string;
  end_time: string;
  total_slot_ms: number;
  total_bytes_billed: number;
  total_bytes_processed: number;
  bi_engine_mode: string;
  reservation_id: string | null;
}) {
  await callPickApi("/write", body);
}

// GET
export async function getFromHash(hash: string) {
  return shouldPick(hash);
}

export async function getFromQuery(query: string) {
  // compute hash of the query
  const hash = crypto.createHash("sha256").update(query).digest("hex");
  return getFromHash(hash);
}

// UPDATE
export async function updateFromHash(hash: string, job: Job) {
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
      bi_engine_mode: job.metadata.statistics.query.biEngineStatistics ? job.metadata.statistics.query.biEngineStatistics?.biEngineMode : null,
      reservation_id: null,
    });
  }
}

export async function updateFromQuery(query: string, job: Job) {
  // compute hash of the query
  const hash = crypto.createHash("sha256").update(query).digest("hex");
  return updateFromHash(hash, job);
}