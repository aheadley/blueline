var Storage = extend(StructureBase, function(game, tile) {
    StructureBase.call(this, game, tile);
    this.name = "Storage";
});
Storage.prototype.rawStorage = function() {
    return 10 + this.level*20;
}
Storage.prototype.rawCost = function() {
    return 10*Math.pow(1.05, this.level) + this.level*5;
}
