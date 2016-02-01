var BuyTileButton = extend(Button, function(x, y, ctx) {
    Button.call(this, x, y, ctx, 'Buy');
});
BuyTileButton.prototype.clickOutside = function(element) {
    if (this.enabled && (element instanceof TileView) && element.tile.mode == Tile.MODE_BUYABLE)
        this.toggle();
}

var ResearchButton = extend(Button, function(x, y, ctx) {
    Button.call(this, x, y, ctx, 'Research');
});
