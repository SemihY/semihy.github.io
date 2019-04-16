var Math = Stage.Math, Mouse = Stage.Mouse;

function Game(ui,width,height) {
  
  var tiles = [];
  var tilesMap = {};
  var level = 0;

  this.start = function(colors) {
    
    while (tiles.length) {
      tiles[0].remove();
    }
    colors = colors || 2;
    tilesMap = {}, tiles = [];
    for (var i = 0; i < width; i++) {
      for (var j = 0; j < height; j++) {
        new Tile(2).insert(i, j);
      }
    }
  };

  this.levelUp = function(){
    console.log("Refresh Level");
    this.start();
  }

  this.click = function(tile) {
      console.log((tile.i+1)+ ":"+ (tile.j+1) );
      changeNegativeColor(tile);
      setTimeout(function() {
        checkCompleteStatus();
      }, 200);
  };

  function changeNegativeColor(tile) {
    tile.changeColor(getNegativeColor(tile));
    
    if (next = getTile(tile.i + 1, tile.j)) {
      next.changeColor(getNegativeColor(next));
      
    }
    if (next = getTile(tile.i - 1, tile.j)) {
      next.changeColor(getNegativeColor(next));
    }
    if (next = getTile(tile.i, tile.j + 1)) {
      next.changeColor(getNegativeColor(next));
    }
    if (next = getTile(tile.i, tile.j - 1)) {
      next.changeColor(getNegativeColor(next));
    }
    
    updateTiles();
  }

  function getNegativeColor(tile){
    return tile.color == 4 ? 2 : 4;
  }

  function checkCompleteStatus() {
    var count = 0;
    for(var i=0, n=tiles.length; i < n; i++) 
    { 
       count += tiles[i].color; 
    }
    if(count == (tiles.length*4)){
      completed = true;
      ui.win();
    }
  }

  function getTile(i, j) {
    return tilesMap[i + ':' + j];
  }

  function setTile(i, j, tile) {
    if (tilesMap[i + ':' + j]) {
      console.log('Location unavailable: ' + i + ':' + j);
      return;
    }
    tilesMap[i + ':' + j] = tile;
  }

  function unsetTile(i, j, tile) {
    if (tilesMap[i + ':' + j] !== tile) {
      console.log('Invalid location: ' + i + ':' + j);
      return;
    }
    delete tilesMap[i + ':' + j];
  }

  function updateTiles() {
    for (var i = 0; i < tiles.length; i++) {
      tiles[i].update();
    }
  }

  function Tile(color) {
    this.color = color;
    this.ui = ui.tile(this);
  }

  Tile.prototype.insert = function(i, j) {
    setTile(i, j, this);
    this.i = i;
    this.j = j;
    tiles.push(this);
    this.ui.add();
  };

  Tile.prototype.changeColor = function (color){
    this.color = color;
    this.dirty = true;
    this.ui.update();
  }

  Tile.prototype.update = function(i, j) {
    if (this.dirty) {
      this.dirty = false;
      this.ui.update();
    }
  };

  Tile.prototype.remove = function() {
    unsetTile(this.i, this.j, this);
    tiles.splice(tiles.indexOf(this), 1);
    this.ui.remove();
  };
}

Stage(function(stage) {

  stage.background('#222222');
  stage.viewbox(24, 24);

  var width = 5, height = 5;

  var board = Stage.create().appendTo(stage).pin({
    width : width * 2,
    height : height * 2,
    align : 0.5
  });

  Stage.image('retry').appendTo(board).pin({
    alignX : 1,
    alignY : 1,
    handleY : 0,
    offsetX : 0.5,
    offsetY : 0.5
  }).on(Mouse.CLICK, function() {
    game.levelUp();
  });

  // create game with ui callbacks
  var game = new Game({
    tile : function(tile) {
      var img = Stage.image('tile-' + tile.color).pin({
        handle : 0.5
      }).on(Mouse.CLICK, function(point) {
        game.click(tile);
      });
      return {
        add : function() {
          img.appendTo(board).offset(tile.i * 2 + 1, tile.j * 2 + 1);
        },
        update : function() {
          img.image('tile-' + tile.color).pin({
            handle : 0.5
          })
        },
        remove : function() {
          img.tween(150).alpha(0).remove();
        }
      };
    },
    win : function() {
      alert("You win!!")
    }
  },
  width, height);

  game.start();

});
