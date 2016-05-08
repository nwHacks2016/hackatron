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
            var blockPosition = Utils.flooredPosition(this.sprite.position);
            // Make sure blocks stay within outer world wall
            if (blockPosition.x + 32 >= (Hackatron.TILE_COUNT_HORIZONTAL - 1) * 16) {
                blockPosition.x -= 16;
            }
            if (blockPosition.y + 32 >= (Hackatron.TILE_COUNT_VERTICAL - 1) * 16) {
                blockPosition.y -= 16;
            }

            var block = this.game.add.sprite(blockPosition.x, blockPosition.y, 'gfx/blocks/glitch');
            block.anchor.setTo(0);
            block.animations.add('glitch', [0,1,2], 12, true, true);
            block.animations.play('glitch');
            this.game.physics.arcade.enable(block, Phaser.Physics.ARCADE);

            block.body.immovable = false;
            block.scale.x = 1;
            block.scale.y = 1;
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

            Hackatron.game.fireEvent({
                key: 'blockSpawned',
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
