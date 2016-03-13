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

Ghost.prototype.updatePoints = function(points) {
    this.points = this.points + points;
};
