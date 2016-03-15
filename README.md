# pictawall JavaScript SDK

This repository is an SDK you can use to access the [pictawall](https://pictawall.com/) API. It is compatible with both browsers and NodeJS.

## Installation

The SDK isn't available in bower's nor npm's registry yet. You can however install it using their git integration.

- NPM: `npm install --save git+ssh://git@github.com:pictawall/sdk-js.git#1.0.x`
- Bower: `bower install git+ssh://git@github.com:pictawall/sdk-js.git#1.0.x`

## Usage

The recommanded way to access the SDK is to import it using the CommonJS syntax, `require('pictawall.sdk')`. Doing that will return the `Sdk` class.  
Alternatively you can require or include the file `dist/pictawall.sdk.min.js` but that is not recommanded. This method will expose the `Sdk` class as `window.pictawall.Sdk` and the available models and collections as `window.pictawall.Sdk.models` and `window.pictawall.Sdk.collections` respectively. It will also expose `window.pictawall.Sdk.version` which is the version string as it appears in `package.json` and `bower.json`.

Once you have your hands on the SDK, you'll need to instantiate it.

```
#!javascript
const Sdk = require('pictawall.sdk');
const sdk = new Sdk();
```

And use it to fetch whatever you might need from our public API.

## Fetching a pictawall Event

```
#!javascript
const eventIdentifier = 'undiscovered-london';
const configuration = {
    autoUpdate: true, // should the event refresh its collections ?
    autoUpdateVelocity: 10000, // how often should it refresh them, in ms.
    assetBatchSize: 100 // how many assets the server should send at a time. (min = 100, max = 1000)
};

sdk.getEvent(eventIdentifier, configuration).then(event => { /* EventModel ready and populated */ });
```

## Fetching a pictawall Channel

```
#!javascript
const channelIdentifier = 'f81d4fae-7dec-11d0-a765-00a0c91e6bf6';
sdk.getChannel(channelIdentifier).then(channel => { /* ChannelModel ready and populated */ });
```

## Going further

If required, you can access parts of the SDK that are not directly exposed by `pictawall.sdk`.  
For instance, you can access the Asset Collection class by requiring `pictawall.sdk/collections/AssetCollection`.

## Documentation

The documentation for this version of the SDK is available here. `TODO ADD URL. TODO AUTOBUILD DOCS`  
Alternatively, you can clone this repository and run `gulp jsdoc` to build the documentation yourself.

The documentation for the API itself is available here. `TODO ADD API DOC URL`
