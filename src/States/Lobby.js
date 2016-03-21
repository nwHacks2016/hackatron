Hackatron.Lobby = function(game) {
};

Hackatron.Lobby.prototype = {
    preload: function() {
    },

    create: function() {
        var Keyboard = Phaser.Keyboard;
        this.game.canvas.enterKey = this.input.keyboard.addKey(Keyboard.ENTER);

        // getting the new sprite :)
        var player = new Tron();
        var spawnPosX = 100;
        var spawnPosY = 100;
        var playerParams = {
            game: this.game,
            characterKey: 'tron',
            emitterKey: 'blueball',
            speed: 50,
            x: spawnPosX,
            y: spawnPosY,
            keys: {
                up: Keyboard.UP,
                down: Keyboard.DOWN,
                left: Keyboard.LEFT,
                right: Keyboard.RIGHT
            }
        };
        player.init(playerParams);  

        // Create an input type dynamically.
        var nameField = document.createElement("input");
        nameField.id = "name-field";
        nameField.setAttribute("type", "text");
        nameField.setAttribute("autofocus", "autofocus");
        document.body.appendChild(nameField);



        var style = {
            font: "Montserrat",
            fontSize: 25,
            align: "center"
        };

        this.game.add.text(100, this.game.world.centerY - 100, "Please enter your name.", style);

        this.game.canvas.style['width'] = '100%';
        this.game.canvas.style['height'] = '100%';
    },

    update: function() {
        if (this.game.canvas.enterKey.isDown || Hackatron.skipIntro) {
            var nameField = document.getElementById('name-field');
            Hackatron.playerName = nameField.value;
            document.body.removeChild(nameField);
            this.game.state.start('Game');
        }
    },

    render: function() {
    }
};
