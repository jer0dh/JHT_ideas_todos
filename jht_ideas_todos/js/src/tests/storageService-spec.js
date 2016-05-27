//var ss = require('../services/storageService.js');
var $ = require('jquery')(require('jsdom').jsdom().defaultView);
var _ = require('underscore');
var fs = require('fs');
var path = require('path');

describe('SS initialized: ', function() {
    var opt, ss;

    describe('SS initialized with no options', function() {
    
        beforeEach(function() {
            opt = {};
            ss = require('../app/services/storageService.js')($, opt);
        });
        //removeIf(production)
        it('ajax_url, actions, and _ajax_nonce will be at default values', function() {
            var actions = ['create', 'read', 'update', 'delete' ];
            expect(ss.getAjax_url()).toBe('localhost');
            actions.forEach(function(action){
                expect(ss.getActions()[action]).toBe('');
            });
            expect(ss.get_ajax_nonce()).toBe('');


        });
        //endRemoveIf(production)
        
        
    });
    
    describe('SS initialized with options', function() {
       
        beforeEach(function() {
            opt = {
                "ajax_url": "testPosts.json",
                "actions": {
                    "create": "create_jht_idea",
                    "read": "read_jht_idea",
                    "update": "update_jht_idea",
                    "delete": "delete_jht_idea"
                },
                "_ajax_nonce": "86656bb37c"
            };

            ss = require('../app/services/storageService.js')($, opt);
        });
        //removeIf(production)
        it('ajax_url, actions, and _ajax_nonce will have opt values', function() {
            var actions = ['create', 'read', 'update', 'delete' ];
            expect(ss.getAjax_url()).toBe('testPosts.json');
            actions.forEach(function(action){
                expect(ss.getActions()[action]).toBe(action + '_jht_idea');
            });
            expect(ss.get_ajax_nonce()).toBe('86656bb37c');
            
        });
        //endRemoveIf(production)
        
    });
    
    describe('SS initialized with no options and then init is called with options', function(){
        beforeEach(function() {
            opt = {
                "ajax_url": "testPosts.json",
                "actions": {
                    "create": "create_jht_idea",
                    "read": "read_jht_idea",
                    "update": "update_jht_idea",
                    "delete": "delete_jht_idea"
                },
                "_ajax_nonce": "86656bb37c"
            };

            ss = require('../app/services/storageService.js')($);
        });

        //removeIf(production)
        it('ajax_url, actions, and _ajax_nonce will be at default values', function() {
            var actions = ['create', 'read', 'update', 'delete' ];
            expect(ss.getAjax_url()).toBe('localhost');
            actions.forEach(function(action){
                expect(ss.getActions()[action]).toBe('');
            });
            expect(ss.get_ajax_nonce()).toBe('');


        });
        //endRemoveIf(production)
        
        it('After ss.init is called with options, ajax_url, actions, and _ajax_nonce will be at their values', function() {
           ss.init(opt);

            //removeIf(production)
            it('ajax_url, actions, and _ajax_nonce will have opt values', function() {
                var actions = ['create', 'read', 'update', 'delete' ];
                expect(ss.getAjax_url()).toBe('testPosts.json');
                actions.forEach(function(action){
                    expect(ss.getActions()[action]).toBe(action + '_jht_idea');
                });
                expect(ss.get_ajax_nonce()).toBe('86656bb37c');
            });
            //endRemoveIf(production)
        });
        
        
    })
    
});

describe('SS.read is called', function() {
    var response, opt, ss;
    
    beforeEach(function() {
       
        opt = {
            "ajax_url": "testPosts.json",
            "actions": {
                "create": "create_jht_idea",
                "read": "read_jht_idea",
                "update": "update_jht_idea",
                "delete": "delete_jht_idea"
            },
            "_ajax_nonce": "86656bb37c"
        };
        ss = require('../app/services/storageService.js')($, opt);
        
    });
    
    it('Will call ajax with correct parameters', function() {
        spyOn($, 'ajax');
        ss.read();
        //console.log($.ajax.calls.mostRecent());
        expect($.ajax.calls.mostRecent().args[0].url).toBe(opt.ajax_url);
        expect($.ajax.calls.mostRecent().args[0].data.action).toBe(opt.actions['read']);
        expect($.ajax.calls.mostRecent().args[0].data._ajax_nonce).toBe(opt._ajax_nonce);
    });
    
    describe('on Success it will create an array of posts in the correct format', function() {
        var data;
        beforeEach(function() {
            // a sample response that would be returned via ajax...i hope
            response = JSON.parse(fs.readFileSync(path.resolve(__dirname,'testPosts.json')));

            // call a mock of ajax that just calls the success function with the sample response
            spyOn($, 'ajax').and.callFake(function(options){
                options.success(response);
            });
            
            // this is a simple callback that will get the reformatted data
            var cbOnS = function(response) {
                data = response;
            };
            ss.read(cbOnS);
        });
        it('result array same size as reponses data array', function(){
            expect(data.length).toBe(response.data.length);
        });      
        it('result array of objects will each have state property equal to "saved"', function(){
            expect(_.filter(data, function(obj){return obj.state==='saved'}).length).toBe(response.data.length);
        });
        it('result array of objects will each have an id property typeof number', function(){
            expect(_.filter(data, function(obj){return typeof obj.id==='number'}).length).toBe(response.data.length);
        });        
        it('result array of objects will each have a unique id property', function(){
            expect(_.uniq(_.pluck(data, 'id')).length).toBe(response.data.length);
        });        
        it('result array of objects will each have a property called data of type string', function(){
            expect(_.filter(data, function(obj){return typeof obj.data==='string'}).length).toBe(response.data.length);
        });
        
    });

    describe('on Error it will call the error callback', function() {
        var data, spy;
        beforeEach(function () {

            // call a mock of ajax that just calls the success function with the sample response
            spyOn($, 'ajax').and.callFake(function (options) {
                options.error({error: '505'});
            });

            // this is a simple callback that will get the reformatted data
            var cbOnS = function (response) {
                data = response;
            };
            spy = {
                cbOnE : function (error, status) {
                         data = error;
                }
                
            };
            spyOn(spy, 'cbOnE').and.callThrough();

            ss.read(cbOnS, spy.cbOnE);
        });
        
        it('error callback called once', function() {
            expect(spy.cbOnE).toHaveBeenCalled();
        })
    });
    
});