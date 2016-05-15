'use strict';

var expect = require('chai').expect,
  Request = require('../../src/models/request.js'),
  RequestMock = require('./mocks/request.mock.js'),
  _ = require('underscore');

describe('Models', function () {

  describe('Request', function () {

    var instance, options;

    beforeEach(function () {
      options = RequestMock;
      instance = new Request(options);
    });

    it('should be defined', function () {
      expect(Request).to.be.a('function');
    });

    describe(' instance should expose public api', function () {
      it('.method', function () {
        expect(instance.method).to.equal(options.method.toLowerCase());
      });

      it('.path', function () {
        expect(instance.path).to.equal(options.path);
      });

      it('.query', function () {
        expect(instance.query).to.deep.equal(options.query);
      });

      it('.headers', function () {
        expect(instance.headers).to.deep.equal(options.headers);
      });

      it('.body', function () {
        expect(instance.body).to.deep.equal(options.body);
      });
    });

    describe(' public api', function () {
      describe('.match', function () {
        var request, testObject;

        beforeEach(function () {
          testObject = { complete: { test: { case: 123 } } };
          options = JSON.parse(JSON.stringify(RequestMock));
          request = new Request(options);
        });

        it('should pass if everything is the same', function () {
          var result = instance.match(request);
          expect(result).to.be.true;
        });

        it('should pass if only case of method is different', function () {
          request.method = request.method.toUpperCase();
          var result = instance.match(request);
          expect(result).to.be.true;
        });

        it('should fail if method differs', function () {
          request.method = 'POST';
          var result = instance.match(request);
          expect(result).to.be.false;
        });

        it('should fail if path differs', function () {
          request.path = '/some/test/data';
          var result = instance.match(request);
          expect(result).to.be.false;
        });

        it('should fail if query differs', function () {
          request.query = "alligator=Mary&hippo=John";
          var result = instance.match(request);
          expect(result).to.be.false;
        });
                
        it('should pass if all expectated headers are present', function () {
          _.extend(request, {'SomeHeader': 123});
          var result = instance.match(request);
          expect(result).to.be.true;
        });
        
        it('should pass if not all expectated headers are present', function () {
          instance.headers['SomeHeader'] = 123 ;
          var result = instance.match(request);
          expect(result).to.be.false;
        });
        

        it('should fail if body differs', function () {
          request.body = testObject;
          var result = instance.match(request);
          expect(result).to.be.false;
        });

      });

    });
  });
});