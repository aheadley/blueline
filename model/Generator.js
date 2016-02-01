var Generator = extend(StructureBase, function(game, tile) {
    StructureBase.call(this, game, tile);
    this.name = "Generator";
});
Generator.prototype.rawPower = function() {
    return 10 + this.level*10;
}
Generator.prototype.rawCost = function() {
    return 30*Math.pow(1.06, this.level) + this.level*5;
}
