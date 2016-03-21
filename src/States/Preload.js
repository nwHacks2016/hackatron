Hackatron.Preload = function(game) {
    this.game = game;
};

var cacheKey = function (key, type, name) {
    return key + '_' + type + (name ? '_' + name : '');
};

Hackatron.Preload.prototype = {
    preload: function() {
        this.game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
        this.game.scale.setUserScale(window.innerWidth / Hackatron.GAME_WIDTH, window.innerWidth / Hackatron.GAME_WIDTH);

        // enable crisp rendering
        this.game.renderer.renderSession.roundPixels = true;
        Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);

        // preload gif not working yet.
        // this.load.image('preloader', 'assets/preloader.gif');
        // this.asset = this.add.sprite(this.width/2,this.height/2, 'preloader');
        // this.asset.anchor.setTo(0.5, 0.5);

        //this.game.add.plugin(new Phaser.Plugin.Tiled(this.game, this.game.stage));
        this.game.add.plugin(Phaser.Plugin.Tiled);


        this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
        // this.load.setPreloadSprite(this.asset);

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
