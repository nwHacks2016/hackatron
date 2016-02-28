define([], function() {

    var Pellet = function(type) {
        this.isAlive = true;
        this.type = type;
    };

    Pellet.init = function(type) {
        return new Pellet(type);
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

    return Pellet;
});