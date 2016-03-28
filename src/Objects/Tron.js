class Tron extends Character {
    toString() { '[Tron]' }

    init(params) {
        params = Object.assign(params, {characterKey: 'tron', defaultFrameKey: 'walkDown-0002', emitterKey: 'gfx/emitters/blueball'});

        super.init(params);

        this.blocks = 3;
        this.frozen = false;
        this.invincible = false;
        this.teleported = false;
    }

    eatPellet(pellet) {
        this.addPoints(pellet.getPoints());
        pellet.eaten();
    }

    triggerAttack() {
        var self = this;
        if (!self.isAlive) { return null; }

        if (this.blocks > 0) {
            self.blocks--;
            if (self.blocks < 0) self.blocks = 0;
            var block = this.game.add.sprite(this.sprite.x, this.sprite.y, 'gfx/blocks/glitch');
            block.anchor.setTo(0.5);
            block.animations.add('glitch', [0,1,2], 12, true, true);
            block.animations.play('glitch');
            this.game.physics.arcade.enable(block, Phaser.Physics.ARCADE);
            block.body.immovable = true;
            block.scale.x = 1.50;
            block.scale.y = 1.50;
            Hackatron.game.blocks.push(block);

            // makes block fade away within a 2.0 seconds
            var tween = this.game.add.tween(block).to( { alpha: 0 }, 2000, 'Linear', true);
            tween.onComplete.add(function() {
                tween.stop();
            });

            setTimeout(function() {
                block.destroy();
                self.blocks++;
                Hackatron.game.blocks.filter(function(b) {
                    return (b !== block);
                });
            }, 2000);

            Hackatron.game.addEvent(
                {key: 'blockSpawned',
                info: {
                    x: block.x,
                    y: block.y
                }
            });

            return block;
        }
        return null;
    }

    teleport(destination) {
        if (this.teleported) { return; }

        console.log('Teleporting player to...', destination);
        this.worldPosition = destination;

        this.teleported = true;

        setTimeout(() => { this.teleported = false; }, 2000);
    }
}
