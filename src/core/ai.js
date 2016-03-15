function AI() {
        
}

var transpose = function(a) {
  // Calculate the width and height of the Array
  var w = a.length ? a.length : 0,
    h = a[0] instanceof Array ? a[0].length : 0;

  // In case it is a zero matrix, no transpose routine needed.
  if(h === 0 || w === 0) { return []; }

  /**
   * @var {Number} i Counter
   * @var {Number} j Counter
   * @var {Array} t Transposed data is stored in this array.
   */
  var i, j, t = [];

  // Loop through every item in the outer array (height)
  for(i=0; i<h; i++) {

    // Insert a new row (array)
    t[i] = [];

    // Loop through every item per item in outer array (width)
    for(j=0; j<w; j++) {

      // Save transposed data.
      t[i][j] = a[j][i];
    }
  }

  return t;
};

AI.prototype.init = function(game, player, enemy, mapData) {
    var originalLevel = transpose(mapData);
    var convertedLevel = [];

    // EasyStar expects a multidimensional array of the rows and columns
    mapData.forEach(function(row) {
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
            var currentPlayerXtile = Math.floor(player.character.sprite.x / 16);
            var currentPlayerYtile = Math.floor(player.character.sprite.y / 16);
            var currentGhostXtile = Math.floor(enemy.character.sprite.x / 16);
            var currentGhostYtile = Math.floor(enemy.character.sprite.y / 16);

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
                enemy.character.sprite.x = Math.floor(currentPath[currentPathIndex].x) * 16;
                enemy.character.sprite.y = Math.floor(currentPath[currentPathIndex].y) * 16;

                enemy.character.dirty = true;

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

AI.prototype.stopPathFinding = function () {
    clearInterval(this.pathFindingInterval)
}