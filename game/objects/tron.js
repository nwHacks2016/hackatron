var Tron = function(game, x, y, key) {
    Character.call(this, game, x, y, key);
    this.isAlive = true;
    this.points = 0;
};

Tron.prototype = new Character();

Tron.prototype.kill = function() {
    this.isAlive = false; 
    this.points = 0;     
};

Tron.prototype.updatePoints = function(points) {
    this.points = this.points + points;
    if(this.points < 0) {
        this.points = 0;
    }
};

Tron.prototype.eatPellet = function(pellet) {
    this.updatePoints(pellet.getPoints());
    pellet.eaten();
};
