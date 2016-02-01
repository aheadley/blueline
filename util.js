function isString(v) {
    return (typeof v == "string") || (v instanceof String);
}
function defaultArg(arg, def) {
    return (typeof arg == 'undefined') ? def : arg;
}

function clonePrototype(obj) {
    function Cloner() {}
    Cloner.prototype = obj;
    return new Cloner();
}
function extend(base, constructor) {
    constructor.prototype = clonePrototype(base.prototype);
    constructor.prototype.constructor = constructor;
    return constructor;
}
