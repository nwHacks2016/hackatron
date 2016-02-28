var Ghost = function(game, x, y, key, frame) {
    Character.call(this, game, x, y, key, frame);
    this.points = 0;
};

Ghost.prototype = new Character ();

Ghost.prototype.killTron = function(tron) {
    this.updatePoints(tron.points);
    tron.kill();     
};

Ghost.prototype.updatePoints = function(points) {
    this.points = this.points + points;
};
