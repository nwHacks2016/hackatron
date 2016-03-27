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
            this.sprite = this.game.add.sprite(this.position.x - 8, this.position.y - 8, 'gfx/characters', this.characterKey + '/' + this.defaultFrameKey);
        } else {
            this.sprite = this.game.add.sprite(this.position.x - 8, this.position.y - 8, this.characterKey);
        }
        this.sprite.scale.x = 0.8;
        this.sprite.scale.y = 0.8;

        this.game.physics.arcade.enable(this.sprite, Phaser.Physics.ARCADE);
        this.sprite.body.setSize(this.dimensions.width / 2, this.dimensions.height / 2, this.dimensions.width / 4, this.dimensions.height / 4);
    }

    set position(position) {
        if (!this.sprite) { return this._position = position; }

        this.sprite.x = Math.floor(position.x - this.sprite.body.offset.x);
        this.sprite.y = Math.floor(position.y - this.sprite.body.offset.y);
    }

    get position() {
        if (!this.sprite) { return this._position; }

        return {x: Math.floor(this.sprite.x + this.sprite.body.offset.x), y: Math.floor(this.sprite.y + this.sprite.body.offset.y)};
    }

    set worldPosition(worldPosition) {
        this.position = {x: worldPosition.x * 16, y: worldPosition.y * 16};
    }

    get worldPosition() {
        return {x: (this.position.x / 16), y: (this.position.y / 16)};
    }
}
