window.StartScreen = React.createClass({
  getInitialState: function() {
    return {instantActionTimer: 5};
  },
  tick: function() {
    this.setState({instantActionTimer: this.state.instantActionTimer - 1});

    if (this.state.instantActionTimer === 0) {
        clearInterval(this.interval);
        Hackatron.game.state.start('Game');
    }
  },
  componentDidMount: function() {
    this.interval = setInterval(this.tick, 1000);
  },
  componentWillUnmount: function() {
    clearInterval(this.interval);
  },
  _clickHost: function() {
    window.UI_state.screenKey = 'hostGame';
    window.UI_controller.setState(window.UI_state);
  },
  _clickJoin: function() {
    window.UI_state.screenKey = 'joinGame';
    window.UI_controller.setState(window.UI_state);
  },
  _clickInstantAction: function() {
    Hackatron.game.state.start('Game');
  },
  render: function() {
    return (
      <div style={styles.container}>
        <div style={styles.hostButton} onClick={this._clickHost}>HOST GAME</div>
        <div style={styles.joinButton} onClick={this._clickJoin}>JOIN GAME</div>
        <div style={styles.instantActionButton} onClick={this._clickInstantAction}>INSTANT ACTION</div>
        <div style={styles.countdown}><br />Instant action in... {this.state.instantActionTimer}</div>
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
    background: '#01242C',
    border: '2px solid #fff',
    borderRadius: '4px'
  },
  hostButton: {
    background: 'url(assets/ui/buttons/button-1.png) no-repeat 0 0',
    width: 215,
    height: 55,
    'font-family': '"Press Start 2P"',
    'font-size': '17px',
    'text-align': 'center',
    'color': '#fff',
    'padding': '18px 15px',
  },
  joinButton: {
    background: 'url(assets/ui/buttons/button-1.png) no-repeat 0 0',
    width: 215,
    height: 55,
    'font-family': '"Press Start 2P"',
    'font-size': '17px',
    'text-align': 'center',
    'color': '#fff',
    'padding': '18px 15px',
  },
  instantActionButton: {
    background: 'url(assets/ui/buttons/button-1.png) no-repeat 0 0',
    width: 215,
    height: 55,
    'font-family': '"Press Start 2P"',
    'font-size': '14px',
    'text-align': 'center',
    'color': '#fff',
    'padding': '10px 15px',
    'line-height': '17px'
  },
  countdown: {
    'font-family': '"Press Start 2P"',
    'font-size': '8px',
    'padding': '12px 0 0 0',
    'text-align': 'center',
    'color': '#fff',
  }
};
