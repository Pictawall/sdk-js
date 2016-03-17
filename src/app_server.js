'use strict';

/*
 * Server-side entry point
 *
 * - defines the fetch polyfill
 */

import Sdk from './core/Sdk';
import FetchShim from './core/FetchShim';

FetchShim.fetch = require('node-fetch');
FetchShim.Response = FetchShim.fetch.Response;

export default Sdk;
