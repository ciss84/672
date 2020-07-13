var ICONSZ = 150;
var PADDING = 20;
var model = {
  cursor: {
    x: 0,
    y: 0
  },
  columns: {
	 "QUICK": {
      index: 0,
      title: "★QUICK★",
      selectedIndex: 0,
      active: false,
      icon: 'style',
      items: [{title:"Mira Loader Usb 672", desc:"Enable only ELF LOADER function on Usb port", version:"1.1 by Lightningmods", icon:"send", expage:"payloads/mira672.html"}, {title:"FTP", desc:"Starts an ftp server with full R/W on all 16 partitions of your PS4", version:"1.0 by Lightningmods", icon:"warning", expage:"payloads/ftp.html"}]
  },
   "BACKUP": {
      index: 1,
      title: "BACKUP",
      selectedIndex: 0,
      icon: "backup",
      items: [{title:"GAME DUMPER", desc:"Dump disc/PSN games to USB: with/without patches, merged/unmerged", version:"1.1 by Al-Azif", icon:"archive", expage:"payloads/discdump.html"}, {title:"KERNEL DUMPER", desc:"Dump kernel to USB: with/without patches, merged/unmerged", version:"1.1 by Al-Azif", icon:"archive", expage:"payloads/kdump.html"}, {title:"KERNEL CLOCK ", desc:"Dump kernel clock to USB: with/without patches, merged/unmerged", version:"1.1 by Al-Azif", icon:"archive", expage:"payloads/kclock.html"}]
	}, 
   "SYSTEM": {
	  index: 2,
      title: "SYSTEM",
      selectedIndex: 0,
      icon: "home",
	    items: [{title:"FAN CONTROL", desc:"Set the temperature at which the PS4 fans will kick in (79° = PS4 default value)", version:"3.0 by Leeful", icon:"", expage:"payloads/fancontrol.html"}]
	}, 
	"MEDIA": {
      index: 3,
      title: "MEDIA",
      selectedIndex: 0,
      icon: "subscriptions",
      items: [{title:"MP4 PLAYER", desc:"Media player for MP4 movies over network", version:"1.0 by DEFAULTDNB", icon:"airplay", expage:"payloads/playerloader.html"}]
	},
	"CACHE": {
      index: 4,
      title: "CACHE",
      selectedIndex: 0,
      icon: "copyright",
      items: [{title:"X-PROJECT CACHE INSTALLER", desc:"Cache X-Project to your web browser for offline use", version:"1.0 by Al-Azif / Mod By Leeful", icon:"", expage:"payloads/xmbcache.html"}]
	},
	 "ABOUT": {
      index: 5,
      title: "ABOUT",
      selectedIndex: 0,
      icon: "help",
      items: [{title:"CREDITS", desc:"Without these people none of this would be possible", version:"1.5 by DEFAULTDNB", icon:"fingerprint", expage:"payloads/creditsloader.html"}, {title:"PAYLOAD STATISTICS", desc:"Logs how many times a payload has been loaded. (VTX HEN/DUMP/FTP only)", version:"1.0 POC by DEFAULTDNB", icon:"", expage:"payloads/statsloader.html"}]
    },
   "★DEBUG": {
      index: 14,
      title: "★DEBUG Mira",
      selectedIndex: 0,
      icon: "grade",
      items: [{ title:"★PAYLOAD", desc:"ps4debug 1.5 payloads", version:"ps4debug 1.5", icon:"lock", expage:"payloads/ps4debug15.html"}]
	},    
  }
  //add zero position to each column and item
};_.each(model.columns, function (c) {
  c.position = { x: 0, y: 0 };
  _.each(c.items, function (i) {
    i.position = {
      x: 0,
      y: 0
    };
  });
});
	  
var xmbVue = new Vue({
  el: "#xmb",
  data: model,
  methods: {
    handleKey: function handleKey(dir, val) {
      this.cursor[dir] += val;
      var nCols = this.nColumns;
      // wrap x
      this.cursor.x = this.cursor.x % nCols;
      if (this.cursor.x < 0) {
        this.cursor.x = this.cursor.x + nCols;
      }

      //wrap y
      var nRows = this.nRows;
      this.cursor.y = this.cursor.y % nRows;
      if (this.cursor.y < 0) {
        this.cursor.y = this.cursor.y + nRows;
      }

      this.highlightCell(this.cursor.x, this.cursor.y);
    },
    highlightCell: function highlightCell(column, row) {

      console.log(column, row);
	  //alert(column, row);
      //update position of elements as well
      var xAccum = (-column - 1) * (ICONSZ);
      if (column == 0) {
        xAccum += ICONSZ;
      }
      var yAccum;

      _.each(this.columns, function (col, colKey) {
        col.active = false;
        yAccum =  - (ICONSZ) * (row + 1);

        col.position.x = xAccum;
        xAccum += ICONSZ;
        if (column === col.index || column === col.index + 1) {
          xAccum += ICONSZ;
        }

        _.each(col.items, function (item, rowN) {
          if (rowN == row && col.index == column) {
            item.active = true;
            col.active = true;
          } else {
            item.active = false;
          }

          if (rowN == row) {
            yAccum += ICONSZ;
          }
          yAccum += ICONSZ;
          item.position.y = yAccum;
        });
      });
      this.cursor.y = row;
      this.cursor.x = column;
    }
  },
  watch: {
    cursor: function cursor(e) {
      console.log('cursor mutated', e);
    }
  },
  computed: {
    nColumns: function nColumns() {
      return Object.keys(this.columns).length;
    },
    nRows: function nRows() {
      //get the row at the current index
      var row = this.columnsArray[this.cursor.x];
      if (!row) {
        console.log('invalid row index: ', this.cursor.x);
        return 0;
      }
      return row.items.length; //todo: number of columns in this row
    },
    columnsArray: function columnsArray() {
      var _this = this;

      //get columns in an array
      var arr = [];
      Object.keys(this.columns).forEach(function (key) {
        arr.push(_this.columns[key]);
      });
      return _.sortBy(arr, 'index');
    }
  },
  created: function created() {
    _.each(this.columns, function (column) {
      _.each(column.items, function (item) {
        item.active = false;
      });
    });
    this.highlightCell(this.cursor.x, this.cursor.y);
  }
});

$('body').on("mousewheel", _.debounce(scrollHandler, 50));

function scrollHandler(e) {
  console.log(e);
  if (e.deltaX) {
    xmbVue.handleKey('x', Math.sign(e.deltaX));
  }
  if (e.deltaY) {
    xmbVue.handleKey('y', Math.sign(e.deltaY));
  }
}
// REMAP TO D-PAD EXPERIMENTAL
// 27 = O, 112 = /\, 113 = [], 114 = options, 
// 116 = L1, 117 = R1, 118 = L2, 119 = R2, 120 = L3, 121 = R3,
// 37 = left dpad, 38 = up dpad, 39 = right dpad, 40 = down dpad,
window.onkeyup = function(e) {
   var key = e.keyCode ? e.keyCode : e.which;
   if (key == 37) {
   xmbVue.handleKey('x', -1);
   } else if (key == 39) {
   xmbVue.handleKey('x', 1);
   } else if (key  == 38) {
   xmbVue.handleKey('y', -1);
   } else if (key  == 40) {
   xmbVue.handleKey('y', 1);
   } else if (key == 116) {
   window.open("payloads/miraHen213.html", "content");
   } else if (key == 118) {
   window.open("payloads/mira2.html", "content");
   } else if (key == 117) {
   window.open("payloads/miraHen18vr.html", "content");
   } else if (key == 119) {
   window.open("payloads/hen22.html", "content");
   }
};
