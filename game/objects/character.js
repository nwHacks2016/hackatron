define([], function() {
	var Character = function(params) {
		this.position = params.pos;
	};

	Character.init = function(name) {
		var params = {
			pos: {
				x: 0,
				y: 0
			},
			name: name
		};

		return new Character(params);
	};

	Character.protoype.up = function() {
		this.position.y = this.y + 1;
	};

	Character.protoype.down = function() {
		this.position.y = this.y - 1;
	};

	Character.protoype.left = function() {
		this.position.x = this.x - 1;
	};

	Character.protoype.right = function() {
		this.position.x = this.x + 1;
	};

	Character.protoype.getPosition = function() {
		return this.position;
	};

	return Character;
});