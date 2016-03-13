var Countdown = function() {
};

Countdown.prototype.init = function(game) {
    this.game = game;
};

Countdown.prototype.start = function() {
    var self = this;
    var tween1 = null;
    var tween2 = null;
    var tween3 = null;
    var centerX = self.game.camera.width / 2;
    var centerY = self.game.camera.height / 2;

    var count1 = self.game.add.sprite(centerX, centerY, 'countdown');
    count1.frame = 0;
    count1.anchor.setTo(0.5);
    tween1 = self.game.add.tween(count1.scale).to({ x: 3, y: 3}, 500, "Linear", true);

    tween1.onComplete.add(function() {
        // tween1.stop();
        self.game.add.tween(count1).to( { alpha: 0 }, 200, "Linear", true);

        var count2 = self.game.add.sprite(centerX, centerY, 'countdown');
        count2.frame = 1;
        count2.anchor.setTo(0.5);

        tween2 = self.game.add.tween(count2.scale).to({ x: 3, y: 3}, 500, "Linear", true);
        tween2.onComplete.add(function() {
            // tween2.stop();
            self.game.add.tween(count2).to( { alpha: 0 }, 200, "Linear", true);


            var count3 = self.game.add.sprite(centerX, centerY, 'countdown');
            count3.frame = 2;
            count3.anchor.setTo(0.5);

            tween3 = self.game.add.tween(count3.scale).to({ x: 3, y: 3}, 500, "Linear", true);
            tween3.onComplete.add(function() {
                self.game.add.tween(count3).to( { alpha: 0 }, 200, "Linear", true);

            });
        });
    });



};
