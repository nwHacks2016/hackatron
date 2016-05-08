Hackatron.Preload = function(game) {
    this.game = game;
    this.ready = false;
};

var cacheKey = function (key, type, name) {
    return key + '_' + type + (name ? '_' + name : '');
};

var text = "";

Hackatron.Preload.prototype = {
    preload: function() {
        this.preloaderBar = this.add.sprite(this.width/2,this.height/2, 'gfx/overlays/preloader');
        this.preloaderBar.x = 0;
        this.preloaderBar.y = Hackatron.GAME_HEIGHT/2;
        this.preloaderBar.width = Hackatron.GAME_WIDTH;
        this.preloaderBar.anchor.setTo(0, 0);

        this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
        this.load.setPreloadSprite(this.preloaderBar);

        text = this.game.add.text(0, Hackatron.GAME_HEIGHT/3, "Loading...", {fill: '#ffffff' });
        this.game.load.onFileComplete.add(fileComplete, this);

        //this.game.add.plugin(new Phaser.Plugin.Tiled(this.game, this.game.stage));
        this.game.add.plugin(Phaser.Plugin.Tiled);

        var assetsPath = 'assets/'; //window.location.hostname === 'localhost' ? 'http://localhost:8080/assets/' : 'https://raw.githubusercontent.com/tony-dinh/hackatron/master/assets/';

        // Screens
        this.load.image('ui/screens/launch', assetsPath + 'ui/screens/launch.png');

        // Effects
        this.load.image('gfx/effects/pellet', assetsPath + 'gfx/effects/pellet.png');

        // Emitters
        this.load.image('gfx/emitters/blueball', assetsPath + 'gfx/emitters/blueball.png');
        this.load.image('gfx/emitters/brownie', assetsPath + 'gfx/emitters/brownie.png');

        // UI
        this.load.spritesheet('gfx/overlays/countdown', assetsPath + 'gfx/overlays/countdown.png', 29, 27, 3);
        this.load.image('gfx/overlays/gameover', assetsPath + 'gfx/overlays/gameover.png');

        // Buffs
        this.load.image('gfx/buffs/general', assetsPath + 'gfx/buffs/general.png');
        this.load.spritesheet('gfx/buffs/aura-1', assetsPath + 'gfx/buffs/aura-1.png', 1, 2, 3, 4, 5, 6);
        this.load.spritesheet('gfx/buffs/speed-boost', assetsPath + 'gfx/buffs/speed-boost.png', 32, 32, 6);
        this.load.spritesheet('gfx/buffs/saiyan', assetsPath + 'gfx/buffs/saiyan.png', 32, 32, 7);

        // Blocks
        this.load.spritesheet('gfx/blocks/glitch', assetsPath + 'gfx/blocks/glitch.png', 32, 32, 3);

        // Map
        this.load.pack('map', assetsPath + 'gfx/maps/general.json');

        // this.load.image('mapImage', assetsPath + 'gfx/maps/' + Hackatron.mapConfig.mapTilesFilename + '/map2.png');
        // this.load.tilemap('mapData', assetsPath + 'gfx/maps/' + Hackatron.mapConfig.mapDataFilename + '/map2.json', null, Phaser.Tilemap.TILED_JSON);

        // Characters
        this.load.atlasJSONHash('gfx/characters', assetsPath + 'gfx/characters/characters.png', assetsPath + 'gfx/characters/characters.json');
        this.load.atlasJSONHash('gfx/buffs', assetsPath + 'gfx/buffs.png', assetsPath + 'gfx/buffs.json');

        this.load.spritesheet('gfx/characters/super-saiyan', assetsPath + 'gfx/characters/super-saiyan.png', 32, 32, 12);

        // Audio
        this.load.audio('audio/bg-0002', [assetsPath + 'audio/bg-0002.mp3']);
    },

    update: function() {
        if(!!this.ready) {
            this.game.state.start('Menu');
        }
    },

    onLoadComplete: function() {
        this.ready = true;
    }
};


function fileComplete(progress, cacheKey, success, totalLoaded, totalFiles  ){
    // console.log(progress);
    text.setText("Loading... " + progress + "%");
}