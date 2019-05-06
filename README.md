IRMA keyshare webclient
=======================

This project contains all the web sources to interact with an [IRMA keyshare server](https://github.com/privacybydesign/irma_keyshare_server). In particular it allows users to

 * register an account with a keyshare server, so that it can benefit from the extra security offered by this server;
 * inspect a log of recent actions; and
 * disable the user's IRMA App.

## Quick start

First setup the development environment:

    yarn install

Then run one of these commands:

``` bash
# serve with hot reload at localhost:8080
yarn watch

# build for production with minification
yarn build

# test the production build locally
yarn serve
```

For detailed explanation on how things work with the Preact CLI, checkout its [CLI Readme](https://github.com/developit/preact-cli/blob/master/README.md).
