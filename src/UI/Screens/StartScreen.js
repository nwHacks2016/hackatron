
window.StartScreen = React.createClass({
  getInitialState: function() {
    return {instantActionTimer: 5};
  },
  tick: function() {
    this.setState({instantActionTimer: this.state.instantActionTimer - 1});

    if (this.state.instantActionTimer === 0) {
        Hackatron.game.state.start('Game');
    }
  },
  componentDidMount: function() {
    this.interval = setInterval(this.tick, 1000);
  },
  componentWillUnmount: function() {
    clearInterval(this.interval);
  },
  _clickHostGame: function() {
    window.UI_state.screen = 'game';
    Hackatron.game.state.start('Game');
  },
  render: function() {
    return (
      <div style={styles.container}>
        <div style={{display: 'none'}}>{this.state.instantActionTimer}</div>
        <div style={styles.hostButton} onClick={this._clickHostGame}></div>
        <div style={styles.joinButton}></div>
        <div style={styles.instantActionButton}><br />Instant action in... {this.state.instantActionTimer}</div>
      </div>
    );
  }
});

var styles = {
    container: {
        position: 'absolute',
        top: 280,
        left: 130,
        width: 255,
        height: 200,
        padding: 20,
        opacity: 0.9,
        background: '#003595',
        border: '2px solid #fff',
        borderRadius: '2px',
        color: '#fff'
    },
    hostButton: {
        background: 'url(assets/play-button-2.png) no-repeat 0 0',
        width: 215,
        height: 55,
        fontFamily: 'Press Start 2P'
    },
    joinButton: {
        fontFamily: 'Press Start 2P'
    },
    instantActionButton: {
        fontFamily: 'Press Start 2P'
    }
};
