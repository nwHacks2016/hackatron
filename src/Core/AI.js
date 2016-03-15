function AI() {
}

AI.prototype.init = function(params) {
    this.map = map;
    this.game = game;
    this.player = player;
    this.enemy = enemy;

    var originalLevel = Utils.transpose(this.map.data);
    var convertedLevel = [];

    // EasyStar expects a multidimensional array of the rows and columns
    this.map.data.forEach(function(row) {
        convertedLevel.push(row.map(function(cell) { return cell.index; }));
    });

    this.easystar = new EasyStar.js();
    this.easystar.setGrid(convertedLevel);
    this.easystar.setAcceptableTiles([Hackatron.mapConfig.floorTile]);
    // easystar.enableDiagonals();
    // easystar.disableCornerCutting();
    // easystar.enableCornerCutting();

    var currentPathIndex = 0;
    var currentPath = null;
    var timeStep = 600;
    var speed = 1000; // usually 100

    // Delayed start to give players a chance
    setTimeout(function() {
        this.pathFindingInterval = setInterval( function() {
            var currentPlayerXtile = Math.floor(this.map.player.character.sprite.x / 16);
            var currentPlayerYtile = Math.floor(this.map.player.character.sprite.y / 16);
            var currentGhostXtile = Math.floor(this.map.enemy.character.sprite.x / 16);
            var currentGhostYtile = Math.floor(this.map.enemy.character.sprite.y / 16);

             if (!currentPath) {
                this.easystar.findPath(currentGhostXtile, currentGhostYtile, currentPlayerXtile, currentPlayerYtile, function(path) {
                    if (!path || path.length < 2) {
                        console.log("The path to the destination point was not found.");
                        return;
                    }

                    currentPath = path;    

                    // Periodically reset
                    setTimeout(function() {
                        currentPathIndex = 0;
                        currentPath = null;
                    }, 3000);                     
                }.bind(this));
            }

            this.easystar.calculate();

            if (currentPath && currentPathIndex < currentPath.length) {
                this.map.enemy.character.sprite.x = Math.floor(currentPath[currentPathIndex].x) * 16;
                this.map.enemy.character.sprite.y = Math.floor(currentPath[currentPathIndex].y) * 16;

                this.map.enemy.character.dirty = true;

                if (currentPathIndex < currentPath.length-1) {
                    ++currentPathIndex;
                } else {
                    currentPathIndex = 0;
                    currentPath = null;
                }
            }
        }.bind(this), speed);
    }.bind(this), 5000);
};

AI.prototype.stopPathFinding = function() {
    clearInterval(this.pathFindingInterval);
};