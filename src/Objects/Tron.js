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

        if (self.characterKey == "super-saiyan") {
            var fireball = self.game.add.sprite(self.sprite.x, self.sprite.y, 'gfx/buffs');
            fireball.anchor.setTo(0.5);
            fireball.animations.add('fireball', ['42'], 1, true, true);
            fireball.animations.play('fireball');

            self.game.physics.arcade.enable(fireball, Phaser.Physics.ARCADE);
            fireball.body.collideWorldBounds = false;
            fireball.body.immovable = true;
            fireball.scale.x = 0.6;
            fireball.scale.y = 0.6;
            Hackatron.game.fireballs.push(fireball);

            var FIREBALL_SPEED = self.speed * 2;
            switch (self.direction) {
            case "walkUp":
                fireball.body.velocity.y = -FIREBALL_SPEED;
                fireball.angle = -90;
                break;
            case "walkDown":
                fireball.body.velocity.y = FIREBALL_SPEED;
                fireball.angle = 90;

                break;
            case "walkLeft":
                fireball.body.velocity.x = -FIREBALL_SPEED;
                fireball.angle = 180;
                break;
            case "walkRight":
                fireball.body.velocity.x = FIREBALL_SPEED;
                break;
            default:
                break;
            }

            // makes block fade away within a 0.2 seconds
            var FIRE_BALL_DURATION = 200;
            var tween = self.game.add.tween(fireball).to( { alpha: 0 }, FIRE_BALL_DURATION, 'Linear', true);
            tween.onComplete.add(function() {
                tween.stop();
            });

            setTimeout(function() {
                if (fireball) {
                    Hackatron.game.fireballs = Hackatron.game.fireballs.filter(function(fb) {
                        return (fb !== fireball);
                    });
                    fireball.destroy();
                }
            }, FIRE_BALL_DURATION + 100);

            Hackatron.game.fireEvent({
                key: 'fireballFired',
                info: {
                    x: self.sprite.x,
                    y: self.sprite.y,
                    speed: FIREBALL_SPEED,
                    direction: self.direction
                }
            });


            return fireball;
        }

        if (self.blocks > 0) {
            self.blocks--;
            if (self.blocks < 0) self.blocks = 0;
            var blockPosition = Utils.flooredPosition(self.sprite.position);
            // Make sure blocks stay within outer world wall
            if (blockPosition.x + 32 >= (Hackatron.TILE_COUNT_HORIZONTAL - 1) * 16) {
                blockPosition.x -= 16;
            }
            if (blockPosition.y + 32 >= (Hackatron.TILE_COUNT_VERTICAL - 1) * 16) {
                blockPosition.y -= 16;
            }

            var block = self.game.add.sprite(blockPosition.x, blockPosition.y, 'gfx/blocks/glitch');
            block.anchor.setTo(0);
            block.animations.add('glitch', [0,1,2], 12, true, true);
            block.animations.play('glitch');
            self.game.physics.arcade.enable(block, Phaser.Physics.ARCADE);

            block.body.immovable = false;
            block.scale.x = 1;
            block.scale.y = 1;
            Hackatron.game.blocks.push(block);

            // makes block fade away within a 2.0 seconds
            var tween = self.game.add.tween(block).to( { alpha: 0 }, 2000, 'Linear', true);
            tween.onComplete.add(function() {
                tween.stop();
            });

            setTimeout(function() {
                Hackatron.game.blocks = Hackatron.game.blocks.filter(function(b) {
                    return (b !== block);
                });
                block.destroy();
                self.blocks++;
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
