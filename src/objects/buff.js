var Buff = function() {
};

Buff.prototype.init = function(params) {
    this.ended = false;

    this.character = params.character;
    this.handler = params.handler();

    this.handler.start.apply(this);

    setTimeout(function() {
        this.handler.stop.apply(this);
    }.bind(this), 2000);
};

// Plugins

Buff.plugins = {};

Buff.plugins.saiyanMode = function() {
    return {
        start: function() {
            console.log('Buff START: Phase mode');
        },

        stop: function() {
            console.log('Buff STOP: Phase mode');
        }
    };
};

Buff.plugins.ghostMode = function() {
    return {
        start: function() {
            console.log('Buff START: Ghost mode');
        },

        stop: function() {
            console.log('Buff STOP: Ghost mode');
        }
    };
};

Buff.plugins.speedBoost = function() {
    return {
        start: function() {
            // console.log('Buff START: Speed boost');
            this.character.speed *= 2;
        },

        stop: function() {
            // console.log('Buff STOP: Speed boost');
            this.character.speed /= 2;
            this.ended = true;
        }
    };
};
