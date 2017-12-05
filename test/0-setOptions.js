'use strict'

const chai = require('chai'),
  expect = chai.expect,
  chaiSubset = require('chai-subset'),
  _ = require('lodash')

chai.use(chaiSubset)

const Cls = require('../index'),
  lib = require('./_lib')

describe('setOptions', function () {
  it('should return the default options', function () {
    const cls = new Cls()
    expect(cls.options).to.include({
      idSrc: '_id',
      idDest: '_id',
      url: 'redis://localhost:6379',
      type: 'test'
    })
  })

  it('should return options with custom idDest', function () {
    const cls = new Cls({ 
      idDest: 'uid'
    })
    expect(cls.options).to.include({
      idDest: 'uid'
    })
  })

  it('should return options with custom url', function () {
    const cls = new Cls({ 
      url: 'http://my.host/1'
    })
    expect(cls.options).to.include({
      url: 'http://my.host/1'
    })
  })

  it('should return options with custom type', function () {
    const cls = new Cls({ 
      type: 'mytype'
    })
    expect(cls.options).to.include({
      type: 'mytype'
    })
  })

})


