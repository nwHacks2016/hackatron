class Enemy {
    toString() { '[Enemy]' }

    init(params) {
        params = Object.assign(params, {characterKey: 'ghost', defaultFrameKey: 'walkDown-0002', emitterKey: 'gfx/emitters/brownie'});

        this.character = new Ghost();
        this.character.init(params);

        Object.assign(this, params); // extends this with the params

        if (this.keys) {
            this.setupKeys(this.keys);
        }
    }

    setupKeys(keys) {
        this.character.sprite.upKey = this.game.input.keyboard.addKey(keys.up);
        this.character.sprite.downKey = this.game.input.keyboard.addKey(keys.down);
        this.character.sprite.leftKey = this.game.input.keyboard.addKey(keys.left);
        this.character.sprite.rightKey = this.game.input.keyboard.addKey(keys.right);
    }
}
