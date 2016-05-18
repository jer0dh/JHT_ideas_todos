/**
 * Created by jer0dh on 5/11/16.
 */
var rivets = require('rivets');


module.exports = function(model, controller) {
    model = model || {};

    controller = controller || {};
   var html = `
<div class="jhtIdeas_container">
   <ul>
    <li rv-each-idea="model.data.posts">
        <h3 rv-text="idea.post_title"></h3>
    </li>
    <li><input rv-value="model.newPost.post_title" /><button rv-on-click="controller.onClickAdd">Add</button></li>
   </ul>
 </div> 

`;

    var main = document.getElementById('jhtMain');
    
    var init = function() {

        main.innerHTML = html;
                
        rivets.bind(main, {model: model, controller: controller });

    };
    
    api = {
        init: init
    };
    
    return api;
};
