var Tile = extend(EventSource, function(game, x, y, type, mode, structure) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.type = type;
    this.mode = defaultArg(mode, Tile.MODE_HIDDEN);
    this.structure = defaultArg(structure, null);
});
Tile.MODE_HIDDEN  = 0;
Tile.MODE_BUYABLE = 1;
Tile.MODE_BOUGHT  = 2;

Tile.TYPE_PLAINS = 0;
Tile.TYPE_MINE   = 1;
Tile.TYPE_OCEAN  = 2;

Tile.TileNames = ["Plains", "Mine", "Ocean"];

Tile.prototype.changeMode = function(mode) {
    if (mode != this.mode) {
        this.mode = mode;
        this.notify('mode-change');
    }
}
Tile.prototype.neighbors = function() {
    var yBit = (this.y + 1) % 2;
    var xOffsets = [1, yBit, yBit - 1, -1, yBit - 1, yBit];
    var yOffsets = [0,    1,        1,  0,       -1,   -1];
    
    var neighbors = [];
    for (var i = 0; i < 6; ++i) {
        var nx = this.x + xOffsets[i];
        var ny = this.y + yOffsets[i];
        if (nx >= 0 && ny >= 0 && nx < this.game.width && ny < this.game.height)
            neighbors.push(this.game.map[nx][ny]);
        else
            neighbors.push(null);
    }
    return neighbors;
}
Tile.prototype.nonNullNeighbors = function() {
    return this.neighbors()
        .filter(function(f) { return f != null; });
}
Tile.prototype.neighborStructures = function() {
    return this.nonNullNeighbors()
        .map(function(f) { return f.structure; })
        .filter(function(f) { return f != null; });
}
Tile.prototype.availableStructures = function() {
    return this.game.availableStructures[this.type];
}
Tile.prototype.buy = function() {
    if (this.mode == Tile.MODE_BUYABLE && this.game.metal >= this.game.tileCost()) {
        this.changeMode(Tile.MODE_BOUGHT);
        this.game.consumeMetal(this.game.tileCost());
        return true;
    }
    return false;
}
Tile.prototype.buildStructure = function(structure) {
    if (this.mode == Tile.MODE_BOUGHT && structure.cost() <= this.game.metal) {
        this.game.consumeMetal(structure.cost());
        this.structure = new structure.constructor(this.game, this);
        return true;
    }
    return false;
}
