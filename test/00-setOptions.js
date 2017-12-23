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
      url: 'redis://localhost:6379',
      ns: 'doc'
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

  it('should return options with custom ns', function () {
    const cls = new Cls({ 
      ns: 'myns'
    })
    expect(cls.options).to.include({
      ns: 'myns'
    })
  })

})


