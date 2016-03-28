class AI {
    constructor() {
        this.pathToPosition = null;
    }

    findPath(origin, target, cb) {
        var originCoord = this.getCoordFromPoint(origin);
        var targetCoord = this.getCoordFromPoint(target);

        if (!this.outsideGrid(originCoord) && !this.outsideGrid(targetCoord)) {
            console.log('Pathing from ', originCoord.x + ',' + originCoord.y + ' to ' + targetCoord.x + ',' + targetCoord.y);

            this.easyStar.findPath(originCoord.x, originCoord.y, targetCoord.x, targetCoord.y, cb);
            this.easyStar.calculate();
            return true;
        }

        return false;
    }

    outsideGrid(coord) {
        return coord.y < 0 || coord.y > this.gridDimensions.y - 1 || coord.x < 0 || coord.x > this.gridDimensions.x - 1;
    }

    getCoordFromPoint(point) {
        var y = Math.floor(point.y / this.tileDimensions.y);
        var x = Math.floor(point.x / this.tileDimensions.x);
        return {y: y, x: x};
    }

    getPointFromCoord(coord) {
        var x = (coord.x * this.tileDimensions.x);
        var y = (coord.y * this.tileDimensions.y);
        return new Phaser.Point(x, y);
    }

    tracePath(path) {
        path.forEach((pathItem) => {
            if (!this.pathTraceSprite) {
                this.pathTraceSprite = this.game.add.graphics(pathItem.x, pathItem.y);
                this.pathTraceSprite.lineStyle(1, 0xffd900, 0.5);
            } else {
                this.pathTraceSprite.lineTo(pathItem.x - this.pathTraceSprite.x, pathItem.y - this.pathTraceSprite.y);
            }
        });

        this.pathTraceSprite.endFill();
    }

    findTarget() {
        var targets = [Hackatron.game.player.character];

        for (var id in Hackatron.game.players) {
            targets.push(Hackatron.game.players[id].character);
        }

        return targets[Math.floor(Math.random() * (targets.length - 1))];
    }

    init(params) {
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

        this.map.collideTiles.forEach((tile) => {
            if (!tile || !tile.collides) { return; }

            convertedLevel[tile.tilePosition.y][tile.tilePosition.x] = 1;
        });

        console.log('AI converted level: ', convertedLevel);

        this.easyStar = new EasyStar.js();
        this.easyStar.setGrid(convertedLevel);
        this.easyStar.setAcceptableTiles([0]);
        // Unfortunately I dont think these are helping
        this.easyStar.disableDiagonals();
        this.easyStar.setIterationsPerCalculation(1000);
        // this.easyStar.enableDiagonals();
        // this.easyStar.disableCornerCutting();
        // this.easyStar.enableCornerCutting();

        this.tileDimensions = {x: 16, y: 16};
        this.gridDimensions = {y: 32, x: 32};

        var sourceCharacter = this.enemy.character;
        var targetCharacter = this.player.character;

        this.followInterval = setInterval(() => {
            sourceCharacter.sprite.body.velocity.x = 0;
            sourceCharacter.sprite.body.velocity.y = 0;

            if (this.pathToPosition) {
                // Check if what we're targetting has changed positions
                if (this.pathToPosition.x !== targetCharacter.position.x || this.pathToPosition.y !== targetCharacter.position.y) {
                    console.log('[AI] Repathing...');
                    sourceCharacter.resetPath();
                    this.pathToPosition = null;
                    this.pathTraceSprite.destroy();
                    this.pathTraceSprite = null;
                    targetCharacter = this.findTarget();
                } else {
                    // If nothing has changed, we just need to keep updating
                    sourceCharacter.pathFind();
                }
            } else {
                this.findPath(sourceCharacter.position, targetCharacter.position, (pathCoords) => {
                    if (!pathCoords) { return; }

                    var path = pathCoords.map((pathCoord) => {
                        return this.getPointFromCoord({y: pathCoord.y, x: pathCoord.x});
                    });

                    this.tracePath(path);
                    sourceCharacter.moveThroughPath(path);

                    this.pathToPosition = targetCharacter.position;
                });
            }
        }, 20);
    }

    stopPathFinding() {
        clearInterval(this.pathFindingInterval);
    }
}
