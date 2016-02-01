"use strict";

var ResearchView = extend(InterfaceElement, function(x, y, ctx, game, tech) {
    InterfaceElement.call(this, 0);
    
    this.width = 250;
    this.height = 60;
    this.ctx = ctx;
    this.game = game;
    this.tech = tech;
    this.x = x;
    this.y = y;
});

ResearchView.prototype.draw = function() {
    this.drawOutline();
    
    var research = this.game.research;
    var data = research.techData(this.tech);

    this.ctx.font = TextFont;
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "top";
    this.ctx.fillStyle = "#FFF";
    this.ctx.fillText(this.tech, this.x + this.width*0.5, this.y + 5);
    this.ctx.fillStyle = "#CCC";
    this.ctx.fillText(data.description, this.x + this.width*0.5, this.y + 20);
    
    if (!research.isAvailable(this.tech)) {
        var texts = [];
        for (var i = 0; i < data.requirements.length; ++i)
            if (!research.isResearched(data.requirements[i]))
                texts.push(data.requirements[i]);
        
        this.ctx.textAlign = "center";
        this.ctx.fillStyle = BadColor;
        this.ctx.fillText(texts.join(', '), this.x + this.width*0.5, this.y + 40);
    } else {
        this.ctx.textAlign = "left";
        this.ctx.fillStyle = data.cost <= this.game.science ? ScienceColor : BadColor;
        drawMultiFont(this.ctx, this.x + this.width*0.5 - 5, this.y + 40, true, [
            IconFont, ResourceIcons['Science'] + " ", TextFont, data.cost
        ]);
    }
}

ResearchView.prototype.drawOutline = function() {
    var mid = 25;
    var top = (this.height - mid)*0.5;

    this.ctx.lineWidth = 3;
    this.ctx.fillStyle = "#222";
    this.ctx.strokeStyle = "#CCC";
    this.ctx.beginPath();
    this.ctx.moveTo(this.x + top, this.y);
    this.ctx.lineTo(this.x + this.width - top, this.y);
    this.ctx.lineTo(this.x + this.width, this.y + top);
    this.ctx.lineTo(this.x + this.width, this.y + top + mid);
    this.ctx.lineTo(this.x + this.width - top, this.y + this.height);
    this.ctx.lineTo(this.x + top, this.y + this.height);
    this.ctx.lineTo(this.x, this.y + top + mid);
    this.ctx.lineTo(this.x, this.y + top);
    this.ctx.closePath();
    
    if (this.hover)
        this.ctx.fill();
    this.ctx.stroke();
}

ResearchView.prototype.pointInside = function(x, y) {
    return x >= this.x
        && y >= this.y
        && x <= this.x + this.width
        && y <= this.y + this.height;
}

var ResearchMenu = extend(InterfaceElement, function(button, game, canvas, ctx) {
    InterfaceElement.call(this, 1);
    
    this.button = button;
    this.game = game;
    this.canvas = canvas;
    this.ctx = ctx;
    
    var padding = 25;
    this.width = 250 + padding;
    this.height = canvas.height;
    this.x = canvas.width - this.width;
    this.y = 0;
    
    var menu = this;
    function add(tech) {
        menu.addElement(new ResearchView(menu.x + padding/2, 20 + i*(60 + 15),
                ctx, game, options[i]));
    }
    
    var options = game.research.visibleList();
    options.sort(function(a, b) {
        return game.research.techData(a).cost - game.research.techData(b).cost;
    });
    for (var i = 0; i < options.length; ++i)
        if (game.research.isAvailable(options[i]))
            add(options[i]);
    for (var i = 0; i < options.length; ++i)
        if (!game.research.isAvailable(options[i]))
            add(options[i]);
});

ResearchMenu.prototype.draw = function() {
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

ResearchMenu.prototype.pointInside = function(x, y) {
    return x >= this.x
        && y >= this.y
        && x <= this.x + this.width
        && y <= this.y + this.height;
}
ResearchMenu.prototype.clickOutside = function(otherElement) {
    if (otherElement != this.button)
        this.button.toggle();
}
ResearchMenu.prototype.click = function() {
    if (this.hoverElement && this.game.research.unlock(this.hoverElement.tech))
        this.button.toggle();
}
