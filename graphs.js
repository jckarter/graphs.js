'use strict';

(function(){

var g_connections = {};

function center(node) {
    var $node = $(node);
    var pos = $node.position();
    var w = $node.outerWidth();
    var h = $node.outerHeight();
    return {left: pos.left + 0.5*w, top: pos.top + 0.5*h};
}

function distance(a, b) {
    var w = b.left - a.left;
    var h = b.top - a.top;
    var dist = Math.sqrt(w*w + h*h);
    return {distance: dist, x: w/dist, y: h/dist};
}

function asMatrix(length) {
    var x = 'matrix(' + [length.x, length.y, -length.y, length.x, 0, 0].join(',') + ')';
    return x;
}

function pushData(obj, key, value) {
    if (obj.data(key))
        obj.data(key).push(value);
    else
        obj.data(key, [value]);
}

function registerConnection(hr, begin, end) {
    pushData($(begin), 'graph-connections', [hr, end]);
    pushData($(end), 'graph-connections', [hr, begin]);
}

function placeConnection(hr, begin, end) {
    var beginCenter = center(begin);
    var endCenter = center(end);
    var length = distance(beginCenter, endCenter);
    var matrix = asMatrix(length);
    $(hr).css({
        width: length.distance + 'px',
        left: beginCenter.left + 'px',
        top: beginCenter.top + 'px',
        WebkitTransform: matrix,
        MozTransform: matrix,
        MsTransform: matrix,
        OTransform: matrix});
}

function newConnection(hr) {
    var endpoints = hr.id.split(':');
    var begin = document.getElementById(endpoints[0]);
    var end = document.getElementById(endpoints[1]);

    registerConnection(hr, begin, end);
    placeConnection(hr, begin, end);
}

function initGraphs() {
    $('.graph-container hr.graph-connection').each(function(_, hr) {
        newConnection(hr);
    });
}

function updateConnections(/*nodes...*/) {
    arguments.each(function(_, node) {
        connections = $(node).data('graph-connections');
        if (connections)
            connections.each(function(_, conn) {
                var hr = conn[0];
                var end = conn[1];
                placeConnection(hr, node, end);
            });
    });
}

window.Graphs = {
    newConnection: newConnection,
    updateConnections: updateConnections};

$(initGraphs);

})();
