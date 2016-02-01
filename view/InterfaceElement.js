var InterfaceElement = extend(EventSource, function(zIndex) {
    this.hover = false;
    this.zIndex = zIndex;
    this.children = [];
    this.hoverElement = null;
    this.visible = true;
});
InterfaceElement.prototype.pointInside = function(x, y) {
    return false;
}
InterfaceElement.prototype.mouseEnter = function(x, y) {
    this.hover = true;
    
    var eventConsumed = false;
    this.hoverElement = null;
    
    for (var i = this.children.length - 1; i >= 0; --i) {
        if (!eventConsumed && this.children[i].visible && this.children[i].pointInside(x, y)) {
            this.hoverElement = this.children[i];
            this.children[i].mouseEnter(x, y);
            eventConsumed = true;
        } else {
            this.children[i].mouseLeave();
        }
    }
}
InterfaceElement.prototype.mouseLeave = function() {
    this.hover = false;
}
InterfaceElement.prototype.click = function(x, y) {
    for (var i = 0; i < this.children.length; ++i)
        if (this.children[i] != this.hoverElement)
            this.children[i].clickOutside(this.hoverElement);
    if (this.hoverElement)
        this.hoverElement.click(x, y);
}
InterfaceElement.prototype.clickOutside = function(otherElement) {
}
InterfaceElement.prototype.remove = function() {
    this.parent.removeElement(this);
}

InterfaceElement.prototype.addElement = function(element) {
    element.parent = this;
    this.children.push(element);
    this.children.sort(function(a, b) {
        return a.zIndex - b.zIndex;
    });
}
InterfaceElement.prototype.removeElement = function(element) {
    var index = this.children.indexOf(element);
    if (index >= 0) {
        this.children.splice(index, 1);
        element.parent = null;
    }
}

InterfaceElement.prototype.draw = function() {
    for (var i = 0; i < this.children.length; ++i)
        if (this.children[i].visible)
            this.children[i].draw();
}
