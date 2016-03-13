var Tron = function() {
    Character.call(this);
    this.name = 'Tron';
    this.isAlive = true;
    this.speedBoost = 1;
    this.points = 0;
    this.blocks = 1;
};

Tron.prototype = new Character();

Tron.prototype.constructor = Tron;

Tron.prototype.init = function() {
    Character.prototype.init.apply(this, arguments);
};

Tron.prototype.kill = function() {
    this.isAlive = false;
    this.points = 0;
};

Tron.prototype.updatePoints = function(points) {
    this.points = this.points + points;
    if(this.points < 0) {
        this.points = 0;
    }
};

Tron.prototype.eatPellet = function(pellet) {
    this.updatePoints(pellet.getPoints());
    pellet.eaten();
};

Tron.prototype.setName = function(game, name) {
    var style = {
        font: "15px Arial",
        fill: "#ffffff",
        align: "center",
        backgroundColor: "#000000"
    };

    this.name = name;

    this.nameText = game.add.text(0, 0, name, style);  //some reason this doesn't fellow thie spirte
    this.nameText.anchor.set(0.5);

    this.sprite.addChild(this.nameText);
};

Tron.prototype.triggerAttack = function(blockList) {
    var self = this;
    if (this.sprite.attKey.isDown && this.blocks > 0) {
        self.blocks--;
        if (self.blocks < 0) self.blocks = 0;
        var block = this.game.add.sprite(this.sprite.x, this.sprite.y, 'block');
        this.game.physics.arcade.enable(block, Phaser.Physics.ARCADE);
        block.body.immovable = true;
        block.scale.x = 0.8;
        block.scale.y = 0.8;
        blockList.push(block);

        setTimeout(function() {
            block.destroy();
            self.blocks++;
            blockList.filter(function(b) {
                return (b !== block);
            });
        }, 2000);

        return block;
    }

    return null;
};
