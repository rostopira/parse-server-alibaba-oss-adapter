'use strict';
//OSSAdapter
// Store Parse File in Alibaba Cloud Object Storage Service: https://www.alibabacloud.com/product/oss

const OSS = require('ali-oss');

function requiredOrFromEnvironment(options, key, env) {
    options[key] = options[key] || process.env[env];
    if (!options[key]) {
        const errorMessage = `OSSAdapter requires an ${key} in options or ${env} in environment`;
        console.error(errorMessage);
        throw errorMessage;
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
 * internal          / OSS_INTERNAL
 * secure            / OSS_SECURE            **/
function OSSAdapter() {
    let options = optionsFromArguments(arguments);
    this._ossClient = new OSS(options);
    if (options['internal'] || !options['secure']) {
        options['internal'] = false;
        options['secure'] = true;
        this._ossExternalClient = new OSS(options);
    } else {
        this._ossExternalClient = this._ossClient;
    }
}

OSSAdapter.prototype.createFile = function (filename, data, contentType, options = {}) {
    let headers = {};
    if (options.metadata.ACL !== undefined && options.metadata.ACL !== '') {
        headers = {
            "x-oss-object-acl": options.metadata.ACL
        }
    }
    return this._ossClient.put(filename, data, {
        mime: contentType,
        headers
    });
};

OSSAdapter.prototype.deleteFile = function(filename) {
    return this._ossClient.delete(filename);
};

OSSAdapter.prototype.getFileData = function(filename) {
    return this._ossClient.get(filename);
};

OSSAdapter.prototype.getFileLocation = function(config, filename) {
    return this._ossExternalClient.signatureUrl(filename);
};

module.exports = OSSAdapter;
module.exports.default = OSSAdapter;
