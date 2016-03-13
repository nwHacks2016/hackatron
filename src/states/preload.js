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
        this.load.image('tiles', baseURL + 'part2_tileset.png');
        this.load.json('JSONobj', baseURL + 'tiles1.json');
        this.load.spritesheet('countdown', baseURL + 'countdown.png', 29, 27, 3);
        this.load.image('tilesetImage', baseURL + 'tileset.png');
        this.load.tilemap('tilesetMap', baseURL + 'tileset.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.spritesheet('ghost', baseURL + 'ghost.png', 32, 32, 12);
        this.load.spritesheet('tron', baseURL + 'tron.png', 32, 32, 12);
    },

    create: function() {
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
