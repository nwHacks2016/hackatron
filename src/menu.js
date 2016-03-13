Hackatron.MainMenu = function(game) {
};

Hackatron.MainMenu.prototype = {
    preload: function() {
    },

    create: function() {
        this.stage.setBackgroundColor(0x2d2d2d);
        this.add.sprite(0, 0, 'menu_background');

        var button = this.add.button(this.world.centerX, 315, 'start_button', this.startGame, this, 1, 0, 0);
        button.enterKey = this.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        button.anchor.setTo(0.5,0.5);
    },

    update: function() {
        if (button.enterKey.isDown) {
            this.startGame();
        }
    },

    startGame: function() {
        this.state.start('Game');
    }
}
