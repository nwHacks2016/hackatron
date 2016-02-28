var Pellet = function(type) {
    this.isAlive = true;
    this.type = type;
};

Pellet.init = function(game, x, y, key) {
	var pellet = game.add.sprite(x, y, key);
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
