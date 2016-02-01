"use strict";

var GoodColor = "#4f4";
var  BadColor = "#f44";
var ScienceColor = "#4cf";

var TextFont = "12px monospace";
var IconFont = "12px Icons";
var ResourceIconFont = "16px Icons";
var ResourceTextFont = "16px monospace";
var ButtonIconFont = "20px Icons";
var StructureFont = "12px Icons";
var TileFont = "24px Icons";
var StructureIcons = {
    'Mine': '\uE041',
    'Storage': '\uE072',
    'Lab': '\uE01c',
    'Generator': '\uE020'
};
var ResourceIcons = {
    'Metal': '\uE041',
    'Science': '\uE01c',
    'Power': '\uE020'
};
var ResourceIconOffsets = { /* Yuck */
    'Science': -2
}
var TileIcons = {
    'Plains': '\uE079',
    'Mine': '\uE07A',
    'Ocean': '\uE058'
};
var ButtonIcons = {
    'Buy': '\uE053',
    'Research': '\uE01c'
};

var GameView = extend(InterfaceElement, function(game, canvas) {
    InterfaceElement.call(this, 0);
    
    this.game = game;
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.ctx.translate(0.5, 0.5);
    this.boardWidth = game.width;
    this.boardHeight = game.height;
    
    this.tiles = [];
    for (var i = 0; i < game.tiles.length; ++i) {
        var tile = new TileView(game.tiles[i], this.ctx);
        this.tiles.push(tile);
        this.addElement(tile);
        
        tile.addEventListener('build-menu', (function(tile) {
            this.addElement(new BuildMenu(this.canvas, this.ctx, tile));
        }).bind(this, tile));
    }
    
    this.showBuyable = game.haveTiles;
    this.scienceOpacity = game.haveScience ? 1.0 : 0.0;
    this.powerOpacity = game.havePower ? 1.0 : 0.0;
    this.showResearch = game.haveResearch;
    
    this.createButtons();
    
    if (this.showBuyable)
        this.addElement(this.buyTileButton);
    if (this.showResearch)
        this.addElement(this.researchButton);
        
    this.buyTileButton.addEventListener('toggle', (function(value) {
        this.showBuyable = value;
    }).bind(this));
    this.researchButton.addEventListener('toggle', (function(value) {
        if (value) {
            this.researchMenu = new ResearchMenu(this.researchButton, this.game, this.canvas, this.ctx);
            this.addElement(this.researchMenu);
        } else {
            this.researchMenu.remove();
            this.researchMenu = null;
        }
    }).bind(this));
    
    game.addEventListener('enable-science', (function() {
        AnimatedValue.addAnimation(this, 'scienceOpacity', 1000.0);
    }).bind(this));
    game.addEventListener('enable-power', (function() {
        AnimatedValue.addAnimation(this, 'powerOpacity', 1000.0);
    }).bind(this));
    game.addEventListener('enable-tiles', (function() {
        this.addElement(this.buyTileButton);
        this.buyTileButton.toggle();
        AnimatedValue.addAnimation(this.buyTileButton, 'opacity', 1000.0);
    }).bind(this));
    game.addEventListener('enable-research', (function() {
        this.addElement(this.researchButton);
        AnimatedValue.addAnimation(this.researchButton, 'opacity', 1000.0);
    }).bind(this));
    
    canvas.addEventListener("mousemove", (function(eventInfo) {
        var rect = this.canvas.getBoundingClientRect();
        var x = eventInfo.clientX - rect.left;
        var y = eventInfo.clientY - rect.top;
        
        this.mouseEnter(x, y);
    }).bind(this));
    
    canvas.addEventListener("click", (function(eventInfo) {
        if (eventInfo.button != 0)
            return;
        var rect = this.canvas.getBoundingClientRect();
        var x = eventInfo.clientX - rect.left;
        var y = eventInfo.clientY - rect.top;
        
        this.click(x, y);
    }).bind(this));
});

GameView.prototype.createButtons = function() {
    var centerTile = this.tiles[6*this.game.height + 4];
    var x = centerTile.screenX + centerTile.width()*0.5;
    var y = this.canvas.height - 20;
    
    this. buyTileButton = new  BuyTileButton(x + 100*0, y, this.ctx);
    this.researchButton = new ResearchButton(x + 100*1, y, this.ctx);
}

GameView.prototype.update = function() {
    AnimatedValue.tick();
    for (var i = 0; i < this.tiles.length; ++i)
        this.tiles[i].update();
}

GameView.prototype.draw = function() {
    this.ctx.fillStyle = "#000";
    this.ctx.beginPath();
    this.ctx.rect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fill();
    
    InterfaceElement.prototype.draw.call(this);
    
    this.drawResources();
}

GameView.prototype.drawResources = function() {
    this.drawResource(0, 'Metal', "#fff", Math.floor(this.game.metal) + "/" + this.game.storage);
    if (this.game.haveScience)
        this.drawResource(1, 'Science', ScienceColor, Math.floor(this.game.science), this.scienceOpacity);
    if (this.game.havePower)
        this.drawResource(-1, 'Power', this.game.power < 0 ? BadColor : "#fff",
                          this.game.power, this.powerOpacity);
    this.ctx.globalAlpha = 1.0;
}

GameView.prototype.drawResource = function(slot, name, color, text, opacity) {
    var centerTile = this.tiles[6*this.game.height + 4];
    var x = centerTile.screenX + centerTile.width()*0.5 + slot*150;
    var y = 20;
    
    this.ctx.globalAlpha = defaultArg(opacity, 1.0);
    this.ctx.font = ResourceTextFont;
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillStyle = color;
    this.ctx.fillText(text, x, y);
    var width = this.ctx.measureText(text).width;
    this.ctx.font = ResourceIconFont;
    this.ctx.textAlign = "right";
    
    if (name in ResourceIconOffsets)
        y += ResourceIconOffsets[name];
    this.ctx.fillText(ResourceIcons[name], x - width*0.5 - 5, y);
}

GameView.prototype.addResourceText = function(array, resourceName, text) {
    var prefix = array.length == 0 ? "" : "     "
    array.push(ResourceIconFont);
    array.push(prefix + ResourceIcons[resourceName] + " ");
    array.push(ResourceTextFont);
    array.push(text);
}
