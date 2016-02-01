"use strict";

var TileView = extend(InterfaceElement, function(tile, ctx) {
    InterfaceElement.call(this, 0);
    
    this.game = tile.game;
    this.tile = tile;
    this.ctx = ctx;
    this.sideLength = 36;
    
    this.hexagonAngle = 0.523598776; /* 30 deg */
    this.hexHeight = Math.floor(Math.sin(this.hexagonAngle)*this.sideLength);
    this.hexRadius = Math.floor(Math.cos(this.hexagonAngle)*this.sideLength);
    this.hexRectangleHeight = this.sideLength + 2*this.hexHeight;
    this.hexRectangleWidth = 2*this.hexRadius;
    
    this.xPadding = 8;
    this.yPadding = this.xPadding*Math.cos(this.hexagonAngle);
    
    var coords = this.coordsToScreen(tile.x, tile.y);
    this.screenX = coords[0];
    this.screenY = coords[1];
    this.opacity = 1.0;
    
    this.tile.addEventListener('mode-change', (function() {
        if (this.tile.mode == Tile.MODE_BUYABLE)
            AnimatedValue.addAnimation(this, 'opacity', 1000.0, 0.0, 1.0, Math.random()*500.0);
    }).bind(this));
});
TileView.prototype.setScreenPos = function(x, y) {
    this.screenX = x;
    this.screenY = y;
}
TileView.prototype.width = function() {
    return this.hexRectangleWidth;
}
TileView.prototype.height = function() {
    return this.hexRectangleHeight;
}
TileView.prototype.coordsToScreen = function(x, y) {
    return [
        Math.floor(3 + x*(this.hexRectangleWidth + this.xPadding) + ((y + 1) % 2)*(this.hexRadius + this.xPadding*0.5)),
        Math.floor(this.hexRectangleHeight*0.5 + y*(this.hexHeight + this.sideLength + this.yPadding))
    ];
}
TileView.prototype.pointInside = function(x, y) {
    var localX = Math.floor(Math.abs(x - (this.screenX + this.hexRectangleWidth *0.5)));
    var localY = Math.floor(Math.abs(y - (this.screenY + this.hexRectangleHeight*0.5)));
    
    var x0 = 0, y0 = Math.floor(0.5*this.sideLength + this.hexHeight);
    var x1 = this.hexRadius, y1 = Math.floor(0.5*this.sideLength);

    return localX < this.hexRadius
        && (localX - x0)*(y0 - y1) + (localY - y0)*(x1 - x0) < 0;
}
TileView.prototype.draw = function() {
    this.ctx.fillStyle = "#CCC";
    this.ctx.strokeStyle = (this.tile.mode == Tile.MODE_BOUGHT) ? "#CCC" : "#666";
    this.ctx.lineWidth = 3;
    this.ctx.globalAlpha = this.opacity;

    this.ctx.beginPath();
    this.ctx.moveTo(this.screenX + this.hexRadius, this.screenY);
    this.ctx.lineTo(this.screenX + this.hexRectangleWidth, this.screenY + this.hexHeight);
    this.ctx.lineTo(this.screenX + this.hexRectangleWidth, this.screenY + this.hexHeight + this.sideLength);
    this.ctx.lineTo(this.screenX + this.hexRadius, this.screenY + this.hexRectangleHeight);
    this.ctx.lineTo(this.screenX, this.screenY + this.sideLength + this.hexHeight);
    this.ctx.lineTo(this.screenX, this.screenY + this.hexHeight);
    this.ctx.closePath();

    if (this.hover) {
        this.ctx.globalAlpha = 0.2;
        this.ctx.fill();
        this.ctx.globalAlpha = 1.0;
    }
    this.ctx.stroke();
    
    this.ctx.globalAlpha = 1.0;
    
    if (this.tile.structure)
        this.drawStructure();
    else
        this.drawEmptyTile();
}
TileView.prototype.update = function() {
    if (this.tile.mode == Tile.MODE_HIDDEN)
        this.visible = false;
    else if (this.tile.mode == Tile.MODE_BUYABLE)
        this.visible = this.parent.showBuyable;
    else
        this.visible = true;
}

TileView.prototype.drawEmptyTile = function() {
    var x = this.screenX + this.hexRadius;
    var y = this.screenY;
    
    this.ctx.font = TileFont;
    this.ctx.fillStyle = this.tile.mode == Tile.MODE_BOUGHT ? "#CCC" : "#666";
    this.ctx.globalAlpha = this.opacity;
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillText(TileIcons[Tile.TileNames[this.tile.type]], x, y + Math.floor(this.hexRectangleHeight*0.5));
    
    if (this.tile.mode == Tile.MODE_BUYABLE) {
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "top";
        var cost = this.game.tileCost();
        this.ctx.fillStyle = cost <= this.game.metal ? GoodColor : BadColor;
        this.ctx.font = TextFont;
        this.ctx.fillText(cost, x, y + 50);
    }
    
    this.ctx.globalAlpha = 1.0;
}

TileView.prototype.drawStructure = function() {
    var x = this.screenX + this.hexRadius;
    var y = this.screenY;
    
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "top";
    this.ctx.fillStyle = "#FFF";
    this.ctx.font = StructureFont;
    this.ctx.fillText(StructureIcons[this.tile.structure.name], x, y + 8);
    
    this.ctx.textBaseline = "middle";
    if (this.game.power >= 0 || this.tile.structure.power() >= 0) {
        var text;
        if (this.tile.structure.production() != 0)
            text = "+" + this.tile.structure.production();
        else if (this.tile.structure.science() != 0)
            text = "+" + this.tile.structure.science();
        else if (this.tile.structure.power() != 0)
            text = "+" + this.tile.structure.power();
        else
            text = Math.floor(this.tile.structure.stored) + "/" + this.tile.structure.storage();
        this.ctx.font = TextFont;
        this.ctx.fillText(text, x, y + Math.floor(this.hexRectangleHeight*0.5));
    } else {
        this.ctx.globalAlpha = 0.6 + 0.4*Math.sin(this.game.timestamp*0.003 % Math.PI*2.0);
        this.ctx.font = StructureFont;
        this.ctx.fillStyle = BadColor;
        this.ctx.fillText(StructureIcons['Generator'], x, y + Math.floor(this.hexRectangleHeight*0.5));
        this.ctx.globalAlpha = 1.0;
    }
    
    var cost = this.tile.structure.cost();
    this.ctx.textBaseline = "top";
    this.ctx.font = TextFont;
    this.ctx.fillStyle = cost <= this.game.metal ? GoodColor : BadColor;
    this.ctx.fillText(cost, x, y + 50);
    
    if (this.tile.structure instanceof Storage) {
        var neighbors = this.tile.neighbors();
        for (var i = 0; i < neighbors.length; ++i)
            if (neighbors[i] && neighbors[i].structure && neighbors[i].structure.production() != 0)
                this.drawConnection(i);
    }
}
TileView.prototype.drawConnection = function(tileIdx) {
    var length = 8;
    var numLines = 3;

    var dirX = Math.cos(tileIdx/6.0*Math.PI*2.0);
    var dirY = Math.sin(tileIdx/6.0*Math.PI*2.0);
    var x0 = dirX*this.hexRadius + this.screenX + this.hexRectangleWidth*0.5;
    var y0 = dirY*this.hexRadius + this.screenY + this.hexRectangleHeight*0.5;
    var x1 = x0 + dirX*length;
    var y1 = y0 + dirY*length;
    
    this.ctx.strokeStyle = "#CCC";
    this.ctx.lineWidth = 3;
    for (var i = 0; i < numLines; ++i) {
        var oX = -dirY*(-(numLines - 1)*0.5 + i)*7;
        var oY =  dirX*(-(numLines - 1)*0.5 + i)*7;
        this.ctx.beginPath();
        this.ctx.moveTo(x0 + oX, y0 + oY);
        this.ctx.lineTo(x1 + oX, y1 + oY);
        this.ctx.stroke();
    }
}

TileView.prototype.click = function(x, y) {
    if (this.tile.structure)
        this.tile.structure.upgrade();
    else if (this.tile.mode == Tile.MODE_BUYABLE)
        this.tile.buy();
    else if (this.tile.mode == Tile.MODE_BOUGHT)
        this.notify('build-menu');
}
