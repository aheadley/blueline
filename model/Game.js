var MapTiles = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
   [0, 0, 0, 1, 0, 0, 0, 2, 2, 0, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0],
   [0, 0, 0, 0, 0, 1, 0, 0, 2, 2, 0, 0, 0],
    [0, 0, 2, 2, 2, 0, 1, 0, 0, 1, 0, 0, 0],
   [0, 0, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 2, 2, 2, 2, 0, 1, 0, 0, 0, 0, 0],
   [0, 0, 0, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0]
];

var Game = extend(EventSource, function(timestamp) {
    this.width = 13;
    this.height = 8;
    this.metal = 0;
    this.storage = 0;
    this.science = 0;
    this.power = 0;
    this.timestamp = timestamp;
    
    this.costModifier = 1.0;
    this.storageModifier = 1.0;
    this.productionModifier = 1.0;
    this.scienceModifier = 1.0;
    this.powerModifier = 1.0;
    
    this.haveTiles = false;
    this.haveScience = false;
    this.havePower = false;
    this.haveResearch = false;
    
    this.research = new Research(this);
    
    this.tiles = [];
    this.map = [];
    for (var x = 0; x < this.width; ++x) {
        this.map.push([]);
        for (var y = 0; y < this.height; ++y) {
            var tile = new Tile(this, x, y, MapTiles[y][x]);
            this.map[x].push(tile);
            this.tiles.push(tile);
            
            tile.addEventListener('mode-change', (function(tile) {
                if (tile.mode == Tile.MODE_BOUGHT) {
                    var neighbors = tile.nonNullNeighbors();
                    for (var i = 0; i < neighbors.length; ++i)
                        if (neighbors[i].mode == Tile.MODE_HIDDEN)
                            neighbors[i].changeMode(Tile.MODE_BUYABLE);
                }
            }).bind(this, tile));
        }
    }
    
    this.availableStructures = [
        [new Storage(this, null)],
        [new Mine(this, null)],
        []
    ];
    
    this.map[6][4].mode = Tile.MODE_BOUGHT;
    var firstMine = new Mine(this, this.map[6][4]);
    
    /* Debug stuff */
    /*firstMine.level = 7;
    this.haveResearch = true;
    this.science = 5000;*/
    
    this.conditions = [];
    this.addCondition(function() {
        if (this.boughtTileCount == 1 && this.metal == this.storage && firstMine.cost() > 50) {
            var neighbors = firstMine.tile.nonNullNeighbors();
            for (var i = 0; i < neighbors.length; ++i)
                neighbors[i].changeMode(Tile.MODE_BUYABLE);
            this.notify('enable-tiles');
            return true;
        }
        return false;
    });
    this.addCondition(function() {
        if (this.haveStructure(Storage)) {
            this.availableStructures[Tile.TYPE_PLAINS].push(new Laboratory(this, null));
            this.haveScience = true;
            this.notify('enable-science');
            return true;
        }
        return false;
    });
    this.addCondition(function() {
        if (this.haveStructure(Laboratory)) {
            this.availableStructures[Tile.TYPE_PLAINS].push(new Generator(this, null));
            this.havePower = true;
            this.notify('enable-power');
            return true;
        }
        return false;
    });
    this.addCondition(function() {
        if (this.haveStructure(Generator)) {
            this.haveResearch = true;
            this.notify('enable-research');
            return true;
        }
        return false;
    });
});
Game.prototype.haveStructure = function(structure) {
    for (var i = 0; i < this.tiles.length; ++i)
        if (this.tiles[i].structure instanceof structure)
            return true;
    return false;
}
Game.prototype.addCondition = function(func) {
    this.conditions.push(func.bind(this));
}
Game.prototype.checkConditions = function() {
    var i = 0;
    while (i < this.conditions.length) {
        if (this.conditions[i]())
            this.conditions.splice(i, 1);
        else
            i++;
    }
}

Game.prototype.tick = function(timestamp) {
    var interval = (timestamp - this.timestamp)/1000.0;
    this.timestamp = timestamp;
    
    this.boughtTileCount = 0;
    this.metal = 0;
    this.storage = 0;
    this.power = 0;
    var scienceProduction = 0;
    for (var i = 0; i < this.tiles.length; ++i) {
        if (this.tiles[i].mode == Tile.MODE_BOUGHT)
            this.boughtTileCount++;
        
        if (this.tiles[i].structure) {
            this.tiles[i].structure.tick(interval);
            
            this.metal        += this.tiles[i].structure.stored;
            this.storage      += this.tiles[i].structure.storage();
            this.power        += this.tiles[i].structure.power();
            scienceProduction += this.tiles[i].structure.science();
        }
    }
    
    if (this.power >= 0)
        this.science += scienceProduction*interval;
    
    this.checkConditions();
}
Game.prototype.tileCost = function() {
    return Math.floor(50*Math.pow(1.07, this.boughtTileCount - 1) + (this.boughtTileCount - 1)*10);
}
Game.prototype.consumeMetal = function(amount) {
    this.metal -= amount;
    
    while (amount > 1e-2) {
        var availableStructures = 0;
        for (var i = 0; i < this.tiles.length; ++i)
            if (this.tiles[i].structure && this.tiles[i].structure.stored > 0)
                availableStructures++;
        if (availableStructures == 0)
            break;
        
        var distribution = amount/availableStructures;
        for (var i = 0; i < this.tiles.length; ++i)
            if (this.tiles[i].structure)
                amount -= this.tiles[i].structure.consume(distribution);
    }
}
