var Research = function(game) {
    this.game = game;
    this.researchedTechs = {};
    this.availableTechs = {
        'Chipsets': {
            'description': 'Unlocks electronic research',
            'requirements': [],
            'cost': 1000,
            'apply': function(game) {}
        },
        'Construction I': {
            'description': 'Build cost -10%',
            'cost': 5000,
            'requirements': [],
            'apply': function(game) { game.costModifier -= 0.1; }
        },
        'Logistics I': {
            'description': 'Storage capacity +10%',
            'cost': 5000,
            'requirements': [],
            'apply': function(game) { game.storageModifier += 0.1; }
        },
        'Drilling I': {
            'description': 'Mining output +10%',
            'cost': 10000,
            'requirements': [],
            'apply': function(game) { game.productionModifier += 0.1; }
        },
        'Electrolysis': {
            'description': 'Hydrogen from ocean tiles',
            'cost': 50000,
            'requirements': ['Chipsets'],
            'apply': function(game) {}
        },
        'Conductors I': {
            'description': 'Power production +10%',
            'cost': 50000,
            'requirements': ['Chipsets'],
            'apply': function(game) { game.powerModifier += 0.1; }
        },
        'Bulldozers': {
            'description': 'Allows destroying structures',
            'cost': 50000,
            'requirements': ['Construction I'],
            'apply': function(game) {}
        },
    };
}
Research.prototype.isResearched = function(tech) {
    return tech in this.researchedTechs;
}
Research.prototype.isVisible = function(tech) {
    if (!(tech in this.availableTechs))
        return false;
    var research = this.availableTechs[tech];
    for (var i = 0; i < research.requirements.length; ++i)
        if (this.isAvailable(research.requirements[i]) || this.isResearched(research.requirements[i]))
            return true;
    return research.requirements.length == 0;
}
Research.prototype.isAvailable = function(tech) {
    if (!(tech in this.availableTechs))
        return false;
    var research = this.availableTechs[tech];
    for (var i = 0; i < research.requirements.length; ++i)
        if (!this.isResearched(research.requirements[i]))
            return false;
    return true;
}
Research.prototype.visibleList = function() {
    return Object.keys(this.availableTechs).filter(this.isVisible.bind(this));
}
Research.prototype.availableList = function() {
    return Object.keys(this.availableTechs).filter(this.isAvailable.bind(this));
}
Research.prototype.techData = function(tech) {
    return this.availableTechs[tech];
}
Research.prototype.unlock = function(tech) {
    if (this.isAvailable(tech) && this.availableTechs[tech].cost <= this.game.science) {
        this.game.science -= this.availableTechs[tech].cost;
        this.availableTechs[tech].apply(this.game);
        this.researchedTechs[tech] = this.availableTechs[tech];
        delete this.availableTechs[tech];
        return true;
    }
    return false;
}
