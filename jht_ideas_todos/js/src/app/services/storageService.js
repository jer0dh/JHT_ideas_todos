var _ = require('underscore');

module.exports = function($, opt) {
    var ajax_url, actions, _ajax_nonce;

    var api = {
        
        init: function (opt) {
            // var opt = opt || {};  //JSON.parse(JSON.stringify(opt))
            opt = (typeof opt === 'undefined') ? {} : JSON.parse(JSON.stringify(opt));
            ajax_url = (typeof opt.ajax_url === 'undefined') ? 'localhost' : opt.ajax_url;
            actions  = {    "create":   "",
                "read":     "",
                "update":   "",
                "delete":   ""};

            $.extend(actions, opt.actions);
            _ajax_nonce = (typeof opt._ajax_nonce === 'undefined') ? '' : opt._ajax_nonce;
        },

        read: function(cbOnS, cbOnE){
          $.ajax({

              url: ajax_url,
              data: {
                  action: actions['read'],
                  _ajax_nonce: _ajax_nonce
              },
              success: function( response ) {
                  var data = _.map( response.data, function(post){
                      return {
                          id    : post.ID,
                          data  : JSON.stringify(post),
                          state : 'saved'
                      }
                  });
                  if (typeof cbOnS === 'function') {
                      cbOnS(data);
                  }
              },
              error: function( error, status ) {

                  if (typeof cbOnE === 'function') {
                      cbOnE(error, status);
                  }
              }

          })


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