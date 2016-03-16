class Tron extends Character {
    toString() {
        return '[Tron]';
    }

    init(params) {
        Character.prototype.init.apply(this, arguments);

        this.blocks = 1;
    }

    eatPellet(pellet) {
        this.addPoints(pellet.getPoints());
        pellet.eaten();
    }

    triggerAttack(blockList) {
        var self = this;
        if (!self.isAlive) { return null; }

        if (this.sprite.attKey.isDown && this.blocks > 0) {
            self.blocks--;
            if (self.blocks < 0) self.blocks = 0;
            var offsetY = -10;
            var block = this.game.add.sprite(this.sprite.x, this.sprite.y + offsetY, 'glitch');
            block.animations.add('glitchLoop', [0,1,2], 12, true, true);
            block.animations.play('glitchLoop');
            this.game.physics.arcade.enable(block, Phaser.Physics.ARCADE);
            block.body.immovable = true;
            block.scale.x = 1.25;
            block.scale.y = 1.25;
            blockList.push(block);

            // makes block fade away within a 2.0 seconds
            var tween = this.game.add.tween(block).to( { alpha: 0 }, 2000, "Linear", true);
            tween.onComplete.add(function() {
                tween.stop();
            });

            setTimeout(function() {
                block.destroy();
                self.blocks++;
                blockList.filter(function(b) {
                    return (b !== block);
                });
            }, 2000);

            return block;
        }

        return null;
    }

    teleport(destination) {
        this.sprite.x = destination.x;
        this.sprite.y = destination.y;
    }
}
