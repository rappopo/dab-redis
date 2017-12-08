'use strict'

const redis = require('redis'),
  async = require('async'),
  Dab = require('@rappopo/dab')

class DabRedis extends Dab {
  constructor (options) {
    super(options)
  }

  setOptions (options) {
    super.setOptions(this._.merge(this.options, {
      idSrc: '_id',
      idDest: options.idDest || options.idSrc || '_id',
      url: options.url || 'redis://localhost:6379',
      ns: options.ns || 'doc'
    }))
  }

  setClient (params) {
    if (!this.client) {
      let url = params.url || this.options.url
      this.client = redis.createClient(this._.merge(this.options.options, { url: url }))
    }
  }

  _addIndex(body, value, callback) {
    const ns = value.split(':')[0]
    const arr = this._.map(body, (v, k) => {
      return { key: k, val: v }
    })
    async.mapSeries(arr, (a, done) => {
      let set = ns + ':' + a.key + ':' + a.val
      this.client.sadd(set, value, err => {
        done()
      })
    }, err => {
      callback()
    })
  }

  _delIndex(body, value, callback) {
    const ns = value.split(':')[0]
    const arr = this._.map(body, (v, k) => {
      return { key: k, val: v }
    })
    async.mapSeries(arr, (a, done) => {
      let set = ns + ':' + a.key + ':' + a.val
      this.client.sismember(set, value, (err, result) => {
        this.client.srem(set, err => {
          done()
        })
      })
    }, err => {
      callback()
    })
  }

  _findOne (id, params, callback) {
    const key = (params.ns || this.options.ns) + ':' + id
    this.client.hgetall(key, (err, result) => {
      if (err)
        return callback(err)
      let data = {
        success: !this._.isEmpty(result)
      }
      if (this._.isEmpty(result)) {
        data.err = new Error('Not found')
      } else {
        data.data = this._.merge(result, { _id: id })
      }
      callback(data)
    })
  }

  findOne (id, params) {
    [params] = this.sanitize(params)
    this.setClient(params)
    return new Promise((resolve, reject) => {
      this._findOne(id, params, result => {
        if (!result.success)
          return reject(result.err)
        result.data = this.convertDoc(result.data)
        resolve(result)
      })
    })
  }

  create (body, params) {
    [params, body] = this.sanitize(params, body)
    this.setClient(params)
    return new Promise((resolve, reject) => {
      const id = body[this.options.idDest] ? body[this.options.idDest] : this.uuid(),
        key = (params.ns || this.options.ns) + ':' + id
      this._findOne(id, params, result => {
        if (result.success && !params.upsert)
          return reject(new Error('Exists'))
        this.client.hmset(key, body, err => {
          if (err)
            return reject(err)
          this._addIndex(body, key, err => {
            let data = {
              success: true,
              data: this.convertDoc(this._.merge(body, { _id: id }))
            }
            resolve(data)
          })
        })
      })
    })
  }

  update (id, body, params) {
    [params, body] = this.sanitize(params, body)
    this.setClient(params)
    body = this._.omit(body, [this.options.idDest])
    return new Promise((resolve, reject) => {
      const key = (params.ns || this.options.ns) + ':' + id
      this._findOne(id, params, result => {
        if (!result.success)
          return reject(result.err)
        let newBody = params.fullReplace ? this._.merge(body, { _id: id }) : this._.merge(result.data, body)
        this._delIndex(result.data, key, err => {
          this.create(newBody, this._.merge(params, { upsert: true }))
          .then(data => {
            if (params.withSource)
              data.source = this.convertDoc(result.data)
            resolve(data)
          })
          .catch(reject)
        })
      })
    })
  }

  remove (id, params) {
    [params] = this.sanitize(params)
    this.setClient(params)
    return new Promise((resolve, reject) => {
      const key = (params.ns || this.options.ns) + ':' + id
      this._findOne(id, params, result => {
        if (!result.success)
          return reject(result.err)
        this._delIndex(result.data, key, err => {
          this.client.del(key, err => {
            if (err)
              return reject(err)
            let data = params.withSource ? { success: true, source: this.convertDoc(result.data) } : { success: true }
            resolve(data)
          })          
        })
      })
    })
  }
}

module.exports = DabRedis