# request-per-second

A utility for making function calls at a precise rate (N times per second) for a specified duration.

## Installation

Clone this repository and install dependencies:

```bash
git clone https://github.com/yourusername/request-per-second.git
cd request-per-second
npm install
```

Run the project:

```bash
npx tsx src/index.ts
```

Or use the npm script:

```bash
npm run start
```

Both methods run the TypeScript code directly without requiring a build step.

## Usage

```typescript
import { callNPerSecond } from 'request-per-second';

// Call a function 10 times per second for 5 seconds
await callNPerSecond(
  () => console.log('Function called at', Date.now()),
  10,  // rate in Hz (calls per second)
  5    // duration in seconds
);

// Make API requests at a controlled rate
await callNPerSecond(
  async () => {
    try {
      const response = await fetch('https://api.example.com/data');
      const data = await response.json();
      // Process data
    } catch (error) {
      console.error('Request failed:', error);
    }
  },
  5,    // 5 requests per second
  60    // for 1 minute
);
```

## API

### callNPerSecond(fn, rateHz, durationSec)

Calls a function at a precise rate for a specified duration.

Parameters:
- `fn`: Function to call. Can be synchronous or asynchronous.
- `rateHz`: Number of calls per second (must be greater than 0).
- `durationSec`: Duration in seconds (must be greater than 0).

Returns:
- A Promise that resolves when all calls are completed.

## How It Works

This utility uses Node.js Worker Threads to achieve precise timing. It combines busy-waiting and sleeping strategies to maintain accurate intervals between function calls.
