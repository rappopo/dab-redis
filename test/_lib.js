'use strict'

const redis = require('redis'),
  _ = require('lodash'),
  async = require('async')

function addIndex(client, body, value, callback) {
  const ns = value.split(':')[0]
  const arr = _.map(body, (v, k) => {
    return { key: k, val: v }
  })
  async.mapSeries(arr, (a, done) => {
    let set = ns + ':' + a.key + ':' + a.val
    client.sadd(set, value, err => {
      done()
    })
  }, err => {
    callback()
  })
}

module.exports = {
  _: _,
  options: {
    url: 'redis://localhost:6379',
    ns: 'test'
  },
  dummyData: [
    { _id: 'jack-bauer', name: 'Jack Bauer' },
    { _id: 'james-bond', name: 'James Bond' }
  ],
  bulkDocs: [
    { _id: 'jack-bauer', name: 'Jack Bauer' },
    { _id: 'johnny-english', name: 'Johnny English' },
    { name: 'Jane Boo' }
  ],
  timeout: 5000,
  resetDb: function (callback) {
    const client = redis.createClient(this.options)
    client.flushdb(err => {
      if (err) return callback(err)
      async.mapSeries(this.dummyData, (item, done) => {
        let key = this.options.ns + ':' + item._id,
          body = _.omit(item, [])
        client.hmset(key, body, err => {
          addIndex(client, body, key, err => {
            done(err)
          })
        })
      }, (err) => {
        callback(err)
      })
    })
  }
}