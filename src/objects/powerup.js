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

    this.setup();
};

// Plugins

Powerup.plugins = {};

Powerup.plugins.saiyanMode = function() {
    return {
        setup: function() {
            var coord = Hackatron.game.state.states.Game.getValidCoord(0, 0);
            this.sprite = this.game.add.sprite(coord.x * 16, coord.y * 16, "blueball");
            this.sprite.scale.x = 0.4;
            this.sprite.scale.y = 0.4;
            this.game.physics.arcade.enable(this.sprite, Phaser.Physics.ARCADE);
        },

        update: function() {
            this.game.physics.arcade.overlap(this.player.sprite, this.sprite, this.start.bind(this), null, this.game);
        },

        start: function() {
            if (this.claimed) { return; }

            this.claimed = true;
            this.sprite.destroy();

            console.log('Powerup START: Phase mode');

            setTimeout(this.stop, 2000);
        },

        stop: function() {
            this.finished = true;

            console.log('Powerup STOP: Phase mode');
        }
    };
};

Powerup.plugins.ghostMode = function() {
    return {
        setup: function() {
            var coord = Hackatron.game.state.states.Game.getValidCoord(0, 0);
            this.sprite = this.game.add.sprite(coord.x * 16, coord.y * 16, "blueball");
            this.sprite.scale.x = 0.4;
            this.sprite.scale.y = 0.4;
            this.game.physics.arcade.enable(this.sprite, Phaser.Physics.ARCADE);

            setTimeout(this.stop, 2000);
        },

        update: function() {
            this.game.physics.arcade.overlap(this.player.sprite, this.sprite, this.start.bind(this), null, this.game);
        },

        start: function() {
            if (this.claimed) { return; }

            this.claimed = true;
            this.sprite.destroy();

            setTimeout(this.stop, 2000);

            console.log('Powerup START: Ghost mode');
        },

        stop: function() {
            this.finished = true;

            console.log('Powerup STOP: Ghost mode');
        }
    };
};

Powerup.plugins.speedBoost = function() {
    return {
        setup: function() {
            var coord = Hackatron.game.state.states.Game.getValidCoord(0, 0);
            this.sprite = this.game.add.sprite(coord.x * 16, coord.y * 16, "blueball");
            this.sprite.scale.x = 0.4;
            this.sprite.scale.y = 0.4;
            this.game.physics.arcade.enable(this.sprite, Phaser.Physics.ARCADE);
        },

        update: function() {
            this.game.physics.arcade.overlap(this.player.sprite, this.sprite, this.start.bind(this), null, this.game);
        },

        start: function() {
            if (this.claimed) { return; }

            this.claimed = true;
            this.player.speed *= 2;
            this.sprite.destroy();

            setTimeout(this.stop, 2000);

            console.log('Powerup START: Speed boost');
        },

        stop: function() {
            this.player.speed /= 2;
            this.finished = true;
            console.log('Powerup STOP: Speed boost');
        }
    };
};

Powerup.plugins.reverseMode = function() {
    return {
        setup: function() {
            var coord = Hackatron.game.state.states.Game.getValidCoord(0, 0);
            this.sprite = this.game.add.sprite(coord.x * 16, coord.y * 16, "blueball");
            this.sprite.scale.x = 0.4;
            this.sprite.scale.y = 0.4;
            this.game.physics.arcade.enable(this.sprite, Phaser.Physics.ARCADE);
        },

        update: function() {
            this.game.physics.arcade.overlap(this.player.sprite, this.sprite, this.start.bind(this), null, this.game);
        },

        start: function() {
            if (this.claimed) { return; }

            this.claimed = true;
            this.player.speed *= -1;
            this.sprite.destroy();

            setTimeout(this.stop, 2000);

            console.log('Powerup START: Reverse mode');
        },

        stop: function() {
            this.player.speed *= -1;
            this.finished = true;
            console.log('Powerup STOP: Reverse mode');
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

            this.entryPortal = this.game.add.sprite(entryPortalCoord.x * 16, entryPortalCoord.y * 16, "poop");
            this.entryPortal.scale.x = 0.4;
            this.entryPortal.scale.y = 0.4;

            this.exitPortal = this.game.add.sprite(exitPortalCoord.x * 16, exitPortalCoord.y * 16, "blueball");
            this.exitPortal.scale.x = 0.4;
            this.exitPortal.scale.y = 0.4;

            this.game.physics.arcade.enable(this.entryPortal, Phaser.Physics.ARCADE);
            this.game.physics.arcade.enable(this.exitPortal, Phaser.Physics.ARCADE);
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

            this.entryPortal.destroy();
            this.exitPortal.destroy();

            setTimeout(this.stop, 2000);

            console.log('Powerup START: Portal');
        },

        stop: function() {
            this.finished = true;
            console.log('Powerup STOP: Portal');
        }
    };
};
