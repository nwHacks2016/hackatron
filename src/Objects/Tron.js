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

        if (this.characterKey == "super-saiyan") {
            var fireball = this.game.add.sprite(this.sprite.x, this.sprite.y, 'gfx/buffs');
            //this.sprite.animations.add('walkUp', Phaser.Animation.generateFrameNames(this.characterKey + '/walkUp-', 1, 3, '', 4), 3, false, false);
            fireball.anchor.setTo(0.5);
            fireball.animations.add('glitch', ['42'], 5, true, true);
            fireball.animations.play('glitch');
            this.game.physics.arcade.enable(fireball, Phaser.Physics.ARCADE);
            fireball.scale.x = 0.6;
            fireball.scale.y = 0.6;
            var FIREBALL_SPEED = this.speed * 2;
            switch (this.direction) {
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


            // Hackatron.game.fireballs.push(fireball);

            // makes block fade away within a 0.2 seconds
            var tween = this.game.add.tween(fireball).to( { alpha: 0 }, 200, 'Linear', true);
            tween.onComplete.add(function() {
                tween.stop();
            });

            setTimeout(function() {
                if (fireball) {
                    fireball.destroy();
                }
            }, 1000);


            return fireball;
        }

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
