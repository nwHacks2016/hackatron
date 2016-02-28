Pacman = {
    score: 0,
};

Pacman.MainMenu = function(game) {
};

Pacman.MainMenu.prototype = {
    preload: function() {
        this.load.image('menu_background', 'images/mainmenu.png');
        this.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
    },

    create: function() {
        this.stage.setBackgroundColor(0x2d2d2d);
        this.add.sprite(0, 0, 'menu_background');
        this.add.bitmapText(0, 64, 'webfont', 'PACMAN', 32);
    },

    update: function() {
    },

    startGame: function(){
        this.state.start('Game');
    }
}
