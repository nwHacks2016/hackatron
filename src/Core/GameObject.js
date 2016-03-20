class GameObject {
    toString() { '[GameObject]' }

    init(params) {
        this.worldPosition = {x: 0, y: 0};
        this.position = {x: 0, y: 0};
        this.dimensions = {width: 32, height: 32};
        this.properties = {};
        this.sprite = null;
        this.rotation = null;
        this.type = null;
        this.visible = false;

        Object.assign(this, params); // extends this with the params

        this._initSprite(params);
    }

    _initSprite() {
        var padding = 0.5; // 35% padding

        if (this.characterKey) {
            this.sprite = this.game.add.sprite(this.position.x, this.position.y, 'gfx/characters', this.characterKey + '/' + this.defaultFrameKey);
        } else {
            this.sprite = this.game.add.sprite(this.position.x, this.position.y, this.characterKey);
        }
        this.sprite.scale.x = 0.8;
        this.sprite.scale.y = 0.8;

        //this.game.physics.arcade.enable(this.sprite, Phaser.Physics.ARCADE);
        //this.sprite.body.setSize(this.dimensions.width / 2, this.dimensions.height / 2, this.dimensions.width / 4, this.dimensions.height / 4);
    }

    set position(position) {
        if (!this.sprite) { return this._position = position; }

        this.sprite.x = Math.floor(position.x);
        this.sprite.y = Math.floor(position.y);
    }

    get position() {
        if (!this.sprite) { return this._position; }

        return {x: Math.floor(this.sprite.x), y: Math.floor(this.sprite.y)};
    }

    set worldPosition(worldPosition) {
        if (!this.sprite) { return this._worldPosition = worldPosition; }

        this.sprite.x = Math.floor(worldPosition.x * 16);
        this.sprite.y = Math.floor(worldPosition.y * 16);
    }

    get worldPosition() {
        if (!this.sprite) { return this._worldPosition; }

        return {x: Math.floor(this.sprite.x / 16) + 1, y: Math.floor(this.sprite.y / 16) + 1};
    }
}
