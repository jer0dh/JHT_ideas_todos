/**
 * Created by jer0dh on 5/11/16.
 */


module.exports = function($, opt) {
    var ajax_url, actions, _ajax_nonce;
    
    var api = {
        data: {},
        addFromNew: function () {
            var newPost = this.data.newPost;
            if (newPost.post_title !== '') {
                newPost.state = 'new';
                this.data.posts.push(newPost);
                this.addToDatabase(newPost, function() { newPost.state='inDatabase'}, function() { newPost.state='error'});
                this.initNewPost();
            }
        },
        addToDatabase: function(newPost, successCallback, errorCallback) {
            
        },
        init: function (opt) {
           // var opt = opt || {};  //JSON.parse(JSON.stringify(opt))
            opt = (typeof opt === 'undefined') ? {} : JSON.parse(JSON.stringify(opt));
            this.data.posts = (typeof opt.posts !== 'undefined') ? opt.posts : [];   
            this.initNewPost();
            this.data.posts.forEach(function (post) {
                post.state = 'inDatabase';

            });
            ajax_url = (typeof opt.ajax_url === 'undefined') ? 'localhost' : opt.ajax_url; 
            actions  = {    "create":   "",
                            "read":     "",
                            "update":   "",
                            "delete":   ""};
            
            $.extend(actions, opt.actions);
            _ajax_nonce = (typeof opt._ajax_nonce === 'undefined') ? '12345' : opt._ajax_nonce; 
        },
        initNewPost: function() {
            this.data.newPost = {}; //for a newPost idea before added to posts
            this.data.newPost.post_title = '';
        },

        //removeIf(production)
        getAjax_url: function() { return ajax_url;} ,
        getActions : function() { return actions;} ,
        get_ajax_nonce: function() { return _ajax_nonce;},
       //endRemoveIf(production)
    
    };



    api.init(opt);
    
    return api;
};