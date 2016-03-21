Hackatron.Menu = function(game) {
    this.game = game;
};

Hackatron.Menu.prototype = {
    fitToWindow: function() {
        this.game.canvas.style['width'] = '100%';
        this.game.canvas.style['height'] = '100%';
        document.getElementById('game').style['width'] = Hackatron.getWidthRatioScale() * 100 + '%';
        document.getElementById('game').style['height'] = Hackatron.getHeightRatioScale() * 100 + '%';
        window.onresize();
    },

    create: function() {
        if (Hackatron.debug) {
            this.game.add.plugin(Phaser.Plugin.Debug);
        }

        this.stage.setBackgroundColor(0x2d2d2d);
        var bg = this.add.sprite(0, 0, 'ui/screens/launch');
        var ratio = bg.height / bg.width;
        bg.width = Hackatron.GAME_WIDTH;
        bg.height = bg.width * ratio;

        this.startKey = this.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        this.musicKey = this.input.keyboard.addKey(Phaser.Keyboard.M);

        window.UI_state.screenKey = 'start';
        window.UI_controller.setState(window.UI_state);

        this.fitToWindow();

        this.game.music = this.game.add.audio('audio/bg-0002', 1, true);
        this.game.music.play('', 0, 1, true);
    },

    update: function() {
        if (this.startKey.isDown) {
            this.game.state.start('Game');
        }

        if (this.musicKey.isDown) {
            this.game.music.mute = !this.game.music.mute;
        }
    },

    render: function() {
        this.fitToWindow();
    }
};
