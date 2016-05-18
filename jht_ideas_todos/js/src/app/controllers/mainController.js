/**
 * Created by jer0dh on 5/11/16.
 */


module.exports = function(model) {
    model = model || {};

    api = {
        onClickAdd : function(e, viewmodel) {
          // send request to add to model with success callback and error callback
            // grey out button and spinner until one or other
            console.log(model);
            model.data.posts.push(model.newPost);
        },
    };
    return api;
}