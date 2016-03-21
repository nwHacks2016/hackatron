window.HostScreen = React.createClass({
  _clickStart: function() {
    Hackatron.loader.state.start('Game');
  },
  render: function() {
    return (
      <div style={styles.container}>
        <div style={styles.startButton} onClick={this._clickStart}>Host Now</div>
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
    height: 200,
    padding: '20px 0px 0px 10px',
    opacity: 0.9,
    background: '#01242C',
    border: '3px solid #fff',
    //boxShadow: '3px 3px 0 #1DFFFE',
    borderRadius: '0px'
  },
  startButton: {
    width: 185,
    height: 55,
    'font-family': '"Press Start 2P"',
    'font-size': '17px',
    'text-align': 'center',
    'color': '#fff',
    //'color': '#FE0313',
    'padding': '18px 15px',
  }
};
