[![License: CC BY-NC-SA 4.0](https://licensebuttons.net/l/by-nc-sa/4.0/88x31.png)](https://creativecommons.org/licenses/by-nc-sa/4.0/)

# Arcadex

Arcadex is a DApp build on [DEXON](https://dexon.org/). This repo contains contracts and website.

## Directory structure

/ - contract part working directory
* contracts - contract code
* migrations - truffle migration scripts
* test - contract test code
* site.js - site config
* truffle.js - truffle config

/app - website part working directory
* src - website code
* webpack - webpack scripts
* gen_meta.js - tool for creating ERC721 metadata.json

## Setup

```shell
  npm install && cd app && npm install
```

## How to develop

### Run local ganache

```shell
  npm run ganache
```

### Contract testing

```shell
  npm run test
```

### Contract deploy to local ganache

```shell
  npm run dev
```

### DApp development

```shell
  cd app && npm run dev
```

## How to deploy

1. Deploy contract
  * setup privKey in [truffle.js](truffle.js)
  * run `npm run prod`

2. Deploy DApp
  * go to app directory
  * run `npm run build`

## License

Copyright © 2019, DEXON Foundation

All of media in this work are licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License, and source code is licensed under GNU Affero General Public License.

See the [LICENSE-AGPL](LICENSE-AGPL) and [LICENSE-CC](LICENSE-CC.md) for license rights and limitations.
