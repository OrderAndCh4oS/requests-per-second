import {parentPort, workerData} from "node:worker_threads";

const { rateHz, durationSec } = workerData as {
    rateHz: number;
    durationSec: number;
};

if (!parentPort) throw new Error('Must be run as a worker thread');

const totalCalls = rateHz * durationSec;
const intervalNs = BigInt(1.0e9 / rateHz);
const startTime  = process.hrtime.bigint();

const sab  = new SharedArrayBuffer(4);
const flag = new Int32Array(sab);

function sleepMs(ms: number) {
    Atomics.wait(flag, 0, 0, ms);
}

for (let i = 0; i < totalCalls; i++) {
    const target = startTime + BigInt(i) * intervalNs;

    while (true) {
        const now   = process.hrtime.bigint();
        const delta = target - now;
        if (delta <= 0n) break;

        if (delta > 1_500_000n) {
            sleepMs(Number((delta - 500_000n) / 1_000_000n));
        }
    }

    parentPort.postMessage(undefined);
}

process.exit(0);
