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
    for(var i = 0; i < 32; i++) {
        convertedLevel[i] = [];
        for (var j = 0; j < 32; j++) {
            convertedLevel[i][j] = 0;
        }
    }

    this.map.collideTiles.forEach(function(tile) {
        convertedLevel[Math.floor(tile.y / 16)][Math.floor(tile.x / 16)] = 1;
    });

    this.easystar = new EasyStar.js();
    this.easystar.setGrid(convertedLevel);
    this.easystar.setAcceptableTiles([0]);
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
                try {
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
                } catch(e) {
                    var position = Hackatron.game.getValidPosition();
                    this.enemy.character.sprite.x = position.x;
                    this.enemy.character.sprite.y = position.y;
                }
            }

            this.easystar.calculate();

            if (currentPath && currentPathIndex < currentPath.length) {
                var xDiff = currentPath[currentPathIndex].x * 16 - this.enemy.character.sprite.x;
                var yDiff = currentPath[currentPathIndex].y * 16 - this.enemy.character.sprite.y;
                var toX = Math.abs(xDiff);
                var toY = Math.abs(yDiff);

                if (toX > toY) {
                    this.enemy.character.sprite.body.velocity.x = xDiff > 0 ? 100 : -100;
                } else {
                    this.enemy.character.sprite.body.velocity.y = yDiff > 0 ? 100 : -100;
                }
                // this.enemy.character.sprite.x = Math.floor(currentPath[currentPathIndex].x) * 16;
                // this.enemy.character.sprite.y = Math.floor(currentPath[currentPathIndex].y) * 16;

                // if (goToPosition) {
                //     repositionTimeout = setTimeout(() => { self.player.character.sprite.body.velocity.y = 0; self.player.character.sprite.y = goToPosition; }, REPOSITION_DELAY);
                // }

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