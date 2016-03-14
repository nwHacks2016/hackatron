Hackatron.Preload = function(game) {
};

Hackatron.Preload.prototype= {
    preload: function() {
    	// preload gif not working yet.
        // this.load.image('preloader', 'assets/preloader.gif');
        // this.asset = this.add.sprite(this.width/2,this.height/2, 'preloader');
        // this.asset.anchor.setTo(0.5, 0.5);

        this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
        // this.load.setPreloadSprite(this.asset);

        var baseURL = window.location.hostname === 'localhost' ? 'http://localhost:8080/assets/' : 'https://raw.githubusercontent.com/tony-dinh/hackatron/master/assets/';

        // main menu
        this.load.image('menu_background', baseURL + 'mainmenu.png');
        this.load.spritesheet('start_button', baseURL + 'startbutton_spritesheet.png', 155, 80);

        // game state
        this.load.image('powerups', baseURL + 'powerups.png');
		this.load.image('blueball', baseURL + 'blueball.png');
        this.load.image('pellet', baseURL + 'pellet.png');
        this.load.image('poop', baseURL + 'poop.png');
        this.load.spritesheet('countdown', baseURL + 'countdown.png', 29, 27, 3);
        this.load.spritesheet('glitch', baseURL + 'glitch-block.png', 32, 32, 3);
        this.load.image('tilesetImage', baseURL + Hackatron.mapConfig.tilesetImageFilename + '.png');
        this.load.tilemap('tilesetMap', baseURL + Hackatron.mapConfig.tilesetMapFilename + '.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.spritesheet('ghost', baseURL + 'ghost.png', 32, 32, 12);
        this.load.spritesheet('tron', baseURL + 'tron.png', 32, 32, 12);
        this.load.audio('music1', [baseURL + 'music1.mp3']);
    },

    create: function() {
        this.game.music = this.game.add.audio('music1', 1, true);
        this.game.music.play('', 0, 1, true);
    },

    update: function() {
        if(!!this.ready) {
            this.game.state.start('MainMenu');
        }
    },

    onLoadComplete: function() {
        this.ready = true;
    }
};
