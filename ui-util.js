function stripClass(node, className) {
    node.className = node.className.replace(new RegExp('(?:^|\\s)' + className + '(?!\\S)'), '');
}
function addClass(node, className) {
    if (node.className.indexOf(className) == -1)
        node.className += " " + className;
}

function removeAllChildren(node) {
    while (node.firstChild)
        node.removeChild(node.firstChild);
}

function createElement(type, args) {
    var element = document.createElement(type);
    for (var i = 0; i < args.length; ++i) {
        if (isString(args[i]))
            addClass(element, args[i]);
        else
            element.appendChild(args[i]);
    }
    return element;
}
function    p(...args) { return createElement(   "p", args); }
function   h1(...args) { return createElement(  "h1", args); }
function   hr(...args) { return createElement(  "hr", args); }
function  div(...args) { return createElement( "div", args); }
function span(...args) { return createElement("span", args); }
function text(label)   { return document.createTextNode(label); }

function iconHtml(iconName) {
    return '<span class="oi" data-glyph="' + iconName + '" aria-hidden="true"></span>';
}
function productionClass(production) {
    return production == 0 ? "prod-neutral" : (production > 0 ? "prod-surplus" : "prod-deficit");
}
function availClass(avail) {
    return avail ? "prod-surplus" : "prod-deficit";
}
function signify(value) {
    return value <= 0 ? value.toString() : "+" + value.toString();
}
function formatProduction(value, signHint) {
    var bangedValue = Math.floor(value);
    var strValue = bangedValue.toString();
    if (bangedValue > 0)
        strValue = "+" + strValue;
    else if (bangedValue == 0)
        strValue = (signHint < 0 ? "-" : "+") + strValue;
    
    return strValue;
}

function formatTimeSpan(seconds) {
    var minutes = Math.floor(seconds/60) % 60;
    var hours   = Math.floor(seconds/(60*60)) % 24;
    var days    = Math.floor(seconds/(60*60*24));
    seconds = seconds % 60;
    
    var secondStr = seconds.toString();
    var minuteStr = minutes.toString();
    var   hourStr = hours.toString();
    var    dayStr = days.toString();
    if (secondStr.length < 2) secondStr = "0" + secondStr;
    if (minuteStr.length < 2) minuteStr = "0" + minuteStr;
    if (  hourStr.length < 2)   hourStr = "0" +   hourStr;
    
    return dayStr + ":" + hourStr + ":" + minuteStr + ":" + secondStr;
}

function now() {
    return Date.now();
}

function drawMultiFont(ctx, x, y, center, texts) {
    if (center) {
        for (var i = 0; i < texts.length; i += 2) {
            ctx.font = texts[i];
            x -= ctx.measureText(texts[i + 1]).width*0.5;
        }
    }
    
    for (var i = 0; i < texts.length; i += 2) {
        ctx.font = texts[i];
        ctx.fillText(texts[i + 1], Math.floor(x), Math.floor(y));
        x += ctx.measureText(texts[i + 1]).width;
    }
}