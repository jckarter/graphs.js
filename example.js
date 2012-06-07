'use strict';
(function(){

$(function() {
    $('.graph-node').draggable({
        drag: function(ev, ui) {
            Graphs.updateConnections(ev.target);
        }});
});

})();
