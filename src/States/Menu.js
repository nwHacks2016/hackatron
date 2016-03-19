Hackatron.Menu = function(game) {
};

Hackatron.Menu.prototype = {
    preload: function() {
    },

    fitToWindow: function() {
        var width;
        var height;

        if (window.innerHeight > window.innerWidth) {
            width = 100;
            height = Math.round(window.innerWidth / window.innerHeight * 100);
        } else {
            width = Math.round(window.innerHeight / window.innerWidth * 100);
            height = 100;
        }

        this.game.canvas.style['width'] = width + '%';
        this.game.canvas.style['height'] = height + '%';
    },

    create: function() {
        this.stage.setBackgroundColor(0x2d2d2d);
        this.add.sprite(0, 0, 'ui/screens/launch');

        this.enterKey = this.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        // this.button = button;
        // button.anchor.setTo(0.5,0.5);

        window.UI_state.screenKey = 'start';
        window.UI_controller.setState(window.UI_state);

        this.fitToWindow();
    },

    update: function() {
        if (this.enterKey.isDown) {
            this.startLobby();
        }
    },

    render: function() {
        this.fitToWindow();
    },

    startLobby: function() {
        this.state.start('Lobby');
    }
};
