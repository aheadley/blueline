var Button = extend(InterfaceElement, function(x, y, ctx, icon) {
    InterfaceElement.call(this, 1);
    
    this.x = x;
    this.y = y;
    this.sizeX = 30;
    this.sizeY = 15;
    this.ctx = ctx;
    this.icon = icon;
    this.enabled = false;
    this.opacity = 1.0;
});
Button.prototype.draw = function() {
    this.ctx.globalAlpha = this.opacity;
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = "#FFF";
    this.ctx.beginPath();
    this.roundRect(this.x - this.sizeX, this.y - this.sizeY, this.sizeX*2, this.sizeY*2, 3);
    
    this.ctx.fillStyle = this.enabled ? "#FFF" : (this.hover ? "#444" : "#000");
    this.ctx.fill();
    this.ctx.stroke();
    
    this.ctx.fillStyle = this.enabled ? "#000" : "#FFF";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.font = ButtonIconFont;
    this.ctx.fillText(ButtonIcons[this.icon], this.x + 1, this.y - 3);
}
Button.prototype.enable = function(value) {
    this.enabled = value;
}
Button.prototype.pointInside = function(x, y) {
    return x >= this.x - this.sizeX
        && y >= this.y - this.sizeY
        && x <= this.x + this.sizeX
        && y <= this.y + this.sizeY;
}
Button.prototype.click = function(x, y) {
    this.toggle();
}
Button.prototype.toggle = function() {
    this.enabled = !this.enabled;
    this.notify('toggle', this.enabled);
}

Button.prototype.roundRect = function(x, y, w, h, r) {
    if (w < 2*r) r = w*0.5;
    if (h < 2*r) r = h*0.5;
    this.ctx.beginPath();
    this.ctx.moveTo(x + r, y);
    this.ctx.arcTo (x + w, y    , x + w, y + h, r);
    this.ctx.arcTo (x + w, y + h, x    , y + h, r);
    this.ctx.arcTo (x    , y + h, x    , y    , r);
    this.ctx.arcTo (x    , y    , x + w, y    , r);
    this.ctx.closePath();
}
