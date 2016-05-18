
var $ = require('jquery')(require('jsdom').jsdom().defaultView);
console.log($.toString());

describe("The Model with no options passed: ", function() {
    var model = require('../app/models/ideasModel.js');
    var model = model($);
    
    it("data.posts is empty array and newPost created with empty post_title", function() {
        expect(model.data.posts.constructor).toBe(Array);
        expect(model.data.posts.length).toBe(0);
        expect(typeof model.data.newPost).toBe('object')
        expect(typeof model.data.newPost.post_title).toBe('string');
        expect(model.data.newPost.post_title).toBe('');
    });

    //removeIf(production)
    
    it('ajax_url, actions, and _ajax_nonce will be at default values', function() {
        console.log(model);
        var actions = ['create', 'read', 'update', 'delete' ];
        expect(model.getAjax_url()).toBe('localhost');
        actions.forEach(function(action){
            expect(model.getActions()[action]).toBe('');
        });
        expect(model.get_ajax_nonce()).toBe('12345');
     
        
    });
    
    //endRemoveIf(production)
    
});



describe("Model with opt passed in: ", function() {
    var model, opt;
    
    beforeEach(function() {
         model = require('../app/models/ideasModel.js');
         opt = {
            "ajax_url": "https://staging3.jhtechservices.com/wp-admin/admin-ajax.php",
            "actions": {
                "create": "create_jht_idea",
                "read": "read_jht_idea",
                "update": "update_jht_idea",
                "delete": "delete_jht_idea"
            },
            "_ajax_nonce": "86656bb37c",
            "posts": [
                {
                    "post_title": "Ability to add ideas from archive page if logged in",
                    "ID": 1066
                },
                {
                    "post_title": "Link off of Dashboard to a PHP file that edits custom post type using AJAX",
                    "ID": 1065
                },
                {
                    "post_title": "Single page Wordpress app",
                    "ID": 1064
                }
            ]
        };
        model = model($,opt);
    });
    
  
    it('data.posts will have same number of posts as opt', function() {
      expect(model.data.posts.length).toBe(opt.posts.length); 
   });
    
    it('data.posts each will have new default data added', function() {
        
        for(var i=0; i < model.data.posts.length-1; i++) {
            expect(typeof model.data.posts[i].state).toBe('string');
            expect(model.data.posts[i].state).toBe('inDatabase');
        }
    });
    
    it('newPost created with empty post_title', function() {
        expect(typeof model.data.newPost).toBe('object')
        expect(typeof model.data.newPost.post_title).toBe('string');
        expect(model.data.newPost.post_title).toBe('');
    });
});

describe('Model is initialized with no options and later init is run on it', function() {
    var model, opt;

    beforeEach(function() {
        model = require('../app/models/ideasModel.js');
        opt = {
            "ajax_url": "https://staging3.jhtechservices.com/wp-admin/admin-ajax.php",
            "actions": {
                "create": "create_jht_idea",
                "read": "read_jht_idea",
                "update": "update_jht_idea",
                "delete": "delete_jht_idea"
            },
            "_ajax_nonce": "86656bb37c",
            "posts": [
                {
                    "post_title": "Ability to add ideas from archive page if logged in",
                    "ID": 1066
                },
                {
                    "post_title": "Link off of Dashboard to a PHP file that edits custom post type using AJAX",
                    "ID": 1065
                },
                {
                    "post_title": "Single page Wordpress app",
                    "ID": 1064
                }
            ]
        };
        model = model($);
        model.init(opt);
    });

    it('data.posts will have same number of posts as opt', function() {
        expect(model.data.posts.length).toBe(opt.posts.length);
    });

    it('data.posts each will have new default data added', function() {

        for(var i=0; i < model.data.posts.length-1; i++) {
            expect(typeof model.data.posts[i].state).toBe('string');
            expect(model.data.posts[i].state).toBe('inDatabase');
        }
    });

    it('newPost created with empty post_title', function() {
        expect(typeof model.data.newPost).toBe('object')
        expect(typeof model.data.newPost.post_title).toBe('string');
        expect(model.data.newPost.post_title).toBe('');
    });
    
});

describe('Model addFromNew: ', function() {
    var model, opt;

    beforeEach(function() {
        model = require('../app/models/ideasModel.js');
        opt = {
            "ajax_url": "https://staging3.jhtechservices.com/wp-admin/admin-ajax.php",
            "actions": {
                "create": "create_jht_idea",
                "read": "read_jht_idea",
                "update": "update_jht_idea",
                "delete": "delete_jht_idea"
            },
            "_ajax_nonce": "86656bb37c",
            "posts": [
                {
                    "post_title": "Ability to add ideas from archive page if logged in",
                    "ID": 1066
                },
                {
                    "post_title": "Link off of Dashboard to a PHP file that edits custom post type using AJAX",
                    "ID": 1065
                },
                {
                    "post_title": "Single page Wordpress app",
                    "ID": 1064
                }
            ]
        };
        model = model($);
        model.init(opt);
    });
    
    it('will not add to data.posts if newPost.title is \'\' ', function() {
       model.addFromNew();
        expect(model.data.posts.length).toBe(opt.posts.length);
        
    });
    
    it('will add to data.posts if newPost.post_title is not \'\' and add state', function() {
        model.data.newPost.post_title = 'This is the new title';
        model.addFromNew();
        var pl = model.data.posts.length;
        expect(model.data.posts.length).toBe(opt.posts.length+1);
        expect(model.data.posts[pl-1].post_title).toBe('This is the new title');
        expect(model.data.posts[pl-1].state).toBe('new');
    })
});
