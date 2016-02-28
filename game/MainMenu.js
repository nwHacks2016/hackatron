Hackatron.MainMenu = function(game) {
};

Hackatron.MainMenu.prototype = {
    preload: function() {
        this.load.image('menu_background', 'https://raw.githubusercontent.com/nwHacks2016/hackatron/master/Images/mainmenu.png');
        this.load.spritesheet('start_button', 'https://raw.githubusercontent.com/nwHacks2016/hackatron/master/Images/startbutton_spritesheet.png', 155, 80);
        this.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
    },

    create: function() {
        this.stage.setBackgroundColor(0x2d2d2d);
        this.add.sprite(0, 0, 'menu_background');

        var button = this.add.button(this.world.centerX, 315, 'start_button', this.startGame, this, 1, 0, 0);

        button.anchor.setTo(0.5,0.5);
    },

    update: function() {
    },

    startGame: function(pointer){
        this.state.start('Game');
    }
}
