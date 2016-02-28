var Ghost = Character.init;

Ghost.init = function(game, x, y, key, frame) {
    var ghost = new Ghost(game, x, y, key, frame);
    ghost.points = 0;
    return ghost
};

Ghost.prototype.killTron = function(tron) {
    this.updatePoints(tron.points);
    tron.kill();     
};

Ghost.prototype.updatePoints = function(points) {
    this.points = this.points + points;
};
