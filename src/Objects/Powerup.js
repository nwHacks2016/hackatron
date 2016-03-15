var Powerup = function() {
    GameObject.apply(this, arguments);
};

Powerup.prototype = new GameObject();

Powerup.prototype.constructor = Powerup;

Powerup.prototype.toString = function() {
    return '[Powerup]';
};

Powerup.prototype.init = function(params) {
    GameObject.prototype.init.apply(this, arguments);

    // TODO: this guy should move a lot of this logic over to GamePlugin

    this.finished = false;
    this.claimed = false;

    // Deps
    // TODO: clean up
    this.state = params.state;
    this.game = params.game;
    this.player = params.player;
    this.mapData = params.mapData;
    this.handler = params.handler();

    // Events
    this.onStarted = params.onStarted;

    // Plugin methods
    this.key = this.handler.key;
    this.update = this.handler.update.bind(this);
    this.setup = this.handler.setup.bind(this);
    this.start = this.handler.start.bind(this);
    this.stop = this.handler.stop.bind(this);
    this.destroy = this.handler.destroy.bind(this);

    // should return the JSON necessary for networking
    return this.setup();
};

// Plugins

Powerup.plugins = {};

Powerup.plugins.saiyanMode = function() {
    return {
        key: 'saiyanMode',
        setup: function() {
            if (!this.state) {
                this.state = {
                    coord: Hackatron.game.state.states.Game.getValidCoord(0, 0)
                };
            }

            this.sprite = this.game.add.sprite(this.state.coord.x * 16, this.state.coord.y * 16, 'saiyanMode');
            this.sprite.animations.add('buffLoop', [0,1,2,3,4,5,6], 6, true, true);
            this.sprite.animations.play('buffLoop');
            this.sprite.scale.x = 0.8;
            this.sprite.scale.y = 0.8;
            this.game.physics.arcade.enable(this.sprite, Phaser.Physics.ARCADE);

            setTimeout(this.destroy, 15000);

            return this.state;
        },

        update: function() {
            this.game.physics.arcade.overlap(this.player.character.sprite, this.sprite, this.start.bind(this), null, this.game);
        },

        start: function() {
            if (this.claimed) { return; }

            this.claimed = true;
            this.sprite.destroy();
            setTimeout(this.stop, 4000);

            this.onStarted && this.onStarted();

            console.log('Powerup START: Phase mode');
        },

        stop: function() {
            this.finished = true;
            this.sprite.destroy();
            console.log('Powerup STOP: Phase mode');
        },
        
        destroy: function() {
            this.sprite.destroy();
        }
    };
};

Powerup.plugins.ghostMode = function() {
    return {
        key: 'ghostMode',
        setup: function(state) {
            if (!this.state) {
                this.state = {
                    coord: Hackatron.game.state.states.Game.getValidCoord(0, 0)
                };
            }

            this.sprite = this.game.add.sprite(this.state.coord.x * 16, this.state.coord.y * 16, this.game.add.bitmapData(16, 16));
            this.sprite.key.copyRect('powerups', getRect(1, 1), 0, 0);
            this.sprite.scale.x = 1.2;
            this.sprite.scale.y = 1.2;
            this.game.add.tween(this.sprite).to({alpha: 0}, 15000, 'Linear', true, 0, -1);
            this.game.physics.arcade.enable(this.sprite, Phaser.Physics.ARCADE);

            setTimeout(this.destroy, 15000);

            return this.state;
        },

        update: function() {
            this.game.physics.arcade.overlap(this.player.character.sprite, this.sprite, this.start.bind(this), null, this.game);
        },

        start: function() {
            if (this.claimed) { return; }

            this.claimed = true;
            this.sprite.destroy();
            setTimeout(this.stop, 4000);

            this.onStarted && this.onStarted();

            console.log('Powerup START: Ghost mode');
        },

        stop: function() {
            this.finished = true;
            console.log('Powerup STOP: Ghost mode');
        },

        destroy: function() {
            this.sprite.destroy();
        }
    };
};

Powerup.plugins.invincibleMode = function() {
    return {
        key: 'invincibleMode',
        setup: function(state) {
            if (!this.state) {
                this.state = {
                    coord: Hackatron.game.state.states.Game.getValidCoord(0, 0)
                };
            }

            this.sprite = this.game.add.sprite(this.state.coord.x * 16, this.state.coord.y * 16, this.game.add.bitmapData(16, 16));
            this.sprite.key.copyRect('powerups', getRect(1, 2), 0, 0);
            this.sprite.scale.x = 1.2;
            this.sprite.scale.y = 1.2;
            this.game.add.tween(this.sprite).to({alpha: 0}, 15000, 'Linear', true, 0, -1);
            this.game.physics.arcade.enable(this.sprite, Phaser.Physics.ARCADE);

            setTimeout(this.destroy, 15000);

            return this.state;
        },

        update: function() {
            this.game.physics.arcade.overlap(this.player.character.sprite, this.sprite, this.start.bind(this), null, this.game);
        },

        start: function() {
            if (this.claimed) { return; }

            this.claimed = true;
            this.player.character.invincible = true;
            this.tween = this.game.add.tween(this.player.character.sprite).to({alpha: 0}, 400, 'Linear', true, 0, -1);
            this.sprite.destroy();
            setTimeout(this.stop, 4000);

            this.onStarted && this.onStarted();

            console.log('Powerup START: Invincible mode');
        },

        stop: function() {
            this.finished = true;
            this.player.character.invincible = false;
            this.tween.stop();
            this.tween = this.game.add.tween(this.player.character.sprite).to({alpha: 1}, 0, 'Linear', true, 0);
            console.log('Powerup STOP: Invincible mode');
        },

        destroy: function() {
            this.sprite.destroy();
        }
    };
};

Powerup.plugins.rageMode = function() {
    return {
        key: 'rageMode',
        setup: function(state) {
            if (!this.state) {
                this.state = {
                    coord: Hackatron.game.state.states.Game.getValidCoord(0, 0)
                };
            }

            this.sprite = this.game.add.sprite(this.state.coord.x * 16, this.state.coord.y * 16, this.game.add.bitmapData(16, 16));
            this.sprite.key.copyRect('powerups', getRect(1, 1), 0, 0);
            this.sprite.scale.x = 1.2;
            this.sprite.scale.y = 1.2;
            this.game.add.tween(this.sprite).to({alpha: 0}, 15000, 'Linear', true, 0, -1);
            this.game.physics.arcade.enable(this.sprite, Phaser.Physics.ARCADE);

            setTimeout(this.destroy, 15000);

            return this.state;
        },

        update: function() {
            this.game.physics.arcade.overlap(this.player.character.sprite, this.sprite, this.start.bind(this), null, this.game);
        },

        start: function() {
            if (this.claimed) { return; }

            this.claimed = true;
            var width = 32;
            var height = 32;
            var padding = 0.75; // 75% padding
            this.player.character.sprite.body.setSize(width * (1 - padding), height * (1 - padding), width * padding, height * padding);
            this.player.character.sprite.scale.x = 1.5;
            this.player.character.sprite.scale.y = 1.5;
            this.sprite.destroy();
            setTimeout(this.stop, 4000);

            this.onStarted && this.onStarted();

            console.log('Powerup START: Rage mode');
        },

        stop: function() {
            this.finished = true;
            // set back original
            var width = 32;
            var height = 32;
            var padding = 0.35; // 35% padding
            this.player.character.sprite.body.setSize(width * (1 - padding), height * (1 - padding), width * padding, height * padding);
            this.player.character.sprite.scale.x = 0.8;
            this.player.character.sprite.scale.y = 0.8;
            console.log('Powerup STOP: Rage mode');
        },

        destroy: function() {
            this.sprite.destroy();
        }
    };
};

var getRect = function(x, y) {
    var rect = new Phaser.Rectangle(16 * (x-1), 16 * (y-1), 16, 16);
    return rect;
};

Powerup.plugins.speedBoost = function() {
    return {
        key: 'speedBoost',
        setup: function(state) {
            if (!this.state) {
                this.state = {
                    coord: Hackatron.game.state.states.Game.getValidCoord(0, 0)
                };
            }

            this.sprite = this.game.add.sprite(this.state.coord.x * 16, this.state.coord.y * 16, 'speedBoost');
            this.sprite.animations.add('buffLoop', [0,1,2,3,4,5], 6, true, true);
            this.sprite.animations.play('buffLoop');
            this.sprite.scale.x = 0.8;
            this.sprite.scale.y = 0.8;
            this.game.add.tween(this.sprite).to({alpha: 0}, 15000, 'Linear', true, 0, -1);
            this.game.physics.arcade.enable(this.sprite, Phaser.Physics.ARCADE);

            setTimeout(this.destroy, 15000);

            return this.state;
        },

        update: function() {
            this.game.physics.arcade.overlap(this.player.character.sprite, this.sprite, this.start.bind(this), null, this.game);
        },

        start: function() {
            if (this.claimed) { return; }

            this.claimed = true;
            this.player.character.speed *= 2;
            this.destroy();
            setTimeout(this.stop, 4000);

            this.onStarted && this.onStarted();

            console.log('Powerup START: Speed boost');
        },

        stop: function() {
            this.player.character.speed /= 2;
            this.finished = true;
            console.log('Powerup STOP: Speed boost');
        },

        destroy: function() {
            this.sprite.destroy();
        }
    };
};

Powerup.plugins.reverseMode = function() {
    return {
        key: 'reverseMode',
        setup: function(state) {
            if (!this.state) {
                this.state = {
                    coord: Hackatron.game.state.states.Game.getValidCoord(0, 0)
                };
            }

            this.sprite = this.game.add.sprite(this.state.coord.x * 16, this.state.coord.y * 16, this.game.add.bitmapData(16, 16));
            this.sprite.key.copyRect('powerups', getRect(2, 2), 0, 0);
            this.sprite.scale.x = 1.2;
            this.sprite.scale.y = 1.2;
            this.game.add.tween(this.sprite).to({alpha: 0}, 15000, 'Linear', true, 0, -1);
            this.game.physics.arcade.enable(this.sprite, Phaser.Physics.ARCADE);

            setTimeout(this.destroy, 15000);

            return this.state;
        },

        update: function() {
            this.game.physics.arcade.overlap(this.player.character.sprite, this.sprite, this.start.bind(this), null, this.game);
        },

        start: function() {
            if (this.claimed) { return; }

            this.claimed = true;
            this.player.character.speed *= -1;
            this.destroy();
            setTimeout(this.stop, 4000);

            console.log('Powerup START: Reverse mode');
        },

        stop: function() {
            this.player.character.speed *= -1;
            this.finished = true;
            console.log('Powerup STOP: Reverse mode');
        },

        destroy: function() {
            this.sprite.destroy();
        }
    };
};

Powerup.plugins.portal = function() {
    return {
        key: 'portal',
        setup: function(state) {
            if (!this.state) {
                this.state = {
                    entryPortalCoord: Hackatron.game.state.states.Game.getValidCoord(0, 0),
                    exitPortalCoord: Hackatron.game.state.states.Game.getValidCoord(0, 0)
                };

                this.state.coord = this.state.entryPortalCoord;
            }

            //console.log('entry x: ' + entryPortalCoord.x * 16 + '\ny: ' + entryPortalCoord.y * 16);
            //console.log('exit x: ' + exitPortalCoord.x * 16 + '\ny: ' + exitPortalCoord.y * 16);

            this.entryPortal = this.game.add.sprite(this.state.entryPortalCoord.x * 16, this.state.entryPortalCoord.y * 16, this.game.add.bitmapData(16, 16));
            this.entryPortal.key.copyRect('powerups', getRect(1, 7), 0, 0);
            this.entryPortal.scale.x = 1.2;
            this.entryPortal.scale.y = 1.2;
            this.game.add.tween(this.entryPortal).to({alpha: 0}, 15000, 'Linear', true, 0, -1);

            this.exitPortal = this.game.add.sprite(this.state.exitPortalCoord.x * 16, this.state.exitPortalCoord.y * 16, this.game.add.bitmapData(16, 16));
            this.exitPortal.key.copyRect('powerups', getRect(17, 7), 0, 0);
            this.exitPortal.scale.x = 1.2;
            this.exitPortal.scale.y = 1.2;
            this.game.add.tween(this.exitPortal).to({alpha: 0}, 15000, 'Linear', true, 0, -1);

            this.game.physics.arcade.enable(this.entryPortal, Phaser.Physics.ARCADE);
            this.game.physics.arcade.enable(this.exitPortal, Phaser.Physics.ARCADE);

            setTimeout(this.destroy, 15000);

            return this.state;
        },

        update: function() {
            this.game.physics.arcade.overlap(this.player.character.sprite, this.entryPortal, this.start.bind(this, 'entry'), null, this.game);
            this.game.physics.arcade.overlap(this.player.character.sprite, this.exitPortal, this.start.bind(this, 'exit'), null, this.game);
        },

        start: function(portal) {
            if (this.claimed) { return; }

            this.claimed = true;
            if (portal === 'entry') {
                this.player.character.teleport(this.exitPortal);
            } else if (portal === 'exit') {
                this.player.character.teleport(this.entryPortal);
            }

            this.destroy();
            setTimeout(this.stop, 4000);

            console.log('Powerup START: Portal');
        },

        stop: function() {
            this.finished = true;
            console.log('Powerup STOP: Portal');
        },

        destroy: function() {
            this.entryPortal.destroy();
            this.exitPortal.destroy();
        }
    };
};
