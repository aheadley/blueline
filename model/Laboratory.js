var Laboratory = extend(StructureBase, function(game, tile) {
    StructureBase.call(this, game, tile);
    this.name = "Lab";
});
Laboratory.prototype.rawScience = function() {
    return 1 + this.level*2;
}
Laboratory.prototype.rawPower = function() {
    return -(7*Math.pow(1.05, this.level) + this.level*5);
}
Laboratory.prototype.rawCost = function() {
    return 50*Math.pow(1.07, this.level) + this.level*5;
}
