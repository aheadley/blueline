"use strict";

var BuildMenu = extend(InterfaceElement, function(canvas, ctx, tileView) {
    InterfaceElement.call(this, 1);
    
    var tile = tileView.tile;
    var padding = 25;
    
    this.canvas = canvas;
    this.ctx = ctx;
    this.tile = tile;
    this.width = tileView.width() + padding;
    this.height = canvas.height;
    this.x = canvas.width - this.width;
    this.y = 0;
    
    var options = tile.availableStructures();
    for (var i = 0; i < options.length; ++i) {
        var newTile = new Tile(tile.game, tile.x, tile.y, tile.type, tile.mode, options[i]);
        var tileView = new TileView(newTile, ctx);
        tileView.setScreenPos(this.x + padding/2, 20 + i*(tileView.height() + 15));
        this.addElement(tileView);
    }
});

BuildMenu.prototype.draw = function() {
    this.ctx.fillStyle = "#000";
    this.ctx.strokeStyle = "#FFF";
    this.ctx.lineWidth = 3;
    
    this.ctx.beginPath();
    this.ctx.rect(this.x, this.y, this.width, this.height);
    this.ctx.fill();
    this.ctx.beginPath();
    this.ctx.moveTo(this.x, this.y);
    this.ctx.lineTo(this.x, this.y + this.height);
    this.ctx.stroke();
    
    InterfaceElement.prototype.draw.call(this);
}

BuildMenu.prototype.pointInside = function(x, y) {
    return x >= this.x
        && y >= this.y
        && x <= this.x + this.width
        && y <= this.y + this.height;
}
BuildMenu.prototype.clickOutside = function(otherElement) {
    this.remove();
}
BuildMenu.prototype.click = function() {
    if (this.hoverElement && this.tile.buildStructure(this.hoverElement.tile.structure))
        this.remove();
}
