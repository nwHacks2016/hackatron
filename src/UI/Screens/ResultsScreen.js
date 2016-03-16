
window.StartScreen = React.createClass({
  _clickHostGame: function() {
    window.UI_state.screen = 'game';
    Hackatron.game.state.start('Game');
  },
  render: function() {
    return (
      <div style={styles.container}>
        <div style={{display: 'none'}}>Seconds Elapsed: {this.state.secondsElapsed}</div>
        <div style={styles.hostButton} onClick={this._clickHostGame}>Host Game</div>
        <div style={styles.joinButton}>Join Game</div>
        <div style={styles.instantActionButton}>Instant Action</div>
      </div>
    );
  }
});

var styles = {
    container: {
    }
    hostButton: {
        position: 'absolute',
        top: 100,
        left: 0,
        width: 512,
        height: 60,
        opacity: 0.95,
        background: '#FFCB46',
        fontFamily: 'Press Start 2P'
    },
    joinButton: {
        position: 'absolute',
        top: 200,
        left: 0,
        width: 512,
        height: 60,
        opacity: 0.95,
        textAlign: 'center',
        size: 40,
        padding: 20,
        background: '#fff',
        fontFamily: 'Press Start 2P'
    },
    instantActionButton: {
        position: 'absolute',
        top: 300,
        left: 0,
        width: 512,
        height: 60,
        opacity: 0.95,
        background: '#F95A3A',
        fontFamily: 'Press Start 2P'
    }
};
