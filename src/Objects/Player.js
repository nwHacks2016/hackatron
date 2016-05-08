var Player = function() {
};

Player.prototype.toString = function() {
    return `[Player x=${this.position.x} y=${this.position.y}]`;
};

Player.prototype.init = function(params) {
    this.character = new Tron(params);
    this.character.init(params);

    this.id = params.id;
    this.game = params.game;
    this.name = params.name;
    this.keys = params.keys;
    this.points = 0;

    this.setupKeys();
};

// Method for registering hardware keys to a given sprite
Player.prototype.setupKeys = function() {
    if (!this.keys) { return; }

    if (this.keys.up) { this.character.sprite.upKey = this.game.input.keyboard.addKey(this.keys.up); }
    if (this.keys.down) { this.character.sprite.downKey = this.game.input.keyboard.addKey(this.keys.down); }
    if (this.keys.left) { this.character.sprite.leftKey = this.game.input.keyboard.addKey(this.keys.left); }
    if (this.keys.right) { this.character.sprite.rightKey = this.game.input.keyboard.addKey(this.keys.right); }

    // register attack key if it exists
    if (this.keys.att) {
        this.character.sprite.attKey = this.game.input.keyboard.addKey(this.keys.att);
        this.character.sprite.attKey.onDown.add(this.character.triggerAttack, this.character);
    }
};

Player.prototype.removePoints = function() {
    this.points -= points;

    if (this.points < 0) {
        this.points = 0;
    }
};

Player.prototype.addPoints = function(points) {
    this.points += points;
};

Player.prototype.hide = function() {
    this.character.sprite.alpha = 0;
};

Player.prototype.show = function() {
    this.character.sprite.alpha = 1;
};

Player.prototype.kill = function() {
    this.character.kill();
};

Player.prototype.destroy = function() {
    this.nameText.destroy();

    if (this.keys) {
        this.keys.up && this.game.input.keyboard.removeKey(this.keys.up);
        this.keys.down && this.game.input.keyboard.removeKey(this.keys.down);
        this.keys.left && this.game.input.keyboard.removeKey(this.keys.left);
        this.keys.right && this.game.input.keyboard.removeKey(this.keys.right);

        this.keys.att && this.game.input.keyboard.removeKey(this.keys.att);
    }
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
            align: 'center'
        };

        this._name = name;

        this.nameText = this.game.add.text(0, 0, name, style);
        this.nameText.anchor.set(0.5, -1);

        this.character.sprite.addChild(this.nameText);
    }
});

// Wow, we may want this for "logic scripts"
//
// function createInterface(name) {
//   return class {
//     ['findBy' + name]() {
//       return 'Found by ' + name;
//     }
//   }
// }

// const Interface = createInterface('Email');
// const instance = new Interface();

// console.log(instance.findByEmail());
