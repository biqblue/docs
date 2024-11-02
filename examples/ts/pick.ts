import crypto from 'crypto';

async function callPickApi(path: string, body: object) {
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

        if (response.status >= 400) {
            throw new Error(`HTTP ${response.status} ${response.statusText}`);
        }
        
        return response.json();
    } catch (e: any) {
        console.log(`[pick.biq.blue] Error ${e.message ? e.message : 'unknown'} at ${path}`);
    }
    return null;
}

async function shouldPick(hash: string): Promise<string> {
    const res = await callPickApi("/pick", { hash });
    return res && res.pick === "ON-DEMAND" ? "ON-DEMAND" : "RESERVATION";
}

export async function getFromHash(hash: string): Promise<string> {
    return shouldPick(hash);
}

export async function getFromQuery(query: string): Promise<string> {
    const hash = crypto.createHash("sha256").update(query).digest("hex");
    return getFromHash(hash);
}

export async function updateFromHash(hash: string, job: any) {
    if (!job.id) {
        console.log(`[pick.biq.blue] No job id for ${hash}`);
    } else {
        await callPickApi("/write", {
            hash,
            job_id: job.id,
            creation_time: job.metadata.statistics.creationTime,
            start_time: job.metadata.statistics.startTime,
            end_time: job.metadata.statistics.endTime,
            total_slot_ms: job.metadata.statistics.totalSlotMs,
            total_bytes_billed: job.metadata.statistics.query.totalBytesBilled,
            total_bytes_processed: job.metadata.statistics.query.totalBytesProcessed,
            bi_engine_mode: job.metadata.statistics.query.biEngineStatistics?.biEngineMode || '',
            reservation_id: null,
        });
    }
}

export async function updateFromQuery(query: string, job: any) {
    const hash = crypto.createHash("sha256").update(query).digest("hex");
    return updateFromHash(hash, job);
}
