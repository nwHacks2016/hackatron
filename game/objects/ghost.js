define(['character'], function(Character) {

    var Ghost = Character.init;

    Ghost.init = function(name) {
        var ghost = new Ghost(name);
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
    
    return Ghost;
});
