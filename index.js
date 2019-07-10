'use strict';
//OSSAdapter
// Store Parse File in Alibaba Cloud Object Storage Service: https://www.alibabacloud.com/product/oss

const OSS = require('ali-oss');

function requiredOrFromEnvironment(options, key, env) {
    options[key] = options[key] || process.env[env];
    if (!options[key]) {
        throw `OSSAdapter requires an ${key} in options or ${env} in environment`;
    }
    return options;
}

function fromEnvironmentOrDefault(options, key, env, defaultValue) {
    options[key] = options[key] || process.env[env] || defaultValue;
    return options;
}

function optionsFromArguments(args) {
    let options = args[0] || {};

    options = fromEnvironmentOrDefault(options, 'region', 'OSS_REGION', null);
    options = requiredOrFromEnvironment(options, 'accessKeyId', 'OSS_ACCESS_KEY_ID');
    options = requiredOrFromEnvironment(options, 'accessKeySecret', 'OSS_ACCESS_KEY_SECRET');
    options = requiredOrFromEnvironment(options, 'bucket', 'OSS_BUCKET');
    options = fromEnvironmentOrDefault(options, 'endpoint', 'OSS_ENDPOINT', null);
    options = fromEnvironmentOrDefault(options, 'internal', 'OSS_INTERNAL', false);
    options = fromEnvironmentOrDefault(options, 'secure', 'OSS_SECURE', !options['internal']);
    return options;
}

/** OSSAdapter
 * Supported options / env variables:
 * region            / OSS_REGION
 * accessKeyId       / OSS_ACCESS_KEY_ID
 * accessKeySecret   / OSS_ACCESS_KEY_SECRET
 * bucket            / OSS_BUCKET
 * endpoint          / OSS_ENDPOINT **/
function OSSAdapter() {
    let options = optionsFromArguments(arguments);
    this._ossClient = new OSS(options);
}

OSSAdapter.prototype.createFile = function (filename, data, contentType) {
    return this._ossClient.put(filename, data, {
        mime: contentType
    });
};

OSSAdapter.prototype.deleteFile = function(filename) {
    return this._ossClient.delete(filename);
};

OSSAdapter.prototype.getFileData = function(filename) {
    return this._ossClient.get(filename);
};

OSSAdapter.prototype.getFileLocation = function(config, filename) {
    const link = this._ossClient.signatureUrl(filename);
    return link.substr(0, 4) + "s" + link.substr(4);
};

module.exports = OSSAdapter;
module.exports.default = OSSAdapter;
