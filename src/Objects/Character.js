class Character extends GameObject {
    toString() { '[Character]' }

    init(params) {
        super.init(params);

        this.isAlive = true;
        this.dirty = false;
        this.points = 0;
        this.game = params.game;
        this.speed = params.speed;
        this.emitterKey = params.emitterKey;
        this.path = [];
        this.pathStep = -1;

        this._addEmitterToSprite();
        this._addAnimationsToSprite();
    }

    removePoints() {
        this.points -= points;

        if (this.points < 0) {
            this.points = 0;
        }
    }

    addPoints(points) {
        this.points += points;
    }

    kill() {
        this.isAlive = false;
        this.points = 0;

        if (this.sprite.emitter) {
            this.sprite.emitter.destroy();
        }

        this.sprite.destroy();
    }

    _addEmitterToSprite() {
        var emitter = this.game.add.emitter(this.sprite.x, this.sprite.y, 50);
        emitter.width = 5;
        emitter.makeParticles(this.emitterKey);
        emitter.setXSpeed();
        emitter.setYSpeed();
        emitter.setRotation();
        emitter.setAlpha(1, 0.4, 800);
        emitter.setScale(0.2, 0.05, 0.2, 0.05, 2000, Phaser.Easing.Quintic.Out);
        emitter.start(false, 250, 1);
        this.sprite.emitter = emitter;

        // this.aura = this.game.add.sprite(this.position.x, this.position.y, 'gfx/buffs/aura-1');
        // this.aura.scale.x = 0.8;
        // this.aura.scale.y = 0.8;
        //
        // this.sprite.addChild(this.aura);
    }

    changeSkin(key) {
        var oldKey = this.characterKey;
        var oldFrameName = this.sprite.frameName;

        this.sprite.animations.getAnimation('walkUp').destroy();
        this.sprite.animations.getAnimation('walkDown').destroy();
        this.sprite.animations.getAnimation('walkLeft').destroy();
        this.sprite.animations.getAnimation('walkRight').destroy();

        this.characterKey = key;

        this._addAnimationsToSprite();
        this.sprite.frameName = oldFrameName.replace(oldKey, key);
    }

    _addAnimationsToSprite() {
        // Phaser.Animation.generateFrameNames(this.characterKey + '/walkDown/', 1, 3, '', 2)
        // is equal to: [
        // this.characterKey + '/walkDown/0001',
        // this.characterKey + '/walkDown/0002',
        // this.characterKey + '/walkDown/0003'
        // ]

        this.sprite.animations.add('walkUp', Phaser.Animation.generateFrameNames(this.characterKey + '/walkUp-', 1, 3, '', 4), 3, false, false);
        this.sprite.animations.add('walkDown', Phaser.Animation.generateFrameNames(this.characterKey + '/walkDown-', 1, 3, '', 4), 3, false, false);
        this.sprite.animations.add('walkLeft', Phaser.Animation.generateFrameNames(this.characterKey + '/walkLeft-', 1, 3, '', 4), 3, false, false);
        this.sprite.animations.add('walkRight', Phaser.Animation.generateFrameNames(this.characterKey + '/walkRight-', 1, 3, '', 4), 3, false, false);
    }

    resetPath() {
        this.path = [];
        this.pathStep = 0;
    }

    reachedTargetPosition(targetPosition) {
        var distance = Phaser.Point.distance(this.position, targetPosition);
        return distance <= 16;
    }

    moveThroughPath(path) {
        if (path !== null) {
            this.path = path;
            this.pathStep = 0;
        } else {
            this.path = [];
        }
    }

    pathFind() {
        if (this.path.length > 0) {
            var nextPosition = this.path[this.pathStep];
            var accuracy = 16; // within 16px

            // If we're on the last step, lets make sure we get to the exact spot
            // Set more accuracy, 2px
            if (this.pathStep === this.path.length - 1) {
                accuracy = 2;
            }

            if (!this.reachedTargetPosition(nextPosition, accuracy)) {
                var velocity = new Phaser.Point(nextPosition.x - this.position.x, nextPosition.y - this.position.y);
                velocity.normalize();
                velocity.x = Math.round(velocity.x);
                velocity.y = Math.round(velocity.y);

                if (velocity.x === 1) {
                    this.sprite.animations.play('walkRight', 3, false);
                } else if (velocity.x === -1) {
                    this.sprite.animations.play('walkLeft', 3, false);
                } else if (velocity.y === 1) {
                    this.sprite.animations.play('walkDown', 3, false);
                } else if (velocity.y === -1) {
                    this.sprite.animations.play('walkUp', 3, false);
                }

                this.sprite.body.velocity.x = velocity.x * 100;
                this.sprite.body.velocity.y = velocity.y * 100;
            } else {
                this.position.x = nextPosition.x;
                this.position.y = nextPosition.y;

                if (this.pathStep < this.path.length - 1) {
                    this.pathStep += 1;
                } else {
                    this.path = [];
                    this.pathStep = -1;
                    this.sprite.body.velocity.x = 0;
                    this.sprite.body.velocity.y = 0;
                }
            }

            this.dirty = true;
        }
    }

    updatePos() {
        if (!this.isAlive || this.frozen) { return; }

        this.inputDown = this.inputDown || (this.sprite.downKey && this.sprite.downKey.isDown);
        this.inputUp = this.inputUp || (this.sprite.upKey && this.sprite.upKey.isDown);
        this.inputLeft = this.inputLeft || (this.sprite.leftKey && this.sprite.leftKey.isDown);
        this.inputRight = this.inputRight || (this.sprite.rightKey && this.sprite.rightKey.isDown);

        if (!(this.sprite &&
            this.sprite.body)) {
            return;
        }

        this.sprite.body.velocity.x = 0;
        this.sprite.body.velocity.y = 0;

        if (this.sprite.emitter) {
            this.sprite.emitter.on = true;
        }

        //console.log(this.name + ' ' + this.sprite.x + ',' + this.sprite.y);
        var emitterOffset = 15;
        if (this.inputUp) {
            this.sprite.animations.play('walkUp', 3, false);
            this.sprite.body.velocity.y = -this.speed;
            this.direction = 'walkUp';
            this.dirty = true;
            if (this.sprite.emitter) {
                this.sprite.emitter.x = this.sprite.x;
                this.sprite.emitter.y = this.sprite.y + emitterOffset;
            }
        } else if (this.inputDown) {
            this.sprite.animations.play('walkDown', 3, false);
            this.sprite.body.velocity.y = this.speed;
            this.direction = 'walkDown';
            this.dirty = true;
            if (this.sprite.emitter) {
                this.sprite.emitter.x = this.sprite.x;
                this.sprite.emitter.y = this.sprite.y - emitterOffset;
            }
        } else if (this.inputLeft) {
            this.sprite.animations.play('walkLeft', 3, false);
            this.sprite.body.velocity.x = -this.speed;
            this.direction = 'walkLeft';
            this.dirty = true;
            if (this.sprite.emitter) {
                this.sprite.emitter.x = this.sprite.x + emitterOffset;
                this.sprite.emitter.y = this.sprite.y;
            }
        } else if (this.inputRight) {
            this.sprite.animations.play('walkRight', 3, false);
            this.sprite.body.velocity.x = this.speed;
            this.direction = 'walkRight';
            this.dirty = true;
            if (this.sprite.emitter) {
                this.sprite.emitter.x = this.sprite.x - emitterOffset;
                this.sprite.emitter.y = this.sprite.y;
            }
        } else {
            if (this.sprite.emitter) {
                this.sprite.emitter.on = false;
            }
        }

        // Check if player has gone beyond the right edge
        // And send him to the beginning
        if (this.sprite.x >=  Hackatron.TILE_WIDTH * 16) {
            this.sprite.x = 5;
        }

        // Check if player has gone beyond the left edge
        // And send him to the end
        if (this.sprite.x < 0) {
            this.sprite.x =  (Hackatron.TILE_WIDTH - 1) * 16;
        }
    }
}
