# parse-server-alibaba-oss-adapter

Parse Server adapter for AlibabaCloud Object Storage Service

# Installation

`npm install git+https://git@github.com/rostopira/parse-server-alibaba-oss-adapter.git`

# Usage

```
const OSSAdapter = require('parse-server-alibaba-oss-adapter');

new ParseServer({
    // Other options
    // Example config, change every field (=
    filesAdapter: new OSSAdapter({
        "region": "oss-cn-beijing",
        "accessKeyId": "XXX",
        "accessKeySecret": "AAA",
        "bucket": "mybucket",
        "internal": true, //set to true, if running inside VPC, defaults to false
        "secure": false   //defaults to !internal``
    })
});
```

### Using environment variables

Set your environment variables:

```
OSS_REGION=oss-cn-beijing
OSS_ACCESS_KEY_ID=XXX
OSS_ACCESS_KEY_SECRET=AAA
OSS_BUCKET=mybucket
OSS_INTERNAL=true
OSS_SECURE=false
```

And update your config / options

```
const OSSAdapter = require('parse-server-alibaba-oss-adapter');

new ParseServer({
    // Other options
    filesAdapter: new OSSAdapter()
});
```

