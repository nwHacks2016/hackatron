window.UI_state = {
    screenKey: null
};

window.UI = React.createClass({
  getInitialState: function() {
    window.UI_controller = this;
    return window.UI_state;
  },
  render: function() {
    return (
      <div style={styles.container}>
        {this.state.screenKey === 'start' && <StartScreen />}
        {this.state.screenKey === 'hostGame' && <HostScreen />}
        {this.state.screenKey === 'joinGame' && <JoinScreen />}
        {this.state.screenKey === 'ingame' && <IngameScreen />}
      </div>
    );
  }
});

var styles = {
    container: {
    }
};
