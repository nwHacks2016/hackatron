class Powerup extends GameObject {
    toString() { `[Powerup handler={this.key}]` }

    static get handlers() {
        return {
            'Saiyan': SaiyanHandler,
            'Ghost': GhostHandler,
            'Invincible': InvincibleHandler,
            'SpeedBoost': SpeedBoostHandler,
            'Reverse': ReverseHandler,
            'Rage': RageHandler,
            'Teleport': TeleportHandler,
            'Portal': PortalHandler,
            'Freeze': FreezeHandler,
            'BlockUp': BlockUpHandler
        }
    }

    init(params) {
        super.init(params);

        // Events
        this.onStarted = params.onStarted;
        this.onDestroyed = params.onDestroyed;

        // TODO: this guy should move a lot of this logic over to GamePlugin
        this.key = params.key;
        this.handler = new Powerup.handlers[params.key](params);
        this.handler.setup();
    }
}



class PowerupHandler {
    constructor(params) {
        this.spriteMode = null;
        this.finished = false;
        this.claimed = false;
        this.state = {};
        this.fadeTime = 10000;
        this.durationTime = 4000;
        this.destroyTimer = null;

        Object.assign(this, params);
    }

    on(type, cb) {
        this['_on' + type] = this['_on' + type] || [];
        this['_on' + type].push(cb);
    }

    emit(type, args) {
        this['_on' + type] && this['_on' + type].forEach((cb) => { cb(args) });
    }

    _getRect(x, y) {
        return new Phaser.Rectangle(16 * (x-1), 16 * (y-1), 16, 16);
    }

    setup() {
        if (!this.state.position) {
            this.state.position = Hackatron.game.getValidPosition();
        }

        if (this.spriteMode === 'key') {
            this.sprite = this.game.add.sprite(this.state.position.x * 16, this.state.position.y * 16, this.spriteKey);
            this.sprite.animations.add('buffLoop', this.spriteLoop, 6, true, true);
            this.sprite.animations.play('buffLoop');
            this.sprite.scale.x = 0.8;
            this.sprite.scale.y = 0.8;
        } else if (this.spriteMode === 'tilemap') {
            this.sprite = this.game.add.sprite(this.state.position.x * 16, this.state.position.y * 16, this.game.add.bitmapData(16, 16));
            this.sprite.key.copyRect(this.spriteTilemap, this._getRect(this.spritePosition.row, this.spritePosition.column), 0, 0);
            this.sprite.scale.x = 1.2;
            this.sprite.scale.y = 1.2;
        }

        this.sprite.alpha = 0;

        var tween1 = this.game.add.tween(this.sprite).to({alpha: 1}, 1000, 'Linear', false, 0, 0);
        var tween2 = this.game.add.tween(this.sprite).to({alpha: 0.5}, this.fadeTime - 2000, 'Linear', false, 0, 0);
        var tween3 = this.game.add.tween(this.sprite).to({alpha: 0}, 1000, 'Linear', false, 0, 0);
        tween1.chain(tween2);
        tween2.chain(tween3);
        tween1.start();

        this.game.physics.arcade.enable(this.sprite, Phaser.Physics.ARCADE);

        this.onSetup();

        this.destroyTimer = setTimeout(this.destroy.bind(this), this.fadeTime * 1.5);
    }

    update() {
        this.game.physics.arcade.overlap(this.player.character.sprite, this.sprite, this.start.bind(this), null, this.game);

        this.onUpdated();
    }

    start() {
        if (this.claimed) { return; }

        this.claimed = true;
        this.destroy();

        this.onStarted();
        this.emit('started');

        setTimeout(this.stop.bind(this), this.durationTime);

        console.log('Powerup START: ' + this.name);
    }

    stop() {
        this.finished = true;

        this.onStopped();
        this.emit('stopped');

        console.log('Powerup STOP: ' + this.name);
    }

    destroy() {
        if (!this.sprite) { return; }

        this.sprite.destroy();
        this.sprite = null;

        clearTimeout(this.destroyTimer);

        this.onDestroyed();
        this.emit('destroyed', {positions: [this.state.position]});
    }

    onSetup() {}
    onStarted() {}
    onStopped() {}
    onUpdated() {}
    onDestroyed() {}
}

// Handlers

class SaiyanHandler extends PowerupHandler {
    constructor(params) {
        super(params);
        this.name = 'Saiyan mode';
        this.spriteMode = 'key';
        this.spriteKey = 'gfx/buffs/saiyan';
        this.spriteLoop = [0,1,2,3,4,5,6];
    }
}


class GhostHandler extends PowerupHandler {
    constructor(params) {
        super(params);
        this.name = 'Ghost mode';
        this.spriteMode = 'tilemap';
        this.spriteTilemap = 'gfx/buffs/general';
        this.spritePosition = {row: 1, column: 2};
    }
}


class BlockUpHandler extends PowerupHandler {
    constructor(params) {
        super(params);
        this.name = 'Block up';
        this.spriteMode = 'tilemap';
        this.spriteTilemap = 'gfx/buffs/general';
        this.spritePosition = {row: 5, column: 3};
    }

    onStarted() {
        this.player.character.blocks += 10;
    }
}


class InvincibleHandler extends PowerupHandler {
    constructor(params) {
        super(params);
        this.name = 'Invincible mode';
        this.spriteMode = 'tilemap';
        this.spriteTilemap = 'gfx/buffs/general';
        this.spritePosition = {row: 1, column: 2};
    }

    onStarted() {
        this.tween = this.game.add.tween(this.player.character.sprite).to({alpha: 0}, 400, 'Linear', true, 0, -1);
    }

    onStopped() {
        this.tween.stop();
        this.tween = this.game.add.tween(this.player.character.sprite).to({alpha: 1}, 0, 'Linear', true, 0);
    }
}


class RageHandler extends PowerupHandler {
    constructor(params) {
        super(params);
        this.name = 'Rage mode';
        this.spriteMode = 'tilemap';
        this.spriteTilemap = 'gfx/buffs/general';
        this.spritePosition = {row: 1, column: 1};
    }

    onStarted() {
        var width = 32;
        var height = 32;
        var padding = 0.75; // 75% padding
        this.player.character.sprite.body.setSize(width * (1 - padding), height * (1 - padding), width * padding, height * padding);
        this.player.character.sprite.scale.x = 1.5;
        this.player.character.sprite.scale.y = 1.5;
    }

    onStopped() {
        // set back original
        var width = 32;
        var height = 32;
        var padding = 0.35; // 35% padding
        this.player.character.sprite.body.setSize(width * (1 - padding), height * (1 - padding), width * padding, height * padding);
        this.player.character.sprite.scale.x = 0.8;
        this.player.character.sprite.scale.y = 0.8;
    }
}


class SpeedBoostHandler extends PowerupHandler {
    constructor(params) {
        super(params);
        this.name = 'Speed boost';
        this.spriteMode = 'key';
        this.spriteTilemap = 'speedBoost';
        this.spriteLoop = [0,1,2,3,4,5];
    }

    onStarted() {
        this.player.character.speed *= 2;
    }

    onStopped() {
        this.player.character.speed /= 2;
    }
}


class ReverseHandler extends PowerupHandler {
    constructor(params) {
        super(params);
        this.name = 'ReverseHandler mode';
        this.spriteMode = 'tilemap';
        this.spriteTilemap = 'gfx/buffs/general';
        this.spritePosition = {row: 2, column: 2};
    }

    onStarted() {
        this.player.character.speed *= -1;
    }

    onStopped() {
        this.player.character.speed *= -1;
    }
}


class TeleportHandler extends PowerupHandler {
    constructor(params) {
        super(params);
        this.name = 'Teleport';
        this.spriteMode = 'tilemap';
        this.spriteTilemap = 'gfx/buffs/general';
        this.spritePosition = {row: 1, column: 7};
    }

    onStarted() {
        this.player.character.teleport(Hackatron.game.getValidPosition());
    }
}

// Freezes the player for 3 seconds
class FreezeHandler extends PowerupHandler {
    constructor(params) {
        super(params);
        this.name = 'Freeze';
        this.spriteMode = 'tilemap';
        this.spriteTilemap = 'gfx/buffs/general';
        this.spritePosition = {row: 10, column: 3};
    }

    // onStarted() {
    //     this.player.character.speed = 0;
    // }

    // onStopped() {
    //     this.player.character.speed = 1;
    // }
}


class PortalHandler extends PowerupHandler {
    constructor(params) {
        super(params);
        this.name = 'Portal';
        this.spriteMode = 'custom';
    }

    setup(state) {
        if (!this.state.entryPortalPosition) {
            this.state.entryPortalPosition = Hackatron.game.getValidPosition();
        }

        if (!this.state.exitPortalPosition) {
            this.state.exitPortalPosition = Hackatron.game.getValidPosition();
        }

        // kind of a hack.. doesn't put exit in the array of powerups :-/
        // TODO: should have an array of positions the powerup uses in an array in state and use that
        this.state.position = this.state.entryPortalPosition;

        //console.log('entry x: ' + entryPortalPosition.x * 16 + '\ny: ' + entryPortalPosition.y * 16);
        //console.log('exit x: ' + exitPortalPosition.x * 16 + '\ny: ' + exitPortalPosition.y * 16);

        this.entryPortal = this.game.add.sprite(this.state.entryPortalPosition.x * 16, this.state.entryPortalPosition.y * 16, this.game.add.bitmapData(16, 16));
        this.entryPortal.key.copyRect('gfx/buffs/general', this._getRect(1, 7), 0, 0);
        this.entryPortal.scale.x = 1.2;
        this.entryPortal.scale.y = 1.2;
        var tween1 = this.game.add.tween(this.entryPortal).to({alpha: 1}, 1000, 'Linear', false, 0, 0);
        var tween2 = this.game.add.tween(this.entryPortal).to({alpha: 0.5}, this.fadeTime - 2000, 'Linear', false, 0, 0);
        var tween3 = this.game.add.tween(this.entryPortal).to({alpha: 0}, 1000, 'Linear', false, 0, 0);
        tween1.chain(tween2);
        tween2.chain(tween3);
        tween1.start();

        this.exitPortal = this.game.add.sprite(this.state.exitPortalPosition.x * 16, this.state.exitPortalPosition.y * 16, this.game.add.bitmapData(16, 16));
        this.exitPortal.key.copyRect('gfx/buffs/general', this._getRect(17, 7), 0, 0);
        this.exitPortal.scale.x = 1.2;
        this.exitPortal.scale.y = 1.2;
        var tween1 = this.game.add.tween(this.exitPortal).to({alpha: 1}, 1000, 'Linear', false, 0, 0);
        var tween2 = this.game.add.tween(this.exitPortal).to({alpha: 0.5}, this.fadeTime - 2000, 'Linear', false, 0, 0);
        var tween3 = this.game.add.tween(this.exitPortal).to({alpha: 0}, 1000, 'Linear', false, 0, 0);
        tween1.chain(tween2);
        tween2.chain(tween3);
        tween1.start();

        this.game.physics.arcade.enable(this.entryPortal, Phaser.Physics.ARCADE);
        this.game.physics.arcade.enable(this.exitPortal, Phaser.Physics.ARCADE);

        this.onSetup();

        this.destroyTimer = setTimeout(this.destroy.bind(this), this.fadeTime * 1.5);
    }

    start(type) {
        if (type === 'entry') {
            this.player.character.teleport(this.exitPortal);
        } else if (type === 'exit') {
            this.player.character.teleport(this.entryPortal);
        }

        this.onStarted();

        console.log('Powerup START: Portal');
    }

    update() {
        this.game.physics.arcade.overlap(this.player.character.sprite, this.entryPortal, this.start.bind(this, 'entry'), null, this.game);
        this.game.physics.arcade.overlap(this.player.character.sprite, this.exitPortal, this.start.bind(this, 'exit'), null, this.game);

        this.onUpdated();
    }

    stop() {
        this.finished = true;
        console.log('Powerup STOP: Portal');

        this.onStopped();
    }

    destroy() {
        if (!this.entryPortal && !this.exitPortal) { return; }

        this.entryPortal.destroy();
        this.exitPortal.destroy();
        this.entryPortal = null;
        this.exitPortal = null;

        clearTimeout(this.destroyTimer);

        this.onDestroyed();
        this.emit('destroyed', {positions: [this.state.entryPortalPosition, this.state.exitPortalPosition]});
    }
}


