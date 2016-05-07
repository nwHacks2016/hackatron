window.StartScreen = React.createClass({
  getInitialState: function() {
    return {instantActionTimer: 5};
  },
  tick: function() {
    this.setState({instantActionTimer: this.state.instantActionTimer - 1});

    if (this.state.instantActionTimer === 0) {
        clearInterval(this.interval);
        Hackatron.loader.state.start('Game');
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
    Hackatron.loader.state.start('Game');
  },
  render: function() {
    return (
      <div style={styles.container}>
        <div style={styles.instantActionButton} onClick={this._clickInstantAction}>INSTANT ACTION</div>
        <div style={styles.countdown}><br />Instant action in... {this.state.instantActionTimer}</div>
      </div>
    );
  }
});

var styles = {
  container: {
    position: 'absolute',
    top: 320,
    left: 570,
    width: 235,
    height: 150,
    padding: '20px 0px 0px 10px',
    opacity: 0.9,
    background: '#01242C',
    border: '3px solid #fff',
    //boxShadow: '3px 3px 0 #1DFFFE',
    borderRadius: '0px'
  },
  instantActionButton: {
    width: 215,
    height: 55,
    'font-family': '"Press Start 2P"',
    'font-size': '13px',
    'text-align': 'center',
    'color': '#fff',
    //'color': '#FFFFD5',
    'padding': '10px 15px',
    'line-height': '17px'
  },
  countdown: {
    'font-family': '"Press Start 2P"',
    'font-size': '8px',
    'padding': '12px 0 0 0',
    'text-align': 'center',
    'color': '#fff',
    //'color': '#FE0313',
  }
};
