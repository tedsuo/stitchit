var assert = require('chai').assert,
    _ = require('underscore'),
    compiler = require('../stitchit');

var TEMPLATE_PATH = __dirname + '/templates/';
var TEST = require('./fixtures');

describe('Stitchit',function(){
    
  it('given a valid file, should create an eval-able a template string',function(done){
    var path = TEMPLATE_PATH + 'hello.jst';
    compiler(path,function(err,template){
      assert.ifError(err);
      assert.isString(template);
      eval(template);
      assert.isFunction(JST['hello']);
      assert.equal(JST['hello'](TEST.hello.data),TEST.hello.result);
      done();
    });
  });

  it('given a valid directory, should create an eval-able a template string',function(done){
    var path = TEMPLATE_PATH;
    compiler(path,function(err,template){
      assert.ifError(err);
      assert.isString(template);
      eval(template);
      assert.isFunction(JST['hello']);
      assert.equal(JST['hello'](TEST['hello'].data),TEST['hello'].result);
      assert.equal(JST['monty'](TEST['monty'].data),TEST['monty'].result);
      done();
    });
  
  });

});
