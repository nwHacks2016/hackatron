Hackatron.Lobby = function(game) {
};

Hackatron.Lobby.prototype= {
    preload: function() {
    },

    create: function() {

        var player = new Tron();
        player.init(this, 100, 100, 'tron');

        this.game.canvas.enterKey = this.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    },

    update: function() {
        if (this.game.canvas.enterKey.isDown){
            this.game.state.start('Game');
        }
    },
};
