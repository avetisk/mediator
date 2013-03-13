'use strict';

var Mediator = require('mediator');
var mediator;
var calls;
var slice = function (args) {
  return Array.prototype.slice.call(args);
};
var ctx = {'x': 108};

chai.should();

describe('Mediator', function () {
  describe('.on(ns, callback) // single level namespace', function () {
    it('should subscribe', function () {
      // reset
      mediator = new Mediator();
      calls = [];

      mediator.on('ns1', function () {
        calls.push({
          'name': 'call 1',
          'args': slice(arguments),
          'ctx': this || ''
        });
      });
      mediator.on('ns2', function () {
        calls.push({
          'name': 'call 2',
          'args': slice(arguments),
          'ctx': this || ''
        });
      }, ctx);
      mediator.on('ns3', function () {
        calls.push({
          'name': 'call 3',
          'args': slice(arguments),
          'ctx': this || ''
        });
      });
      mediator.on('ns4', function () {
        calls.push({
          'name': 'call 4',
          'args': slice(arguments),
          'ctx': this || ''
        });
      });

      mediator.subs.should.have.property('ns1');
      mediator.subs.should.have.property('ns2');
      mediator.subs.should.have.property('ns3');
    });
  });
  describe('.trigger(ns, ...)', function () {
    it('should trigger', function () {
      mediator.trigger('ns1', 100);
      mediator.trigger('ns2', 200, 201);
      mediator.trigger('ns2', 100, 222);
      mediator.trigger('ns3', 300);

      calls.should.have.length(4);
      calls[0].should.have.property('name');
      calls[1].should.have.property('name');
      calls[2].should.have.property('name');
      calls[3].should.have.property('name');

      calls[0].should.have.property('args');
      calls[1].should.have.property('args');
      calls[2].should.have.property('args');
      calls[3].should.have.property('args');

      calls[0].should.have.property('ctx');
      calls[1].should.have.property('ctx');
      calls[2].should.have.property('ctx');
      calls[3].should.have.property('ctx');

      calls[0].name.should.equal('call 1');
      calls[1].name.should.equal('call 2');
      calls[2].name.should.equal('call 2');
      calls[3].name.should.equal('call 3');

      calls[0].args.should.have.length(2);
      calls[1].args.should.have.length(3);
      calls[2].args.should.have.length(3);
      calls[3].args.should.have.length(2);

      calls[0].args.should.contain('ns1', 100);
      calls[1].args.should.contain('ns2', 200, 201);
      calls[2].args.should.contain('ns2', 100, 222);
      calls[3].args.should.contain('ns3', 300);
    });
  });

  describe('.on(ns, callback) // multi-level namespace', function () {
    it('should subscribe', function () {
      // reset
      mediator = new Mediator();
      calls = [];

      mediator.on('ns1', function () {
        calls.push({
          'name': 'call 1',
          'args': slice(arguments),
          'ctx': this || ''
        });
      });
      mediator.on('ns2', function () {
        calls.push({
          'name': 'call 2',
          'args': slice(arguments),
          'ctx': this || ''
        });
      }, ctx);
      mediator.on('ns2::sub1', function () {
        calls.push({
          'name': 'call 2.1',
          'args': slice(arguments),
          'ctx': this || ''
        });
      }, ctx);
      mediator.on('ns3', function () {
        calls.push({
          'name': 'call 3',
          'args': slice(arguments),
          'ctx': this || ''
        });
      });

      mediator.subs.should.have.property('ns1');
      mediator.subs.should.have.property('ns2');
      mediator.subs.should.have.property('ns3');
    });
  });
  describe('.trigger(ns, ...)', function () {
    it('should trigger', function () {
      mediator.trigger('ns1', 100);
      mediator.trigger('ns2', 200, 201);
      mediator.trigger('ns2', 100, 222);
      mediator.trigger('ns3', 300);
      mediator.trigger('ns2::sub1', 434, 333);

      calls.should.have.length(6);
      calls[0].should.have.property('name');
      calls[1].should.have.property('name');
      calls[2].should.have.property('name');
      calls[3].should.have.property('name');
      calls[4].should.have.property('name');
      calls[5].should.have.property('name');

      calls[0].should.have.property('args');
      calls[1].should.have.property('args');
      calls[2].should.have.property('args');
      calls[3].should.have.property('args');
      calls[4].should.have.property('args');
      calls[5].should.have.property('args');

      calls[0].should.have.property('ctx');
      calls[1].should.have.property('ctx');
      calls[2].should.have.property('ctx');
      calls[3].should.have.property('ctx');
      calls[4].should.have.property('ctx');
      calls[5].should.have.property('ctx');

      calls[0].name.should.equal('call 1');
      calls[1].name.should.equal('call 2');
      calls[2].name.should.equal('call 2');
      calls[3].name.should.equal('call 3');
      calls[4].name.should.equal('call 2.1');
      calls[5].name.should.equal('call 2.1');

      calls[0].args.should.have.length(2);
      calls[1].args.should.have.length(3);
      calls[2].args.should.have.length(3);
      calls[3].args.should.have.length(2);
      calls[4].args.should.have.length(3);
      calls[5].args.should.have.length(3);

      calls[0].args.should.contain('ns1', 100);
      calls[1].args.should.contain('ns2', 200, 201);
      calls[2].args.should.contain('ns2', 100, 222);
      calls[3].args.should.contain('ns3', 300);
      calls[4].args.should.contain('ns2::sub1', 434, 333);
      calls[5].args.should.contain('ns2::sub1', 434, 333);
    });
  });
});
