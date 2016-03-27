'use strict';
 
/**
*  Plugin for shake effect for camera
*/
 
Phaser.Plugin.CameraShake = function(game, parent) {
  Phaser.Plugin.call(this, game, parent);
 
  //settings by default
  this._settings = {
    //shake screen
    shakeRange: 20,
    shakeCount: 10,
    shakeInterval: 20,
    randomShake: false,
    randomizeInterval: true,
    shakeAxis: 'xy' //xy x y
  };
  var originalBounds = this.game.camera.bounds;

  this.game.camera.bounds = null;
 
  /**
   * camera shake function.
   */
  this._shakeCamera = function () {
 
    var temp_cnt = this._settings.shakeCount;
    var shake_timer = this.game.time.create(false);
 
    var camera_current_position =  this.game.camera.position;
 
    shake_timer.loop(this._settings.randomizeInterval ? (Math.random() * this._settings.shakeInterval +
    this._settings.shakeInterval) : this._settings.shakeInterval, function () {
        this.game.camera.x = 0;
        this.game.camera.y = 0;
 
      if (this._settings.shakeCount == 0) {
        this.game.camera.bounds = originalBounds;
        //if shake end set camera to default position
        //stop shake timer
        shake_timer.stop();
        //restore value of shakeCount
        this._settings.shakeCount = temp_cnt;
        return;
      }
 
      var shift1, shift2;
 
      if (this._settings.randomShake) {
 
        //if uneven shifts in the coordinates
        var shift1 = this.game.rnd.integerInRange(-this._settings.shakeRange / 2, this._settings.shakeRange / 2);
        var shift2 = this.game.rnd.integerInRange(-this._settings.shakeRange / 2, this._settings.shakeRange / 2);
 
      }
      else {
 
        //If regular shifts
        if (this._settings.shakeCount % 2) {
          shift1 = shift2 = -this._settings.shakeRange / 2;
        }
        else {
          shift1 = shift2 = this._settings.shakeRange / 2;
        }
      }
 
      if (this._settings.shakeAxis != "y")this.game.camera.x += shift1;
      if (this._settings.shakeAxis != "x")this.game.camera.y += shift2;
 
 
      this._settings.shakeCount--;
 
 
    }, this);
 
    shake_timer.start();
 
    console.log(this._settings.shakeCount);
  };
};
 
Phaser.Plugin.CameraShake.prototype = Object.create(Phaser.Plugin.prototype);
Phaser.Plugin.CameraShake.prototype.constructor = Phaser.Plugin.CameraShake;
 
 
/**
 * Change default settings object values with passed object value.
 *
 * @method Phaser.Plugin.CameraShake#setup
 * @param {object} [obj] - Passed object to merge
 */
Phaser.Plugin.CameraShake.prototype.setup = function (obj) {
  this._settings = Phaser.Utils.extend(false, this._settings, obj);
};
Phaser.Plugin.CameraShake.prototype.shake = function(){
  this._shakeCamera();
};