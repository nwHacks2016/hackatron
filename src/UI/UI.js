window.UI_state = {
    screenKey: null
};

window.UI = React.createClass({
  getInitialState: function() {
    window.UIIII = this;
    return window.UI_state;
  },
  render: function() {
    return (
      <div style={styles.container}>
        {this.state.screenKey === 'menu' && <StartScreen />}
      </div>
    );
  }
});

var styles = {
    container: {
    }
};
