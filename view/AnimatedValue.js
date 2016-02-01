var AnimatedValue = function(target, name, length, min, max, offset) {
    this.target = target;
    this.name = name;
    this.length = length;
    this.min = defaultArg(min, 0.0);
    this.max = defaultArg(max, 1.0);
    this.timestamp = now() + defaultArg(offset, 0);
    this.tick();
}
AnimatedValue.prototype.tick = function() {
    this.target[this.name] = Math.max(this.min, Math.min(this.max, (now() - this.timestamp)/this.length));
}
AnimatedValue.prototype.done = function() {
    return this.target[this.name] >= this.max;
}
AnimatedValue.animations = [];
AnimatedValue.tick = function() {
    for (var i = 0; i < AnimatedValue.animations.length; ++i)
        AnimatedValue.animations[i].tick();
    AnimatedValue.animations = AnimatedValue.animations.filter(function(i) { return !i.done(); });
}
AnimatedValue.addAnimation = function(target, name, length, min, max, offset) {
    AnimatedValue.animations.push(new AnimatedValue(target, name, length, min, max, offset));
}
