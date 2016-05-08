window.Utils = {
    generateId: function() {
      function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
      }

      return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
    },
    transpose: function(a) {
      // Calculate the width and height of the Array
      var w = a.length ? a.length : 0,
        h = a[0] instanceof Array ? a[0].length : 0;

      // In case it is a zero matrix, no transpose routine needed.
      if(h === 0 || w === 0) { return []; }

      /**
       * @var {Number} i Counter
       * @var {Number} j Counter
       * @var {Array} t Transposed data is stored in this array.
       */
      var i, j, t = [];

      // Loop through every item in the outer array (height)
      for(i = 0; i < h; i++) {

        // Insert a new row (array)
        t[i] = [];

        // Loop through every item per item in outer array (width)
        for(j = 0; j < w; j++) {

          // Save transposed data.
          t[i][j] = a[j][i];
        }
      }

      return t;
    },
    flooredPosition: function(position) {
        var correctedX = Math.floor(position.x / 16.0) * 16.0;
        var correctedY = Math.floor(position.y / 16.0) * 16.0;

        var correctedPosition = {
            x: correctedX,
            y: correctedY
        };
        return correctedPosition;
    }
};
