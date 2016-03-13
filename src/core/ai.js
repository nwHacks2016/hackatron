function AI() {
        
}

AI.prototype.init = function(jsonfile) {
        var mazeWidth = 32;
        var mazeHeight = 32;

        var convertedLevel = [];
        var originalLevel = jsonfile.layers[0].data;

        for (var i = 0, l = Math.floor(originalLevel.length / 32); i < l; ++i) {
            var row = originalLevel.slice(i * 32, i * 32 + 32);

            convertedLevel.push(row);
        }

        this.easystar = new EasyStar.js();
        this.easystar.setGrid(convertedLevel);
        this.easystar.setAcceptableTiles([0]);
        // easystar.enableDiagonals();
        //easystar.disableCornerCutting();
        // easystar.enableCornerCutting();

        // if (this.playerId === this.hostId) {
        //     var timeStep = 400;
        //
        //     setInterval(function() { 
        //            if (!currentPath) {
        //                 this.easystar.findPath(this.currentGhostXtile, this.currentGhostYtile, this.currentPlayerXtile, this.currentPlayerYtile, function( path ) {
        //
        //                     if (!path || path.length < 2) {
        //                         console.log("The path to the destination point was not found.");
        //                         return;
        //                     }
        //
        //                     currentPath = path;  
        //
        //                     // Periodically reset
        //                     setTimeout(function() {
        //                         currentPathIndex = 0;
        //                         currentPath = null;
        //                     }, 3000);           
        //                 }.bind(this));
        //
        //            }
        //          this.easystar.calculate();
        //
        //     if (currentPath && currentPathIndex < currentPath.length) {
        //         enemy.sprite.x = Math.floor(currentPath[currentPathIndex].x) * 16;
        //         enemy.sprite.y = Math.floor(currentPath[currentPathIndex].y) * 16;
        //
        //             if (currentPathIndex < currentPath.length-1) {
        //                 ++currentPathIndex;
        //             } else {
        //                 currentPathIndex = 0;
        //                 currentPath = null;
        //             }
        //     }
        //
        //     }.bind(this), 100);
        // }
};