# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

XPower UI is a cryptocurrency mining and minting web application that runs in the browser. Users mine for random nonces and mint XPower tokens (XPOW) using MetaMask or compatible Web3 wallets. The application supports NFTs (Non-Fungible Tokens) and PPTs (Proof-of-Proof Tokens), and operates on both mainnet and testnet networks.

## Build & Development Commands

### Prerequisites
- Node.js version: `^20.16.0`
- Install dependencies: `npm install`

### Common Commands
- **Lint code**: `npm run lint` (add `-- --fix` to auto-fix issues)
- **Type check**: `tsc` (compile TypeScript without emitting files)
- **Watch mode**: `npm run watch` (continuous TypeScript compilation)
- **Clean build artifacts**: `npm run clean` (removes public/{scripts,styles,views}/*)
- **Run tests**: `npm test` (runs Jest test suite)
- **Run single test**: `jest path/to/test-file.test.ts --verbose`

### Development Server
- **Production build**: `npm run build` (lints, compiles, runs prefetch.sh, builds with webpack)
- **Development (mainnet)**: `npm run dev@mainnet` (starts webpack watch + dev server on mainnet)
- **Development (testnet)**: `npm run dev@testnet` (starts webpack watch + dev server on testnet)
- **Start server**: `npm start` (runs production server on port 3000)

The development commands use `concurrently` to run webpack in watch mode alongside the Express server with hot reloading via `ts-node-dev`. Set `DEBUG="xpower-ui:*"` environment variable for debug logging.

### Build Process
The prebuild/predev scripts run in sequence:
1. `npm run lint` - ESLint validation
2. `tsc` - TypeScript compilation
3. `./prefetch.sh` - Prefetch external resources
4. Webpack bundling (development or production mode)

## Architecture

### Technology Stack
- **Frontend**: React 18 + TypeScript, Redux Toolkit for state management
- **Backend**: Express.js with Pug/Pig templating engines
- **Build**: Webpack 5 with ts-loader, SASS compilation
- **Blockchain**: ethers.js v6 for Web3 interactions
- **Mining**: WebAssembly workers using `wasm-miner` package
- **Testing**: Jest with ts-jest preset

### Project Structure

```
├── source/              # Core business logic (TypeScript)
│   ├── blockchain/      # Chain detection, providers, wallet connections
│   ├── contract/        # Smart contract interfaces & factories
│   ├── functions/       # Utility functions (nice formatting, modals, etc.)
│   ├── miner/           # Mining logic with Web Workers
│   └── redux/           # Redux store, actions, reducers, selectors, observers
├── views/               # React components (.tsx)
│   ├── app.tsx          # Main React app entry
│   ├── header/          # Navigation & wallet connector
│   ├── home/            # Landing page
│   ├── mine/            # Mining interface (minting + mining controls)
│   ├── nfts/            # NFT management (list, details, minter)
│   ├── ppts/            # PPT management (list, details, minter)
│   ├── swap/            # Token swapping interface
│   └── wallet/          # Wallet display components
├── routes/              # Express route handlers (.ts)
├── library/             # Browser-side initialization
├── public/              # Static assets & compiled outputs
└── bin/www.ts           # Server entry point with clustering
```

### State Management (Redux)

The application uses Redux Toolkit with a complex state architecture:

- **Store**: Located at `source/redux/store/store.ts`
- **Slices** managed by reducers in `source/redux/reducers/`:
  - `mining-reducer` - Mining toggle, speed, status
  - `minting-reducer` - Minting transactions & status
  - `nonces-reducer` - Mined nonces storage
  - `nfts-reducer` / `ppts-reducer` - NFT/PPT data
  - `aft-wallet-reducer` / `otf-wallet-reducer` - Wallet balances & state
  - `token-reducer` - Current token selection
  - `page-reducer` - Current page/route
  - `rates-reducer` - Exchange rates
  - `history-reducer` - Transaction history

- **Observers**: Located in `source/redux/observers/`, these watch state changes and trigger side effects (e.g., persisting nonces, updating wallet balances)

- **Middleware**: Custom middleware in `source/redux/middleware/` handles logging and alerts

### Smart Contracts

Contract interfaces are in `source/contract/`:
- Each contract type has a base class (e.g., `xpower-nft.ts`) and factory (e.g., `xpower-nft-factory.ts`)
- Contracts: XPower tokens (SOV, MOE, PPT), NFTs, Pools, Treasuries
- Contract addresses are managed per-chain in `source/contract/address.ts`

### Mining System

Mining runs in Web Workers (`source/miner/scripts/worker.ts`) using WebAssembly:
- Workers are spawned based on CPU count and speed settings
- Nonces are validated and stored in Redux state
- Auto-minting can be configured via query parameters

### View Engine

Custom "Pig" engine (`source/engines/pig.ts`) renders `.pig` files:
- Webpack pre-compiles Pug templates to `.pig` format
- `.pig` files are minified HTML with injected script/style hashes
- Express serves these on-demand with environment-specific variables

### Routes & Templating

Express routes (`routes/*.ts`) handle:
- Server-side rendering of initial page HTML
- Environment variable injection via `env-of` functions
- IPFS content serving
- robots.txt generation

Each route has corresponding tests (`.test.ts` files).

## Development Guidelines

### TypeScript Configuration
- Target: ES2021
- Strict mode enabled
- JSX: React (not React JSX)
- Module: CommonJS
- Source maps enabled

### Linting
ESLint configuration (`eslint.config.mjs`):
- Uses `typescript-eslint` and `eslint-plugin-react`
- Non-null assertions allowed (`@typescript-eslint/no-non-null-assertion: off`)
- Unused vars with `_` prefix are ignored

### Testing
Jest configuration (`jest.config.js`):
- Preset: `ts-jest`
- Setup files in `test/` directory handle environment vars, jQuery extensions, TextEncoder polyfills
- Ignores `.js` files in test paths (only runs `.ts` and `.tsx` tests)

### Webpack Bundling

Webpack creates multiple entry points:
- `app` - Main application bundle (header + app + footer)
- `error` - Error page bundle
- `migrate` - Migration page bundle
- `worker_dev` / `worker_pro` - Mining web workers

Output files include contenthash for cache busting. CSS is extracted via MiniCssExtractPlugin. Pug templates are pre-rendered during build.

### External Dependencies

The following libraries are externalized (loaded via CDN, not bundled):
- `ethers` - Ethereum library
- `jquery` - DOM manipulation
- `react` - React runtime

These must be available on the page via `<script>` tags before app initialization.

### Environment Variables

Configuration via `.env` file (loaded by dotenv):
- `NETWORK` - Chain network (mainnet/testnet)
- `PORT` - Server port (default: 3000)
- `WEB_CONCURRENCY` - Number of worker processes for clustering (default: 1)

Additional runtime configuration via URL query parameters (see README.md for full list):
- `speed` - Mining speed percentage (0-100)
- `min-level` / `max-level` - Nonce filtering thresholds
- `persist` - Nonce persistence slot
- `auto-mint` - Auto-mint interval in milliseconds
- `dex` - DEX selection (velora, uniswap, or URL)

### Server Clustering

The server (`bin/www.ts`) uses `throng` for process clustering:
- Configurable via `WEB_CONCURRENCY` environment variable
- Each worker runs an independent HTTP server
- Debug logging via `debug` package (namespaces: `xpower-ui:cluster`, `xpower-ui:server`)

## Code Patterns

### Contract Factories
Contract instances are created via factory functions that handle multi-chain deployments:
```typescript
const nftContract = XPowerNftFactory(version, chain);
```

### Redux Observers
Observers use `observe()` utility to watch specific state slices:
```typescript
observe(store, (state) => state.mining, (mining) => {
  // React to mining state changes
});
```

### Utility Functions
Common patterns in `source/functions/`:
- `nice()` / `niceSi()` - Format large numbers with SI prefixes
- `buffered()` / `delayed()` - Debouncing/throttling utilities
- `memoized()` - Function memoization
- `ensure()` / `assert()` - Type guards and runtime checks

### Testing Patterns
Most modules have corresponding `.test.ts` files with unit tests. Tests use Jest matchers and often include setup files for browser APIs.