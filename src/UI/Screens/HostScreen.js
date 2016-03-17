window.HostScreen = React.createClass({
  _clickStart: function() {
    Hackatron.game.state.start('Game');
  },
  render: function() {
    return (
      <div style={styles.container}>
        <div style={styles.startButton} onClick={this._clickStart}></div>
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
    borderRadius: '4px',
    color: '#fff'
  },
  startButton: {
    background: 'url(assets/play-button-2.png) no-repeat 0 0',
    width: 215,
    height: 55,
    fontFamily: 'Press Start 2P'
  }
};
