var Ghost = function() {
    Character.apply(this, arguments);
    this.name = 'Ghost';
    this.points = 0;
};

Ghost.prototype = new Character();

Ghost.prototype.constructor = Ghost;

Ghost.prototype.init = function() {
    Character.prototype.init.apply(this, arguments);
};

Ghost.prototype.killTron = function(tron) {
    this.updatePoints(tron.points);
    tron.sprite.emitter.destroy();
    tron.nameText.destroy();
    tron.sprite.destroy();
    tron.kill();
};

Ghost.prototype.updatePoints = function(points) {
    this.points = this.points + points;
};
