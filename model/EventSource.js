var EventSource = function() {}
EventSource.prototype.addEventListener = function(name, callback) {
    if (Array.isArray(name))
        for (var i = 0; i < name.length; ++i)
            this.addEventListener(name[i], callback);
    if (!("listeners" in this))
        this.listeners = {};
    if (!(name in this.listeners))
        this.listeners[name] = [];
    this.listeners[name].push(callback);
}
EventSource.prototype.notify = function(name, data) {
    if (!("listeners" in this) || (!(name in this.listeners)))
        return;
    var listeners = this.listeners[name];
    for (var i = 0; i < listeners.length; ++i)
        listeners[i].call(this, data);
}