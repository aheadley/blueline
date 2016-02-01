var StructureBase = function(game, tile) {
    this.game = game;
    this.tile = tile;
    this.level = 0;
    this.stored = 0;
    
    if (tile)
        tile.structure = this;
}
StructureBase.prototype.production = function() {
    return Math.floor(this.game.productionModifier*this.rawProduction());
}
StructureBase.prototype.science = function() {
    return Math.floor(this.game.scienceModifier*this.rawScience());
}
StructureBase.prototype.power = function() {
    var power = this.rawPower()
    var modifier = power < 0 ? 1.0 : this.game.powerModifier;
    return Math.floor(modifier*power);
}
StructureBase.prototype.cost = function() {
    return Math.floor(this.game.costModifier*this.rawCost());
}
StructureBase.prototype.storage = function() {
    return Math.floor(this.game.storageModifier*this.rawStorage());
}
StructureBase.prototype.rawCost = function() {
    return 0;
}
StructureBase.prototype.rawProduction = function() {
    return 0;
}
StructureBase.prototype.rawScience = function() {
    return 0;
}
StructureBase.prototype.rawPower = function() {
    return 0;
}
StructureBase.prototype.rawStorage = function() {
    return 0;
}
StructureBase.prototype.storageSpace = function() {
    return this.storage() - this.stored;
}
StructureBase.prototype.store = function(value) {
    var stored = Math.min(value, this.storageSpace());
    this.stored = Math.min(this.stored + value, this.storage());
    return stored;
}
StructureBase.prototype.consume = function(value) {
    var consumed = Math.min(value, this.stored);
    this.stored = Math.max(this.stored - value, 0);
    return consumed;
}
StructureBase.prototype.upgrade = function() {
    if (this.cost() <= this.game.metal) {
        this.game.consumeMetal(this.cost());
        this.level++;
    }
}
StructureBase.prototype.tick = function(interval) {
    var production = this.production()*interval;

    var neighbors = this.tile.neighborStructures();
    while (production > 1e-2*interval) {
        var freeNeighbors = this.storageSpace() > 0;
        for (var i = 0; i < neighbors.length; ++i)
            if (neighbors[i].storageSpace() > 0)
                freeNeighbors++;
        if (freeNeighbors == 0)
            break;
        
        var distribution = production/freeNeighbors;
        production -= this.store(distribution);
        for (var i = 0; i < neighbors.length; ++i)
            production -= neighbors[i].store(distribution);
    }
}
