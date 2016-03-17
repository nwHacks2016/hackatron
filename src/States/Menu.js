Hackatron.Menu = function(game) {
};

Hackatron.Menu.prototype = {
    preload: function() {
    },

    create: function() {
        this.stage.setBackgroundColor(0x2d2d2d);
        this.add.sprite(0, 0, 'menu_background');

        //var button = this.add.button(this.world.centerX, 315, 'start_button', this.startLobby, this, 1, 0, 0);
        this.enterKey = this.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        // this.button = button;
        // button.anchor.setTo(0.5,0.5);

        window.UI_state.screenKey = 'start';
        window.UI_controller.setState(window.UI_state);


        this.game.canvas.style['width'] = '100%';
        this.game.canvas.style['height'] = '100%';
    },

    update: function() {
        if (this.enterKey.isDown) {
            this.startLobby();
        }
    },

    render: function() {
        
        this.game.canvas.style['width'] = '100%';
        this.game.canvas.style['height'] = '100%';
    },

    startLobby: function() {
        this.state.start('Lobby');
    }
};
