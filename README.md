# @rappopo/dab-redis

A [Rappopo DAB](https://github.com/rappopo/dab) implementation for [Redis](https://redis.io). 

## Installation

Simply invoke this command in your project folder:

```
$ npm install --save @rappopo/dab-redis
```

And within your script:

```javascript
const DabRedis = require('@rappopo/dab-redis')
const dab = new DabRedis({
  url: 'redis://myhost:6379',
  ns: 'docs'
})
...
dab.findOne('my-doc').then(function(doc) { ... })
```

## Options

`url`: your Redis url endpoint. If it not provided, it defauts to: *redis://localhost:6379*

`ns`: your namespace. You'll most likely want to give a custom name, otherwise it defaults to *doc*

## Misc

* [Methods](https://github.com/rappopo/dab)
* [ChangeLog](CHANGELOG.md)
* Donation: Bitcoin **16HVCkdaNMvw3YdBYGHbtt3K5bmpRmH74Y**

## License

(The MIT License)

Copyright © 2017 Ardhi Lukianto <ardhi@lukianto.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.