import { callNPerSecond } from './precise-ticker.ts';

(async () => {
    console.time('run');
    await callNPerSecond(
        () => console.log('tick', Date.now()),
        200,
        3,
    );
    console.timeEnd('run');
})();