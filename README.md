# pictawall JavaScript SDK

This repository is an SDK you can use to access the [pictawall](https://pictawall.com/) API. It is compatible with both browsers and NodeJS.

## Installation

The SDK isn't available in bower's nor npm's registry yet. You can however install it using their git integration.

- NPM: `npm install --save git+ssh://git@github.com:pictawall/sdk-js.git#1.0.x`
- Bower: `bower install git+ssh://git@github.com:pictawall/sdk-js.git#1.0.x`

## Usage

The easiest way to access the SDK is to import it using the CommonJS syntax, `require('pictawall.sdk')`. Although you also can also import it as a standalone script by adding `<script src="{path_to_sdk}/dist/pictawall.sdk.min.js">` to your web page. Doing that will expose the function `pictawall.Sdk` to the global object.

Once you have your hands on the SDK, you'll need to instantiate it.

```
#!javascript
const Sdk = require('pictawall.sdk'); // or window.pictawall.Sdk depending on how you decided to import it.
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

## Documentation

The documentation for this version of the SDK is available here. `TODO ADD URL. TODO AUTOBUILD DOCS`  
Alternatively, you can clone this repository and run `gulp jsdoc` to build the documentation yourself.

The documentation for the API itself is available here. `TODO ADD API DOC URL`
