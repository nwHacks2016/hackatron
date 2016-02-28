var Tron = Character.init;

Tron.init = function(name) {
    var tron = new Tron(name);
    tron.isAlive = true;
    tron.points = 0;
    return tron;
};

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
