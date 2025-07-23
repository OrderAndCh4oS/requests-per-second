import {Worker} from "worker_threads";

/**
 * Call `fn` exactly `rateHz` times per second
 * for `durationSec` seconds (≈ rateHz*durationSec calls).
 *
 * Resolves when the run finishes.  Any error in the worker
 * rejects the promise.
 */
export function callNPerSecond(
    fn: () => void | Promise<void>,
    rateHz: number,
    durationSec: number,
): Promise<void> {
    if (rateHz <= 0) throw new Error('rateHz must be > 0');
    if (durationSec <= 0) throw new Error('durationSec must be > 0');

    const workerUrl = new URL('./precise-ticker-worker.ts', import.meta.url);

    return new Promise((resolve, reject) => {
        const worker = new Worker(workerUrl, {
            workerData: {rateHz, durationSec},
        });

        worker.on('message', fn);

        worker.once('error', reject);
        worker.once('exit', code => {
            code === 0
                ? resolve()
                : reject(new Error(`ticker worker exited with code ${code}`));
        });
    });
}
