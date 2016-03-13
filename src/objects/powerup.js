var Powerup = function() {
};

Powerup.prototype.init = function(params) {
    this.finished = false;
    this.claimed = false;

    this.character = params.character;
    this.game = params.game;
    this.player = params.player;
    this.mapData = params.mapData;
    this.handler = params.handler();

    this.update = this.handler.update.bind(this);
    this.setup = this.handler.setup.bind(this);
    this.start = this.handler.start.bind(this);
    this.stop = this.handler.stop.bind(this);
    this.destroy = this.handler.destroy.bind(this);

    this.setup();
};

// Plugins

Powerup.plugins = {};

Powerup.plugins.saiyanMode = function() {
    return {
        setup: function() {
            var coord = Hackatron.game.state.states.Game.getValidCoord(0, 0);
            this.sprite = this.game.add.sprite(coord.x * 16, coord.y * 16, this.game.add.bitmapData(16, 16));
            this.sprite.key.copyRect('powerups', getRect(1, 1), 0, 0);
            this.sprite.scale.x = 1;
            this.sprite.scale.y = 1;
            this.game.physics.arcade.enable(this.sprite, Phaser.Physics.ARCADE);

            setTimeout(this.destroy, 15000);
        },

        update: function() {
            this.game.physics.arcade.overlap(this.player.sprite, this.sprite, this.start.bind(this), null, this.game);
        },

        start: function() {
            if (this.claimed) { return; }

            this.claimed = true;
            this.sprite.destroy();
            setTimeout(this.stop, 4000);

            console.log('Powerup START: Phase mode');
        },

        stop: function() {
            this.finished = true;
            this.sprite.destroy();
            console.log('Powerup STOP: Phase mode');
        }
    };
};

Powerup.plugins.ghostMode = function() {
    return {
        setup: function() {
            var coord = Hackatron.game.state.states.Game.getValidCoord(0, 0);
            this.sprite = this.game.add.sprite(coord.x * 16, coord.y * 16, this.game.add.bitmapData(16, 16));
            this.sprite.key.copyRect('powerups', getRect(1, 1), 0, 0);
            this.sprite.scale.x = 1;
            this.sprite.scale.y = 1;
            this.game.add.tween(this.sprite).to({alpha: 0}, 15000, "Linear", true, 0, -1);
            this.game.physics.arcade.enable(this.sprite, Phaser.Physics.ARCADE);

            setTimeout(this.destroy, 15000);
        },

        update: function() {
            this.game.physics.arcade.overlap(this.player.sprite, this.sprite, this.start.bind(this), null, this.game);
        },

        start: function() {
            if (this.claimed) { return; }

            this.claimed = true;
            this.sprite.destroy();
            setTimeout(this.stop, 4000);

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
        setup: function() {
            var coord = Hackatron.game.state.states.Game.getValidCoord(0, 0);
            this.sprite = this.game.add.sprite(coord.x * 16, coord.y * 16, this.game.add.bitmapData(16, 16));
            this.sprite.key.copyRect('powerups', getRect(1, 2), 0, 0);
            this.sprite.scale.x = 1;
            this.sprite.scale.y = 1;
            this.game.add.tween(this.sprite).to({alpha: 0}, 15000, "Linear", true, 0, -1);
            this.game.physics.arcade.enable(this.sprite, Phaser.Physics.ARCADE);

            setTimeout(this.destroy, 15000);
        },

        update: function() {
            this.game.physics.arcade.overlap(this.player.sprite, this.sprite, this.start.bind(this), null, this.game);
        },

        start: function() {
            if (this.claimed) { return; }

            this.claimed = true;
            this.player.invincible = true;
            this.sprite.destroy();
            setTimeout(this.stop, 4000);

            console.log('Powerup START: Invincible mode');
        },

        stop: function() {
            this.finished = true;
            this.player.invincible = false;
            console.log('Powerup STOP: Invincible mode');
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
        setup: function() {
            var coord = Hackatron.game.state.states.Game.getValidCoord(0, 0);
            this.sprite = this.game.add.sprite(coord.x * 16, coord.y * 16, this.game.add.bitmapData(16, 16));
            this.sprite.key.copyRect('powerups', getRect(1, 1), 0, 0);
            this.sprite.scale.x = 1;
            this.sprite.scale.y = 1;
            this.game.add.tween(this.sprite).to({alpha: 0}, 15000, "Linear", true, 0, -1);
            this.game.physics.arcade.enable(this.sprite, Phaser.Physics.ARCADE);

            setTimeout(this.destroy, 15000);
        },

        update: function() {
            this.game.physics.arcade.overlap(this.player.sprite, this.sprite, this.start.bind(this), null, this.game);
        },

        start: function() {
            if (this.claimed) { return; }

            this.claimed = true;
            this.player.speed *= 2;
            this.destroy();
            setTimeout(this.stop, 4000);

            console.log('Powerup START: Speed boost');
        },

        stop: function() {
            this.player.speed /= 2;
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
        setup: function() {
            var coord = Hackatron.game.state.states.Game.getValidCoord(0, 0);
            this.sprite = this.game.add.sprite(coord.x * 16, coord.y * 16, this.game.add.bitmapData(16, 16));
            this.sprite.key.copyRect('powerups', getRect(2, 2), 0, 0);
            this.sprite.scale.x = 1;
            this.sprite.scale.y = 1;
            this.game.add.tween(this.sprite).to({alpha: 0}, 15000, "Linear", true, 0, -1);
            this.game.physics.arcade.enable(this.sprite, Phaser.Physics.ARCADE);

            setTimeout(this.destroy, 15000);
        },

        update: function() {
            this.game.physics.arcade.overlap(this.player.sprite, this.sprite, this.start.bind(this), null, this.game);
        },

        start: function() {
            if (this.claimed) { return; }

            this.claimed = true;
            this.player.speed *= -1;
            this.destroy();
            setTimeout(this.stop, 4000);

            console.log('Powerup START: Reverse mode');
        },

        stop: function() {
            this.player.speed *= -1;
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
        setup: function() {
            var entryPortalCoord = Hackatron.game.state.states.Game.getValidCoord(0, 0);
            var exitPortalCoord = Hackatron.game.state.states.Game.getValidCoord(0, 0);

            //console.log("entry x: " + entryPortalCoord.x * 16 + "\ny: " + entryPortalCoord.y * 16);
            //console.log("exit x: " + exitPortalCoord.x * 16 + "\ny: " + exitPortalCoord.y * 16);

            this.entryPortal = this.game.add.sprite(entryPortalCoord.x * 16, entryPortalCoord.y * 16, this.game.add.bitmapData(16, 16));
            this.entryPortal.key.copyRect('powerups', getRect(1, 7), 0, 0);
            this.entryPortal.scale.x = 1;
            this.entryPortal.scale.y = 1;
            this.game.add.tween(this.entryPortal).to({alpha: 0}, 15000, "Linear", true, 0, -1);

            this.exitPortal = this.game.add.sprite(exitPortalCoord.x * 16, exitPortalCoord.y * 16, this.game.add.bitmapData(16, 16));
            this.exitPortal.key.copyRect('powerups', getRect(17, 7), 0, 0);
            this.exitPortal.scale.x = 1;
            this.exitPortal.scale.y = 1;
            this.game.add.tween(this.exitPortal).to({alpha: 0}, 15000, "Linear", true, 0, -1);

            this.game.physics.arcade.enable(this.entryPortal, Phaser.Physics.ARCADE);
            this.game.physics.arcade.enable(this.exitPortal, Phaser.Physics.ARCADE);

            setTimeout(this.destroy, 15000);
        },

        update: function() {
            this.game.physics.arcade.overlap(this.player.sprite, this.entryPortal, this.start.bind(this, 'entry'), null, this.game);
            this.game.physics.arcade.overlap(this.player.sprite, this.exitPortal, this.start.bind(this, 'exit'), null, this.game);
        },

        start: function(portal) {
            if (this.claimed) { return; }

            this.claimed = true;
            if (portal === 'entry') {
                this.player.teleport(this.exitPortal);
            } else if (portal === 'exit') {
                this.player.teleport(this.entryPortal);
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
