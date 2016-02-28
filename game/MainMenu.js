Tron = {
    score: 0
};

Tron.MainMenu = function(game) {
};

Tron.MainMenu.prototype = {
    preload: function() {
        this.load.image('menu_background', 'images/mainmenu.png');
        this.load.image('start_button', 'images/startbutton.png');
        this.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
    },

    create: function() {
        this.stage.setBackgroundColor(0x2d2d2d);
        this.add.sprite(0, 0, 'menu_background');

        var button = this.add.button(this.world.centerX - 80, 400, 'start_button', this.startGame, this);
        button.anchor.setTo(0.5,0.5);
    },

    update: function() {
    },

    startGame: function(){
        this.state.start('Game');
    }
}
