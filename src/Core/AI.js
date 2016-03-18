function AI() {
}

AI.prototype.init = function(params) {
    this.map = params.map;
    this.game = params.game;
    this.player = params.player;
    this.enemy = params.enemy;

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
    var speed = 200; // usually 100

    // Delayed start to give players a chance
    setTimeout(() => {
        this.pathFindingInterval = setInterval(() => {
             if (!currentPath) {
                this.easystar.findPath(
                    this.enemy.character.worldPosition.x,
                    this.enemy.character.worldPosition.y,
                    this.player.character.worldPosition.x,
                    this.player.character.worldPosition.y,
                    function(path) {
                    if (!path || path.length < 2) {
                        console.log("The path to the destination point was not found.");
                        return;
                    }

                    currentPath = path;    

                    // Periodically reset
                    setTimeout(() => {
                        currentPathIndex = 0;
                        currentPath = null;
                    }, 3000);
                }.bind(this));
            }

            this.easystar.calculate();

            if (currentPath && currentPathIndex < currentPath.length) {
                this.enemy.character.sprite.x = Math.floor(currentPath[currentPathIndex].x) * 16;
                this.enemy.character.sprite.y = Math.floor(currentPath[currentPathIndex].y) * 16;

                this.enemy.character.dirty = true;

                if (currentPathIndex < currentPath.length-1) {
                    ++currentPathIndex;
                } else {
                    currentPathIndex = 0;
                    currentPath = null;
                }
            }
        }, speed);
    }, 5000);
};

AI.prototype.stopPathFinding = function() {
    clearInterval(this.pathFindingInterval);
};