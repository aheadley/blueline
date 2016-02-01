var Mine = extend(StructureBase, function(game, tile) {
    StructureBase.call(this, game, tile);
    this.name = "Mine";
});
Mine.prototype.rawProduction = function() {
    return 1 + this.level*2;
}
Mine.prototype.rawCost = function() {
    return 10*Math.pow(1.07, this.level) + this.level*5;
}
Mine.prototype.rawStorage = function() {
    return 50;
}
