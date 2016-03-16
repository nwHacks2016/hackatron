class Ghost extends Character {
    toString() {
        return '[Ghost]';
    }

    init() {
        super.init.apply(this, arguments);
    }
}
