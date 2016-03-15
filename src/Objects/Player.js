var Player = function() {
};

Player.prototype.toString = function() {
    return '[Player x=' + this.position.x + ' y=' + this.position.y + ']';
};

Player.prototype.init = function(params) {
    params.characterKey = 'tron';
    params.emitterKey = 'blueball';
    this.character = new Tron(params);
    this.character.init(params);

    this.id = params.id;
    this.game = params.game;
    this.name = params.name;

    if (params.keys) {
        this.setupKeys(params.keys);
    }
};

// Method for registering hardware keys to a given sprite
Player.prototype.setupKeys = function(keys) {
    this.character.sprite.upKey = this.game.input.keyboard.addKey(keys.up);
    this.character.sprite.downKey = this.game.input.keyboard.addKey(keys.down);
    this.character.sprite.leftKey = this.game.input.keyboard.addKey(keys.left);
    this.character.sprite.rightKey = this.game.input.keyboard.addKey(keys.right);

    // register attack key if it exists
    if (keys.att) {
        this.character.sprite.attKey = this.game.input.keyboard.addKey(keys.att);
    }
};

Player.prototype.kill = function() {
    this.nameText.destroy();
    this.character.kill();
};

Object.defineProperty(Player.prototype, 'name', {
    get: function() {
        return this._name;
    },
    set: function(name) {
        if (!name) {
            name = this.id.substring(0, 2);
        }

        var style = {
            font: '15px Arial',
            fill: '#ffffff',
            align: 'center',
            backgroundColor: '#000000'
        };

        this._name = name;

        this.nameText = this.game.add.text(0, 0, name, style);
        this.nameText.anchor.set(0.5);

        this.character.sprite.addChild(this.nameText);
    }
});