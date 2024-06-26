# XPower Token UI

The XPower user interface allows you to *mine* for random nonces and to then *mint* for the corresponding amounts. It runs in a modern browser and expects the [Metamask] extension (or add-on) to be available.

[Metamask]: https://metamask.io/

## Installation

```shell
npm install
```

## Development

### Lint

```shell
npm run -- lint [--fix]
```

### Build

```shell
npm run build
```

### Watch

```shell
npm run watch
```

### Test

```shell
npm test
```

## Server

### Start local server with

```shell
npm start
```

#### ..or with the DEBUG flag set

```shell
npm run debug
```

Then visit `http://localhost:3000`, connect your Metamask and start mining for tokens. Once a valid nonce is found, you can then mint XPOW tokens for the corresponding amount.

## User Interface

### Query Parameters

Name | Type | Default | Description
-----|------|---------|------------
auto-mint | number | 3000 | auto-mint interval in milliseconds
clear | boolean | false | flag to clear current persistence slot (as defined by persist flag)
clear-all | boolean | false | flag to clear all persistence slots
color | string | white | standard colorization
color-alt | string | magenta | alternative colorization
dex | string | paraswap | DEX: paraswap, uniswap or a URL (template: `{address}`)
logger | boolean | false | flag to log nonces to console
min[t]-level | number | 6 | threshold of nonces with lower corresponding amounts to be ignored
max-level | number | 64 | threshold of nonces with higher corresponding amounts to be ignored
min-nft-level | number | 0 | threshold of NFT levels to display from (UNIT)
max-nft-level | number | 24 | threshold of NFT levels to display upto (YOTTA)
persist | number | 0 | flag to persist nonces; each non-zero value is a persistence slot
speed | number | 50 | speed percentage (w.r.t a single browser tab) between 0 and 100

### Examples

To ignore (frequent & low-value) nonces with an amount less than 7 XPOW tokens and mine with a speed of 100% use:

```txt
http://localhost:3000?min-level=3&speed=100
```

To persist nonces between reloads at 1st slot use (may impact mining performance):

```txt
http://localhost:3000?persist=1
```

To clear (i.e. forget) persisted nonces at 1st slot use:

```txt
http://localhost:3000?persist=1&clear=true
```

To clear (i.e. forget) all persisted nonces use:

```txt
http://localhost:3000?clear-all=true
```

To log nonces to console use (may impact mining performance):

```txt
http://localhost:3000?logger=true
```

> **Note:** All non-minted nonces are cleared at the start of each interval (i.e. every hour), independent of the flags above! Further, (reloaded) nonces cannot be minted once the interval (i.e. hour) &mdash; at which they have been mined &mdash; expires.

## Copyright

 © 2024 [Moorhead LLC](#)
