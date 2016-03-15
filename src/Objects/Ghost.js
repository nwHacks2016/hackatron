var Ghost = function() {
    Character.apply(this, arguments);
};

Ghost.prototype = new Character();

Ghost.prototype.constructor = Ghost;

Ghost.prototype.toString = function() {
    return '[Ghost]';
};

Ghost.prototype.init = function() {
    Character.prototype.init.apply(this, arguments);
};
