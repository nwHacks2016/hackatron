var Pellet = function(type) {
    this.isAlive = true;
    this.type = type;
};

Pellet.init = function(game, x, y, key, frame, type) {
	var pellet = Hackatron.Game.add.sprite(game, x, y, key, frame);
	pellet.isAlive = true;
	this.type = type
    return pellet;
};

Pellet.prototype.eaten = function() {
    this.isAlive = false; 
};

Pellet.prototype.getPoints = function() {
    switch (type) {
        case 'LOW': return 1;
        case 'MED': return 5;
        case 'HIGH': return 10;
    }
};
