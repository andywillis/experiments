// javascript for make no wonder

// initialize jQuery
$(document).ready(function(){



 /* setup */

 // initialize variables
 var admin = {
  'mini': true,  // default true (shows minimap)
  'fog': true,   // default true (fog hides unexplored areas)
  'warp': false, // default false (shows cursor info, click miniMap to warp)
  'fly': false,  // default false (unrestricted movement)
  'free': false, // default false (no cost to build)
  'heli': false  // default false (helicopter at start)
 };

 var start = {
  'tile': {'x': false, 'y': false}, // set tile coordinates, or false for random
	 'i': {
	  'canoe':      0,
	  'map':        0,
	  'backpack':   0,
	  'pickaxe':    0,
	  'axe':        0,
	  'shovel':     0,
	  'boots':      0,
	  'radio':      0,
	  'binoculars': 0,
	  'wire':       0,
	  'rabbit':     0,
	  'fur':        0,
	  'bone':       0,
	  'ice':        0,
	  'shell':      0,
	  'slate':      0,
	  'quartz':     0,
	  'stone':      2,
	  'wood':       2,
	  'boughs':     2,
	  'birchbark':  0,
	  'charcoal':   0,
	  'berries':    0
  }
 };
 
 function Game() {
  this.mapSize = 2048;
  this.mapFraction = 16;
  this.tileSize = 16;
  this.loopRate = 40; // 50 = 20fps, 40 = 25fps; 30 = 30fps; 25 = 40fps; use 50 or 40
  
  this.softMap = true;       // default true
  this.miniMapTrees = false; // default false
  
  this.mapCanvasW = 624; // should match 'normal' size option
  this.mapCanvasH = 624;
  this.mapCanvasTileW = this.mapCanvasW / this.tileSize;
  this.mapCanvasTileH = this.mapCanvasH / this.tileSize;
  this.mapCanvasHalfTiles = this.mapCanvasTileW/2;
  // if view area is odd number of tiles wide and high (game.mapCanvasTileW%2 is 0 if even number of tiles, 1 if odd number of tiles)
  if (this.mapCanvasTileW%2) {
   this.mapCanvasHalfTiles = this.mapCanvasHalfTiles - 0.5;
  }
  
  this.mapTileMultiplier = this.tileSize / this.mapFraction; // 1, 2, 4, 8
  this.mapTileSquare = this.mapTileMultiplier*this.mapTileMultiplier; // 1, 4, 16, 64
  this.mapTileCount = this.mapSize/this.mapFraction; // 128 (0-127), 256 (0-255), etc.
  this.mapTileMax = this.mapTileCount-1; // 127, 255, etc.
  this.miniMapVisW = Math.round(this.mapCanvasTileW / this.mapTileMultiplier);
  this.miniMapVisH = Math.round(this.mapCanvasTileH / this.mapTileMultiplier);
  
  this.canvasMiniMapPx = 128;
  this.canvasMiniMapW = this.mapTileCount; // was 128
  this.canvasMiniMapH = this.mapTileCount; // was 128

	 // small map: 128 x 128
	 if (this.mapFraction === 16) {
	  this.roughness = 14; // roughness of map; higher generates more mountains & islands
			this.campVisionMiniAdjust = 1; // small adjustment to size of fog cleared around camps on miniMap, on small maps
			this.markerSize = 2; // size in pixels of you and markers on miniMap
	  
	 // normal map: 256 x 256
	 } else if (this.mapFraction === 8) {
	  this.roughness = 23;
	  this.campVisionMiniAdjust = 0;
	  this.markerSize = 2;
	
	 // large map: 512 x 512
	 } else if (this.mapFraction === 4) {
	  this.roughness = 48;
	  this.campVisionMiniAdjust = 0;
	  this.markerSize = 2;
	
	 // extra large map: 1024 x 1024
	 } else if (this.mapFraction === 2) {
	  this.roughness = 65;
	  this.campVisionMiniAdjust = 0;
	  this.markerSize = 2;
	
	 // huge map: 2048 x 2048
	 } else if (this.mapFraction === 1) {
	  this.roughness = 88;
	  this.campVisionMiniAdjust = 0;
	  this.markerSize = 2;
	 }
 };

 var game = new Game();


 var platformOffset = game.tileSize*1.5;
 var zip1OffsetX = game.tileSize*1.5;
 var zip1OffsetY = -game.tileSize/2;
 var zip2OffsetX = -2;
 var zip2OffsetY = game.tileSize-1;
 var zip3OffsetX = game.tileSize*3;
 var zip3OffsetY = game.tileSize-1;


 // define queries for later use, and declare global variables
 var $system = $('#system');
 var $mapTerrain = $('#mapTerrain');
 var $mapSprites = $('#mapSprites');
 var $mapCover = $('#mapCover');
 var $mapFog = $('#mapFog');
 
 var $miniMap = $('#miniMap');
 var $miniMapCanvas = $('#miniMapCanvas');
 var $miniMapSprites = $('#miniMapSprites');
 var $miniMapFog = $('#miniMapFog');
 var $miniMapCursor = $('#miniMapCursor');
 
 var $cursor = $('#cursor');
 var $fader = $('#fader');
 var $dimmer = $('#dimmer');
 var $cancel = $('#cancel');
 var $radio = $('#radio');
 var $energyBar = $('#energyBar');
 var $cursorInfo = $('#cursorInfo');
 
 var $actions = $('#actions'); // make sure to also add new actions to mnw.php
 var $actionsGuide = $('#actionsGuide');
 var $actionsItems = $('#actions li');
 var $aHand = $('#aHand');
 var $aBridge = $('#aBridge');
 var $aFlag = $('#aFlag');
 var $aSign = $('#aSign');
 var $aSnare = $('#aSnare');
 var $aCamp = $('#aCamp');
 var $aRaft = $('#aRaft');
 var $aCanoe = $('#aCanoe');
 var $aLetter = $('#aLetter');
 var $aPlatform = $('#aPlatform');
 var $aZip = $('#aZip');
 var $aRoof = $('#aRoof');
 var $aQuarry = $('#aQuarry');
 var $aPickaxe = $('#aPickaxe');
 var $aAxe = $('#aAxe');
 var $aShovel = $('#aShovel');
 var $aFur = $('#aFur');
 var $aBoots = $('#aBoots');
 var $aRadio = $('#aRadio');
 var $aLand = $('#aLand');
 
 var $inventory = $('#inventory');
 var $inventoryGuide = $('#inventoryGuide');
 var $inventoryDiscard = $('#inventoryDiscard');
 var $cacheInventoryBox = $('#cacheInventoryBox');
 var $cacheInventoryLabel = $('#cacheInventoryLabel');
 var $cacheInventoryDesc = $('#cacheInventoryDesc');
 var $cacheInventory = $('#cacheInventory');
 var $cacheInventoryGuide = $('#cacheInventoryGuide');
 
 var $letterSelectionBox = $('#letterSelectionBox');
 var $signInputBox = $('#signInputBox');
 
	var canvasSprites = document.getElementById('mapSprites'); // used when copying to contextFader
	var canvasMiniMap = document.getElementById('miniMapCanvas');
	
	var contextFader = document.getElementById('fader').getContext("2d");
	var contextTerrain = document.getElementById('mapTerrain').getContext("2d");
	var contextSprites = document.getElementById('mapSprites').getContext("2d");
	var contextCover = document.getElementById('mapCover').getContext("2d");
	var contextFog = document.getElementById('mapFog').getContext("2d");
	var contextMiniMap = document.getElementById('miniMapCanvas').getContext("2d");
	var contextMiniMapSprites = document.getElementById('miniMapSprites').getContext("2d");
	var contextMiniMapFog = document.getElementById('miniMapFog').getContext("2d");
	var contextMiniMapCursor = document.getElementById('miniMapCursor').getContext("2d");
 
 // used for prerendering images
 var sprites1x1Image, sprites1x1, sprites1x2Image, sprites1x2, sprites2x2Image, sprites2x2, sprites3x2Image, sprites3x2, sprites3x3Image, sprites3x3, sprites9x3Image, sprites9x3, sprites9x6Image, sprites9x6, sprites15x10Image, sprites15x10;
 var miniMapPixel = contextMiniMap.createImageData(1,1), miniMapPixelData = miniMapPixel.data;
 
 // counters, switches, timers, arrays of tiles and objects
 var frameCount = 0, stepCount = 0, raftCounter = 0, canoeCounter = 0;
 var clearStatusTimer;
 var redrawTerrain = true, redrawFog = true, redrawMiniMapCursor = true;
 var radioFeed, radioRescue = false;
 
 var startTilesArray = [];
 var crashSiteTilesArray = [];
 var fieldStationTilesArray = [];
 var helicopterTilesArray = [];
 var startTreesArray = [];
 var startStonesArray = [];
 var newStonesArray = [];
 var newBerriesArray = [];
 var newShellsArray = [];
 var lettersArray = [];
 
 // objects instead of arrays, since we need to remove specific keys
 var objects = {};
 var caches = {};
 var rafts = {};
 var canoes = {};
 var helicopters = {};
 var platforms = {};
 var snares = {};
 var holes = {};
 var trees = {};
 var fires = {};
 
 // special walkable tiles
 var specialWalkable = [
  2.4, // cave
  3.1, 3.2, 3.3, 3.4, // icebergs
  4.20, 4.21, 4.22, 4.23, // crash site
	 6.004, // field station
	 6.104, 6.108, 6.109, 6.110, 6.111,
		6.204, 6.208, 6.207, 6.209, 6.210, 6.211, 6.213,
		6.303, 6.304, 6.306, 6.307, 6.308, 6.309, 6.310, 6.311, 6.312, 6.313, 6.314,
		6.403, 6.404, 6.405, 6.406, 6.407, 6.408, 6.409, 6.410, 6.411, 6.412, 6.413, 6.414,
		6.504, 6.506, 6.507, 6.508, 6.509, 6.510, 6.511, 6.512, 6.513, 6.514,
		6.604, 6.606, 6.607, 6.608, 6.609, 6.610, 6.611, 6.612, 6.613, 6.614,
		6.704, 6.706, 6.707, 6.708, 6.709, 6.710, 6.711, 6.712, 6.713, 6.714,
		6.804, 6.810,
		6.904, 6.905, 6.906, 6.907, 6.908, 6.909, 6.910, 6.911, 6.912, 6.913, 6.914, 6.915
 ];



 // player properties and states
 function Player() {
  this.tile = {'x': false, 'y': false};
  this.walk = {'min': 0.55, 'max': 0.98}; // uses > min, <= max
  this.reach = 4.25;
  this.carry = {'now': 20, 'normal': 20, 'fromBackpack': 10};
  // if onPlatform or onHelicopter vision changes, make sure radius doesn't extend outside small view size, else miniMapFog doesn't clear properly
  this.vision = {'normal': 100, 'fromBinoculars': 35, 'fromHighTerrain': 35, 'onBoat': -28, 'onPlatform': 160, 'onHelicopter': 160};
  this.energy = {'now': 900, 'max': 900, 'fromBerries': 40, 'fromRabbit': 100};
  this.status = {
   'cold': false, 'active': 0, 'sleep': 1,
   'buildingZip': false, 'buildingLetter': false, 'buildingSign': false, 'calledHelicopter': false,
   'paused1': false, 'paused2': false
  };
  this.on = {'water': false, 'cache': false, 'raft': false, 'canoe': false, 'platform': false, 'zip': false, 'helicopter': false}
  this.offset = game.tileSize/2;
  this.animating = {'sleep': 0, 'stand': 0};
  this.updateCarry = function() {
   this.carry.now = this.carry.normal + (this.inventory.backpack.count*this.carry.fromBackpack);
  };
  this.updateEnergy = function(energyChange) {
   energyChange = energyChange || 0; // sets default if parameter is undefined
   this.energy.now += energyChange;
   if (energyChange < 0 && this.status.cold) { this.energy.now += energyChange; } // if losing energy and cold, lose twice as much
   if (energyChange > 0 && !$energyBar.hasClass('increasing')) { $energyBar.addClass('increasing'); } // if gaining energy, animate energy bar
   if (this.energy.now > this.energy.max) {
	   this.energy.now = this.energy.max;
	  } else if (this.energy.now <= 0) {
	   this.energy.now = 0;
	  }
		 var energyFraction = this.energy.now / this.energy.max;
		 var newEnergyWidth = Math.round(energyBarWidth * energyFraction);
		 // if energy level has changed, update css
		 if (newEnergyWidth + 'px' !== $('#energyNow').width()) {
	 	 if (energyFraction < 0.10) {
			  $('#energyNow').css({'background-color': '#a34848', 'width': newEnergyWidth});
			 } else if (energyFraction < 0.25) {
			  $('#energyNow').css({'background-color': '#d8625f', 'width': newEnergyWidth});
			 } else if (energyFraction < 0.50) {
			  $('#energyNow').css({'background-color': '#db9460', 'width': newEnergyWidth});
			 } else if (energyFraction < 0.75) {
		 	 $('#energyNow').css({'background-color': '#dbb760', 'width': newEnergyWidth});
			 } else {
			  $('#energyNow').css({'background-color': '#dbda60', 'width': newEnergyWidth});
			 }
	 	}
	 	if (this.status.cold) {
	 	 $('#energyBox').addClass('cold');
	 	} else {
	 	 $('#energyBox').removeClass('cold');
	 	}
	 };
  this.getTerrain = function() {
   return mapArray[this.tile.x][this.tile.y];
  };
  this.getVisionRadius = function() {
   var vr = this.vision.normal;
   if (this.inventory.binoculars.count > 0) { vr += this.vision.fromBinoculars; }
   if (this.getTerrain() > 0.98 && this.getTerrain() <= 1) { vr += this.vision.fromHighTerrain; }
   if (this.on.raft || this.on.canoe) { vr += this.vision.onBoat; }
   if (this.on.platform) { vr = this.vision.normal+this.vision.onPlatform; } // binoculars or high terrain do not affect vision when on platform
   if (this.on.helicopter) { vr = this.vision.normal+this.vision.onHelicopter; } // binoculars or high terrain do not affect vision when on helicopter
   return vr;
  };
	 this.updateSleep = function() {
	  // if not already asleep, in water, building zip or letter, on zip or on helicopter, chance to fall asleep
	  if (this.status.sleep <= 0 && this.on.water === false && this.status.buildingZip === false && this.status.buildingLetter === false && this.status.buildingSign === false && this.on.zip === false && this.on.helicopter === false) {
    var sleepChance = randomBetween(0, 50);
	   if (sleepChance === 1) {
	    this.status.sleep++;
	    // don't animate sleep when already animating
	    if (this.status.sleep >= 1 && this.animating.sleep === 0) { this.animating.sleep = 3; }
	   }
	  }
  };
  // two functions to pause control, so that two events can pause control without cancelling each other
	 this.pause1 = function(interval) {
	  if (you.status.paused1 === false) {
	   you.status.paused1 = true;
	   var pause1Timer = requestTimeout(function() {
	    you.status.paused1 = false;
	   }, interval);
	  }
	 };
	 this.pause2 = function(interval) {
	  if (you.status.paused2 === false) {
	   you.status.paused2 = true;
	   var pause2Timer = requestTimeout(function() {
	    you.status.paused2 = false;
	   }, interval);
	  }
	 };
 }
 var you = new Player();



 // camps, caves, and other caches
 function Cache(type, description, carry, energy) {
  this.type = type;
  this.description = description;
  this.carry = carry;
 }
 function Camp(inventory) {
  this.inventory = inventory;
  this.vision = 275; // if this changes, make sure fog drawing buffer is the right size
  this.energy = {'now': 100, 'max': 100};
  this.offset = game.tileSize;
  this.updateEnergy = function(energyChange) {
   energyChange = energyChange || 0; // sets default if parameter is undefined
   this.energy.now += energyChange;
   if (this.energy.now > this.energy.max) {
	   this.energy.now = this.energy.max;
	  } else if (this.energy.now <= 0) {
	   this.energy.now = 0;
	  }
	 };
 }
 Camp.prototype = new Cache('camp', 'Click items you are carrying to store them here. Camps also restore energy.', 25);
 
 function Cave(inventory) {
  this.inventory = inventory;
 }
 Cave.prototype = new Cache('cave', 'A small cave. You can stash items here.', 10);
 
 function Crash(inventory) {
  this.inventory = inventory;
 }
 Crash.prototype = new Cache('crash site', 'The cockpit is smashed and smells of smoke.', 15);
 
 function Cupboard(inventory) {
  this.inventory = inventory;
 }
 Cupboard.prototype = new Cache('crash site', 'The wooden cupboard is damp and moldy.', 10);
 
 function Quarry(inventory) {
  this.inventory = inventory;
 }
 Quarry.prototype = new Cache('quarry', 'Beneath the thin soil are many stones.', 20);
 


 // cursor
 function Cursor() {
  this.tile = {'x': false, 'y': false};
  this.near = false;
  this.mode = 'hand';
  this.offset;
  this.hide = function() {
		 this.near = false;
		 $cursor.hide();
		 $('body').css('cursor', 'crosshair');
	 };
 }
 var cursor = new Cursor();



 var mapOffsetX, mapOffsetY, drawOffsetX, drawOffsetY;

 var flagVision = 40;
 var platformVision = 400;
 var platformEnergy = 250;

 var energyBarWidth = 126;
 var inventoryItemHeight = 22;

 var stationX, stationY, stationW, stationH;
 var raftMoveMin = 0, raftMoveMax = 0.6;
 var canoeMoveMin = 0, canoeMoveMax = 0.6;
 var raftSplashLeft = 0, raftSplashRight = 0, raftSplashUp = 0, raftSplashDown = 0;
 
 var fogColor = '#36516f';
 var miniMapFogColor = '#324b67';
 
 var startTreeMin = 0.65, startTreeMax = 0.9;
 var newTreeMin = 0.61, newTreeMax = 0.95;
 var berriesMin = 0.69, berriesMax = 0.71;
 var shellMin = 0.45, shellMax = 0.55; // shallows
 var boneMin = 0.86, boneMax = 0.95;
 
 var startStoneMin = 0.56, startStoneMax = 0.98;
 var newStoneMin = 0.56, newStoneMax = 0.65;
 
 var stepStoneMin = 0.05, stepStoneMax = 0.55; // uses > min, <= max
 var stepStoneSink = 7000;
 
 var shovelTerrainMin = 0.55, shovelTerrainMax = 0.85;
 var pickaxeTerrainMin = 0.99, pickaxeTerrainMax = 1;
 
 // terrain values use > min, <= max
 var buildable = {
	 'bridge': {'cost': {'wood': 2}, 'terrain': {'min': 0, 'max': 0.55}, 'energy': 1, 'action': $aBridge},
	 'flag': {'cost': {'birchbark': 1, 'berries': 1}, 'energy': 1, 'action': $aFlag},
	 'sign': {'cost': {'birchbark': 1, 'charcoal': 1}, 'energy': 1, 'action': $aSign},
	 'snare': {'cost': {'wire': 1, 'boughs': 1}, 'terrain': {'min': 0.55, 'max': 0.98}, 'energy': 1, 'action': $aSnare},
	 'camp': {'cost': {'stone': 2, 'wood': 2, 'boughs': 2}, 'terrain': {'min': 0.55, 'max': 0.85}, 'energy': 1, 'action': $aCamp},
	 'raft': {'cost': {'wood': 8}, 'terrain': {'min': 0.55, 'max': 0.6}, 'energy': 1, 'action': $aRaft},
	 'canoe': {'cost': {'wood': 2, 'birchbark': 6}, 'terrain': {'min': 0.55, 'max': 0.6}, 'energy': 1, 'action': $aCanoe},
	 'letter': {'cost': {'charcoal': 6}, 'terrain': {'min': 0.55, 'max': 0.98}, 'energy': 1, 'action': $aLetter},
	 'platform': {'cost': {'wood': 6, 'boughs': 2}, 'terrain': {'min': 0.55, 'max': 0.98}, 'energy': 1, 'action': $aPlatform},
	 'zip': {'cost': {'wire': 1, 'wood': 1}, 'energy': 1, 'action': $aZip},
	 'roof': {'cost': {'slate': 6, 'wood': 2}, 'energy': 1, 'action': $aRoof},
	 'quarry': {'cost': {'shovel': 1, 'wood': 4}, 'energy': 1, 'action': $aQuarry},
	 'pickaxe': {'cost': {'bone': 1, 'wood': 1}, 'restriction': 'pickaxe', 'energy': 1, 'action': $aPickaxe},
	 'axe': {'cost': {'slate': 1, 'wood': 1}, 'restriction': 'axe', 'energy': 1, 'action': $aAxe},
	 'shovel': {'cost': {'shell': 1, 'wood': 1}, 'restriction': 'shovel', 'energy': 1, 'action': $aShovel},
	 'fur': {'cost': {'rabbit': 1}, 'energy': 1, 'action': $aFur},
	 'boots': {'cost': {'fur': 2, 'birchbark': 2}, 'restriction': 'boots', 'energy': 1, 'action': $aBoots},
	 'radio': {'cost': {'wire': 1, 'shell': 1, 'quartz': 1}, 'restriction': 'radio', 'energy': 1, 'action': $aRadio}
 };
 
 var wireAtFieldStation = randomOneOf([0, 1]); // used to randomize position of wire

 function Item(count, size, description, found) {
  this.count = count;
  this.size = size; // number of blocks taken up in inventory grid
  this.description = description;
  this.found = found;
 }
 function Inventory(canoe, map, backpack, pickaxe, axe, shovel, boots, radio, binoculars, wire, rabbit, fur, bone, ice, shell, slate, quartz, stone, wood, boughs, birchbark, charcoal, berries) {
  this.canoe = new Item(canoe, 3, 'It\'s a birchbark canoe. Place it on a sand tile to use it. You can click canoes to pick them up again.', '');
  this.map = new Item(map, 1, 'It\'s a map of the area.', 'You found a map!');
  this.backpack = new Item(backpack, 1, 'A backpack lets you carry more items.', 'You found a backpack!');
  this.pickaxe = new Item(pickaxe, 1, 'An pickaxe lets you smash rocks.', 'You found a pickaxe!');
  this.axe = new Item(axe, 1, 'An axe lets you cut down large trees.', 'You found an axe!');
  this.shovel = new Item(shovel, 1, 'A shovel lets you dig holes.', 'You found a shovel!');
  this.boots = new Item(boots, 1, 'Boots let you walk on higher terrain.', '');
  this.radio = new Item(radio, 1, 'A makeshift crystal radio.', '');
  this.binoculars = new Item(binoculars, 1, 'Binoculars increase view distance.', 'You found a pair of binoculars!');
  this.wire = new Item(wire, 1, 'Wire is used to build snares and ziplines.', '');
  this.rabbit = new Item(rabbit, 1, 'Rabbits are a source of energy and fur.', '');
  this.fur = new Item(fur, 1, 'Fur can be used to make boots.', '');
  this.bone = new Item(bone, 1, 'Bone is used to craft pickaxes.', '');
  this.ice = new Item(ice, 1, 'Ice is used to erase charcoal marks.', '');
  this.shell = new Item(shell, 1, 'Shells are used to craft shovels.', '');
  this.slate = new Item(slate, 1, 'Slate is used to craft axes and build platform roofs.', '');
  this.quartz = new Item(quartz, 1, 'Quartz can be used to craft a crystal radio.', '');
  this.stone = new Item(stone, 1, 'Stone is used to place stepping stones, or build camps.', '');
  this.wood = new Item(wood, 1, 'Wood is used to build camps, rafts, and other things.', '');
  this.boughs = new Item(boughs, 1, 'Boughs are used to build snares, camps and platforms.', '');
  this.birchbark = new Item(birchbark, 1, 'Birchbark is used to make canoes, flags and other things.', '');
  this.charcoal = new Item(charcoal, 1, 'Charcoal is used to make marks.', '');
  this.berries = new Item(berries, 1, 'Berries are a source of energy and are used to make flags.', '');
	 this.count = function() {
	  var thisInventory = this;
	  var inventoryCount = 0;
	  for (var key in thisInventory) {
	   if (key !== 'count') {
	    // 'i' is used for cacheInventory items that never run out
	    var addCount = thisInventory[key].count;
	    if (addCount === 'i') { addCount = 1; }
	    inventoryCount += addCount*thisInventory[key].size;
	   }
	  }
	  return inventoryCount;
	 };
 }
 
 you.inventory = new Inventory(
  start.i.canoe, start.i.map, start.i.backpack, start.i.pickaxe, start.i.axe, start.i.shovel, start.i.boots, start.i.radio, start.i.binoculars,
  start.i.wire, start.i.rabbit, start.i.fur, start.i.bone, start.i.ice, start.i.shell, start.i.slate, start.i.quartz, start.i.stone,
  start.i.wood, start.i.boughs, start.i.birchbark, start.i.charcoal, start.i.berries
 );
 you.updateCarry();
 you.updateEnergy();

 // build map and set css properties
 var drawLoop, mapArray, airArray;
 var mapData = multiDimensionalArray(game.mapSize+1, game.mapSize+1);
 var airData = multiDimensionalArray(game.mapSize+1, game.mapSize+1);
 
 $system.css({'width': game.mapCanvasW, 'height': game.mapCanvasH});
 $dimmer.css({'width': game.mapCanvasW, 'height': game.mapCanvasH});

 // important to set attributes for canvas elements, not css values
 $mapTerrain.attr({'width': game.mapCanvasW, 'height': game.mapCanvasH});
 $mapSprites.attr({'width': game.mapCanvasW, 'height': game.mapCanvasH});
 $mapCover.attr({'width': game.mapCanvasW, 'height': game.mapCanvasH});
 $mapFog.attr({'width': game.mapCanvasW, 'height': game.mapCanvasH});
 $fader.attr({'width': game.tileSize, 'height': game.tileSize}).css({'left': game.mapCanvasHalfTiles*game.tileSize, 'top': game.mapCanvasHalfTiles*game.tileSize});
 
 $miniMap.css({'width': game.canvasMiniMapPx, 'height': game.canvasMiniMapPx});
 $miniMapCanvas.attr({'width': game.canvasMiniMapPx, 'height': game.canvasMiniMapPx});
 $miniMapSprites.attr({'width': game.canvasMiniMapPx, 'height': game.canvasMiniMapPx});
 $miniMapFog.attr({'width': game.canvasMiniMapPx, 'height': game.canvasMiniMapPx});
 $miniMapCursor.attr({'width': game.canvasMiniMapPx, 'height': game.canvasMiniMapPx});

 // special admin conditions
 if (admin.warp) { $('#infoBox').show(); }
 if (!admin.mini) { $miniMap.css({'display': 'none'}); }
 if (!admin.fog) { $mapFog.css({'display': 'none'}); $miniMapFog.css({'display': 'none'}); }
 





 /* utility functions */
  
 // timer for testing
 // see: http://addyosmani.com/blog/8-jquery-performance-tips/
 function clockTime() {
  var time = new Date();
  return time.getTime();
 }
 var s = clockTime();
 // insert somewhere to check script timing
 //console.log('Script executed in ' + (clockTime()-s) +'ms.');
 


 // drop-down menus.
	$('#menuSwitchSize')
	 .on('mouseenter', function(e) {
	  $(this).children('ul').css("z-index", "50000").show();
	 })
	 .on('mouseleave', function(e) {
	  $(this).children('ul').css("z-index", "50").hide();
	 });
 


 // given a string, display status
 function status(string) {
  clearTimeout(clearStatusTimer);
  //$('#status').hide().text(string).fadeIn(400);
  $('#status').hide().text(string).show(0);
 }

 // clear status after given milliseconds (or default)
 function clearStatus(milliseconds) {
  milliseconds = milliseconds || 2500; // sets default if parameter is undefined
  clearStatusTimer = requestTimeout(function(){
   $('#status').empty();
   return false;
  }, milliseconds);
 }



 // given a minimum and maximum value, return a random integer
 function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
 }


 
 // given an array of possible values, return a random value.
 function randomOneOf(possibilities) {
  return possibilities[Math.floor(possibilities.length*Math.random())] || false;
 }
 
 
 
 // given an object, return a random property
 // source: http://stackoverflow.com/questions/2532218/pick-random-property-from-a-javascript-object
 function randomProperty(obj) {
  var result, count = 0;
  for (var prop in obj) {
	  if (Math.random() < 1/++count) {
	   result = prop;
	  }
	 }
  return result;
 }
 
 
 
 // given two point objects {'x', 'y'}, return the distance between
 function getDistance(point1, point2) {
  var xd = point1.x - point2.x;
		var yd = point1.y - point2.y;
		var xy = Math.pow(xd, 2) + Math.pow(yd, 2);
		var distance = Math.round(Math.sqrt(xy)*100)/100;
		return distance;
 }






 /* map generation */
 // see: http://www.somethinghitme.com/2009/12/06/terrain-generation-with-canvas-and-javascript/
 
 // create a multi-dimensional array (don't need to fill array, just create it)
	function multiDimensionalArray(nRows, nCols) {
	 var a = [nRows];
	 for (var i=0; i<nRows; i++) {
	  a[i] = [nCols];
   /*
			for (var j=0; j<nCols; j++) {
				//a[i][j] = ""; // was using a[i][j] = [] here
			} */
		}
		return a;
	}

 
 
 // set up map as a two-dimensional array of x and y values
 // mapData contains values from [0][0] to [game.mapSize][game.mapSize] ([2048][2048]) at steps of [game.tileSize][game.tileSize], representing raw terrain data
 // mapArray contains values from [0][0] to [(game.mapSize/game.tileSize)-1][(game.mapSize/game.tileSize)-1] ([127][127]), representing tile data.
 function generateMap() {
  // adjusted multiDimensionalArray() above so that each [x][y] is an empty array instead of an empty string
	 mapArray = multiDimensionalArray(game.mapTileCount, game.mapTileCount);
	 airArray = multiDimensionalArray(game.mapTileCount, game.mapTileCount);
	 
	 // build mapArray from mapData, round terrain values, fix terrain value spikes (sometimes happens at [0][64] and [64][0] on small map)
	 for (var x=0; x<game.mapTileCount; x++) {
	 	for (var y=0; y<game.mapTileCount; y++) {
    mapArray[x][y] = Math.round(mapData[x*game.mapFraction][y*game.mapFraction]*100)/100; // round terrain values to .00 places
    if (mapArray[x][y] > 1) {
	 	  mapArray[x][y] = 1;
	 	 }
	 	 airArray[x][y] = Math.round(airData[x*game.mapFraction][y*game.mapFraction]*100)/100;
	 	}
	 }
	 

	 // filter terrain to create islands instead of land ending at edges of map
	 var trimTerrain1 = 0.8, trimTerrain2 = 0.3, trimTerrain3 = 0.2, trimTerrain4 = 0.1;
	 
	 for (var x=0; x<game.mapTileCount; x++) {
	  // topmost rows
	  mapArray[x][0] = mapArray[x][0] - trimTerrain1;
	  if (mapArray[x][0] <= 0.45) {	mapArray[x][0] = 0.45; }
	  mapArray[x][1] = mapArray[x][1] - trimTerrain2;
	  if (mapArray[x][1] <= 0.45) {	mapArray[x][1] = 0.45; }
	  mapArray[x][2] = mapArray[x][2] - trimTerrain3;
	  if (mapArray[x][2] <= 0.45) {	mapArray[x][2] = 0.45; }
	  mapArray[x][3] = mapArray[x][3] - trimTerrain4;
	  if (mapArray[x][3] <= 0.45) {	mapArray[x][3] = 0.45; }
   // bottommost rows
	  mapArray[x][game.mapTileMax] = mapArray[x][game.mapTileMax] - trimTerrain1;
	  if (mapArray[x][game.mapTileMax] <= 0.45) {	mapArray[x][game.mapTileMax] = 0.45; }
	  mapArray[x][game.mapTileMax-1] = mapArray[x][game.mapTileMax-1] - trimTerrain2;
	  if (mapArray[x][game.mapTileMax-1] <= 0.45) {	mapArray[x][game.mapTileMax-1] = 0.45; }
	  mapArray[x][game.mapTileMax-2] = mapArray[x][game.mapTileMax-2] - trimTerrain3;
	  if (mapArray[x][game.mapTileMax-2] <= 0.45) {	mapArray[x][game.mapTileMax-2] = 0.45; }
	  mapArray[x][game.mapTileMax-3] = mapArray[x][game.mapTileMax-3] - trimTerrain4;
	  if (mapArray[x][game.mapTileMax-3] <= 0.45) {	mapArray[x][game.mapTileMax-3] = 0.45; }
		}

	 for (var y=0; y<game.mapTileCount; y++) {
	  // leftmost columns
	  mapArray[0][y] = mapArray[0][y] - trimTerrain1;
	  if (mapArray[0][y] <= 0.45) {	mapArray[0][y] = 0.45; }
	  mapArray[1][y] = mapArray[1][y] - trimTerrain2;
	  if (mapArray[1][y] <= 0.45) {	mapArray[1][y] = 0.45; }
	  mapArray[2][y] = mapArray[2][y] - trimTerrain3;
	  if (mapArray[2][y] <= 0.45) {	mapArray[2][y] = 0.45; }
	  mapArray[3][y] = mapArray[3][y] - trimTerrain4;
	  if (mapArray[3][y] <= 0.45) {	mapArray[3][y] = 0.45; }
	  // rightmost columns
	  mapArray[game.mapTileMax][y] = mapArray[game.mapTileMax][y] - trimTerrain1;
	  if (mapArray[game.mapTileMax][y] <= 0.45) {	mapArray[game.mapTileMax][y] = 0.45; }
	  mapArray[game.mapTileMax-1][y] = mapArray[game.mapTileMax-1][y] - trimTerrain2;
	  if (mapArray[game.mapTileMax-1][y] <= 0.45) {	mapArray[game.mapTileMax-1][y] = 0.45; }
	  mapArray[game.mapTileMax-2][y] = mapArray[game.mapTileMax-2][y] - trimTerrain3;
	  if (mapArray[game.mapTileMax-2][y] <= 0.45) {	mapArray[game.mapTileMax-2][y] = 0.45; }
	  mapArray[game.mapTileMax-3][y] = mapArray[game.mapTileMax-3][y] - trimTerrain4;
	  if (mapArray[game.mapTileMax-3][y] <= 0.45) {	mapArray[game.mapTileMax-3][y] = 0.45; }
		}
		
		
		// store possible crash site tiles, field station tiles
  for (var x=3, xLimit=game.mapTileCount-3; x<xLimit; x++) {
	 	for (var y=3, yLimit=game.mapTileCount-3; y<yLimit; y++) {
	 	 var storeTileChance = randomBetween(0, game.mapTileSquare*10); // store fewer with larger maps
	 	 if (storeTileChance === 1) {
	    // store possible crash site tiles
	    if (
		     // if within map limits
		     x+6 < game.mapTileMax && y+3 < game.mapTileMax
		     // and terrain is appropriate
		     && mapArray[x-2][y] <= 0.45 && mapArray[x-1][y] <= 0.45 && mapArray[x][y] <= 0.45 && mapArray[x+1][y] <= 0.45
		     && mapArray[x+2][y] <= 0.45 && mapArray[x+3][y] <= 0.45 && mapArray[x+4][y] <= 0.45 && mapArray[x+5][y] <= 0.45
		     && mapArray[x-2][y+1] <= 0.45 && mapArray[x-1][y+1] <= 0.45 && mapArray[x][y] <= 0.45 && mapArray[x+1][y+1] <= 0.45
		     && mapArray[x+2][y+1] <= 0.45 && mapArray[x+3][y+1] <= 0.45 && mapArray[x+4][y+1] <= 0.45 && mapArray[x+5][y+1] <= 0.45
	     ) {
	     crashSiteTilesArray.push({'x': x, 'y': y});
	    }
	    // store possible field station tiles
	    if (
		     // if within map limits
		     x > 5 && y > 5 && x+15 < game.mapTileMax-5 && y+10 < game.mapTileMax-5
		     // and terrain is appropriate
		     && mapArray[x][y] < you.walk.max && mapArray[x][y] > you.walk.min
		     && mapArray[x+7][y] < you.walk.max && mapArray[x+7][y] > you.walk.min
		     && mapArray[x+14][y] < you.walk.max && mapArray[x+14][y] > you.walk.min
		     && mapArray[x+7][y+9] < you.walk.max && mapArray[x+7][y+9] > you.walk.min
		     && mapArray[x+14][y+9] < you.walk.max && mapArray[x+14][y+9] > you.walk.min
		    ) {
	     fieldStationTilesArray.push({'x': x, 'y': y});
	    }
	    // store possible helicopter tiles
	    if (
		     // if within map limits
		     x > 5 && y > 5 && x+9 < game.mapTileMax-5 && y+3 < game.mapTileMax-5
		     // and terrain is appropriate
		     && mapArray[x+1][y+2] < you.walk.max && mapArray[x+1][y+2] > you.walk.min
		     && mapArray[x+2][y+2] < you.walk.max && mapArray[x+2][y+2] > you.walk.min
		     && mapArray[x+3][y+2] < you.walk.max && mapArray[x+3][y+2] > you.walk.min
		     && mapArray[x+4][y+2] < you.walk.max && mapArray[x+4][y+2] > you.walk.min
		    ) {
	     helicopterTilesArray.push({'x': x, 'y': y});
	    }
    }
   }
  }


  // generate crash site
  if (crashSiteTilesArray.length) {
	  var cS = randomOneOf(crashSiteTilesArray);
	  mapArray[cS.x][cS.y] = 4.10;
	  mapArray[cS.x+1][cS.y] = 4.11;
	  mapArray[cS.x+2][cS.y] = 4.12;
	  mapArray[cS.x+3][cS.y] = 4.13;
	  
	  mapArray[cS.x][cS.y+1] = 4.20;
	  mapArray[cS.x+1][cS.y+1] = 4.21;
	  mapArray[cS.x+2][cS.y+1] = 4.22;
	  mapArray[cS.x+3][cS.y+1] = 4.23;
	  
	  var cacheId = 'X'+(cS.x+2)+'Y'+cS.y;
	  objects[cacheId] = {'type': 'crash', 'x': (cS.x+2), 'y': cS.y};
	  if (wireAtFieldStation) {
	   var crashInventory = new Inventory(0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0); // backpack
	  } else {
	   var crashInventory = new Inventory(0, 0, 1, 0, 0, 0, 0, 0, 0, 'i', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0); // backpack, infinite wire
	  }
	  caches[cacheId] = new Crash(crashInventory);
	  miniMapMarker(cS.x, cS.y, 'yellow');
  }
  
  
  // generate field station
  if (fieldStationTilesArray.length) {
	  var fS = randomOneOf(fieldStationTilesArray);
	  // row 1
	  mapArray[fS.x][fS.y] = 6.001; mapArray[fS.x+1][fS.y] = 6.002; mapArray[fS.x+2][fS.y] = 6.003; mapArray[fS.x+3][fS.y] = 6.004; mapArray[fS.x+4][fS.y] = 6.005;
	  mapArray[fS.x+5][fS.y] = 6.006; mapArray[fS.x+6][fS.y] = 6.007; mapArray[fS.x+7][fS.y] = 6.008; mapArray[fS.x+8][fS.y] = 6.009; mapArray[fS.x+9][fS.y] = 6.010;
	  mapArray[fS.x+10][fS.y] = 6.011; mapArray[fS.x+11][fS.y] = 6.012; mapArray[fS.x+12][fS.y] = 6.013; mapArray[fS.x+13][fS.y] = 6.014; mapArray[fS.x+14][fS.y] = 6.015;
	  
	  // row 2
	  mapArray[fS.x][fS.y+1] = 6.101; mapArray[fS.x+1][fS.y+1] = 6.102; mapArray[fS.x+2][fS.y+1] = 6.103; mapArray[fS.x+3][fS.y+1] = 6.104; mapArray[fS.x+4][fS.y+1] = 6.105;
	  mapArray[fS.x+5][fS.y+1] = 6.106; mapArray[fS.x+6][fS.y+1] = 6.107; mapArray[fS.x+7][fS.y+1] = 6.108; mapArray[fS.x+8][fS.y+1] = 6.109; mapArray[fS.x+9][fS.y+1] = 6.110;
	  mapArray[fS.x+10][fS.y+1] = 6.111; mapArray[fS.x+11][fS.y+1] = 6.112; mapArray[fS.x+12][fS.y+1] = 6.113; mapArray[fS.x+13][fS.y+1] = 6.114; mapArray[fS.x+14][fS.y+1] = 6.115;
	  
	  // row 3
	  mapArray[fS.x][fS.y+2] = 6.201; mapArray[fS.x+1][fS.y+2] = 6.202; mapArray[fS.x+2][fS.y+2] = 6.203; mapArray[fS.x+3][fS.y+2] = 6.204; mapArray[fS.x+4][fS.y+2] = 6.205;
	  mapArray[fS.x+5][fS.y+2] = 6.206; mapArray[fS.x+6][fS.y+2] = 6.207; mapArray[fS.x+7][fS.y+2] = 6.208; mapArray[fS.x+8][fS.y+2] = 6.209; mapArray[fS.x+9][fS.y+2] = 6.210;
	  mapArray[fS.x+10][fS.y+2] = 6.211; mapArray[fS.x+11][fS.y+2] = 6.212; mapArray[fS.x+12][fS.y+2] = 6.213; mapArray[fS.x+13][fS.y+2] = 6.214; mapArray[fS.x+14][fS.y+2] = 6.215;
	  
	  // row 4
	  mapArray[fS.x+2][fS.y+3] = 6.303; mapArray[fS.x+3][fS.y+3] = 6.304; mapArray[fS.x+4][fS.y+3] = 6.305;
	  mapArray[fS.x+5][fS.y+3] = 6.306; mapArray[fS.x+6][fS.y+3] = 6.307; mapArray[fS.x+7][fS.y+3] = 6.308; mapArray[fS.x+8][fS.y+3] = 6.309; mapArray[fS.x+9][fS.y+3] = 6.310;
	  mapArray[fS.x+10][fS.y+3] = 6.311; mapArray[fS.x+11][fS.y+3] = 6.312; mapArray[fS.x+12][fS.y+3] = 6.313; mapArray[fS.x+13][fS.y+3] = 6.314; mapArray[fS.x+14][fS.y+3] = 6.315;
	  
	  // row 5
	  mapArray[fS.x+2][fS.y+4] = 6.403; mapArray[fS.x+3][fS.y+4] = 6.404; mapArray[fS.x+4][fS.y+4] = 6.405;
	  mapArray[fS.x+5][fS.y+4] = 6.406; mapArray[fS.x+6][fS.y+4] = 6.407; mapArray[fS.x+7][fS.y+4] = 6.408; mapArray[fS.x+8][fS.y+4] = 6.409; mapArray[fS.x+9][fS.y+4] = 6.410;
	  mapArray[fS.x+10][fS.y+4] = 6.411; mapArray[fS.x+11][fS.y+4] = 6.412; mapArray[fS.x+12][fS.y+4] = 6.413; mapArray[fS.x+13][fS.y+4] = 6.414; mapArray[fS.x+14][fS.y+4] = 6.415;
	  
	  // row 6
	  mapArray[fS.x+3][fS.y+5] = 6.504; mapArray[fS.x+4][fS.y+5] = 6.505;
	  mapArray[fS.x+5][fS.y+5] = 6.506; mapArray[fS.x+6][fS.y+5] = 6.507; mapArray[fS.x+7][fS.y+5] = 6.508; mapArray[fS.x+8][fS.y+5] = 6.509; mapArray[fS.x+9][fS.y+5] = 6.510;
	  mapArray[fS.x+10][fS.y+5] = 6.511; mapArray[fS.x+11][fS.y+5] = 6.512; mapArray[fS.x+12][fS.y+5] = 6.513; mapArray[fS.x+13][fS.y+5] = 6.514; mapArray[fS.x+14][fS.y+5] = 6.515;
	  
	  // row 7
	  mapArray[fS.x+3][fS.y+6] = 6.604; mapArray[fS.x+4][fS.y+6] = 6.605;
	  mapArray[fS.x+5][fS.y+6] = 6.606; mapArray[fS.x+6][fS.y+6] = 6.607; mapArray[fS.x+7][fS.y+6] = 6.608; mapArray[fS.x+8][fS.y+6] = 6.609; mapArray[fS.x+9][fS.y+6] = 6.610;
	  mapArray[fS.x+10][fS.y+6] = 6.611; mapArray[fS.x+11][fS.y+6] = 6.612; mapArray[fS.x+12][fS.y+6] = 6.613; mapArray[fS.x+13][fS.y+6] = 6.614; mapArray[fS.x+14][fS.y+6] = 6.615;
	
	  // row 8
	  mapArray[fS.x+3][fS.y+7] = 6.704; mapArray[fS.x+4][fS.y+7] = 6.705;
	  mapArray[fS.x+5][fS.y+7] = 6.706; mapArray[fS.x+6][fS.y+7] = 6.707; mapArray[fS.x+7][fS.y+7] = 6.708; mapArray[fS.x+8][fS.y+7] = 6.709; mapArray[fS.x+9][fS.y+7] = 6.710;
	  mapArray[fS.x+10][fS.y+7] = 6.711; mapArray[fS.x+11][fS.y+7] = 6.712; mapArray[fS.x+12][fS.y+7] = 6.713; mapArray[fS.x+13][fS.y+7] = 6.714; mapArray[fS.x+14][fS.y+7] = 6.715;
	  
	  // row 9
	  mapArray[fS.x+3][fS.y+8] = 6.804; mapArray[fS.x+4][fS.y+8] = 6.805;
	  mapArray[fS.x+5][fS.y+8] = 6.806; mapArray[fS.x+6][fS.y+8] = 6.807; mapArray[fS.x+7][fS.y+8] = 6.808; mapArray[fS.x+8][fS.y+8] = 6.809; mapArray[fS.x+9][fS.y+8] = 6.810;
	  mapArray[fS.x+10][fS.y+8] = 6.811; mapArray[fS.x+11][fS.y+8] = 6.812; mapArray[fS.x+12][fS.y+8] = 6.813; mapArray[fS.x+13][fS.y+8] = 6.814; mapArray[fS.x+14][fS.y+8] = 6.815;
	
	  // row 10
	  mapArray[fS.x+3][fS.y+9] = 6.904; mapArray[fS.x+4][fS.y+9] = 6.905;
	  mapArray[fS.x+5][fS.y+9] = 6.906; mapArray[fS.x+6][fS.y+9] = 6.907; mapArray[fS.x+7][fS.y+9] = 6.908; mapArray[fS.x+8][fS.y+9] = 6.909; mapArray[fS.x+9][fS.y+9] = 6.910;
	  mapArray[fS.x+10][fS.y+9] = 6.911; mapArray[fS.x+11][fS.y+9] = 6.912; mapArray[fS.x+12][fS.y+9] = 6.913; mapArray[fS.x+13][fS.y+9] = 6.914; mapArray[fS.x+14][fS.y+9] = 6.915;
	  
	  // row 11 (front of building)
	  mapArray[fS.x+4][fS.y+10] = 0.77;
	  mapArray[fS.x+5][fS.y+10] = 0.77; mapArray[fS.x+6][fS.y+10] = 0.77; mapArray[fS.x+7][fS.y+10] = 0.77; mapArray[fS.x+8][fS.y+10] = 0.77; mapArray[fS.x+9][fS.y+10] = 0.77;
	  mapArray[fS.x+10][fS.y+10] = 0.77; mapArray[fS.x+11][fS.y+10] = 0.77; mapArray[fS.x+12][fS.y+10] = 0.77; mapArray[fS.x+13][fS.y+10] = 0.77; mapArray[fS.x+14][fS.y+10] = 0.77;
	
	  // add map
	  objects['X'+(fS.x+12)+'Y'+(fS.y+2)] = {'type': 'map', 'x': (fS.x+12), 'y': (fS.y+2), 'collectable': true, 'collectItem': 'map'};
	  
	  // add cupboard
	  var cacheId = 'X'+(fS.x+6)+'Y'+(fS.y+2);
	  objects[cacheId] = {'type': 'field station', 'x': (fS.x+6), 'y': (fS.y+2)};
   if (wireAtFieldStation) {
	   var stationInventory = new Inventory(0, 0, 0, 0, 0, 0, 0, 0, 0, 'i', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0); // infinite wire
	  } else {
	   var stationInventory = new Inventory(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0); // nothing
	  }
	  caches[cacheId] = new Cupboard(stationInventory);
	  stationX = (fS.x+4); stationY = fS.y; stationW = 11; stationH = 9;
	  miniMapMarker(fS.x+7, fS.y+5, '#DD22C3');
  }

		
		// filter terrain to add advanced terrain features (not near edges of map)
	 for (var x=2, xLimit=game.mapTileCount-2; x<xLimit; x++) {
	 	for (var y=2, yLimit=game.mapTileCount-2; y<yLimit; y++) {
	 	 
	 	 // generate mountain ranges 2 (making sure these do not overlap other mountain ranges or special terrain)
	 	 if (
	 	  mapArray[x][y-1] <= 1 && mapArray[x+1][y-1] <= 1 && mapArray[x+2][y-1] <= 1
	 	  && mapArray[x][y] === 1 && mapArray[x+1][y] === 1 && mapArray[x+2][y] === 1
	 	  && mapArray[x][y+1] === 1 && mapArray[x+1][y+1] === 1 && mapArray[x+2][y+1] === 1) {
	 	  mapArray[x][y-1] = 0.87;
	 	  mapArray[x+1][y-1] = 0.87;
	 	  mapArray[x+2][y-1] = 0.87;
	 	  mapArray[x][y] = 5.1;
	 	  mapArray[x+1][y] = 5.2;
	 	  mapArray[x+2][y] = 5.3;
	 	  mapArray[x][y+1] = 5.4;
	 	  mapArray[x+1][y+1] = 5.5;
	 	  mapArray[x+2][y+1] = 5.6;
	 	  //console.log('range2 at ' + x + ', ' + y);
	 	 }

	 	 // generate mountain ranges 1
	 	 if (mapArray[x][y] === 1 && mapArray[x+1][y] === 1 && mapArray[x][y+1] === 1 && mapArray[x+1][y+1] === 1) {
	 	  mapArray[x][y] = 1.1;
	 	  mapArray[x+1][y] = 1.2;
	 	  mapArray[x][y+1] = 1.3;
	 	  mapArray[x+1][y+1] = 1.4;
	 	 }

	 	 // generate icebergs
	 	 if (mapArray[x][y] === 0 && mapArray[x+1][y] === 0 && mapArray[x][y+1] === 0 && mapArray[x+1][y+1] === 0) {
	 	  var icebergChance = randomBetween(0, 10);
	 	  if (icebergChance === 1) {
		 	  mapArray[x][y] = 3.1;
		 	  mapArray[x+1][y] = 3.2;
		 	  mapArray[x][y+1] = 3.3;
		 	  mapArray[x+1][y+1] = 3.4;
		 	 }
	 	 }

	 	 // generate caves
	 	 if (mapArray[x-1][y] === 1 && mapArray[x][y] === 1 && mapArray[x+1][y] === 1 && mapArray[x][y+1] > 0.5) {
	  	 var caveChance = randomBetween(0, 5);
	 	  if (caveChance === 1) {
		 	  mapArray[x-1][y] = 2.1; // left
		 	  mapArray[x][y] = 2.2; // entrance
		 	  mapArray[x+1][y] = 2.3; // right
		 	  mapArray[x][y+1] = 2.4; // front of entrance
		 	  var cacheId = 'X'+x+'Y'+y;
		 	  objects[cacheId] = {'type': 'cave', 'x': x, 'y': y};
		 	  var caveSlate = randomOneOf([0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2]);
		 	  var caveQuartz = randomOneOf([0, 0, 0, 0, 0, 0, 0, 1, 1, 1]);
		 	  var caveStone = randomOneOf([0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 3]);
      var caveWood = randomOneOf([0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1]);
		 	  caches[cacheId] = new Cave(new Inventory(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, caveSlate, caveQuartz, caveStone, caveWood, 0, 0, 0, 0));
		 	  //miniMapMarker(x, y, 'black');
	 	  }
	 	 }

	 	}
	 }
	 

	 // store possible tree and stone tiles (can't combine with above loop because that loop alters terrain)
  for (var x=1, xLimit=game.mapTileCount-1; x<xLimit; x++) {
	 	for (var y=1, yLimit=game.mapTileCount-1; y<yLimit; y++) {
	 	 var storeTileChance = randomBetween(0, game.mapTileSquare*10); // store fewer with larger maps
	 	 if (storeTileChance === 1) {
	  	 // store start maple, pine, alder tiles
	    if (mapArray[x][y] > startTreeMin && mapArray[x][y] < startTreeMax && typeof(objects['X'+x+'Y'+y]) === "undefined") { // typeof returns a string, so "undefined" is in quotes
	     startTreesArray.push({'x': x, 'y': y});
	    }
	  	 // store start stone tiles
	    if (mapArray[x][y] > startStoneMin && mapArray[x][y] < startStoneMax && typeof(objects['X'+x+'Y'+y]) === "undefined") {
	     startStonesArray.push({'x': x, 'y': y});
     }
    }
   }
  }
  

  // generate start trees, start stones, and berries on random tiles that are suitable (can't combine with above loop because that loop generates arrays)
  for (var x=1, xLimit=game.mapTileCount-1; x<xLimit; x++) {
	 	for (var y=1, yLimit=game.mapTileCount-1; y<yLimit; y++) {
	 	 var tileId = 'X'+x+'Y'+y;

    // start maples
		  var startMapleChance = randomBetween(0, 1400);
		  if (startMapleChance === 1) {
		   var startMapleTile = randomOneOf(startTreesArray);
		   var objectId = 'X'+startMapleTile.x+'Y'+startMapleTile.y;
		   if (typeof(objects[objectId]) === "undefined") {
		    objects[objectId] = {'type': 'tree', 'class': 'maple', 'x': startMapleTile.x, 'y': startMapleTile.y, 'flammable': true, 'collectable': true, 'collectItem': 'wood'};
		    trees[objectId] = objects[objectId];
		    //miniMapMarker(startMapleTile.x, startMapleTile.y, 'green');
		   }
		  }
		  
		  // start pines
		  var startPineChance = randomBetween(0, 1400);
		  if (startPineChance === 1) {
		   var startPineTile = randomOneOf(startTreesArray);
		   var objectId = 'X'+startPineTile.x+'Y'+startPineTile.y;
		   if (typeof(objects[objectId]) === "undefined") {
		    objects[objectId] = {'type': 'tree', 'class': 'pine', 'x': startPineTile.x, 'y': startPineTile.y, 'flammable': true, 'collectable': true, 'collectItem': 'wood'};
		    trees[objectId] = objects[objectId];
      //miniMapMarker(startPineTile.x, startPineTile.y, 'green');
		   }
		  }
		  
		  // start alders
		  var startAlderChance = randomBetween(0, 1400);
		  if (startAlderChance === 1) {
		   var startAlderTile = randomOneOf(startTreesArray);
		   var objectId = 'X'+startAlderTile.x+'Y'+startAlderTile.y;
		   if (typeof(objects[objectId]) === "undefined") {
		    objects[objectId] = {'type': 'tree', 'class': 'alder', 'x': startAlderTile.x, 'y': startAlderTile.y, 'flammable': true, 'collectable': true, 'collectItem': 'wood'};
		    trees[objectId] = objects[objectId];
      //miniMapMarker(startAlderTile.x, startAlderTile.y, 'green');
		   }
		  }
		  
		  // generate fir forests
		  if (typeof(objects[tileId]) === "undefined" && airArray[x][y] > 0.8 && mapArray[x][y] > 0.66 && mapArray[x][y] < 0.98) {
		   var birchChance = randomBetween(0, 10);
		   if (birchChance === 1) {
 	    objects[tileId] = {'type': 'tree', 'class': 'birch', 'chopped': 0, 'flagged': false, 'x': x, 'y': y, 'flammable': true};
 	   } else {
 	    objects[tileId] = {'type': 'tree', 'class': 'fir', 'chopped': 0, 'flagged': false, 'x': x, 'y': y, 'flammable': true};
 	   }
	    //trees['X' + x + 'Y' + y] = {'type': 'tree', 'class': 'fir', 'x': x, 'y': y, 'flammable': true}; // slows game loading
	 	 }
	 	 
	 	 // generate berries
	 	 if (mapArray[x][y] > berriesMin && mapArray[x][y] <= berriesMax) {
	 	  var berriesChance = randomBetween(0, 10);
	 	  if (berriesChance === 1) {
	 	   objects[tileId] = {'type': 'berries', 'x': x, 'y': y, 'flammable': true, 'collectable': true, 'collectItem': 'berries'};
	 	  }
	 	 }

	 	 // generate bones
	 	 /*
	 	 if (mapArray[x][y] > boneMin && mapArray[x][y] <= boneMax) {
	 	  var boneChance = randomBetween(0, 150);
	 	  if (boneChance === 1) {
	 	   objects[tileId] = {'type': 'bone', 'x': x, 'y': y, 'collectable': true, 'collectItem': 'bone'};
	 	  }
	 	 }
	 	 */

	 	 // generate shells
	 	 if ((x < 8 || x > game.mapTileCount-8 || y < 8 || y > game.mapTileCount-8) && mapArray[x][y] > shellMin && mapArray[x][y] <= shellMax) {
	 	  var shellChance = randomBetween(0, 40);
	 	  if (shellChance === 1) {
	 	   objects[tileId] = {'type': 'shell', 'x': x, 'y': y, 'collectable': true, 'collectItem': 'shell'};
	 	  }
	 	 }

		  // start stones
		  var startStoneChance = randomBetween(0, 500); // was 800
		  if (startStoneChance === 1) {
		   var startStoneTile = randomOneOf(startStonesArray);
		   var objectId = 'X'+startStoneTile.x+'Y'+startStoneTile.y;
		   if (typeof(objects[objectId]) === "undefined") {
		    objects[objectId] = {'type': 'stone', 'class': 'stone1', 'x': startStoneTile.x, 'y': startStoneTile.y, 'collectable': true, 'collectItem': 'stone'};
		   }
		  }

   }
  }
  

  // iterate over trees to grow clusters of trees
  for (var n=0; n<3; n++) {
		 for (var tree in trees) {
    var newTreeTile = getRandomAdjacentTerrainTile(trees[tree].x, trees[tree].y, newTreeMin, newTreeMax);
    if (newTreeTile) {
     var objectId = 'X'+newTreeTile.x+'Y'+newTreeTile.y;
     objects[objectId] = {'type': 'tree', 'class': trees[tree].class, 'x': newTreeTile.x, 'y': newTreeTile.y, 'flammable': true, 'collectable': true, 'collectItem': 'wood'};
     trees[objectId] = objects[objectId];
    }
   }
  }
	 // remove random trees to create gaps
  for (var d=0, dLimit = 30*game.mapTileMultiplier; d<dLimit; d++) {
   var removeTree = randomProperty(trees);
   if (typeof(removeTree) !== "undefined"){
    delete objects[removeTree];
    delete trees[removeTree];
   }
  }

  
  // store possible start tiles, new stone tiles, new berries tiles, new shells tiles
  for (var x=3, xLimit=game.mapTileCount-3; x<xLimit; x++) {
	 	for (var y=3, yLimit=game.mapTileCount-3; y<yLimit; y++) {
	 	 var storeTileChance = randomBetween(0, game.mapTileSquare*10); // store fewer with larger maps
	 	 if (storeTileChance === 1) {
	 	  if (start.tile.x === false || start.tile.y === false) {
		    if (
		     // store possible start tiles
		     mapArray[x][y] > you.walk.min && mapArray[x][y] <= you.walk.max && typeof(objects['X'+x+'Y'+y]) === "undefined"
		     // check row above
		     && mapArray[x-1][y-1] > you.walk.min && mapArray[x-1][y-1] <= you.walk.max && typeof(objects['X'+(x-1)+'Y'+(y-1)]) === "undefined"
		     && mapArray[x][y-1] > you.walk.min && mapArray[x][y-1] <= you.walk.max && typeof(objects['X'+x+'Y'+(y-1)]) === "undefined"
		     && mapArray[x+1][y-1] > you.walk.min && mapArray[x+1][y-1] <= you.walk.max && typeof(objects['X'+(x+1)+'Y'+(y-1)]) === "undefined"
		     // check either side
		     && mapArray[x-1][y] > you.walk.min && mapArray[x-1][y] <= you.walk.max && typeof(objects['X'+(x-1)+'Y'+y]) === "undefined"
		     && mapArray[x+1][y] > you.walk.min && mapArray[x+1][y] <= you.walk.max && typeof(objects['X'+(x+1)+'Y'+y]) === "undefined"
		     // check row below
		     && mapArray[x-1][y+1] > you.walk.min && mapArray[x-1][y+1] <= you.walk.max && typeof(objects['X'+(x-1)+'Y'+(y+1)]) === "undefined"
		     && mapArray[x][y+1] > you.walk.min && mapArray[x][y+1] <= you.walk.max && typeof(objects['X'+x+'Y'+(y+1)]) === "undefined"
		     && mapArray[x+1][y+1] > you.walk.min && mapArray[x+1][y+1] <= you.walk.max && typeof(objects['X'+(x+1)+'Y'+(y+1)]) === "undefined"
		     ) {
		     startTilesArray.push({'x': x, 'y': y});
		    }
	    }
	  	 // store newStones tiles
	    if (mapArray[x][y] > newStoneMin && mapArray[x][y] < newStoneMax) {
	     newStonesArray.push({'x': x, 'y': y});
	    }
	    // store newBerries tiles
	    if (mapArray[x][y] > berriesMin && mapArray[x][y] < berriesMax) {
	     newBerriesArray.push({'x': x, 'y': y});
	    }
	    // store newShells tiles
	    if ((x < 8 || x > game.mapTileCount-8 || y < 8 || y > game.mapTileCount-8) && mapArray[x][y] > shellMin && mapArray[x][y] <= shellMax) {
	     newShellsArray.push({'x': x, 'y': y});
     }
    }
   }
  }
  
  
  // generate binoculars on a random tile (use berries tiles)
  var startBinocularsTile = randomOneOf(newBerriesArray);
  if (startBinocularsTile) {
   // overwrite existing objects
	  objects['X'+startBinocularsTile.x+'Y'+startBinocularsTile.y] = {'type': 'binoculars', 'x': startBinocularsTile.x, 'y': startBinocularsTile.y, 'collectable': true, 'collectItem': 'binoculars'};
	  //miniMapMarker(startBinocularsTile.x, startBinocularsTile.y, '#4afff9');
	 }

	 
	 // set large unused variables to null to reclaim memory
	 // note: use delete for properties, set to null for variables
	 // see: http://stackoverflow.com/questions/5181954/memory-leak-in-javascript-chrome
	 // also: http://stackoverflow.com/questions/742623/deleting-objects-in-javascript
	 // also: http://stackoverflow.com/questions/4523172/freeing-javascript-object
	 mapData = null;
	 airData = null;
	 startTreesArray = null;
	 startStonesArray = null;
 }
 


 // update map with generated objects (called with each step)
	function updateMap() {
	
	 // trees spread to nearby tiles that are suitable for trees; seedlings grow into trees
  var treeSpreadChance = randomBetween(0, 10);
  if (treeSpreadChance === 1) {
   var treeToSeed = randomProperty(trees);
   if (treeToSeed) {
	   // if seedling, grow into tree
	   if (typeof(objects[treeToSeed]) !== "undefined") {
		   if (objects[treeToSeed].class === 'mapleSeedling') {
		    objects[treeToSeed].class = 'maple';
		    trees[treeToSeed].class = 'maple';
		   }
		   if (objects[treeToSeed].class === 'pineSeedling') {
		    objects[treeToSeed].class = 'pine';
		    trees[treeToSeed].class = 'pine';
		   }
		   if (objects[treeToSeed].class === 'alderSeedling') {
		    objects[treeToSeed].class = 'alder';
		    trees[treeToSeed].class = 'alder';
		   }
		
		   // if newTreeTile is suitable, add new tree
		   var newTreeTile = getRandomAdjacentTerrainTile(trees[treeToSeed].x, trees[treeToSeed].y, newTreeMin, newTreeMax);
		   if (newTreeTile) {
		    var objectId = 'X'+newTreeTile.x+'Y'+newTreeTile.y;
		    if (trees[treeToSeed].class === 'maple' || trees[treeToSeed].class === 'mapleSeedling') {
		     objects[objectId] = {'type': 'tree', 'class': 'mapleSeedling', 'x': newTreeTile.x, 'y': newTreeTile.y, 'flammable': true, 'collectable': true, 'collectItem': 'wood'};
		     trees[objectId] = objects[objectId];
		     
		    } else if (trees[treeToSeed].class === 'pine' || trees[treeToSeed].class === 'pineSeedling') {
		     objects[objectId] = {'type': 'tree', 'class': 'pineSeedling', 'x': newTreeTile.x, 'y': newTreeTile.y, 'flammable': true, 'collectable': true, 'collectItem': 'wood'};
		     trees[objectId] = objects[objectId];
		     
		    } else if (trees[treeToSeed].class === 'alder' || trees[treeToSeed].class === 'alderSeedling') {
		     objects[objectId] = {'type': 'tree', 'class': 'alderSeedling', 'x': newTreeTile.x, 'y': newTreeTile.y, 'flammable': true, 'collectable': true, 'collectItem': 'wood'};
		     trees[objectId] = objects[objectId];
		    }
		    //miniMapMarker(newTreeTile.x, newTreeTile.y, 'green');
		   }
	   }
	  }
	 }
  

  // stones appear on random tiles that are suitable for stones
  var newStoneChance = randomBetween(0, 40);
  if (newStoneChance === 1) {
   var newStoneTile = randomOneOf(newStonesArray);
   if (newStoneTile) {
    var objectId = 'X'+newStoneTile.x+'Y'+newStoneTile.y;
	   if (typeof(objects[objectId]) === "undefined") {
	    objects[objectId] = {'type': 'stone', 'class': 'stone2', 'x': newStoneTile.x, 'y': newStoneTile.y, 'collectable': true, 'collectItem': 'stone'};
	   }
	  }
  }


  // berries appear on random tiles that are suitable for berries
  var newBerriesChance = randomBetween(0, 40);
  if (newBerriesChance === 1) {
   var newBerriesTile = randomOneOf(newBerriesArray);
   if (newBerriesTile) {
    var objectId = 'X'+newBerriesTile.x+'Y'+newBerriesTile.y;
	   if (typeof(objects[objectId]) === "undefined") {
	    objects[objectId] = {'type': 'berries', 'x': newBerriesTile.x, 'y': newBerriesTile.y, 'flammable': true, 'collectable': true, 'collectItem': 'berries'};
	   }
   }
  }
  

  // shells appear on random tiles that are suitable for shells
  var newShellChance = randomBetween(0, 100);
  if (newShellChance === 1) {
   var newShellTile = randomOneOf(newShellsArray);
   if (newShellTile) {
    var objectId = 'X'+newShellTile.x+'Y'+newShellTile.y;
	   if (typeof(objects[objectId]) === "undefined") {
	    objects[objectId] = {'type': 'shell', 'x': newShellTile.x, 'y': newShellTile.y, 'collectable': true, 'collectItem': 'shell'};
	   }
   }
  }
 
 
  // chance for snares to catch rabbits, if they are a certain distance from player
  var snareTriggerChance = randomBetween(0, 40);
  if (snareTriggerChance === 1) {
   var snareId = randomProperty(snares);
   if (snareId) {
	   if (typeof(objects[snareId]) !== "undefined") {
				 // if snare is a certain distance from player
				 var snareDistance = getDistance(snares[snareId], you.tile);
	    if (snareDistance > 25) {
	     delete objects[snareId];
	     objects[snareId] = {'type': 'rabbit', 'x': snares[snareId].x, 'y': snares[snareId].y, 'collectable': true, 'collectItem': 'rabbit'};
	     delete snares[snareId];
	    }
	   }
   }
  }

	} // end updateMap
 
 
 
	// random function to offset map center
	function displace(num) {
		var max = num / (game.mapSize + game.mapSize) * game.roughness;
		return (Math.random() - 0.5) * max;
	}
	
	// normalize a value to make sure it is within bounds
	function normalize(value) {
		if (value > 1) {
			value = 1;
		} else if (value < 0) {
			value = 0;
		}
		return value;
	}
	
	// round to the nearest pixel
	function round(n) {
		if (n-(parseInt(n)) >= 0.5) {
			return parseInt(n)+1;
		} else {
			return parseInt(n);
		}
	}
	


	// terrain generation
	function midpointDisplacement(dataObject, dimension) {
		var newDimension = dimension / 2, top, topRight, topLeft, bottom, bottomLeft, bottomRight, right, left, center, i, j;
		
		if (newDimension > game.mapFraction) {
			for (var i=newDimension; i<=game.mapSize; i+=newDimension) {
				for (var j=newDimension; j<=game.mapSize; j+=newDimension) {
					x = i - (newDimension / 2);
					y = j - (newDimension / 2);
					
					topLeft = dataObject[i - newDimension][j - newDimension];
					topRight = dataObject[i][j - newDimension];
					bottomLeft = dataObject[i - newDimension][j];
					bottomRight = dataObject[i][j];
					
					// center				
					dataObject[x][y] = (topLeft + topRight + bottomLeft + bottomRight) / 4 + displace(dimension);
					dataObject[x][y] = normalize(dataObject[x][y]);
					center = dataObject[x][y];	
					
					// top
					if (j - (newDimension * 2) + (newDimension / 2) > 0) {
						dataObject[x][j - newDimension] = (topLeft + topRight + center + dataObject[x][j - dimension + (newDimension / 2)]) / 4 + displace(dimension);
					} else {
						dataObject[x][j - newDimension] = (topLeft + topRight + center) / 3+ displace(dimension);
					}
					
					dataObject[x][j - newDimension] = normalize(dataObject[x][j - newDimension]);
			
					// bottom
					if (j + (newDimension / 2) < game.mapSize) {
						dataObject[x][j] = (bottomLeft + bottomRight + center + dataObject[x][j + (newDimension / 2)]) / 4+ displace(dimension);
					} else {
						dataObject[x][j] = (bottomLeft + bottomRight + center) / 3+ displace(dimension);
					}
					
					dataObject[x][j] = normalize(dataObject[x][j]);

					// right
					if (i + (newDimension / 2) < game.mapSize) {
						dataObject[i][y] = (topRight + bottomRight + center + dataObject[i + (newDimension / 2)][y]) / 4+ displace(dimension);
					} else {
						dataObject[i][y] = (topRight + bottomRight + center) / 3+ displace(dimension);
					}
					
					dataObject[i][y] = normalize(dataObject[i][y]);
					
					// left
					if (i - (newDimension * 2) + (newDimension / 2) > 0) {
						dataObject[i - newDimension][y] = (topLeft + bottomLeft + center + dataObject[i - dimension + (newDimension / 2)][y]) / 4 + displace(dimension);
					} else {
						dataObject[i - newDimension][y] = (topLeft + bottomLeft + center) / 3+ displace(dimension);
					}
					
					dataObject[i - newDimension][y] = normalize(dataObject[i - newDimension][y]);
				}
			}
			midpointDisplacement(dataObject, newDimension);
		}
	}



 // draw an ellipse
 // source: http://www.williammalone.com/briefs/how-to-draw-ellipse-html5-canvas/
 function drawEllipse(context, centerX, centerY, width, height, fillStyle) {
  context.beginPath();
  context.moveTo(centerX, centerY - height/2); // A1
  context.bezierCurveTo(
   centerX + width/2, centerY - height/2, // C1
   centerX + width/2, centerY + height/2, // C2
   centerX, centerY + height/2); // A2
  context.bezierCurveTo(
   centerX - width/2, centerY + height/2, // C3
   centerX - width/2, centerY - height/2, // C4
   centerX, centerY - height/2); // A1
  context.fillStyle = fillStyle;
  context.fill();
  context.closePath();
 }



 // draw map canvas
 // mapData contains values from [0][0] to [game.mapSize][game.mapSize] ([2048][2048]) at steps of [game.tileSize][game.tileSize], representing raw terrain data
 // mapArray contains values from [0][0] to [(game.mapSize/game.tileSize)-1][(game.mapSize/game.tileSize)-1] ([127][127]), representing tile data.
	function drawMap() {
	 var drawTime = clockTime();
	 var frameMod2 = frameCount%2; // repeats 0,1
	 var frameMod3 = frameCount%3; // repeats 0-2
	 var frameMod9 = frameCount%9; // repeats 0-8
	 var frameMod15 = frameCount%15; // repeats 0-14
		var frameMod30 = frameCount%30; // repeats 0-29
		
		// for testing stone and tree generation (lots of steps)
		//stepCount++; updateMap();
		
		you.status.active--;
		
		// remove 'increasing' class from $energyBar every 3 frames (so that it blinks out quickly)
		if (frameMod3 === 1 && $energyBar.hasClass('increasing')) { $energyBar.removeClass(); }
		
		// if at cache or on platform and not on zip or helicopter, check if energy is supplied
		if ((you.on.cache || you.on.platform) && you.on.zip === false && you.on.helicopter === false) {
		 
		 // if at camp
		 if (you.on.cache) {
		  if (caches[you.on.cache].energy) {
			  you.status.cold = false;
			  you.updateEnergy();
				 if (caches[you.on.cache].energy.now > 0 && you.energy.now < you.energy.max) {
				  if (frameMod3 === 1) {
		 		  caches[you.on.cache].updateEnergy(-1);
			 	  you.updateEnergy(1);
			 	 }
		 	 }
			 }
			
			// else if on platform with roof
			} else if (you.on.platform) {
			 if (platforms[you.on.platform].roof === true) {
			  you.status.cold = false;
		   you.updateEnergy();
				 if (platforms[you.on.platform].platformEnergy > 0 && you.energy.now < you.energy.max) {
				  if (frameMod3 === 1) {
		 		  platforms[you.on.platform].platformEnergy -= 2;
			 	  you.updateEnergy(2);
			 	 }
				 }
			 }
			}
		}
		
		// if player has no energy and stops moving, chance to fall asleep
		if (you.energy.now <= 0 && you.status.active < 0 && you.status.sleep <= 0) {
	  you.updateSleep();
	 }


  if (redrawTerrain) {
   drawTerrain();
   redrawTerrain = false;
  }


  // sprites layer
  // sprite sheet uses drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
	 
	 // clear sprites canvas
	 contextSprites.clearRect(0, 0, game.mapCanvasW, game.mapCanvasH);

  for (var x=0; x<=game.mapCanvasTileW; x++) {
   for (var y=0; y<=game.mapCanvasTileH; y++) {
    if (typeof(mapArray[x+mapOffsetX]) !== "undefined" && x+mapOffsetX < game.mapTileCount) {
     if (typeof(mapArray[x+mapOffsetX][y+mapOffsetY]) !== "undefined" && y+mapOffsetY < game.mapTileCount) {
      var thisTile = mapArray[x+mapOffsetX][y+mapOffsetY];

      // waves 1
      if (thisTile <= 0.01) {
       if (frameMod30 <= 2) {
        contextSprites.drawImage(sprites1x1['waves1Canvas'], x*game.tileSize, y*game.tileSize);
       } else if (frameMod30 <= 5) {
        contextSprites.drawImage(sprites1x1['waves2Canvas'], x*game.tileSize, y*game.tileSize);
       } else if (frameMod30 <= 8) {
        contextSprites.drawImage(sprites1x1['waves3Canvas'], x*game.tileSize, y*game.tileSize);
       } else if (frameMod30 <= 11) {
        contextSprites.drawImage(sprites1x1['waves4Canvas'], x*game.tileSize, y*game.tileSize);
       } else if (frameMod30 <= 14) {
        contextSprites.drawImage(sprites1x1['waves5Canvas'], x*game.tileSize, y*game.tileSize);
       } else if (frameMod30 <= 17) {
        contextSprites.drawImage(sprites1x1['waves6Canvas'], x*game.tileSize, y*game.tileSize);
       } else if (frameMod30 <= 20) {
        contextSprites.drawImage(sprites1x1['waves7Canvas'], x*game.tileSize, y*game.tileSize);
       } else if (frameMod30 <= 23) {
        contextSprites.drawImage(sprites1x1['waves8Canvas'], x*game.tileSize, y*game.tileSize);
       } else if (frameMod30 <= 26) {
        contextSprites.drawImage(sprites1x1['waves9Canvas'], x*game.tileSize, y*game.tileSize);
       } else if (frameMod30 <= 29) {
        contextSprites.drawImage(sprites1x1['waves10Canvas'], x*game.tileSize, y*game.tileSize);
       }
      
      // waves 2
      } else if (thisTile > 0.01 && thisTile <= 0.03) {
       if (frameMod30 <= 2) {
        contextSprites.drawImage(sprites1x1['waves6Canvas'], x*game.tileSize, y*game.tileSize);
       } else if (frameMod30 <= 5) {
        contextSprites.drawImage(sprites1x1['waves7Canvas'], x*game.tileSize, y*game.tileSize);
       } else if (frameMod30 <= 8) {
        contextSprites.drawImage(sprites1x1['waves8Canvas'], x*game.tileSize, y*game.tileSize);
       } else if (frameMod30 <= 11) {
        contextSprites.drawImage(sprites1x1['waves9Canvas'], x*game.tileSize, y*game.tileSize);
       } else if (frameMod30 <= 14) {
        contextSprites.drawImage(sprites1x1['waves10Canvas'], x*game.tileSize, y*game.tileSize);
       } else if (frameMod30 <= 17) {
        contextSprites.drawImage(sprites1x1['waves1Canvas'], x*game.tileSize, y*game.tileSize);
       } else if (frameMod30 <= 20) {
        contextSprites.drawImage(sprites1x1['waves2Canvas'], x*game.tileSize, y*game.tileSize);
       } else if (frameMod30 <= 23) {
        contextSprites.drawImage(sprites1x1['waves3Canvas'], x*game.tileSize, y*game.tileSize);
       } else if (frameMod30 <= 26) {
        contextSprites.drawImage(sprites1x1['waves4Canvas'], x*game.tileSize, y*game.tileSize);
       } else if (frameMod30 <= 29) {
        contextSprites.drawImage(sprites1x1['waves5Canvas'], x*game.tileSize, y*game.tileSize);
       }
      
      // waves 3
      } else if (thisTile > 0.03 && thisTile <= 0.05) {
       if (frameMod30 <= 2) {
        contextSprites.drawImage(sprites1x1['waves3Canvas'], x*game.tileSize, (y*game.tileSize)-4);
        contextSprites.drawImage(sprites1x1['waves8Canvas'], (x*game.tileSize)-1, (y*game.tileSize)+4);
       } else if (frameMod30 <= 5) {
        contextSprites.drawImage(sprites1x1['waves4Canvas'], x*game.tileSize, (y*game.tileSize)-4);
        contextSprites.drawImage(sprites1x1['waves9Canvas'], (x*game.tileSize)-1, (y*game.tileSize)+4);
       } else if (frameMod30 <= 8) {
        contextSprites.drawImage(sprites1x1['waves5Canvas'], x*game.tileSize, (y*game.tileSize)-4);
        contextSprites.drawImage(sprites1x1['waves10Canvas'], (x*game.tileSize)-1, (y*game.tileSize)+4);
       } else if (frameMod30 <= 11) {
        contextSprites.drawImage(sprites1x1['waves6Canvas'], x*game.tileSize, (y*game.tileSize)-4);
        contextSprites.drawImage(sprites1x1['waves1Canvas'], (x*game.tileSize)-1, (y*game.tileSize)+4);
       } else if (frameMod30 <= 14) {
        contextSprites.drawImage(sprites1x1['waves7Canvas'], x*game.tileSize, (y*game.tileSize)-4);
        contextSprites.drawImage(sprites1x1['waves2Canvas'], (x*game.tileSize)-1, (y*game.tileSize)+4);
       } else if (frameMod30 <= 17) {
        contextSprites.drawImage(sprites1x1['waves8Canvas'], x*game.tileSize, (y*game.tileSize)-4);
        contextSprites.drawImage(sprites1x1['waves3Canvas'], (x*game.tileSize)-1, (y*game.tileSize)+4);
       } else if (frameMod30 <= 20) {
        contextSprites.drawImage(sprites1x1['waves9Canvas'], x*game.tileSize, (y*game.tileSize)-4);
        contextSprites.drawImage(sprites1x1['waves4Canvas'], (x*game.tileSize)-1, (y*game.tileSize)+4);
       } else if (frameMod30 <= 23) {
        contextSprites.drawImage(sprites1x1['waves10Canvas'], x*game.tileSize, (y*game.tileSize)-4);
        contextSprites.drawImage(sprites1x1['waves5Canvas'], (x*game.tileSize)-1, (y*game.tileSize)+4);
       } else if (frameMod30 <= 26) {
        contextSprites.drawImage(sprites1x1['waves1Canvas'], x*game.tileSize, (y*game.tileSize)-4);
        contextSprites.drawImage(sprites1x1['waves6Canvas'], (x*game.tileSize)-1, (y*game.tileSize)+4);
       } else if (frameMod30 <= 29) {
        contextSprites.drawImage(sprites1x1['waves2Canvas'], x*game.tileSize, (y*game.tileSize)-4);
        contextSprites.drawImage(sprites1x1['waves7Canvas'], (x*game.tileSize)-1, (y*game.tileSize)+4);
       }
      }
       
       // was drawing mountains, etc. here

     }
    }
   } // end y loop
  } // end x loop
  
  // clear cover canvas
	 contextCover.clearRect(0, 0, game.mapCanvasW, game.mapCanvasH);

  // this loop was originally for all larger terrain, now just for cover layer
  // tiles larger than 1x1; buffer 15 tiles because of field station
  for (var x=-15, xLimit=game.mapCanvasTileW+15; x<=xLimit; x++) {
   for (var y=-15, yLimit=game.mapCanvasTileH+15; y<=yLimit; y++) {
    if (typeof(mapArray[x+mapOffsetX]) !== "undefined" && x+mapOffsetX < game.mapTileCount) {
     if (typeof(mapArray[x+mapOffsetX][y+mapOffsetY]) !== "undefined" && y+mapOffsetY < game.mapTileCount) {
      var thisTile = mapArray[x+mapOffsetX][y+mapOffsetY];
      
      // crash
      if (thisTile === 4.10) {
       contextCover.drawImage(sprites9x6['crashCoverCanvas'], (x-3)*game.tileSize, (y-3)*game.tileSize);
       //contextTerrain.drawImage(sprites9x6['crashCanvas'], (x-3)*game.tileSize, y*game.tileSize);
      
      // mountain range 2
      } else if (thisTile === 5.1) {
       contextCover.drawImage(sprites3x3['range2CoverCanvas'], x*game.tileSize, (y-1)*game.tileSize);
       //contextTerrain.drawImage(sprites3x3['range2Canvas'], x*game.tileSize, y*game.tileSize);
       
      // field station
      } else if (thisTile === 6.001) {
       // if player is inside station and not on zip, do not draw roof
       if (you.tile.x >= stationX && you.tile.x < (stationX*1+stationW) && you.tile.y >= stationY && you.tile.y < (stationY*1+stationH) && you.on.zip === false && you.on.helicopter === false) {
        //contextTerrain.drawImage(sprites15x10['fieldStationCanvas'], x*game.tileSize, y*game.tileSize);
       } else {
        contextCover.drawImage(sprites15x10['fieldStationCoverCanvas'], x*game.tileSize, y*game.tileSize);
        //contextTerrain.drawImage(sprites15x10['fieldStationCanvas'], x*game.tileSize, y*game.tileSize);
       }

      }

     }
    }
   } // end y loop
  } // end x loop

  for (var x=0; x<=game.mapCanvasTileW; x++) {
   for (var y=0; y<=game.mapCanvasTileH; y++) {
    if (typeof(mapArray[x+mapOffsetX]) !== "undefined" && x+mapOffsetX < game.mapTileCount) {
     if (typeof(mapArray[x+mapOffsetX][y+mapOffsetY]) !== "undefined" && y+mapOffsetY < game.mapTileCount) {
      var thisObject = objects['X'+(x+mapOffsetX)+'Y'+(y+mapOffsetY)];
      var thisHole = holes['X'+(x+mapOffsetX)+'Y'+(y+mapOffsetY)];
      
      // holes are separate loop
      if (typeof(thisHole) !== "undefined") {
        if (thisHole.class === 1) {
         contextSprites.drawImage(sprites1x1['hole1Canvas'], x*game.tileSize, y*game.tileSize);
        } else if (thisHole.class === 2) {
         contextSprites.drawImage(sprites1x1['hole2Canvas'], x*game.tileSize, y*game.tileSize);
        } else if (thisHole.class === 3) {
         contextSprites.drawImage(sprites1x1['hole3Canvas'], x*game.tileSize, y*game.tileSize);
        } else if (thisHole.class === 4) {
         contextSprites.drawImage(sprites1x1['hole4Canvas'], x*game.tileSize, y*game.tileSize);
        }
       }
      
      if (typeof(thisObject) !== "undefined") {
      
	      // small trees (maple, pine, alder)
	      if (thisObject.type === 'tree') {
	       if (thisObject.class === 'mapleSeedling') {
	        contextSprites.drawImage(sprites1x1['mapleSeedlingCanvas'], x*game.tileSize, y*game.tileSize);
	       } else if (thisObject.class === 'pineSeedling') {
	        contextSprites.drawImage(sprites1x1['pineSeedlingCanvas'], x*game.tileSize, y*game.tileSize);
	       } else if (thisObject.class === 'alderSeedling') {
	        contextSprites.drawImage(sprites1x1['alderSeedlingCanvas'], x*game.tileSize, y*game.tileSize);
	       } else if (thisObject.class === 'maple') {
	        contextSprites.drawImage(sprites1x1['mapleTreeCanvas'], x*game.tileSize, y*game.tileSize);
	       } else if (thisObject.class === 'pine') {
	        contextSprites.drawImage(sprites1x1['pineTreeCanvas'], x*game.tileSize, y*game.tileSize);
	       } else if (thisObject.class === 'alder') {
	        contextSprites.drawImage(sprites1x1['alderTreeCanvas'], x*game.tileSize, y*game.tileSize);
	       } else if (thisObject.class === 'stump') {
	        contextSprites.drawImage(sprites1x1['stumpCanvas'], x*game.tileSize, y*game.tileSize);
	       }
	      
	      // found stones
	      } else if (thisObject.type === 'stone') {
	       if (thisObject.class === 'stone1') {
	        contextSprites.drawImage(sprites1x1['stone1Canvas'], x*game.tileSize, y*game.tileSize);
	       } else if (thisObject.class === 'stone2') {
	        contextSprites.drawImage(sprites1x1['stone2Canvas'], x*game.tileSize, y*game.tileSize);
	       }

	      // berries
	      } else if (thisObject.type === 'berries') {
	       contextSprites.drawImage(sprites1x1['berriesCanvas'], x*game.tileSize, y*game.tileSize);
	      
	      // bones
	      } else if (thisObject.type === 'bone') {
	       contextSprites.drawImage(sprites1x1['boneCanvas'], x*game.tileSize, y*game.tileSize);

	      // ice
	      } else if (thisObject.type === 'ice') {
	       contextSprites.drawImage(sprites1x1['iceCanvas'], x*game.tileSize, y*game.tileSize);
	      
	      // shells
	      } else if (thisObject.type === 'shell') {
	       contextSprites.drawImage(sprites1x1['shellCanvas'], x*game.tileSize, y*game.tileSize);

	      // quartz
	      } else if (thisObject.type === 'quartz') {
	       contextSprites.drawImage(sprites1x1['quartzCanvas'], x*game.tileSize, y*game.tileSize);
	      
	      // stepstones
	      } else if (thisObject.type === 'stepstone') {
	       if (thisObject.timer > 0) {
	        thisObject.timer = thisObject.timer*1 - game.loopRate;
	        var sinkPercent = thisObject.timer / stepStoneSink * 100;
	        if (sinkPercent >= 90) {
	         contextSprites.drawImage(sprites1x1['stepStone1Canvas'], x*game.tileSize, y*game.tileSize);
	        } else if (sinkPercent >= 80) {
	         contextSprites.drawImage(sprites1x1['stepStone2Canvas'], x*game.tileSize, y*game.tileSize);
	        } else if (sinkPercent >= 70) {
	         contextSprites.drawImage(sprites1x1['stepStone3Canvas'], x*game.tileSize, y*game.tileSize);
	        } else if (sinkPercent >= 60) {
	         contextSprites.drawImage(sprites1x1['stepStone4Canvas'], x*game.tileSize, y*game.tileSize);
	        } else if (sinkPercent >= 50) {
	         contextSprites.drawImage(sprites1x1['stepStone5Canvas'], x*game.tileSize, y*game.tileSize);
	        } else if (sinkPercent >= 40) {
	         contextSprites.drawImage(sprites1x1['stepStone6Canvas'], x*game.tileSize, y*game.tileSize);
	        } else if (sinkPercent >= 30) {
	         contextSprites.drawImage(sprites1x1['stepStone7Canvas'], x*game.tileSize, y*game.tileSize);
	        } else if (sinkPercent >= 20) {
	         contextSprites.drawImage(sprites1x1['stepStone8Canvas'], x*game.tileSize, y*game.tileSize);
	        } else if (sinkPercent >= 10) {
	         contextSprites.drawImage(sprites1x1['stepStone9Canvas'], x*game.tileSize, y*game.tileSize);
	        } else if (sinkPercent >= 0) {
	         contextSprites.drawImage(sprites1x1['stepStone10Canvas'], x*game.tileSize, y*game.tileSize);
	        }
	       } else {
	        // stepstone sinks; if you is on this tile, falls in water
	        delete objects['X'+(x+mapOffsetX)+'Y'+(y+mapOffsetY)];
	        if (x+mapOffsetX === you.tile.x && y+mapOffsetY === you.tile.y) {
	         you.on.water = true;
	         you.status.cold = true;
	         you.updateEnergy();
	        }
	        
	       }
	      
	      // bridges
	      } else if (thisObject.type === 'bridge') {
	       contextSprites.drawImage(sprites1x1['bridgeCanvas'], x*game.tileSize, y*game.tileSize);
	      
	      // snares
	      } else if (thisObject.type === 'snare') {
	       contextSprites.drawImage(sprites1x1['snareCanvas'], x*game.tileSize, y*game.tileSize);
	      
	      // rabbits
	      } else if (thisObject.type === 'rabbit') {
	       contextSprites.drawImage(sprites1x1['snareRabbitCanvas'], x*game.tileSize, y*game.tileSize);
	      
	      // map
	      } else if (thisObject.type === 'map') {
	       contextSprites.drawImage(sprites1x1['mapCanvas'], x*game.tileSize, y*game.tileSize);

	      // binoculars
	      } else if (thisObject.type === 'binoculars') {
	       contextSprites.drawImage(sprites1x1['binocularsCanvas'], x*game.tileSize, y*game.tileSize);
	
	      // backpack
	      } else if (thisObject.type === 'backpack') {
	       contextSprites.drawImage(sprites1x1['backpackCanvas'], x*game.tileSize, y*game.tileSize);
	      
	      // radio
	      } else if (thisObject.type === 'radio') {
	       contextSprites.drawImage(sprites1x1['radioCanvas'], x*game.tileSize, y*game.tileSize);

	      }

      }
     }
    }
   } // end y loop
  } // end x loop


  // tiles larger than 1x1; buffer 9 tiles (was 4 before helicopter)
  for (var x=-9, xLimit=game.mapCanvasTileW+9; x<=xLimit; x++) {
   for (var y=-9, yLimit=game.mapCanvasTileH+9; y<=yLimit; y++) {
    if (typeof(mapArray[x+mapOffsetX]) !== "undefined" && x+mapOffsetX < game.mapTileCount) {
     if (typeof(mapArray[x+mapOffsetX][y+mapOffsetY]) !== "undefined" && y+mapOffsetY < game.mapTileCount) {
      var thisObject = objects['X'+(x+mapOffsetX)+'Y'+(y+mapOffsetY)];
      if (typeof(thisObject) !== "undefined") {
      
	      // large trees (fir)
	      if (thisObject.type === 'tree') {
	       if (thisObject.class === 'fir') {
	        if (thisObject.chopped === 0) {
	         contextCover.drawImage(sprites1x2['firCoverCanvas'], x*game.tileSize, (y-1)*game.tileSize);
	         contextSprites.drawImage(sprites1x2['firCanvas'], x*game.tileSize, y*game.tileSize);
	        } else if (thisObject.chopped === 1) {
	         contextCover.drawImage(sprites1x2['firChopped1CoverCanvas'], x*game.tileSize, (y-1)*game.tileSize);
	         contextSprites.drawImage(sprites1x2['firChopped1Canvas'], x*game.tileSize, y*game.tileSize);
	        } else if (thisObject.chopped === 2) {
	         contextCover.drawImage(sprites1x2['firChopped2CoverCanvas'], x*game.tileSize, (y-1)*game.tileSize);
	         contextSprites.drawImage(sprites1x2['firChopped2Canvas'], x*game.tileSize, y*game.tileSize);
	        } else if (thisObject.chopped === 3) {
	         contextCover.drawImage(sprites1x2['firChopped3CoverCanvas'], x*game.tileSize, (y-1)*game.tileSize);
	         contextSprites.drawImage(sprites1x2['firChopped3Canvas'], x*game.tileSize, y*game.tileSize);
	        } else if (thisObject.chopped === 4) {
	         contextCover.drawImage(sprites1x2['firChopped4CoverCanvas'], x*game.tileSize, (y-1)*game.tileSize);
	         contextSprites.drawImage(sprites1x2['firChopped4Canvas'], x*game.tileSize, y*game.tileSize);
	        } else {
	         contextCover.drawImage(sprites1x2['firChopped5CoverCanvas'], x*game.tileSize, (y-1)*game.tileSize);
	         contextSprites.drawImage(sprites1x2['firChopped5Canvas'], x*game.tileSize, y*game.tileSize);
	        }
	       } else if (thisObject.class === 'birch') {
	        if (thisObject.chopped === 0) {
	         contextCover.drawImage(sprites1x2['birchCoverCanvas'], x*game.tileSize, (y-1)*game.tileSize);
	         contextSprites.drawImage(sprites1x2['birchCanvas'], x*game.tileSize, y*game.tileSize);
	        } else if (thisObject.chopped === 1) {
	         contextCover.drawImage(sprites1x2['birchChopped1CoverCanvas'], x*game.tileSize, (y-1)*game.tileSize);
	         contextSprites.drawImage(sprites1x2['birchChopped1Canvas'], x*game.tileSize, y*game.tileSize);
	        } else if (thisObject.chopped === 2) {
	         contextCover.drawImage(sprites1x2['birchChopped2CoverCanvas'], x*game.tileSize, (y-1)*game.tileSize);
	         contextSprites.drawImage(sprites1x2['birchChopped2Canvas'], x*game.tileSize, y*game.tileSize);
	        } else if (thisObject.chopped === 3) {
	         contextCover.drawImage(sprites1x2['birchChopped3CoverCanvas'], x*game.tileSize, (y-1)*game.tileSize);
	         contextSprites.drawImage(sprites1x2['birchChopped3Canvas'], x*game.tileSize, y*game.tileSize);
	        } else if (thisObject.chopped === 4) {
	         contextCover.drawImage(sprites1x2['birchChopped4CoverCanvas'], x*game.tileSize, (y-1)*game.tileSize);
	         contextSprites.drawImage(sprites1x2['birchChopped4Canvas'], x*game.tileSize, y*game.tileSize);
	        } else {
	         contextCover.drawImage(sprites1x2['birchChopped5CoverCanvas'], x*game.tileSize, (y-1)*game.tileSize);
	         contextSprites.drawImage(sprites1x2['birchChopped5Canvas'], x*game.tileSize, y*game.tileSize);
	        }
	       }
       	if (thisObject.flagged === true) {
	        contextSprites.drawImage(sprites1x2['treeFlagCanvas'], x*game.tileSize, y*game.tileSize);
        } else if (typeof(thisObject.flagged) === "string") {
         contextSprites.drawImage(sprites1x2['treeSignCanvas'], x*game.tileSize, y*game.tileSize);
        }
	
	      // camps
	      } else if (thisObject.type === 'camp') {
	       var thisCampId = 'X'+thisObject.x+'Y'+thisObject.y;
	       // if player is in camp (and not on zip or on helicopter)
	       if (thisCampId === you.on.cache && you.on.zip === false && you.on.helicopter === false) {
	      	 if (frameMod9 >= 6) {
		        if (thisObject.part === 1) {
			        contextSprites.drawImage(sprites2x2['camp2Canvas'], x*game.tileSize, y*game.tileSize);
			       }
		       } else if (frameMod9 >= 3 && frameMod9 < 6) {
				      if (thisObject.part === 1) {
			        contextSprites.drawImage(sprites2x2['camp3Canvas'], x*game.tileSize, y*game.tileSize);
			       }
		       } else {
		        if (thisObject.part === 1) {
			        contextSprites.drawImage(sprites2x2['camp4Canvas'], x*game.tileSize, y*game.tileSize);
			       }
		       }
		      // else player is either not in camp or on zip
		      } else {
	        if (thisObject.part === 1) {
		        contextSprites.drawImage(sprites2x2['camp1Canvas'], x*game.tileSize, y*game.tileSize);
		        // nearby empty camps slowly regain energy
		        if (frameMod15 === 1 && caches[thisCampId].energy.now < caches[thisCampId].energy.max) {
		         caches[thisCampId].updateEnergy(1);
		        }
		       }
		      }
	      
	      // rafts
	      } else if (thisObject.type === 'raft') {
	       var objectId = 'X'+(x+mapOffsetX)+'Y'+(y+mapOffsetY); // note that for rafts this is not the same as objects[objectId].id
	       if (thisObject.part === 1) {
	        // if player is on raft
	        if (objects[objectId].id === you.on.raft && raftSplashLeft > 0) {
	         contextSprites.drawImage(sprites2x2['raftSplashLeftCanvas'], x*game.tileSize, y*game.tileSize);
	         raftSplashLeft--; raftSplashRight = 0; raftSplashUp = 0; raftSplashDown = 0;
	        } else if (objects[objectId].id === you.on.raft && raftSplashRight > 0) {
	         contextSprites.drawImage(sprites2x2['raftSplashRightCanvas'], x*game.tileSize, y*game.tileSize);
	         raftSplashRight--; raftSplashLeft = 0; raftSplashUp = 0; raftSplashDown = 0;
	        } else if (objects[objectId].id === you.on.raft && raftSplashUp > 0) {
	         contextSprites.drawImage(sprites2x2['raftSplashUpCanvas'], x*game.tileSize, y*game.tileSize);
	         raftSplashUp--; raftSplashLeft = 0; raftSplashRight = 0; raftSplashDown = 0;
	        } else if (objects[objectId].id === you.on.raft && raftSplashDown > 0) {
	         contextSprites.drawImage(sprites2x2['raftSplashDownCanvas'], x*game.tileSize, y*game.tileSize);
	         raftSplashDown--; raftSplashLeft = 0; raftSplashRight = 0; raftSplashUp = 0;
	        } else {
	         contextSprites.drawImage(sprites2x2['raftCanvas'], x*game.tileSize, y*game.tileSize);
	         raftSplashLeft = 0; raftSplashRight = 0; raftSplashUp = 0; raftSplashDown = 0;
	        }
	       }
	      
	      // canoes
	      } else if (thisObject.type === 'canoe') {
	       if (thisObject.direction === 'horz') {
 	       contextSprites.drawImage(sprites3x3['canoeHorzCanvas'], (x-1)*game.tileSize, (y-1)*game.tileSize);
 	      } else {
 	       contextSprites.drawImage(sprites3x3['canoeVertCanvas'], (x-1)*game.tileSize, (y-1)*game.tileSize);
 	      }

	      // helicopters
	      } else if (thisObject.type === 'helicopter') {
	       if (!you.on.helicopter) {
	        if (helicopters[1].direction === 'left') {
 	        contextCover.drawImage(sprites9x3['helicopterLeftLandedCoverCanvas'], (x-2)*game.tileSize, (y-2)*game.tileSize);
 	        contextSprites.drawImage(sprites9x3['helicopterLeftShadowCanvas'], (x-2)*game.tileSize, y*game.tileSize);
 	        contextSprites.drawImage(sprites9x3['helicopterLeftLandedCanvas'], (x-2)*game.tileSize, y*game.tileSize);
 	       } else {
 	        contextCover.drawImage(sprites9x3['helicopterRightLandedCoverCanvas'], (x-6)*game.tileSize, (y-2)*game.tileSize);
 	        contextSprites.drawImage(sprites9x3['helicopterRightShadowCanvas'], (x-6)*game.tileSize, y*game.tileSize);
 	        contextSprites.drawImage(sprites9x3['helicopterRightLandedCanvas'], (x-6)*game.tileSize, y*game.tileSize);
 	       }
 	      }
 	     
 	     // quarries
	      } else if (thisObject.type === 'quarry') {
	       if (thisObject.part === 1) {
 	       contextSprites.drawImage(sprites3x3['quarryCanvas'], x*game.tileSize, y*game.tileSize);
 	      }
	      
	      // letters
	      } else if (thisObject.type === 'letter') {
	       if (thisObject.part === 1) {
	        if (thisObject.char === 'other') {
		        contextSprites.drawImage(sprites3x3['letterOtherCanvas'], x*game.tileSize, y*game.tileSize);
		       } else if (thisObject.char === 'a') {
		        contextSprites.drawImage(sprites3x3['letterACanvas'], x*game.tileSize, y*game.tileSize);
		       } else if (thisObject.char === 'b') {
		        contextSprites.drawImage(sprites3x3['letterBCanvas'], x*game.tileSize, y*game.tileSize);
		       } else if (thisObject.char === 'c') {
		        contextSprites.drawImage(sprites3x3['letterCCanvas'], x*game.tileSize, y*game.tileSize);
		       } else if (thisObject.char === 'd') {
		        contextSprites.drawImage(sprites3x3['letterDCanvas'], x*game.tileSize, y*game.tileSize);
		       } else if (thisObject.char === 'e') {
		        contextSprites.drawImage(sprites3x3['letterECanvas'], x*game.tileSize, y*game.tileSize);
		       } else if (thisObject.char === 'f') {
		        contextSprites.drawImage(sprites3x3['letterFCanvas'], x*game.tileSize, y*game.tileSize);
		       } else if (thisObject.char === 'g') {
		        contextSprites.drawImage(sprites3x3['letterGCanvas'], x*game.tileSize, y*game.tileSize);
		       } else if (thisObject.char === 'h') {
		        contextSprites.drawImage(sprites3x3['letterHCanvas'], x*game.tileSize, y*game.tileSize);
		       } else if (thisObject.char === 'i') {
		        contextSprites.drawImage(sprites3x3['letterICanvas'], x*game.tileSize, y*game.tileSize);
		       } else if (thisObject.char === 'j') {
		        contextSprites.drawImage(sprites3x3['letterJCanvas'], x*game.tileSize, y*game.tileSize);
		       } else if (thisObject.char === 'k') {
		        contextSprites.drawImage(sprites3x3['letterKCanvas'], x*game.tileSize, y*game.tileSize);
		       } else if (thisObject.char === 'l') {
		        contextSprites.drawImage(sprites3x3['letterLCanvas'], x*game.tileSize, y*game.tileSize);
		       } else if (thisObject.char === 'm') {
		        contextSprites.drawImage(sprites3x3['letterMCanvas'], x*game.tileSize, y*game.tileSize);
		       } else if (thisObject.char === 'n') {
		        contextSprites.drawImage(sprites3x3['letterNCanvas'], x*game.tileSize, y*game.tileSize);
		       } else if (thisObject.char === 'o') {
		        contextSprites.drawImage(sprites3x3['letterOCanvas'], x*game.tileSize, y*game.tileSize);
		       } else if (thisObject.char === 'p') {
		        contextSprites.drawImage(sprites3x3['letterPCanvas'], x*game.tileSize, y*game.tileSize);
		       } else if (thisObject.char === 'q') {
		        contextSprites.drawImage(sprites3x3['letterQCanvas'], x*game.tileSize, y*game.tileSize);
		       } else if (thisObject.char === 'r') {
		        contextSprites.drawImage(sprites3x3['letterRCanvas'], x*game.tileSize, y*game.tileSize);
		       } else if (thisObject.char === 's') {
		        contextSprites.drawImage(sprites3x3['letterSCanvas'], x*game.tileSize, y*game.tileSize);
		       } else if (thisObject.char === 't') {
		        contextSprites.drawImage(sprites3x3['letterTCanvas'], x*game.tileSize, y*game.tileSize);
		       } else if (thisObject.char === 'u') {
		        contextSprites.drawImage(sprites3x3['letterUCanvas'], x*game.tileSize, y*game.tileSize);
		       } else if (thisObject.char === 'v') {
		        contextSprites.drawImage(sprites3x3['letterVCanvas'], x*game.tileSize, y*game.tileSize);
		       } else if (thisObject.char === 'w') {
		        contextSprites.drawImage(sprites3x3['letterWCanvas'], x*game.tileSize, y*game.tileSize);
		       } else if (thisObject.char === 'x') {
		        contextSprites.drawImage(sprites3x3['letterXCanvas'], x*game.tileSize, y*game.tileSize);
		       } else if (thisObject.char === 'y') {
		        contextSprites.drawImage(sprites3x3['letterYCanvas'], x*game.tileSize, y*game.tileSize);
		       } else if (thisObject.char === 'z') {
		        contextSprites.drawImage(sprites3x3['letterZCanvas'], x*game.tileSize, y*game.tileSize);
		       }
		      }
		      
		     // platforms
	      } else if (thisObject.type === 'platform') {
	       var thisPlatformId = 'X'+thisObject.x+'Y'+thisObject.y;
	       var thisPlatform = platforms[thisPlatformId];
	       if (thisObject.part === 1) {
	        contextSprites.drawImage(sprites3x3['platformCanvas'], x*game.tileSize, y*game.tileSize);
	       }
	       if (thisObject.part === 2 && thisPlatform.node1 !== false) {
	        contextCover.drawImage(sprites3x3['zip1Canvas'], (x-1)*game.tileSize, (y-1)*game.tileSize);
	       }
	       if (thisObject.part === 4 && thisPlatform.node2 !== false) {
	        contextCover.drawImage(sprites3x3['zip2Canvas'], ((x-1)*game.tileSize)-1, ((y-1)*game.tileSize)-1);
	       }
	       if (thisObject.part === 6 && thisPlatform.node3 !== false) {
	        contextCover.drawImage(sprites3x3['zip3Canvas'], (x-1)*game.tileSize, ((y-1)*game.tileSize)-1);
	       }
	       if (thisObject.part === 9 && thisPlatform.roof === true) { // using part 9 so roof is drawn in front of zip nodes
	        if (thisPlatformId !== you.on.platform) {
 	        contextCover.drawImage(sprites3x3['slateRoofCanvas'], (x-2)*game.tileSize, ((y-2)*game.tileSize)-6);
 	       } else {
 	        contextCover.drawImage(sprites3x3['roofPillarsCanvas'], (x-2)*game.tileSize, (y-2)*game.tileSize);
 	       }
	       }
	       // nearby empty platforms with roofs slowly regain energy
	       if (frameMod15 === 1 && thisObject.part === 5) {
	        if (thisPlatformId !== you.on.platform && you.on.zip === false && thisPlatform.roof === true && thisPlatform.platformEnergy < platformEnergy) {
          thisPlatform.platformEnergy++;
         }
	       }
	      }
      
      }
     }
    }
   } // end y loop
  } // end x loop

  // draw fire; fire spreads to nearby flammable objects; buffer 5 tiles
  for (var x=-5, xLimit=game.mapCanvasTileW+5; x<=xLimit; x++) {
   for (var y=-5, yLimit=game.mapCanvasTileH+5; y<=yLimit; y++) {
    if (typeof(mapArray[x+mapOffsetX]) !== "undefined" && x+mapOffsetX < game.mapTileCount) {
     if (typeof(mapArray[x+mapOffsetX][y+mapOffsetY]) !== "undefined" && y+mapOffsetY < game.mapTileCount) {
      var thisFire = fires['X'+(x+mapOffsetX)+'Y'+(y+mapOffsetY)];
      var thisObject = objects['X'+(x+mapOffsetX)+'Y'+(y+mapOffsetY)];
      if (typeof(thisFire) !== "undefined" && typeof(thisObject) !== "undefined") {

       if (thisFire === 3) { // 3 and 2 are the same animation, just out of sync to provide variation
        if (frameMod15 >= 13) {
        	contextSprites.drawImage(sprites1x1['fire4Canvas'], x*game.tileSize, y*game.tileSize);
	        contextCover.drawImage(sprites1x1['smoke2Canvas'], (x*game.tileSize)+7, (y*game.tileSize)-12);
	       } else if (frameMod15 >= 10 && frameMod15 < 13) {
	        contextSprites.drawImage(sprites1x1['fire4Canvas'], x*game.tileSize, y*game.tileSize);
	        contextCover.drawImage(sprites1x1['smoke2Canvas'], (x*game.tileSize)+5, (y*game.tileSize)-9);
	       } else if (frameMod15 >= 7 && frameMod15 < 10) {
	        contextSprites.drawImage(sprites1x1['fire3Canvas'], x*game.tileSize, y*game.tileSize);
	        contextCover.drawImage(sprites1x1['smoke1Canvas'], (x*game.tileSize)+2, (y*game.tileSize)-6);
	       } else if (frameMod15 >= 4 && frameMod15 < 7) {
	        contextSprites.drawImage(sprites1x1['fire3Canvas'], x*game.tileSize, y*game.tileSize);
	        contextCover.drawImage(sprites1x1['smoke1Canvas'], (x*game.tileSize)+1, (y*game.tileSize)-3);
	       } else {
	       	contextSprites.drawImage(sprites1x1['fire5Canvas'], x*game.tileSize, y*game.tileSize);
	        contextCover.drawImage(sprites1x1['smoke3Canvas'], (x*game.tileSize)+9, (y*game.tileSize)-14);
	       }

       } else if (thisFire === 2) {
	       if (frameMod15 >= 13) {
	        contextSprites.drawImage(sprites1x1['fire5Canvas'], x*game.tileSize, y*game.tileSize);
	        contextCover.drawImage(sprites1x1['smoke3Canvas'], (x*game.tileSize)+11, (y*game.tileSize)-12);
	       } else if (frameMod15 >= 10 && frameMod15 < 13) {
	        contextSprites.drawImage(sprites1x1['fire4Canvas'], x*game.tileSize, y*game.tileSize);
	        contextCover.drawImage(sprites1x1['smoke2Canvas'], (x*game.tileSize)+9, (y*game.tileSize)-10);
	       } else if (frameMod15 >= 7 && frameMod15 < 10) {
	        contextSprites.drawImage(sprites1x1['fire4Canvas'], x*game.tileSize, y*game.tileSize);
	        contextCover.drawImage(sprites1x1['smoke2Canvas'], (x*game.tileSize)+7, (y*game.tileSize)-7);
	       } else if (frameMod15 >= 4 && frameMod15 < 7) {
	        contextSprites.drawImage(sprites1x1['fire3Canvas'], x*game.tileSize, y*game.tileSize);
	        contextCover.drawImage(sprites1x1['smoke1Canvas'], (x*game.tileSize)+5, (y*game.tileSize)-5);
	       } else {
	        contextSprites.drawImage(sprites1x1['fire3Canvas'], x*game.tileSize, y*game.tileSize);
	        contextCover.drawImage(sprites1x1['smoke1Canvas'], (x*game.tileSize)+3, (y*game.tileSize)-2);
	       }
	       
	      } else { // fire === 1
	       if (frameMod9 >= 6) {
	        contextSprites.drawImage(sprites1x1['fire3Canvas'], x*game.tileSize, y*game.tileSize);
	       } else if (frameMod9 >= 3 && frameMod9 < 6) {
	        contextSprites.drawImage(sprites1x1['fire2Canvas'], x*game.tileSize, y*game.tileSize);
	       } else {
	        contextSprites.drawImage(sprites1x1['fire1Canvas'], x*game.tileSize, y*game.tileSize);
	       }
	      }
	      
	      // if player is on tile which is on fire, and not on zip or on helicopter, lose energy rapidly
	      if (x+mapOffsetX === you.tile.x && y+mapOffsetY === you.tile.y && you.on.zip === false && you.on.helicopter === false) {
	       you.status.cold = false;
	       you.updateEnergy(-4);
	      }

       // fire has chance to spread
				   var fireSpreadChance = randomBetween(0, 12);
				   if (fireSpreadChance === 1) {
				    var newFireTile = getRandomAdjacentFlammableTile(x+mapOffsetX, y+mapOffsetY);
		      if (newFireTile) {
		       var spreadFireId = 'X'+newFireTile.x+'Y'+newFireTile.y;
		      	if (typeof(fires[spreadFireId]) !== "undefined" && fires[spreadFireId] < 3) {
				      fires[spreadFireId]++;
				     } else {
				      fires[spreadFireId] = 1;
				     }
			     }
				   } // end if fireSpreadChance
					   
				   // fire has a chance to fade
				   var fireFadeChance = randomBetween(0, 20);
				   if (fireFadeChance === 1) {
				    var fadeFireId = 'X'+(x+mapOffsetX)+'Y'+(y+mapOffsetY);
					   if (thisFire === 3) {
					    fires[fadeFireId] -= 2;
					   } else {
					    fires[fadeFireId]--;
					   }
				    if (thisFire === 0) {
				     // if tree has burned, generate stump; also redraw fog in case tree had flag
				     if (thisObject.type === 'tree') {
				      // if tree had flag, redraw fog
				      if (thisObject.flagged === 'true') { if (admin.fog) { redrawFog = true; } }
				      objects[fadeFireId] = {'type': 'tree', 'class': 'stump', 'x': (x+mapOffsetX), 'y': (y+mapOffsetY), 'collectable': true, 'collectItem': 'charcoal'};
				      if (thisObject.class !== 'fir' || thisObject.class !== 'birch') {
				       delete trees[fadeFireId];
				      }
				     // if bridge has burned, check if player falls in water
				     } else if (thisObject.type === 'bridge' && x+mapOffsetX === you.tile.x && y+mapOffsetY === you.tile.y) {
				      delete objects[fadeFireId];
				      you.on.water = true;
          you.status.cold = true;
	         you.updateEnergy();
				     } else {
					     delete objects[fadeFireId];
					    }
				     delete fires[fadeFireId];
				    }
				   }
       
      }
     }
    }
   } // end y loop
  } // end x loop
  

  // draw you
  // note: game.mapCanvasHalfTiles = you.tile.x - mapOffsetX

  // if animation
  if (you.animating.stand === 3) {
   you.status.paused1 = true;
   contextSprites.drawImage(sprites1x1['youSleep2Canvas'], game.mapCanvasHalfTiles*game.tileSize, game.mapCanvasHalfTiles*game.tileSize);
   requestTimeout(function() { if (you.animating.stand === 3) { you.animating.stand--; } }, game.loopRate);
  
  } else if (you.animating.stand === 2) {
   you.status.paused1 = true;
   contextSprites.drawImage(sprites1x1['youSleep3Canvas'], game.mapCanvasHalfTiles*game.tileSize, game.mapCanvasHalfTiles*game.tileSize);
   requestTimeout(function() { if (you.animating.stand === 2) { you.animating.stand--; } }, game.loopRate);
  
  } else if (you.animating.stand === 1) {
   you.status.paused1 = true;
   contextSprites.drawImage(sprites1x1['youSleep4Canvas'], game.mapCanvasHalfTiles*game.tileSize, game.mapCanvasHalfTiles*game.tileSize);
   requestTimeout(function() { if (you.animating.stand === 1) { you.animating.stand--; you.status.paused1 = false; } }, game.loopRate*2);
  
  } else if (you.animating.sleep === 3) {
   you.status.paused1 = true;
   contextSprites.drawImage(sprites1x1['youSleep4Canvas'], game.mapCanvasHalfTiles*game.tileSize, game.mapCanvasHalfTiles*game.tileSize);
   requestTimeout(function() { if (you.animating.sleep === 3) { you.animating.sleep--; } }, game.loopRate);
  
  } else if (you.animating.sleep === 2) {
   you.status.paused1 = true;
   contextSprites.drawImage(sprites1x1['youSleep3Canvas'], game.mapCanvasHalfTiles*game.tileSize, game.mapCanvasHalfTiles*game.tileSize);
   requestTimeout(function() { if (you.animating.sleep === 2) { you.animating.sleep--; } }, game.loopRate);
  
  } else if (you.animating.sleep === 1) {
   you.status.paused1 = true;
   contextSprites.drawImage(sprites1x1['youSleep2Canvas'], game.mapCanvasHalfTiles*game.tileSize, game.mapCanvasHalfTiles*game.tileSize);
   requestTimeout(function() { if (you.animating.sleep === 1) { you.animating.sleep--; } }, game.loopRate);

  // else no animation
  } else {
   you.status.paused1 = false;
   if (you.on.zip) {
    if (you.status.cold) {
     contextCover.drawImage(sprites1x2['youColdZipCanvas'], game.mapCanvasHalfTiles*game.tileSize, game.mapCanvasHalfTiles*game.tileSize);
    } else {
     contextCover.drawImage(sprites1x2['youZipCanvas'], game.mapCanvasHalfTiles*game.tileSize, game.mapCanvasHalfTiles*game.tileSize);
    }
   } else if (you.on.water) {
    contextSprites.drawImage(sprites1x1['youWaterCanvas'], game.mapCanvasHalfTiles*game.tileSize, game.mapCanvasHalfTiles*game.tileSize);
	  } else if (you.status.sleep) {
	   contextSprites.drawImage(sprites1x1['youSleep1Canvas'], game.mapCanvasHalfTiles*game.tileSize, game.mapCanvasHalfTiles*game.tileSize);
	  } else if (you.on.raft) {
	   if (you.status.cold) {
	    contextSprites.drawImage(sprites1x1['youColdRaftCanvas'], game.mapCanvasHalfTiles*game.tileSize, game.mapCanvasHalfTiles*game.tileSize);
	   } else {
	    contextSprites.drawImage(sprites1x1['youRaftCanvas'], game.mapCanvasHalfTiles*game.tileSize, game.mapCanvasHalfTiles*game.tileSize);
	   }
	  } else if (you.on.canoe) {
	   if (you.status.cold) {
	    contextSprites.drawImage(sprites1x1['youColdCanoeCanvas'], game.mapCanvasHalfTiles*game.tileSize, game.mapCanvasHalfTiles*game.tileSize);
	   } else {
	    contextSprites.drawImage(sprites1x1['youCanoeCanvas'], game.mapCanvasHalfTiles*game.tileSize, game.mapCanvasHalfTiles*game.tileSize);
	   }
	  } else if (you.on.helicopter) {
	   // drawn after ziplines
	  } else {
	   if (you.status.cold) {
 	   contextSprites.drawImage(sprites1x1['youColdCanvas'], game.mapCanvasHalfTiles*game.tileSize, game.mapCanvasHalfTiles*game.tileSize);
 	  } else {
 	   contextSprites.drawImage(sprites1x1['youCanvas'], game.mapCanvasHalfTiles*game.tileSize, game.mapCanvasHalfTiles*game.tileSize);
 	  }
	  }
	 
	  /*
	  
		 if (you.status.cold) {
		  contextSprites.globalCompositeOperation = "source-in";
		  contextSprites.fillStyle = '#ace2ee';
		  contextSprites.fillRect(game.mapCanvasHalfTiles*game.tileSize, game.mapCanvasHalfTiles*game.tileSize, game.tileSize, game.tileSize);
		  contextSprites.globalCompositeOperation = "source-over";
		 }
		 // */
  } // end if animation


  // check for nearby ziplines; buffer 7 tiles
  var nearbyNodes = [];
  for (var x=-7, xLimit=game.mapCanvasTileW+7; x<=xLimit; x++) {
   for (var y=-7, yLimit=game.mapCanvasTileH+7; y<=yLimit; y++) {
    if (typeof(mapArray[x+mapOffsetX]) !== "undefined" && x+mapOffsetX < game.mapTileCount) {
     if (typeof(mapArray[x+mapOffsetX][y+mapOffsetY]) !== "undefined" && y+mapOffsetY < game.mapTileCount) {
      var thisPlatform = platforms['X'+(x+mapOffsetX)+'Y'+(y+mapOffsetY)];
      if (typeof(thisPlatform) !== "undefined") {
       if (thisPlatform.node1 !== false) {
        nearbyNodes.push(thisPlatform.node1);
       }
       if (thisPlatform.node2 !== false) {
        nearbyNodes.push(thisPlatform.node2);
       }
       if (thisPlatform.node3 !== false) {
        nearbyNodes.push(thisPlatform.node3);
       }
      }
     }
    }
   } // end y loop
  } // end x loop
  
  // draw ziplines
  var drawnNodes = [];
  if (nearbyNodes.length > 1) {
   contextCover.strokeStyle = "#282828"; // #fff also looks good
	  for (var z=0, zLimit=nearbyNodes.length; z<zLimit; z++) {
				contextCover.beginPath();
				var nodeFromId = nearbyNodes[z].fromId+'Node'+nearbyNodes[z].fromNode;
				var nodeToId = nearbyNodes[z].toId+'Node'+nearbyNodes[z].toNode;

    // if node connection has not been drawn already
				if ($.inArray(nodeFromId, drawnNodes) === -1 || $.inArray(nodeToId, drawnNodes) === -1) {
				 drawnNodes.push(nodeFromId);
				 drawnNodes.push(nodeToId);
				
					// from node
					if (nearbyNodes[z].fromNode === 1) {
	 				contextCover.moveTo((platforms[nearbyNodes[z].fromId].x-mapOffsetX)*game.tileSize + zip1OffsetX + 0.5, (platforms[nearbyNodes[z].fromId].y-mapOffsetY)*game.tileSize + zip1OffsetY + 0.5);
	 			} else if (nearbyNodes[z].fromNode === 2) {
	 			 contextCover.moveTo((platforms[nearbyNodes[z].fromId].x-mapOffsetX)*game.tileSize + zip2OffsetX + 0.5, (platforms[nearbyNodes[z].fromId].y-mapOffsetY)*game.tileSize + zip2OffsetY + 0.5);
	 			} else if (nearbyNodes[z].fromNode === 3) {
	 			 contextCover.moveTo((platforms[nearbyNodes[z].fromId].x-mapOffsetX)*game.tileSize + zip3OffsetX + 0.5, (platforms[nearbyNodes[z].fromId].y-mapOffsetY)*game.tileSize + zip3OffsetY + 0.5);
	 			}
	 			
	 			// to node
	 			if (nearbyNodes[z].toNode === 1) {
			   contextCover.lineTo((platforms[nearbyNodes[z].toId].x-mapOffsetX)*game.tileSize + zip1OffsetX + 0.5, (platforms[nearbyNodes[z].toId].y-mapOffsetY)*game.tileSize + zip1OffsetY + 0.5);
	 			} else if (nearbyNodes[z].toNode === 2) {
			   contextCover.lineTo((platforms[nearbyNodes[z].toId].x-mapOffsetX)*game.tileSize + zip2OffsetX + 0.5, (platforms[nearbyNodes[z].toId].y-mapOffsetY)*game.tileSize + zip2OffsetY + 0.5);
	 			} else if (nearbyNodes[z].toNode === 3) {
			   contextCover.lineTo((platforms[nearbyNodes[z].toId].x-mapOffsetX)*game.tileSize + zip3OffsetX + 0.5, (platforms[nearbyNodes[z].toId].y-mapOffsetY)*game.tileSize + zip3OffsetY + 0.5);
	 			}
	
			  contextCover.stroke();
			  contextCover.closePath();
			  //status('zipline: x' + (nearbyZiplines[z].x-mapOffsetX)*game.tileSize + ', y' + (nearbyZiplines[z].y-mapOffsetY)*game.tileSize + ' to x' + (nearbyZiplines[z+1].x-mapOffsetX)*game.tileSize + ', y' + (nearbyZiplines[z+1].y-mapOffsetY)*game.tileSize);
		  }
		 }
  }
  
  
  // draw you in helicopter (after ziplines so it appears above)
  if (you.on.helicopter) {
	  if (helicopters[1].direction === 'left') {
	   if (you.status.active > 0) {
	    if (frameMod2 === 0) {
	     contextCover.drawImage(sprites9x3['helicopterLeft1TiltCanvas'], (game.mapCanvasHalfTiles-2)*game.tileSize, (game.mapCanvasHalfTiles-5)*game.tileSize);
	 	  } else {
	 	   contextCover.drawImage(sprites9x3['helicopterLeft2TiltCanvas'], (game.mapCanvasHalfTiles-2)*game.tileSize, (game.mapCanvasHalfTiles-5)*game.tileSize);
	 	  }
	 	  contextCover.drawImage(sprites9x3['helicopterLeftShadowCanvas'], (game.mapCanvasHalfTiles-2)*game.tileSize, game.mapCanvasHalfTiles*game.tileSize);
	   } else {
	    if (frameMod2 === 0) {
	 	   contextCover.drawImage(sprites9x3['helicopterLeft1Canvas'], (game.mapCanvasHalfTiles-2)*game.tileSize, (game.mapCanvasHalfTiles-5)*game.tileSize);
	 	  } else {
	 	   contextCover.drawImage(sprites9x3['helicopterLeft2Canvas'], (game.mapCanvasHalfTiles-2)*game.tileSize, (game.mapCanvasHalfTiles-5)*game.tileSize);
	 	  }
		   contextCover.drawImage(sprites9x3['helicopterLeftShadowCanvas'], (game.mapCanvasHalfTiles-2)*game.tileSize, game.mapCanvasHalfTiles*game.tileSize);
		  }
		 } else {
		  if (you.status.active > 0) {
		   if (frameMod2 === 0) {
		    contextCover.drawImage(sprites9x3['helicopterRight1TiltCanvas'], (game.mapCanvasHalfTiles-6)*game.tileSize, (game.mapCanvasHalfTiles-5)*game.tileSize);
		   } else {
		    contextCover.drawImage(sprites9x3['helicopterRight2TiltCanvas'], (game.mapCanvasHalfTiles-6)*game.tileSize, (game.mapCanvasHalfTiles-5)*game.tileSize);
		   }
		   contextCover.drawImage(sprites9x3['helicopterRightShadowCanvas'], (game.mapCanvasHalfTiles-6)*game.tileSize, game.mapCanvasHalfTiles*game.tileSize);
		  } else {
		   if (frameMod2 === 0) {
		    contextCover.drawImage(sprites9x3['helicopterRight1Canvas'], (game.mapCanvasHalfTiles-6)*game.tileSize, (game.mapCanvasHalfTiles-5)*game.tileSize);
		   } else {
		    contextCover.drawImage(sprites9x3['helicopterRight2Canvas'], (game.mapCanvasHalfTiles-6)*game.tileSize, (game.mapCanvasHalfTiles-5)*game.tileSize);
		   }
		   contextCover.drawImage(sprites9x3['helicopterRightShadowCanvas'], (game.mapCanvasHalfTiles-6)*game.tileSize, game.mapCanvasHalfTiles*game.tileSize);
		  }
		 }
  }
  


  // draw reach
	 if (cursor.near) {
			contextCover.beginPath();
	  contextCover.arc(game.mapCanvasHalfTiles*game.tileSize + you.offset, game.mapCanvasHalfTiles*game.tileSize + you.offset, you.reach*game.tileSize + 3, 0, Math.PI*2, false);
	  contextCover.strokeStyle = 'rgb(220,220,220)';
	  contextCover.stroke();
	  contextCover.closePath();
  }

  
  if (admin.fog && redrawFog) {
   drawFog();
   redrawFog = false;
  }


  if (admin.mini && redrawMiniMapCursor) {
   drawMiniMapCursor();
   redrawMiniMapCursor = false;
  }
  
		
		//status(frameCount);
		frameCount++;
		$('#drawTime').text('draw time: ' + (clockTime()-drawTime) +'ms.');
		
	} // end drawMap
	
	
	
	// draw terrain
	function drawTerrain() {
	 // copy miniMap to map
  // see: http://stackoverflow.com/questions/6060881/html5-canvas-draw-image
  if (game.softMap) {
   var clearTerrain = false, sourceOffsetX, sourceOffsetY, sourceW, sourceH, copyX, copyY, copyW, copyH;
   // can't ask for source image data outside boundaries: http://stackoverflow.com/questions/7459240/canvas-drawimage-throws-index-size-err-when-run-locally-but-not-from-the-web
   if (mapOffsetX < 0) { clearTerrain = true; sourceOffsetX = 0; copyX = mapOffsetX*game.tileSize*-1; } else { sourceOffsetX = mapOffsetX; copyX = 0; }
   if (mapOffsetY < 0) { clearTerrain = true; sourceOffsetY = 0; copyY = mapOffsetY*game.tileSize*-1; } else { sourceOffsetY = mapOffsetY; copyY = 0; }
   if (sourceOffsetX + game.mapCanvasTileW > game.canvasMiniMapW) { clearTerrain = true; sourceW = game.mapCanvasTileW - (mapOffsetX + game.mapCanvasTileW - game.canvasMiniMapW); copyW = sourceW*game.tileSize; } else { sourceW = game.mapCanvasTileW; copyW = game.mapCanvasW; }
   if (sourceOffsetY + game.mapCanvasTileH > game.canvasMiniMapH) { clearTerrain = true; sourceH = game.mapCanvasTileH - (mapOffsetY + game.mapCanvasTileH - game.canvasMiniMapH); copyH = sourceH*game.tileSize; } else { sourceH = game.mapCanvasTileH; copyH = game.mapCanvasH; }
   // only need to clear canvas here if near edges of map; best clear canvas practice: http://stackoverflow.com/a/6722031/294189
   if (clearTerrain) {
    contextTerrain.clearRect(0, 0, game.mapCanvasW, game.mapCanvasH);
   }
   contextTerrain.drawImage(canvasMiniMap, sourceOffsetX, sourceOffsetY, sourceW, sourceH, copyX, copyY, copyW, copyH);
  }

	 // tiles
  // water, waves, icebergs, crash
  if (!game.softMap) {
	  contextTerrain.fillStyle = '#5591b0';
	  for (var x=0; x<=game.mapCanvasTileW; x++) {
	   for (var y=0; y<=game.mapCanvasTileH; y++) {
	    if (typeof(mapArray[x+mapOffsetX]) !== "undefined" && x+mapOffsetX < game.mapTileCount) {
	     if (typeof(mapArray[x+mapOffsetX][y+mapOffsetY]) !== "undefined" && y+mapOffsetY < game.mapTileCount) {
	      if (mapArray[x+mapOffsetX][y+mapOffsetY] <= 0.45 || (mapArray[x+mapOffsetX][y+mapOffsetY] > 3 && mapArray[x+mapOffsetX][y+mapOffsetY] < 5)) {
	       contextTerrain.fillRect(x*game.tileSize, y*game.tileSize, game.tileSize, game.tileSize);
	      }
	     } //else { contextSprites.clearRect(x*game.tileSize, y*game.tileSize, game.tileSize, game.tileSize); } // clears areas outside map; unnecessary because of redraw changes?
	    } //else { contextSprites.clearRect(x*game.tileSize, y*game.tileSize, game.tileSize, game.tileSize); }
	   }
	  }
	 }

  // shallows
  contextTerrain.fillStyle = '#67A0B7';
  for (var x=0; x<=game.mapCanvasTileW; x++) {
   for (var y=0; y<=game.mapCanvasTileH; y++) {
    if (typeof(mapArray[x+mapOffsetX]) !== "undefined" && x+mapOffsetX < game.mapTileCount) {
     if (typeof(mapArray[x+mapOffsetX][y+mapOffsetY]) !== "undefined" && y+mapOffsetY < game.mapTileCount) {
      if (mapArray[x+mapOffsetX][y+mapOffsetY] > 0.45 && mapArray[x+mapOffsetX][y+mapOffsetY] <= 0.55) {
       if (game.softMap) {
        contextTerrain.fillRect(x*game.tileSize+1, y*game.tileSize+1, game.tileSize-2, game.tileSize-2);
       } else {
        contextTerrain.fillRect(x*game.tileSize, y*game.tileSize, game.tileSize, game.tileSize);
       }
      }
     }
    }
   }
  }
  
  // sand
  contextTerrain.fillStyle = '#D3D1A5';
  for (var x=0; x<=game.mapCanvasTileW; x++) {
   for (var y=0; y<=game.mapCanvasTileH; y++) {
    if (typeof(mapArray[x+mapOffsetX]) !== "undefined" && x+mapOffsetX < game.mapTileCount) {
     if (typeof(mapArray[x+mapOffsetX][y+mapOffsetY]) !== "undefined" && y+mapOffsetY < game.mapTileCount) {
      if (mapArray[x+mapOffsetX][y+mapOffsetY] > 0.55 && mapArray[x+mapOffsetX][y+mapOffsetY] <= 0.6) {
       if (game.softMap) {
	       contextTerrain.fillRect(x*game.tileSize+1, y*game.tileSize+1, game.tileSize-2, game.tileSize-2);
	      } else {
	       contextTerrain.fillRect(x*game.tileSize, y*game.tileSize, game.tileSize, game.tileSize);
	      }
      }
     }
    }
   }
  }
  
  // field, grass, flowers1, weeds, high field, rocks, hill1, hill2
  contextTerrain.fillStyle = '#91B58C';
  for (var x=0; x<=game.mapCanvasTileW; x++) {
   for (var y=0; y<=game.mapCanvasTileH; y++) {
    if (typeof(mapArray[x+mapOffsetX]) !== "undefined" && x+mapOffsetX < game.mapTileCount) {
     if (typeof(mapArray[x+mapOffsetX][y+mapOffsetY]) !== "undefined" && y+mapOffsetY < game.mapTileCount) {
      if ((mapArray[x+mapOffsetX][y+mapOffsetY] > 0.6 && mapArray[x+mapOffsetX][y+mapOffsetY] < 0.99 && airArray[x+mapOffsetX][y+mapOffsetY] > 0.5) || (mapArray[x+mapOffsetX][y+mapOffsetY] === 2.4 && airArray[x+mapOffsetX][y+mapOffsetY] > 0.5)) {
       if (game.softMap) {
        contextTerrain.fillRect(x*game.tileSize+1, y*game.tileSize+1, game.tileSize-2, game.tileSize-2);
       } else {
        contextTerrain.fillRect(x*game.tileSize, y*game.tileSize, game.tileSize, game.tileSize);
       }
      }
     }
    }
   }
  }
  
  // alternate field, grass, flowers2, weeds, high field, rocks, hill1, hill2, cave4, field station, platform
  contextTerrain.fillStyle = '#8AAD86';
  for (var x=0; x<=game.mapCanvasTileW; x++) {
   for (var y=0; y<=game.mapCanvasTileH; y++) {
    if (typeof(mapArray[x+mapOffsetX]) !== "undefined" && x+mapOffsetX < game.mapTileCount) {
     if (typeof(mapArray[x+mapOffsetX][y+mapOffsetY]) !== "undefined" && y+mapOffsetY < game.mapTileCount) {
      if ((mapArray[x+mapOffsetX][y+mapOffsetY] > 0.6 && mapArray[x+mapOffsetX][y+mapOffsetY] < 0.99 && airArray[x+mapOffsetX][y+mapOffsetY] <= 0.5) || (mapArray[x+mapOffsetX][y+mapOffsetY] === 2.4 && airArray[x+mapOffsetX][y+mapOffsetY] <= 0.5)
       || (mapArray[x+mapOffsetX][y+mapOffsetY] >= 6 && mapArray[x+mapOffsetX][y+mapOffsetY] <= 7.99)) {
       if (game.softMap) {
	       contextTerrain.fillRect(x*game.tileSize+1, y*game.tileSize+1, game.tileSize-2, game.tileSize-2);
	      } else {
	       contextTerrain.fillRect(x*game.tileSize, y*game.tileSize, game.tileSize, game.tileSize);
	      }
      }
     }
    }
   }
  }
  
  // mountain1, mountain2, range1, range2, cave1, cave2, cave3
  contextTerrain.fillStyle = '#8c9074';
  for (var x=0; x<=game.mapCanvasTileW; x++) {
   for (var y=0; y<=game.mapCanvasTileH; y++) {
    if (typeof(mapArray[x+mapOffsetX]) !== "undefined" && x+mapOffsetX < game.mapTileCount) {
     if (typeof(mapArray[x+mapOffsetX][y+mapOffsetY]) !== "undefined" && y+mapOffsetY < game.mapTileCount) {
      if ((mapArray[x+mapOffsetX][y+mapOffsetY] >= 0.99 && mapArray[x+mapOffsetX][y+mapOffsetY] <= 1.4)
       || (mapArray[x+mapOffsetX][y+mapOffsetY] >= 2.1 && mapArray[x+mapOffsetX][y+mapOffsetY] <= 2.3)
       || (mapArray[x+mapOffsetX][y+mapOffsetY] >= 5.1 && mapArray[x+mapOffsetX][y+mapOffsetY] <= 5.6)) {
       if (game.softMap) {
        contextTerrain.fillRect(x*game.tileSize+1, y*game.tileSize+1, game.tileSize-2, game.tileSize-2);
       } else {
	       contextTerrain.fillRect(x*game.tileSize, y*game.tileSize, game.tileSize, game.tileSize);
	      }
      }
     }
    }
   }
  }
  

  // 1x1 terrain
  for (var x=0; x<=game.mapCanvasTileW; x++) {
   for (var y=0; y<=game.mapCanvasTileH; y++) {
    if (typeof(mapArray[x+mapOffsetX]) !== "undefined" && x+mapOffsetX < game.mapTileCount) {
     if (typeof(mapArray[x+mapOffsetX][y+mapOffsetY]) !== "undefined" && y+mapOffsetY < game.mapTileCount) {
      var thisTile = mapArray[x+mapOffsetX][y+mapOffsetY];
  
      // grass
      if (thisTile > 0.71 && thisTile <= 0.735) {
       contextTerrain.drawImage(sprites1x1['grassCanvas'], x*game.tileSize, y*game.tileSize);
      
      // flowers1 and flowers2
      } else if (thisTile > 0.735 && thisTile <= 0.74) {
       if (airArray[x+mapOffsetX][y+mapOffsetY] <= 0.5) {
        contextTerrain.drawImage(sprites1x1['flowers2Canvas'], x*game.tileSize, y*game.tileSize);
       } else {
        contextTerrain.drawImage(sprites1x1['flowers1Canvas'], x*game.tileSize, y*game.tileSize);
       }
      
      // weeds
      } else if (thisTile > 0.74 && thisTile <= 0.76) {
       contextTerrain.drawImage(sprites1x1['weedsCanvas'], x*game.tileSize, y*game.tileSize);
      
      // rocks
      } else if (thisTile > 0.85 && thisTile <= 0.88) {
       contextTerrain.drawImage(sprites1x1['rocksCanvas'], x*game.tileSize, y*game.tileSize);
      
      // hill 1
      } else if (thisTile > 0.88 && thisTile <= 0.90) {
       contextTerrain.drawImage(sprites1x1['hill1Canvas'], x*game.tileSize, y*game.tileSize);
      
      // hill 2
      } else if (thisTile > 0.90 && thisTile < 0.99) {
       contextTerrain.drawImage(sprites1x1['hill2Canvas'], x*game.tileSize, y*game.tileSize);
      
      // mountain 1
      } else if (thisTile === 0.99) {
       contextTerrain.drawImage(sprites1x1['mountain1Canvas'], x*game.tileSize, y*game.tileSize);
      
      // mountain 2
      } else if (thisTile === 1) {
       contextTerrain.drawImage(sprites1x1['mountain2Canvas'], x*game.tileSize, y*game.tileSize);
      }

     }
    }
   } // end y loop
  } // end x loop


  // terrain larger than 1x1; buffer 15 tiles because of field station; cover draw in drawMap loop
  for (var x=-15, xLimit=game.mapCanvasTileW+15; x<=xLimit; x++) {
   for (var y=-15, yLimit=game.mapCanvasTileH+15; y<=yLimit; y++) {
    if (typeof(mapArray[x+mapOffsetX]) !== "undefined" && x+mapOffsetX < game.mapTileCount) {
     if (typeof(mapArray[x+mapOffsetX][y+mapOffsetY]) !== "undefined" && y+mapOffsetY < game.mapTileCount) {
      var thisTile = mapArray[x+mapOffsetX][y+mapOffsetY];
      
      // mountain range 1
      if (thisTile === 1.1) {
       contextTerrain.drawImage(sprites2x2['range1Canvas'], x*game.tileSize, y*game.tileSize);
      
      // icebergs
      } else if (thisTile === 3.1) {
       contextTerrain.drawImage(sprites2x2['icebergCanvas'], x*game.tileSize, y*game.tileSize);
      
      // caves
      } else if (thisTile === 2.1) {
       contextTerrain.drawImage(sprites3x2['caveCanvas'], x*game.tileSize, y*game.tileSize);
      
      // crash
      } else if (thisTile === 4.10) {
       //contextCover.drawImage(sprites9x6['crashCoverCanvas'], (x-3)*game.tileSize, (y-3)*game.tileSize);
       contextTerrain.drawImage(sprites9x6['crashCanvas'], (x-3)*game.tileSize, y*game.tileSize);
      
      // mountain range 2
      } else if (thisTile === 5.1) {
       //contextCover.drawImage(sprites3x3['range2CoverCanvas'], x*game.tileSize, (y-1)*game.tileSize);
       contextTerrain.drawImage(sprites3x3['range2Canvas'], x*game.tileSize, y*game.tileSize);
       
      // field station
      } else if (thisTile === 6.001) {
       // if player is inside station and not on zip or on helicopter, do not draw roof
       if (you.tile.x >= stationX && you.tile.x < (stationX*1+stationW) && you.tile.y >= stationY && you.tile.y < (stationY*1+stationH) && you.on.zip === false && you.on.helicopter === false) {
        contextTerrain.drawImage(sprites15x10['fieldStationCanvas'], x*game.tileSize, y*game.tileSize);
       } else {
        //contextCover.drawImage(sprites15x10['fieldStationCoverCanvas'], x*game.tileSize, y*game.tileSize);
        contextTerrain.drawImage(sprites15x10['fieldStationCanvas'], x*game.tileSize, y*game.tileSize);
       }

      }

     }
    }
   } // end y loop
  } // end x loop
  

	} // end drawTerrain
	
	
	
	// draw fog and miniMap fog
	function drawFog() {
	 var visionRadius = you.getVisionRadius();

		// fog layer; fill entire area
  contextFog.globalCompositeOperation = "source-over";
  contextFog.fillStyle = fogColor;
  contextFog.fillRect(0, 0, game.mapCanvasW, game.mapCanvasH);

  // miniMapFog; fill only area represented by miniMapVis, so that fog from far-away camps is still cleared on miniMap
  if (admin.mini) {
   contextMiniMapFog.globalCompositeOperation = "source-over";
   contextMiniMapFog.fillStyle = miniMapFogColor;
   //contextMiniMapFog.fillRect(0, 0, game.canvasMiniMapW, game.canvasMiniMapH); // clear full miniMap
   contextMiniMapFog.fillRect(Math.round(you.tile.x/game.mapTileMultiplier) - (game.miniMapVisW/2), Math.round(you.tile.y/game.mapTileMultiplier) - (game.miniMapVisH/2), game.miniMapVisW, game.miniMapVisH);
  
	  // define clipping region for camp vision circles (otherwise nearby camp vision circles that fall outside miniMapVis are cleared over and over, creating pixellated effect)
	  contextMiniMapFog.save();
	  contextMiniMapFog.beginPath();
	  contextMiniMapFog.rect(Math.round(you.tile.x/game.mapTileMultiplier) - (game.miniMapVisW/2)-1, Math.round(you.tile.y/game.mapTileMultiplier) - (game.miniMapVisH/2)-1, game.miniMapVisW+2, game.miniMapVisH+2); // a little bigger than fillRect above
	  contextMiniMapFog.clip();
  }

  // set globalCompositeOperation once before loop
  contextFog.globalCompositeOperation = "destination-out"; // 'copy' + alpha set to 0 also erases, but doesn't work in firefox
  if (admin.mini) { contextMiniMapFog.globalCompositeOperation = "destination-out"; }

  // clear fog around nearby camps; buffer 'game.mapCanvasHalfTiles' to include cleared fog from camps that are out of view
  for (var x=-game.mapCanvasHalfTiles, xLimit=game.mapCanvasTileW+game.mapCanvasHalfTiles; x<=xLimit; x++) {
   for (var y=-game.mapCanvasHalfTiles, yLimit=game.mapCanvasTileH+game.mapCanvasHalfTiles; y<=yLimit; y++) {
    if (typeof(mapArray[x+mapOffsetX]) !== "undefined" && x+mapOffsetX < game.mapTileCount) {
     if (typeof(mapArray[x+mapOffsetX][y+mapOffsetY]) !== "undefined" && y+mapOffsetY < game.mapTileCount) {
      if (typeof(objects['X'+(x+mapOffsetX)+'Y'+(y+mapOffsetY)]) !== "undefined") {
       var thisObject = objects['X'+(x+mapOffsetX)+'Y'+(y+mapOffsetY)];
       
       // camps
	      if (thisObject.type === 'camp' && thisObject.part === 1) {
	       var thisCamp = caches['X'+(x+mapOffsetX)+'Y'+(y+mapOffsetY)];

								// camp: larger outer circle, partially transparent
								contextFog.beginPath();
						  contextFog.arc(x*game.tileSize + thisCamp.offset, y*game.tileSize + thisCamp.offset, thisCamp.vision+10, 0, Math.PI*2, false);
						  contextFog.fillStyle = 'rgba(0,0,0,0.5)';
						  contextFog.fill();
						  contextFog.closePath();
						  
						  // camp: smaller inner circle, entirely transparent
								contextFog.beginPath();
						  contextFog.arc(x*game.tileSize + thisCamp.offset, y*game.tileSize + thisCamp.offset, thisCamp.vision, 0, Math.PI*2, false);
						  contextFog.fillStyle = 'rgb(0,0,0)';
						  contextFog.fill();
						  contextFog.closePath();
						  
						  if (admin.mini) {
							  // camp: miniMapFog circle
									contextMiniMapFog.beginPath();
							  contextMiniMapFog.arc(Math.round((thisObject.x / game.mapTileMultiplier)+1), Math.round((thisObject.y / game.mapTileMultiplier)+1), Math.round((thisCamp.vision / game.mapTileMultiplier)/16) + game.campVisionMiniAdjust, 0, Math.PI*2, false);
							  contextMiniMapFog.fillStyle = 'rgb(0,0,0)';
							  contextMiniMapFog.fill();
							  contextMiniMapFog.closePath();
						  }
						 
						 // platforms
						 } else if (thisObject.type === 'platform' && thisObject.part === 1) {

								// platform: larger outer circle, partially transparent
								contextFog.beginPath();
						  contextFog.arc(x*game.tileSize + platformOffset, y*game.tileSize + platformOffset, (platformVision/2)+10, 0, Math.PI*2, false);
						  contextFog.fillStyle = 'rgba(0,0,0,0.5)';
						  contextFog.fill();
						  contextFog.closePath();
						  
						  // platform: smaller inner circle, entirely transparent
								contextFog.beginPath();
						  contextFog.arc(x*game.tileSize + platformOffset, y*game.tileSize + platformOffset, platformVision/2, 0, Math.PI*2, false);
						  contextFog.fillStyle = 'rgb(0,0,0)';
						  contextFog.fill();
						  contextFog.closePath();
						  
						  if (admin.mini) {
							  // platform: miniMapFog circle
									contextMiniMapFog.beginPath();
							  contextMiniMapFog.arc(Math.round((thisObject.x / game.mapTileMultiplier)+1), Math.round((thisObject.y / game.mapTileMultiplier)+1), Math.round((platformVision/2 / game.mapTileMultiplier)/16) + game.campVisionMiniAdjust, 0, Math.PI*2, false);
							  contextMiniMapFog.fillStyle = 'rgb(0,0,0)';
							  contextMiniMapFog.fill();
							  contextMiniMapFog.closePath();
						  }
						 
						 // flagged trees
					  } else if (thisObject.type === 'tree' && (thisObject.class === 'fir' || thisObject.class === 'birch') && thisObject.flagged === true) {
					   // flag: larger outer circle, partially transparent
								contextFog.beginPath();
						  contextFog.arc(x*game.tileSize + you.offset, y*game.tileSize + you.offset, (flagVision/2)+10, 0, Math.PI*2, false); // you.offset works for flag too
						  contextFog.fillStyle = 'rgba(0,0,0,0.5)';
						  contextFog.fill();
						  contextFog.closePath();
						  
						  // flag: smaller inner circle, entirely transparent
								contextFog.beginPath();
						  contextFog.arc(x*game.tileSize + you.offset, y*game.tileSize + you.offset, flagVision/2, 0, Math.PI*2, false);
						  contextFog.fillStyle = 'rgb(0,0,0)';
						  contextFog.fill();
						  contextFog.closePath();
					  }

      }
     }
    }
   }
  }

		// you: larger outer circle, partially transparent
		contextFog.beginPath();
  contextFog.arc(game.mapCanvasHalfTiles*game.tileSize + you.offset, game.mapCanvasHalfTiles*game.tileSize + you.offset, visionRadius+10, 0, Math.PI*2, false);
  contextFog.fillStyle = 'rgba(0,0,0,0.5)';
  contextFog.fill();
  contextFog.closePath();
  
  // you: smaller inner circle, entirely transparent
		contextFog.beginPath();
  contextFog.arc(game.mapCanvasHalfTiles*game.tileSize + you.offset, game.mapCanvasHalfTiles*game.tileSize + you.offset, visionRadius, 0, Math.PI*2, false);
  contextFog.fillStyle = 'rgb(0,0,0)';
  contextFog.fill();
  contextFog.closePath();

  if (admin.mini) {
	  // you: miniMapFog circle
			contextMiniMapFog.beginPath();
	  contextMiniMapFog.arc(Math.round((you.tile.x / game.mapTileMultiplier)+1), Math.round((you.tile.y / game.mapTileMultiplier)+1), Math.round((visionRadius / game.mapTileMultiplier)/16), 0, Math.PI*2, false); // radius: 6 works for small map; game.mapFraction/2.5 works, but doesn't account for visionRadius
	  contextMiniMapFog.fillStyle = 'rgb(0,0,0)';
	  contextMiniMapFog.fill();
	  contextMiniMapFog.closePath();

	  contextMiniMapFog.restore(); // works with .save() above
  }

	} // end drawFog
	
	
	
	// draw miniMap cursor
	function drawMiniMapCursor() {
  // clear canvas; only need to clear area around miniMapVis, plus a little larger to get border
  //contextMiniMapCursor.clearRect(0, 0, game.canvasMiniMapW, game.canvasMiniMapH); // clear entire canvas
  contextMiniMapCursor.clearRect(Math.round(you.tile.x/game.mapTileMultiplier) - (game.miniMapVisW/2) - 3, Math.round(you.tile.y/game.mapTileMultiplier) - (game.miniMapVisH/2) - 3, game.miniMapVisW+6, game.miniMapVisH+6);
  // you
  contextMiniMapCursor.fillStyle = 'rgb(255,255,255)';
  contextMiniMapCursor.fillRect(Math.round(you.tile.x/game.mapTileMultiplier), Math.round(you.tile.y/game.mapTileMultiplier), game.markerSize, game.markerSize);
  // miniMapVis (adding 0.5 to avoid subpixel rendering)
  contextMiniMapCursor.beginPath();
  contextMiniMapCursor.strokeStyle = 'rgb(52,66,81)';
	 contextMiniMapCursor.strokeRect(Math.round(Math.round(you.tile.x/game.mapTileMultiplier) - (game.miniMapVisW/2))+0.5, Math.round(Math.round(you.tile.y/game.mapTileMultiplier) - (game.miniMapVisH/2))+0.5, game.miniMapVisW, game.miniMapVisH);
	 contextMiniMapCursor.closePath();
	}



	// clear miniMapCursor
	function clearMiniMapCursor() {
	 contextMiniMapCursor.clearRect(0, 0, game.canvasMiniMapW, game.canvasMiniMapH);
	}



 // draw minimap canvas
	function drawMiniMap() {
	 var miniMapImage, miniMapImageData, miniMapMultiplier;
		
		// drawing each pixel in order using createImageData
		// see: http://hacks.mozilla.org/2009/06/pushing-pixels-with-canvas/
		// could convert hex to rgb: http://stackoverflow.com/questions/4262417/jquery-hex-to-rgb-calculation-different-between-browsers
		if (game.softMap) { // for larger maps, 1x1 resized (much slower)
			$miniMapCanvas.attr({'width': game.mapTileCount, 'height': game.mapTileCount});
			miniMapImage = contextMiniMap.createImageData(game.mapTileCount, game.mapTileCount);
			miniMapImageData = miniMapImage.data;
			miniMapMultiplier = 1;
		} else {
		 miniMapImage = contextMiniMap.createImageData(game.canvasMiniMapPx, game.canvasMiniMapPx);
		 miniMapImageData = miniMapImage.data;
		 miniMapMultiplier = game.mapTileMultiplier;
  }

  var miniMapImageWidth = miniMapImage.width, miniMapImageHeight = miniMapImage.height;
		for (var x=0; x<miniMapImageWidth; x++) {
   for (var y=0; y<miniMapImageHeight; y++) {
    mapValue = mapArray[x*miniMapMultiplier][y*miniMapMultiplier];
    airValue = airArray[x*miniMapMultiplier][y*miniMapMultiplier];
   
    // get index of the pixel in the array; can also get pixel colour values
    if (game.softMap) {
     var idx = (x + y * game.mapTileCount) * 4; // for larger maps, 1x1 resized (much slower)
    } else {
     var idx = (x + y * game.canvasMiniMapPx) * 4;
    }
    //var r = miniMapImageData[idx + 0];
    //var g = miniMapImageData[idx + 1];
    //var b = miniMapImageData[idx + 2];
    //var a = miniMapImageData[idx + 3];
    
    // water, waves, icebergs, crash: 5591b0
	   if (mapValue <= 0.45 || (mapValue > 3 && mapValue < 5)) {
					 miniMapImageData[idx + 0] = 85; // red
      miniMapImageData[idx + 1] = 145; // green
      miniMapImageData[idx + 2] = 176; // blue
      miniMapImageData[idx + 3] = 255; // alpha
					}
   
    // shallows: 67A0B7
	   if (mapValue > 0.45 && mapValue <= 0.55) {
					 miniMapImageData[idx + 0] = 103; // red
      miniMapImageData[idx + 1] = 160; // green
      miniMapImageData[idx + 2] = 183; // blue
      miniMapImageData[idx + 3] = 255; // alpha
					}
					
    // sand: D3D1A5
	   if (mapValue > 0.55 && mapValue <= 0.6) {
					 miniMapImageData[idx + 0] = 211; // red
      miniMapImageData[idx + 1] = 209; // green
      miniMapImageData[idx + 2] = 165; // blue
      miniMapImageData[idx + 3] = 255; // alpha
					}

    // field & grass: 91B58C
	   if ((mapValue > 0.6 && mapValue < 0.99 && airValue > 0.5)
	     || (mapValue === 2.4 && airValue > 0.5)) {
					 miniMapImageData[idx + 0] = 145; // red
      miniMapImageData[idx + 1] = 181; // green
      miniMapImageData[idx + 2] = 140; // blue
      miniMapImageData[idx + 3] = 255; // alpha
					}

    // field & grass (alternate): 8AAD86
	   if ((mapValue > 0.6 && mapValue < 0.99 && airValue <= 0.5)
	     || (mapValue === 2.4 && airValue <= 0.5)
	     || (mapValue >= 6 && mapValue <= 7.99)) {
					 miniMapImageData[idx + 0] = 138; // red
      miniMapImageData[idx + 1] = 173; // green
      miniMapImageData[idx + 2] = 134; // blue
      miniMapImageData[idx + 3] = 255; // alpha
					}
					
    // hill & mountain: 8c9074
	   if ((mapValue >= 0.99 && mapValue <= 1.4)
	     || (mapValue >= 2.1 && mapValue <= 2.3)
	     || (mapValue >= 5.1 && mapValue <= 5.6)) {
					 miniMapImageData[idx + 0] = 140; // red
      miniMapImageData[idx + 1] = 144; // green
      miniMapImageData[idx + 2] = 116; // blue
      miniMapImageData[idx + 3] = 255; // alpha
					}

   }
  }
  
  var miniMapImage = contextMiniMap.putImageData(miniMapImage, 0, 0);
  if (game.softMap) {
   $miniMapCanvas.width(128).height(128); // for larger maps, 1x1 resized (much slower)
  }
  
  // draw trees on miniMap (always uses game.mapTileMultiplier, not miniMapMultiplier)
  if (game.miniMapTrees) {
		 contextMiniMapSprites.fillStyle = '#477747';
		 for (var x=0; x<game.canvasMiniMapPx; x++) {
		  for (var y=0; y<game.canvasMiniMapPx; y++) {
		   var objectId = 'X'+(x*game.mapTileMultiplier)+'Y'+(y*game.mapTileMultiplier);
		   if (typeof(objects[objectId]) !== "undefined") {
		    if (objects[objectId].type === 'tree') {
		     contextMiniMapSprites.fillRect(x, y, 1, 1);
		    }
		   }
		  }
			}
		}
	} // end drawMiniMap
	
	
	
	// set pixel on miniMap
	function updateMiniMapPixel(x, y) {
  // water, waves, icebergs, crash: 5591b0
  if (mapArray[x][y] <= 0.45 || (mapArray[x][y] > 3 && mapArray[x][y] < 5)) {
		 miniMapPixelData[0] = 85; // red
   miniMapPixelData[1] = 145; // green
   miniMapPixelData[2] = 176; // blue
   miniMapPixelData[3] = 255; // alpha
		}
 
  // shallows: 67A0B7
  if (mapArray[x][y] > 0.45 && mapArray[x][y] <= 0.55) {
		 miniMapPixelData[0] = 103; // red
   miniMapPixelData[1] = 160; // green
   miniMapPixelData[2] = 183; // blue
   miniMapPixelData[3] = 255; // alpha
		}
			
  // sand: D3D1A5
  if (mapArray[x][y] > 0.55 && mapArray[x][y] <= 0.6) {
		 miniMapPixelData[0] = 211; // red
   miniMapPixelData[1] = 209; // green
   miniMapPixelData[2] = 165; // blue
   miniMapPixelData[3] = 255; // alpha
		}

  // field & grass: 91B58C
  if ((mapArray[x][y] > 0.6 && mapArray[x][y] < 0.99 && airArray[x][y] > 0.5)
   || (mapArray[x][y] === 2.4 && airArray[x][y] > 0.5)) {
		 miniMapPixelData[0] = 145; // red
   miniMapPixelData[1] = 181; // green
   miniMapPixelData[2] = 140; // blue
   miniMapPixelData[3] = 255; // alpha
		}

  // field & grass (alternate): 8AAD86
  if ((mapArray[x][y] > 0.6 && mapArray[x][y] < 0.99 && airArray[x][y] <= 0.5)
   || (mapArray[x][y] === 2.4 && airArray[x][y] <= 0.5)
   || (mapArray[x][y] >= 6 && mapArray[x][y] <= 7.99)) {
		 miniMapPixelData[0] = 138; // red
   miniMapPixelData[1] = 173; // green
   miniMapPixelData[2] = 134; // blue
   miniMapPixelData[3] = 255; // alpha
		}
			
  // hill & mountain: 8c9074
  if ((mapArray[x][y] >= 0.99 && mapArray[x][y] <= 1.4)
   || (mapArray[x][y] >= 2.1 && mapArray[x][y] <= 2.3)
   || (mapArray[x][y] >= 5.1 && mapArray[x][y] <= 5.6)) {
		 miniMapPixelData[0] = 140; // red
   miniMapPixelData[1] = 144; // green
   miniMapPixelData[2] = 116; // blue
   miniMapPixelData[3] = 255; // alpha
		}
		
		contextMiniMap.putImageData(miniMapPixel, x, y);
	}
	


 // add marker to miniMap
 function miniMapMarker(x, y, color) {
  color = color || false; // set defaults if parameters are undefined
  if (admin.mini) {
   if (color) {
    $miniMap.append('<div class="miniMapMarker" style="background-color: ' + color + ' ; left: ' + Math.round(x/game.mapTileMultiplier) + 'px; top: ' + Math.round(y/game.mapTileMultiplier) + 'px; width: ' + game.markerSize + 'px; height: ' + game.markerSize + 'px;"></div>');
   } else {
    $miniMap.append('<div class="miniMapMarker" style="left: ' + Math.round(x/game.mapTileMultiplier) + 'px; top: ' + Math.round(y/game.mapTileMultiplier) + 'px; width: ' + game.markerSize + 'px; height: ' + game.markerSize + 'px;"></div>');
		 }
		}
 }
	
	

	// starts off the map generation, seeds the first 4 corners
	function seedMap(dataObject) {
		var x = game.mapSize, y = game.mapSize, tr, tl, t, br, bl, b, r, l, center;
		
		// top left
		dataObject[0][0] = Math.random();
		tl = dataObject[0][0];
		
		// bottom left
		dataObject[0][game.mapSize] = Math.random();
		bl = dataObject[0][game.mapSize];
		
		// top right
		dataObject[game.mapSize][0] = Math.random();
		tr = dataObject[game.mapSize][0];
		
		// bottom right
		dataObject[game.mapSize][game.mapSize] = Math.random();
		br = dataObject[game.mapSize][game.mapSize]
		
		// center
		dataObject[game.mapSize / 2][game.mapSize / 2] = dataObject[0][0] + dataObject[0][game.mapSize] + dataObject[game.mapSize][0] + dataObject[game.mapSize][game.mapSize] / 4;
		dataObject[game.mapSize / 2][game.mapSize / 2] = normalize(dataObject[game.mapSize / 2][game.mapSize / 2]);
		center = dataObject[game.mapSize / 2][game.mapSize / 2];
		
		dataObject[game.mapSize / 2][game.mapSize] = bl + br + center / 3;
		dataObject[game.mapSize / 2][0] = tl + tr + center / 3;
		dataObject[game.mapSize][game.mapSize / 2] = tr + br + center / 3;
		dataObject[0][game.mapSize / 2] = tl + bl + center / 3;
		
		// call displacment 
		midpointDisplacement(dataObject, game.mapSize);
	}






 /* player generation and control */
 
 // set up map, given tile location x, y, or a random suitable tile
 function loadPlayer() {
  
  // if startX and startY are defined, use starting tile, else find a random tile that is walkable by the player
  if (start.tile.x !== false && start.tile.y !== false) {
   // just use start.tile as is
  } else {
   start.tile = randomOneOf(startTilesArray);
  }
  
  // if can't get suitable starting tile, set coordinates to center
  if (!start.tile) {
   console.log('Couldn\'t locate suitable starting tile.');
   status('Something went wrong... please reload the page.');
   start.tile = {x: Math.round(game.mapTileCount/2), y: Math.round(game.mapTileCount/2)};
  }
  
  you.tile.x = start.tile.x;
  you.tile.y = start.tile.y;
  mapOffsetX = you.tile.x - game.mapCanvasHalfTiles;
	 mapOffsetY = you.tile.y - game.mapCanvasHalfTiles;
  drawOffsetX = mapOffsetX * game.tileSize;
  drawOffsetY = mapOffsetY * game.tileSize;
  
  // if player starts with radio, load radio
	 if (you.inventory.radio.count >= 1) {
	  loadRadio();
	 }
  
  // add trail data to starting tile
	 //mapArray[start.tile.x][start.tile.y].trail = mapArray[start.tile.x][start.tile.y].trail*1 + 1;


  // preload sprites tiles
  // 1x1
  sprites1x1Image = new Image();
  sprites1x1Image.src = 'images/sprites-1x1.png';
  sprites1x1Image.onload = function() {
  
   sprites1x1 = [];
   var names1x1 = [
    'you', 'youSleep1', 'youSleep2', 'youSleep3', 'youSleep4', 'youRaft', 'youCanoe', 'youWater', 'youCold', 'youColdRaft', 'youColdCanoe',
    'waves1', 'waves2', 'waves3', 'waves4', 'waves5', 'waves6', 'waves7', 'waves8', 'waves9', 'waves10',
    'grass', 'flowers1', 'flowers2', 'weeds', 'rocks', 'hill1', 'hill2', 'mountain1', 'mountain2',
    'alderSeedling', 'alderTree', 'mapleSeedling', 'mapleTree', 'pineSeedling', 'pineTree', 'stump', 'berries', 'bone', 'ice', 'shell', 'stone1', 'stone2', 'slate', 'quartz',
    'stepStone1', 'stepStone2', 'stepStone3', 'stepStone4', 'stepStone5', 'stepStone6', 'stepStone7', 'stepStone8', 'stepStone9', 'stepStone10',
    'bridge', 'snare', 'snareRabbit', 'hole1', 'hole2', 'hole3', 'hole4', 'map', 'backpack', 'binoculars', 'radio',
    'fire1', 'fire2', 'fire3', 'fire4', 'fire5', 'smoke1', 'smoke2', 'smoke3'
   ];
   for (var i=0, iLimit=names1x1.length; i<iLimit; i++) {
    sprites1x1[names1x1[i]+'Canvas'] = document.createElement('canvas');
    sprites1x1[names1x1[i]+'Canvas'].width = game.tileSize;
	   sprites1x1[names1x1[i]+'Canvas'].height = game.tileSize;
	   sprites1x1[names1x1[i]+'Context'] = sprites1x1[names1x1[i]+'Canvas'].getContext('2d');
	   sprites1x1[names1x1[i]+'Context'].drawImage(sprites1x1Image, 0, game.tileSize*i, game.tileSize, game.tileSize, 0, 0, game.tileSize, game.tileSize);
   }
   
   
	  // 1x2
	  sprites1x2Image = new Image();
	  sprites1x2Image.src = 'images/sprites-1x2.png';
	  sprites1x2Image.onload = function() {
	  
	   sprites1x2 = [];
	   /*
	   var names1x2 = [
	    'fir'
	   ];
    for (var i=0, iLimit=names1x2.length; i<iLimit; i++) {
     sprites1x2[names1x2[i]+'Canvas'] = document.createElement('canvas');
     sprites1x2[names1x2[i]+'Canvas'].width = game.tileSize;
		   sprites1x2[names1x2[i]+'Canvas'].height = game.tileSize*2;
		   sprites1x2[names1x2[i]+'Context'] = sprites1x2[names1x2[i]+'Canvas'].getContext('2d');
		   sprites1x2[names1x2[i]+'Context'].drawImage(sprites1x2Image, 0, game.tileSize*i, game.tileSize, game.tileSize*2, 0, 0, game.tileSize, game.tileSize*2);
    }
    // */
    // youZip
    sprites1x2['youZipCanvas'] = document.createElement('canvas');
    sprites1x2['youZipCanvas'].width = game.tileSize;
	   sprites1x2['youZipCanvas'].height = game.tileSize*2;
	   sprites1x2['youZipContext'] = sprites1x2['youZipCanvas'].getContext('2d');
	   sprites1x2['youZipContext'].drawImage(sprites1x2Image, 0, 0, game.tileSize, game.tileSize*2, 0, 0, game.tileSize, game.tileSize*2);
	   
	   // youColdZip
    sprites1x2['youColdZipCanvas'] = document.createElement('canvas');
    sprites1x2['youColdZipCanvas'].width = game.tileSize;
	   sprites1x2['youColdZipCanvas'].height = game.tileSize*2;
	   sprites1x2['youColdZipContext'] = sprites1x2['youColdZipCanvas'].getContext('2d');
	   sprites1x2['youColdZipContext'].drawImage(sprites1x2Image, 0, game.tileSize*2, game.tileSize, game.tileSize*2, 0, 0, game.tileSize, game.tileSize*2);
	   
    // fir cover
    sprites1x2['firCoverCanvas'] = document.createElement('canvas');
    sprites1x2['firCoverCanvas'].width = game.tileSize;
	   sprites1x2['firCoverCanvas'].height = game.tileSize;
	   sprites1x2['firCoverContext'] = sprites1x2['firCoverCanvas'].getContext('2d');
	   sprites1x2['firCoverContext'].drawImage(sprites1x2Image, 0, game.tileSize*4, game.tileSize, game.tileSize, 0, 0, game.tileSize, game.tileSize);
    // fir (bottom half)
    sprites1x2['firCanvas'] = document.createElement('canvas');
    sprites1x2['firCanvas'].width = game.tileSize;
	   sprites1x2['firCanvas'].height = game.tileSize;
	   sprites1x2['firContext'] = sprites1x2['firCanvas'].getContext('2d');
	   sprites1x2['firContext'].drawImage(sprites1x2Image, 0, game.tileSize*5, game.tileSize, game.tileSize, 0, 0, game.tileSize, game.tileSize);
	   
	   // fir chopped1 cover
    sprites1x2['firChopped1CoverCanvas'] = document.createElement('canvas');
    sprites1x2['firChopped1CoverCanvas'].width = game.tileSize;
	   sprites1x2['firChopped1CoverCanvas'].height = game.tileSize;
	   sprites1x2['firChopped1CoverContext'] = sprites1x2['firChopped1CoverCanvas'].getContext('2d');
	   sprites1x2['firChopped1CoverContext'].drawImage(sprites1x2Image, 0, game.tileSize*6, game.tileSize, game.tileSize, 0, 0, game.tileSize, game.tileSize);
    // fir chopped1 (bottom half)
    sprites1x2['firChopped1Canvas'] = document.createElement('canvas');
    sprites1x2['firChopped1Canvas'].width = game.tileSize;
	   sprites1x2['firChopped1Canvas'].height = game.tileSize;
	   sprites1x2['firChopped1Context'] = sprites1x2['firChopped1Canvas'].getContext('2d');
	   sprites1x2['firChopped1Context'].drawImage(sprites1x2Image, 0, game.tileSize*7, game.tileSize, game.tileSize, 0, 0, game.tileSize, game.tileSize);
	   
	   // fir chopped2 cover
    sprites1x2['firChopped2CoverCanvas'] = document.createElement('canvas');
    sprites1x2['firChopped2CoverCanvas'].width = game.tileSize;
	   sprites1x2['firChopped2CoverCanvas'].height = game.tileSize;
	   sprites1x2['firChopped2CoverContext'] = sprites1x2['firChopped2CoverCanvas'].getContext('2d');
	   sprites1x2['firChopped2CoverContext'].drawImage(sprites1x2Image, 0, game.tileSize*8, game.tileSize, game.tileSize, 0, 0, game.tileSize, game.tileSize);
    // fir chopped2 (bottom half)
    sprites1x2['firChopped2Canvas'] = document.createElement('canvas');
    sprites1x2['firChopped2Canvas'].width = game.tileSize;
	   sprites1x2['firChopped2Canvas'].height = game.tileSize;
	   sprites1x2['firChopped2Context'] = sprites1x2['firChopped2Canvas'].getContext('2d');
	   sprites1x2['firChopped2Context'].drawImage(sprites1x2Image, 0, game.tileSize*9, game.tileSize, game.tileSize, 0, 0, game.tileSize, game.tileSize);
	   
	   // fir chopped3 cover
    sprites1x2['firChopped3CoverCanvas'] = document.createElement('canvas');
    sprites1x2['firChopped3CoverCanvas'].width = game.tileSize;
	   sprites1x2['firChopped3CoverCanvas'].height = game.tileSize;
	   sprites1x2['firChopped3CoverContext'] = sprites1x2['firChopped3CoverCanvas'].getContext('2d');
	   sprites1x2['firChopped3CoverContext'].drawImage(sprites1x2Image, 0, game.tileSize*10, game.tileSize, game.tileSize, 0, 0, game.tileSize, game.tileSize);
    // fir chopped3 (bottom half)
    sprites1x2['firChopped3Canvas'] = document.createElement('canvas');
    sprites1x2['firChopped3Canvas'].width = game.tileSize;
	   sprites1x2['firChopped3Canvas'].height = game.tileSize;
	   sprites1x2['firChopped3Context'] = sprites1x2['firChopped3Canvas'].getContext('2d');
	   sprites1x2['firChopped3Context'].drawImage(sprites1x2Image, 0, game.tileSize*11, game.tileSize, game.tileSize, 0, 0, game.tileSize, game.tileSize);
	   
	   // fir chopped4 cover
    sprites1x2['firChopped4CoverCanvas'] = document.createElement('canvas');
    sprites1x2['firChopped4CoverCanvas'].width = game.tileSize;
	   sprites1x2['firChopped4CoverCanvas'].height = game.tileSize;
	   sprites1x2['firChopped4CoverContext'] = sprites1x2['firChopped4CoverCanvas'].getContext('2d');
	   sprites1x2['firChopped4CoverContext'].drawImage(sprites1x2Image, 0, game.tileSize*12, game.tileSize, game.tileSize, 0, 0, game.tileSize, game.tileSize);
    // fir chopped4 (bottom half)
    sprites1x2['firChopped4Canvas'] = document.createElement('canvas');
    sprites1x2['firChopped4Canvas'].width = game.tileSize;
	   sprites1x2['firChopped4Canvas'].height = game.tileSize;
	   sprites1x2['firChopped4Context'] = sprites1x2['firChopped4Canvas'].getContext('2d');
	   sprites1x2['firChopped4Context'].drawImage(sprites1x2Image, 0, game.tileSize*13, game.tileSize, game.tileSize, 0, 0, game.tileSize, game.tileSize);
	   
	   // fir chopped5 cover
    sprites1x2['firChopped5CoverCanvas'] = document.createElement('canvas');
    sprites1x2['firChopped5CoverCanvas'].width = game.tileSize;
	   sprites1x2['firChopped5CoverCanvas'].height = game.tileSize;
	   sprites1x2['firChopped5CoverContext'] = sprites1x2['firChopped5CoverCanvas'].getContext('2d');
	   sprites1x2['firChopped5CoverContext'].drawImage(sprites1x2Image, 0, game.tileSize*14, game.tileSize, game.tileSize, 0, 0, game.tileSize, game.tileSize);
    // fir chopped5 (bottom half)
    sprites1x2['firChopped5Canvas'] = document.createElement('canvas');
    sprites1x2['firChopped5Canvas'].width = game.tileSize;
	   sprites1x2['firChopped5Canvas'].height = game.tileSize;
	   sprites1x2['firChopped5Context'] = sprites1x2['firChopped5Canvas'].getContext('2d');
	   sprites1x2['firChopped5Context'].drawImage(sprites1x2Image, 0, game.tileSize*15, game.tileSize, game.tileSize, 0, 0, game.tileSize, game.tileSize);
	   
	   // birch cover
    sprites1x2['birchCoverCanvas'] = document.createElement('canvas');
    sprites1x2['birchCoverCanvas'].width = game.tileSize;
	   sprites1x2['birchCoverCanvas'].height = game.tileSize;
	   sprites1x2['birchCoverContext'] = sprites1x2['birchCoverCanvas'].getContext('2d');
	   sprites1x2['birchCoverContext'].drawImage(sprites1x2Image, 0, game.tileSize*16, game.tileSize, game.tileSize, 0, 0, game.tileSize, game.tileSize);
    // birch (bottom half)
    sprites1x2['birchCanvas'] = document.createElement('canvas');
    sprites1x2['birchCanvas'].width = game.tileSize;
	   sprites1x2['birchCanvas'].height = game.tileSize;
	   sprites1x2['birchContext'] = sprites1x2['birchCanvas'].getContext('2d');
	   sprites1x2['birchContext'].drawImage(sprites1x2Image, 0, game.tileSize*17, game.tileSize, game.tileSize, 0, 0, game.tileSize, game.tileSize);
	   
	   // birch chopped1 cover
    sprites1x2['birchChopped1CoverCanvas'] = document.createElement('canvas');
    sprites1x2['birchChopped1CoverCanvas'].width = game.tileSize;
	   sprites1x2['birchChopped1CoverCanvas'].height = game.tileSize;
	   sprites1x2['birchChopped1CoverContext'] = sprites1x2['birchChopped1CoverCanvas'].getContext('2d');
	   sprites1x2['birchChopped1CoverContext'].drawImage(sprites1x2Image, 0, game.tileSize*18, game.tileSize, game.tileSize, 0, 0, game.tileSize, game.tileSize);
    // birch chopped1 (bottom half)
    sprites1x2['birchChopped1Canvas'] = document.createElement('canvas');
    sprites1x2['birchChopped1Canvas'].width = game.tileSize;
	   sprites1x2['birchChopped1Canvas'].height = game.tileSize;
	   sprites1x2['birchChopped1Context'] = sprites1x2['birchChopped1Canvas'].getContext('2d');
	   sprites1x2['birchChopped1Context'].drawImage(sprites1x2Image, 0, game.tileSize*19, game.tileSize, game.tileSize, 0, 0, game.tileSize, game.tileSize);
	   
	   // birch chopped2 cover
    sprites1x2['birchChopped2CoverCanvas'] = document.createElement('canvas');
    sprites1x2['birchChopped2CoverCanvas'].width = game.tileSize;
	   sprites1x2['birchChopped2CoverCanvas'].height = game.tileSize;
	   sprites1x2['birchChopped2CoverContext'] = sprites1x2['birchChopped2CoverCanvas'].getContext('2d');
	   sprites1x2['birchChopped2CoverContext'].drawImage(sprites1x2Image, 0, game.tileSize*20, game.tileSize, game.tileSize, 0, 0, game.tileSize, game.tileSize);
    // birch chopped2 (bottom half)
    sprites1x2['birchChopped2Canvas'] = document.createElement('canvas');
    sprites1x2['birchChopped2Canvas'].width = game.tileSize;
	   sprites1x2['birchChopped2Canvas'].height = game.tileSize;
	   sprites1x2['birchChopped2Context'] = sprites1x2['birchChopped2Canvas'].getContext('2d');
	   sprites1x2['birchChopped2Context'].drawImage(sprites1x2Image, 0, game.tileSize*21, game.tileSize, game.tileSize, 0, 0, game.tileSize, game.tileSize);
	   
	   // birch chopped3 cover
    sprites1x2['birchChopped3CoverCanvas'] = document.createElement('canvas');
    sprites1x2['birchChopped3CoverCanvas'].width = game.tileSize;
	   sprites1x2['birchChopped3CoverCanvas'].height = game.tileSize;
	   sprites1x2['birchChopped3CoverContext'] = sprites1x2['birchChopped3CoverCanvas'].getContext('2d');
	   sprites1x2['birchChopped3CoverContext'].drawImage(sprites1x2Image, 0, game.tileSize*22, game.tileSize, game.tileSize, 0, 0, game.tileSize, game.tileSize);
    // birch chopped3 (bottom half)
    sprites1x2['birchChopped3Canvas'] = document.createElement('canvas');
    sprites1x2['birchChopped3Canvas'].width = game.tileSize;
	   sprites1x2['birchChopped3Canvas'].height = game.tileSize;
	   sprites1x2['birchChopped3Context'] = sprites1x2['birchChopped3Canvas'].getContext('2d');
	   sprites1x2['birchChopped3Context'].drawImage(sprites1x2Image, 0, game.tileSize*23, game.tileSize, game.tileSize, 0, 0, game.tileSize, game.tileSize);
	   
	   // birch chopped4 cover
    sprites1x2['birchChopped4CoverCanvas'] = document.createElement('canvas');
    sprites1x2['birchChopped4CoverCanvas'].width = game.tileSize;
	   sprites1x2['birchChopped4CoverCanvas'].height = game.tileSize;
	   sprites1x2['birchChopped4CoverContext'] = sprites1x2['birchChopped4CoverCanvas'].getContext('2d');
	   sprites1x2['birchChopped4CoverContext'].drawImage(sprites1x2Image, 0, game.tileSize*24, game.tileSize, game.tileSize, 0, 0, game.tileSize, game.tileSize);
    // birch chopped4 (bottom half)
    sprites1x2['birchChopped4Canvas'] = document.createElement('canvas');
    sprites1x2['birchChopped4Canvas'].width = game.tileSize;
	   sprites1x2['birchChopped4Canvas'].height = game.tileSize;
	   sprites1x2['birchChopped4Context'] = sprites1x2['birchChopped4Canvas'].getContext('2d');
	   sprites1x2['birchChopped4Context'].drawImage(sprites1x2Image, 0, game.tileSize*25, game.tileSize, game.tileSize, 0, 0, game.tileSize, game.tileSize);
	   
	   // birch chopped5 cover
    sprites1x2['birchChopped5CoverCanvas'] = document.createElement('canvas');
    sprites1x2['birchChopped5CoverCanvas'].width = game.tileSize;
	   sprites1x2['birchChopped5CoverCanvas'].height = game.tileSize;
	   sprites1x2['birchChopped5CoverContext'] = sprites1x2['birchChopped5CoverCanvas'].getContext('2d');
	   sprites1x2['birchChopped5CoverContext'].drawImage(sprites1x2Image, 0, game.tileSize*26, game.tileSize, game.tileSize, 0, 0, game.tileSize, game.tileSize);
    // birch chopped5 (bottom half)
    sprites1x2['birchChopped5Canvas'] = document.createElement('canvas');
    sprites1x2['birchChopped5Canvas'].width = game.tileSize;
	   sprites1x2['birchChopped5Canvas'].height = game.tileSize;
	   sprites1x2['birchChopped5Context'] = sprites1x2['birchChopped5Canvas'].getContext('2d');
	   sprites1x2['birchChopped5Context'].drawImage(sprites1x2Image, 0, game.tileSize*27, game.tileSize, game.tileSize, 0, 0, game.tileSize, game.tileSize);
	   
	   // tree flag
    sprites1x2['treeFlagCanvas'] = document.createElement('canvas');
    sprites1x2['treeFlagCanvas'].width = game.tileSize;
	   sprites1x2['treeFlagCanvas'].height = game.tileSize;
	   sprites1x2['treeFlagContext'] = sprites1x2['treeFlagCanvas'].getContext('2d');
	   sprites1x2['treeFlagContext'].drawImage(sprites1x2Image, 0, game.tileSize*29, game.tileSize, game.tileSize, 0, 0, game.tileSize, game.tileSize);
	   
	   // tree sign
    sprites1x2['treeSignCanvas'] = document.createElement('canvas');
    sprites1x2['treeSignCanvas'].width = game.tileSize;
	   sprites1x2['treeSignCanvas'].height = game.tileSize;
	   sprites1x2['treeSignContext'] = sprites1x2['treeSignCanvas'].getContext('2d');
	   sprites1x2['treeSignContext'].drawImage(sprites1x2Image, 0, game.tileSize*31, game.tileSize, game.tileSize, 0, 0, game.tileSize, game.tileSize);


    // 2x2
    sprites2x2Image = new Image();
    sprites2x2Image.src = 'images/sprites-2x2.png';
    sprites2x2Image.onload = function() {
    
     sprites2x2 = [];
	    var names2x2 = [
	     'range1', 'iceberg', 'camp1', 'camp2', 'camp3', 'camp4', 'raft', 'raftSplashLeft', 'raftSplashRight', 'raftSplashUp', 'raftSplashDown'
	    ];
	    for (var i=0, iLimit=names2x2.length; i<iLimit; i++) {
	     sprites2x2[names2x2[i]+'Canvas'] = document.createElement('canvas');
	     sprites2x2[names2x2[i]+'Canvas'].width = game.tileSize*2;
			   sprites2x2[names2x2[i]+'Canvas'].height = game.tileSize*2;
			   sprites2x2[names2x2[i]+'Context'] = sprites2x2[names2x2[i]+'Canvas'].getContext('2d');
			   sprites2x2[names2x2[i]+'Context'].drawImage(sprites2x2Image, 0, game.tileSize*i*2, game.tileSize*2, game.tileSize*2, 0, 0, game.tileSize*2, game.tileSize*2);
	    }


     // 3x2
	    sprites3x2Image = new Image();
	    sprites3x2Image.src = 'images/sprites-3x2.png';
	    sprites3x2Image.onload = function() {
	    
		    sprites3x2 = [];
		    var names3x2 = [
		     'cave'
		    ];
		    for (var i=0, iLimit=names3x2.length; i<iLimit; i++) {
		     sprites3x2[names3x2[i]+'Canvas'] = document.createElement('canvas');
		     sprites3x2[names3x2[i]+'Canvas'].width = game.tileSize*3;
				   sprites3x2[names3x2[i]+'Canvas'].height = game.tileSize*2;
				   sprites3x2[names3x2[i]+'Context'] = sprites3x2[names3x2[i]+'Canvas'].getContext('2d');
				   sprites3x2[names3x2[i]+'Context'].drawImage(sprites3x2Image, 0, game.tileSize*i*3, game.tileSize*3, game.tileSize*2, 0, 0, game.tileSize*3, game.tileSize*2);
		    }
	
	    
	     // 3x3
	     sprites3x3Image = new Image();
	     sprites3x3Image.src = 'images/sprites-3x3.png';
	     sprites3x3Image.onload = function() {
	
			    sprites3x3 = [];
			    var names3x3 = [
			     'letterOther', 'letterA', 'letterB', 'letterC', 'letterD', 'letterE', 'letterF', 'letterG', 'letterH', 'letterI', 
			     'letterJ', 'letterK', 'letterL', 'letterM', 'letterN', 'letterO', 'letterP', 'letterQ', 'letterR', 'letterS', 
			     'letterT', 'letterU', 'letterV', 'letterW', 'letterX', 'letterY', 'letterZ', 'range2Full', // range2Full is unused
			     'platform', 'zip1', 'zip2', 'zip3', 'slateRoof', 'roofPillars', 'quarry', 'canoeHorz', 'canoeVert'
			    ];
			    for (var i=0, iLimit=names3x3.length; i<iLimit; i++) {
			     sprites3x3[names3x3[i]+'Canvas'] = document.createElement('canvas');
			     sprites3x3[names3x3[i]+'Canvas'].width = game.tileSize*3;
					   sprites3x3[names3x3[i]+'Canvas'].height = game.tileSize*3;
					   sprites3x3[names3x3[i]+'Context'] = sprites3x3[names3x3[i]+'Canvas'].getContext('2d');
					   sprites3x3[names3x3[i]+'Context'].drawImage(sprites3x3Image, 0, game.tileSize*i*3, game.tileSize*3, game.tileSize*3, 0, 0, game.tileSize*3, game.tileSize*3);
			    }
			    // range2 cover
			    sprites3x3['range2CoverCanvas'] = document.createElement('canvas');
		     sprites3x3['range2CoverCanvas'].width = game.tileSize*3;
				   sprites3x3['range2CoverCanvas'].height = game.tileSize*1;
				   sprites3x3['range2CoverContext'] = sprites3x3['range2CoverCanvas'].getContext('2d');
				   sprites3x3['range2CoverContext'].drawImage(sprites3x3Image, 0, game.tileSize*81, game.tileSize*3, game.tileSize*1, 0, 0, game.tileSize*3, game.tileSize*1);
			    // range2 (bottom half)
			    sprites3x3['range2Canvas'] = document.createElement('canvas');
		     sprites3x3['range2Canvas'].width = game.tileSize*3;
				   sprites3x3['range2Canvas'].height = game.tileSize*2;
				   sprites3x3['range2Context'] = sprites3x3['range2Canvas'].getContext('2d');
				   sprites3x3['range2Context'].drawImage(sprites3x3Image, 0, game.tileSize*82, game.tileSize*3, game.tileSize*2, 0, 0, game.tileSize*3, game.tileSize*2);


	      // 9x3
			    sprites9x3Image = new Image();
			    sprites9x3Image.src = 'images/sprites-9x3.png';
			    sprites9x3Image.onload = function() {
			    
				    sprites9x3 = [];
				    /*
				    var names9x3 = [
				     'helicopter'
				    ];
				    for (var i=0, iLimit=names9x3.length; i<iLimit; i++) {
				     sprites9x3[names9x3[i]+'Canvas'] = document.createElement('canvas');
				     sprites9x3[names9x3[i]+'Canvas'].width = game.tileSize*9;
						   sprites9x3[names9x3[i]+'Canvas'].height = game.tileSize*3;
						   sprites9x3[names9x3[i]+'Context'] = sprites9x3[names9x3[i]+'Canvas'].getContext('2d');
						   sprites9x3[names9x3[i]+'Context'].drawImage(sprites9x3Image, 0, game.tileSize*i*9, game.tileSize*9, game.tileSize*3, 0, 0, game.tileSize*9, game.tileSize*3);
			     }
			     // */
				    // helicopter left landed cover
				    sprites9x3['helicopterLeftLandedCoverCanvas'] = document.createElement('canvas');
			     sprites9x3['helicopterLeftLandedCoverCanvas'].width = game.tileSize*9;
					   sprites9x3['helicopterLeftLandedCoverCanvas'].height = game.tileSize*2;
					   sprites9x3['helicopterLeftLandedCoverContext'] = sprites9x3['helicopterLeftLandedCoverCanvas'].getContext('2d');
					   sprites9x3['helicopterLeftLandedCoverContext'].drawImage(sprites9x3Image, 0, 0, game.tileSize*9, game.tileSize*2, 0, 0, game.tileSize*9, game.tileSize*2);
					   // helicopter left landed (bottom row)
				    sprites9x3['helicopterLeftLandedCanvas'] = document.createElement('canvas');
			     sprites9x3['helicopterLeftLandedCanvas'].width = game.tileSize*9;
					   sprites9x3['helicopterLeftLandedCanvas'].height = game.tileSize*1;
					   sprites9x3['helicopterLeftLandedContext'] = sprites9x3['helicopterLeftLandedCanvas'].getContext('2d');
					   sprites9x3['helicopterLeftLandedContext'].drawImage(sprites9x3Image, 0, game.tileSize*2, game.tileSize*9, game.tileSize*1, 0, 0, game.tileSize*9, game.tileSize*1);
					   
					   // helicopter left 1
				    sprites9x3['helicopterLeft1Canvas'] = document.createElement('canvas');
			     sprites9x3['helicopterLeft1Canvas'].width = game.tileSize*9;
					   sprites9x3['helicopterLeft1Canvas'].height = game.tileSize*3;
					   sprites9x3['helicopterLeft1Context'] = sprites9x3['helicopterLeft1Canvas'].getContext('2d');
					   sprites9x3['helicopterLeft1Context'].drawImage(sprites9x3Image, 0, game.tileSize*3, game.tileSize*9, game.tileSize*3, 0, 0, game.tileSize*9, game.tileSize*3);
					   
					   // helicopter left 2
				    sprites9x3['helicopterLeft2Canvas'] = document.createElement('canvas');
			     sprites9x3['helicopterLeft2Canvas'].width = game.tileSize*9;
					   sprites9x3['helicopterLeft2Canvas'].height = game.tileSize*3;
					   sprites9x3['helicopterLeft2Context'] = sprites9x3['helicopterLeft2Canvas'].getContext('2d');
					   sprites9x3['helicopterLeft2Context'].drawImage(sprites9x3Image, 0, game.tileSize*6, game.tileSize*9, game.tileSize*3, 0, 0, game.tileSize*9, game.tileSize*3);
					   
					   // helicopter left 1 move
				    sprites9x3['helicopterLeft1TiltCanvas'] = document.createElement('canvas');
			     sprites9x3['helicopterLeft1TiltCanvas'].width = game.tileSize*9;
					   sprites9x3['helicopterLeft1TiltCanvas'].height = game.tileSize*3;
					   sprites9x3['helicopterLeft1TiltContext'] = sprites9x3['helicopterLeft1TiltCanvas'].getContext('2d');
					   sprites9x3['helicopterLeft1TiltContext'].drawImage(sprites9x3Image, 0, game.tileSize*9, game.tileSize*9, game.tileSize*3, 0, 0, game.tileSize*9, game.tileSize*3);
					   
					   // helicopter left 2 move
				    sprites9x3['helicopterLeft2TiltCanvas'] = document.createElement('canvas');
			     sprites9x3['helicopterLeft2TiltCanvas'].width = game.tileSize*9;
					   sprites9x3['helicopterLeft2TiltCanvas'].height = game.tileSize*3;
					   sprites9x3['helicopterLeft2TiltContext'] = sprites9x3['helicopterLeft2TiltCanvas'].getContext('2d');
					   sprites9x3['helicopterLeft2TiltContext'].drawImage(sprites9x3Image, 0, game.tileSize*12, game.tileSize*9, game.tileSize*3, 0, 0, game.tileSize*9, game.tileSize*3);
					   
					   // helicopter right landed cover
				    sprites9x3['helicopterRightLandedCoverCanvas'] = document.createElement('canvas');
			     sprites9x3['helicopterRightLandedCoverCanvas'].width = game.tileSize*9;
					   sprites9x3['helicopterRightLandedCoverCanvas'].height = game.tileSize*2;
					   sprites9x3['helicopterRightLandedCoverContext'] = sprites9x3['helicopterRightLandedCoverCanvas'].getContext('2d');
					   sprites9x3['helicopterRightLandedCoverContext'].drawImage(sprites9x3Image, 0, game.tileSize*15, game.tileSize*9, game.tileSize*2, 0, 0, game.tileSize*9, game.tileSize*2);
					   // helicopter right landed (bottom row)
				    sprites9x3['helicopterRightLandedCanvas'] = document.createElement('canvas');
			     sprites9x3['helicopterRightLandedCanvas'].width = game.tileSize*9;
					   sprites9x3['helicopterRightLandedCanvas'].height = game.tileSize*1;
					   sprites9x3['helicopterRightLandedContext'] = sprites9x3['helicopterRightLandedCanvas'].getContext('2d');
					   sprites9x3['helicopterRightLandedContext'].drawImage(sprites9x3Image, 0, game.tileSize*17, game.tileSize*9, game.tileSize*1, 0, 0, game.tileSize*9, game.tileSize*1);
					   
					   // helicopter right 1
				    sprites9x3['helicopterRight1Canvas'] = document.createElement('canvas');
			     sprites9x3['helicopterRight1Canvas'].width = game.tileSize*9;
					   sprites9x3['helicopterRight1Canvas'].height = game.tileSize*3;
					   sprites9x3['helicopterRight1Context'] = sprites9x3['helicopterRight1Canvas'].getContext('2d');
					   sprites9x3['helicopterRight1Context'].drawImage(sprites9x3Image, 0, game.tileSize*18, game.tileSize*9, game.tileSize*3, 0, 0, game.tileSize*9, game.tileSize*3);
					   
					   // helicopter right 2
				    sprites9x3['helicopterRight2Canvas'] = document.createElement('canvas');
			     sprites9x3['helicopterRight2Canvas'].width = game.tileSize*9;
					   sprites9x3['helicopterRight2Canvas'].height = game.tileSize*3;
					   sprites9x3['helicopterRight2Context'] = sprites9x3['helicopterRight2Canvas'].getContext('2d');
					   sprites9x3['helicopterRight2Context'].drawImage(sprites9x3Image, 0, game.tileSize*21, game.tileSize*9, game.tileSize*3, 0, 0, game.tileSize*9, game.tileSize*3);
					   
					   // helicopter right 1 move
				    sprites9x3['helicopterRight1TiltCanvas'] = document.createElement('canvas');
			     sprites9x3['helicopterRight1TiltCanvas'].width = game.tileSize*9;
					   sprites9x3['helicopterRight1TiltCanvas'].height = game.tileSize*3;
					   sprites9x3['helicopterRight1TiltContext'] = sprites9x3['helicopterRight1TiltCanvas'].getContext('2d');
					   sprites9x3['helicopterRight1TiltContext'].drawImage(sprites9x3Image, 0, game.tileSize*24, game.tileSize*9, game.tileSize*3, 0, 0, game.tileSize*9, game.tileSize*3);
					   
					   // helicopter right 2 move
				    sprites9x3['helicopterRight2TiltCanvas'] = document.createElement('canvas');
			     sprites9x3['helicopterRight2TiltCanvas'].width = game.tileSize*9;
					   sprites9x3['helicopterRight2TiltCanvas'].height = game.tileSize*3;
					   sprites9x3['helicopterRight2TiltContext'] = sprites9x3['helicopterRight2TiltCanvas'].getContext('2d');
					   sprites9x3['helicopterRight2TiltContext'].drawImage(sprites9x3Image, 0, game.tileSize*27, game.tileSize*9, game.tileSize*3, 0, 0, game.tileSize*9, game.tileSize*3);

					   // helicopter shadow left
				    sprites9x3['helicopterLeftShadowCanvas'] = document.createElement('canvas');
			     sprites9x3['helicopterLeftShadowCanvas'].width = game.tileSize*9;
					   sprites9x3['helicopterLeftShadowCanvas'].height = game.tileSize;
					   sprites9x3['helicopterLeftShadowContext'] = sprites9x3['helicopterLeftShadowCanvas'].getContext('2d');
					   sprites9x3['helicopterLeftShadowContext'].drawImage(sprites9x3Image, 0, game.tileSize*32, game.tileSize*9, game.tileSize, 0, 0, game.tileSize*9, game.tileSize);
				    // helicopter shadow right
				    sprites9x3['helicopterRightShadowCanvas'] = document.createElement('canvas');
			     sprites9x3['helicopterRightShadowCanvas'].width = game.tileSize*9;
					   sprites9x3['helicopterRightShadowCanvas'].height = game.tileSize;
					   sprites9x3['helicopterRightShadowContext'] = sprites9x3['helicopterRightShadowCanvas'].getContext('2d');
					   sprites9x3['helicopterRightShadowContext'].drawImage(sprites9x3Image, 0, game.tileSize*35, game.tileSize*9, game.tileSize, 0, 0, game.tileSize*9, game.tileSize);
	
	
		      // 9x6
				    sprites9x6Image = new Image();
				    sprites9x6Image.src = 'images/sprites-9x6.png';
				    sprites9x6Image.onload = function() {
				    
					    sprites9x6 = [];
					    /*
					    var names9x6 = [
					     'crash'
					    ];
					    for (var i=0, iLimit=names9x6.length; i<iLimit; i++) {
					     sprites9x6[names9x6[i]+'Canvas'] = document.createElement('canvas');
					     sprites9x6[names9x6[i]+'Canvas'].width = game.tileSize*9;
							   sprites9x6[names9x6[i]+'Canvas'].height = game.tileSize*6;
							   sprites9x6[names9x6[i]+'Context'] = sprites9x6[names9x6[i]+'Canvas'].getContext('2d');
							   sprites9x6[names9x6[i]+'Context'].drawImage(sprites9x6Image, 0, game.tileSize*i*9, game.tileSize*9, game.tileSize*6, 0, 0, game.tileSize*9, game.tileSize*6);
				     }
				     // */
					    // crash cover
					    sprites9x6['crashCoverCanvas'] = document.createElement('canvas');
				     sprites9x6['crashCoverCanvas'].width = game.tileSize*9;
						   sprites9x6['crashCoverCanvas'].height = game.tileSize*3;
						   sprites9x6['crashCoverContext'] = sprites9x6['crashCoverCanvas'].getContext('2d');
						   sprites9x6['crashCoverContext'].drawImage(sprites9x6Image, 0, 0, game.tileSize*9, game.tileSize*3, 0, 0, game.tileSize*9, game.tileSize*3);
					    // crash (bottom half)
					    sprites9x6['crashCanvas'] = document.createElement('canvas');
				     sprites9x6['crashCanvas'].width = game.tileSize*9;
						   sprites9x6['crashCanvas'].height = game.tileSize*3;
						   sprites9x6['crashContext'] = sprites9x6['crashCanvas'].getContext('2d');
						   sprites9x6['crashContext'].drawImage(sprites9x6Image, 0, game.tileSize*3, game.tileSize*9, game.tileSize*3, 0, 0, game.tileSize*9, game.tileSize*3);
	
	
			      // 15x10
					    sprites15x10Image = new Image();
					    sprites15x10Image.src = 'images/sprites-15x10.png';
					    sprites15x10Image.onload = function() {
					    
						    sprites15x10 = [];
						    var names15x10 = [
						     'fieldStation', 'fieldStationCover'
						    ];
						    for (var i=0, iLimit=names15x10.length; i<iLimit; i++) {
						     sprites15x10[names15x10[i]+'Canvas'] = document.createElement('canvas');
						     sprites15x10[names15x10[i]+'Canvas'].width = game.tileSize*15;
								   sprites15x10[names15x10[i]+'Canvas'].height = game.tileSize*10;
								   sprites15x10[names15x10[i]+'Context'] = sprites15x10[names15x10[i]+'Canvas'].getContext('2d');
								   sprites15x10[names15x10[i]+'Context'].drawImage(sprites15x10Image, 0, game.tileSize*i*10, game.tileSize*15, game.tileSize*10, 0, 0, game.tileSize*15, game.tileSize*10);
					     }
		
					     // fill miniMapFog canvas at start
								  if (admin.mini) {
				 				  contextMiniMapFog.globalCompositeOperation = "source-over";
					 			  contextMiniMapFog.fillStyle = miniMapFogColor;
						 		  contextMiniMapFog.fillRect(0, 0, game.canvasMiniMapW, game.canvasMiniMapH);
			       }
			       if (admin.mini || game.softMap) { drawMiniMap(); }
			
				      updateInventory();
				      $aHand.click();
				      $('#loading').hide();
				      cursor.offset = $system.offset();
				      $system.show();
				      $('#sideBoxes').show();
				      // set mapTerrain background to waves after brief delay, to avoid blinking effect
	         requestTimeout(function(){ $mapTerrain.css('background', '#4c829e url(\'images/waves-deep.gif\') 0 0 repeat'); return false; }, 50);
				      startTilesArray = null;
				      if (admin.heli) { generateHelicopter(); }
				      
				      // start game loop
				      drawLoop = requestInterval(drawMap, game.loopRate); // loop
				      console.log('Game loaded in ' + (clockTime()-s) +'ms.');

        } // 15x10
       } // 9x6
      } // 9x3
     } // 3x3
    } // 3x2
   } // 2x2
  } // 1x2
 } // 1x1

 // start player control (arrow keys, spacebar, map)
 $(document).bind({
  keydown: function(event) {
   if (you.status.paused1 === false && you.status.paused2 === false) {
    //console.log('pressed key ' + event.keyCode);

    // if asleep, wake up; else walk
    if (you.status.sleep) {
     you.status.sleep--;
     if (you.status.sleep === 0) {
      you.animating.stand = 3;
     }
    } else {
     switch (event.keyCode) {
     
      case 37: // left arrow
      case 65: // a
       event.preventDefault();
       walk('left', 1);
       return false;
       break;
      
      case 38: // up arrow
      case 87: // w
       event.preventDefault();
	      walk('up', 1);
	      return false;
	      break;
	     
	     case 39: // right arrow
      case 68: // d
       event.preventDefault();
	      walk('right', 1);
	      return false;
	      break;
	     
	     case 40: // down arrow
      case 83: // s
       event.preventDefault();
	      walk('down', 1);
	      return false;
	      break;
	     
	     case 27: // esc
	      event.preventDefault();
	      // if cacheInventory is showing, close, otherwise revert to hand action
	      // only when not in helicopter
	      if (you.on.helicopter === false) {
 	      if ($cacheInventory.is(':visible')) {
  	      $('#closeCacheInventory').click();
 	      } else {
 	       $aHand.click();
 	      }
 	     }
	      return false;
	      break;
	     
	     case 78: // n
	      event.preventDefault();
	      // only when not in helicopter
	      if (you.on.helicopter === false) {
		      var $nextAction = $('#actions li.selected').next(':not(.craft)');
		      while (!$nextAction.is(':visible')) {
		       $nextAction = $nextAction.next(':not(.craft)');
		       if ($nextAction.length === 0) {
		        $nextAction = $('#actions li').first(); // note that first (hand) will never be hidden or craft, when not in helicopter
		       }
		      } 
		      $nextAction.click();
		     }
		     return false;
		     break;
	     
	     default:
	      break;
     } // end switch

	   }

   // else pressed key, but player control is paused
   } else {
    switch (event.keyCode) {
    
     case 27: // esc
	     event.preventDefault();
	     if ($letterSelectionBox.is(':visible')) {
	      $('#closeLetterSelection').click();
	     } else if ($signInputBox.is(':visible')) {
	      $('#closeSignInput').click();
	     }
	     return false;
	     break;
    
     default:
	     break;
	     
    } // end switch
    //event.preventDefault();
    //return false; // removed this as it prevented typing into sign input box
   }
  }
 });

 } // end setupMap



 // given movement direction and steps, move you
 function walk(direction, steps) {
  $cursor.removeClass();
  if (admin.mini && admin.fog && !$miniMapFog.is(':visible')) { $miniMapFog.show(); }
 
  var okayToWalk = false, moveRaft = false, moveCanoe = false, bumpRaft = false, bumpCanoe = false, enterCache = false, enterWater = false;
  if (direction === 'left' || direction === 'up') { axisModifier = -1; } else { axisModifier = 1; }
  
  var futureSpriteX = you.tile.x;
  var futureSpriteY = you.tile.y;
  
  if (direction === 'left' || direction === 'right') {
   futureSpriteX = futureSpriteX+(steps*axisModifier);
  } else if (direction === 'up' || direction === 'down') {
   futureSpriteY = futureSpriteY+(steps*axisModifier);
  }
  
  // check if futuresprite is within map limits
  if ((futureSpriteX < 0) || (futureSpriteX > game.mapTileMax) || (futureSpriteY < 0) || (futureSpriteY > game.mapTileMax)) {
   okayToWalk = false;
   return false;
  }
  
  // get terrain of futuresprite tile
  var futureSpriteTerrainData = mapArray[futureSpriteX][futureSpriteY];
  var youTileId = 'X'+you.tile.x+'Y'+you.tile.y;
  var objectId = 'X'+futureSpriteX+'Y'+futureSpriteY;
  var intersectObject = objects[objectId];


  // check if player is on raft
  if (you.on.raft) {
   // check future location of raft object (top left tile)
   var futureRaftX = rafts[you.on.raft].x;
   var futureRaftY = rafts[you.on.raft].y;
   if (direction === 'left' || direction === 'right') {
    futureRaftX = futureRaftX+(steps*axisModifier);
   } else if (direction === 'up' || direction === 'down') {
    futureRaftY = futureRaftY+(steps*axisModifier);
   }
   
   // if future raft tiles are not outside of map
   if (futureRaftX >= 0 && futureRaftX+1 <= game.mapTileMax && futureRaftY >= 0 && futureRaftY+1 <= game.mapTileMax) {
	   var futureRaftTerrain = mapArray[futureRaftX][futureRaftY];
	   var futureRaftTerrainX1 = mapArray[futureRaftX+1][futureRaftY];
	   var futureRaftTerrainY1 = mapArray[futureRaftX][futureRaftY+1];
	   var futureRaftTerrainX1Y1 = mapArray[futureRaftX+1][futureRaftY+1];
	   var futureRaftObject = objects['X'+futureRaftX+'Y'+futureRaftY]; // uses futureRaftX, futureRaftY, so not the same as objects[objectId]!
	   var futureRaftObjectX1 = objects['X'+(futureRaftX+1)+'Y'+futureRaftY];
	   var futureRaftObjectY1 = objects['X'+futureRaftX+'Y'+(futureRaftY+1)];
	   var futureRaftObjectX1Y1 = objects['X'+(futureRaftX+1)+'Y'+(futureRaftY+1)];
	   if (direction === 'left') {
	    if (futureRaftTerrain >= raftMoveMin && futureRaftTerrain <= raftMoveMax && futureRaftTerrainY1 >= raftMoveMin && futureRaftTerrainY1 <= raftMoveMax && typeof(futureRaftObject) === "undefined" && typeof(futureRaftObjectY1) === "undefined") {
	     okayToWalk = true;
	     moveRaft = true;
	    }
	   } else if (direction === 'up') {
	    if (futureRaftTerrain >= raftMoveMin && futureRaftTerrain <= raftMoveMax && futureRaftTerrainX1 >= raftMoveMin && futureRaftTerrainX1 <= raftMoveMax && typeof(futureRaftObject) === "undefined" && typeof(futureRaftObjectX1) === "undefined") {
	     okayToWalk = true;
	     moveRaft = true;
	    }
	   } else if (direction === 'right') {
	    if (futureRaftTerrainX1 >= raftMoveMin && futureRaftTerrainX1 <= raftMoveMax && futureRaftTerrainX1Y1 >= raftMoveMin && futureRaftTerrainX1Y1 <= raftMoveMax && typeof(futureRaftObjectX1) === "undefined" && typeof(futureRaftObjectX1Y1) === "undefined") {
	     okayToWalk = true;
	     moveRaft = true;
	    }
	   } else if (direction === 'down') {
	    if (futureRaftTerrainY1 >= raftMoveMin && futureRaftTerrainY1 <= raftMoveMax && futureRaftTerrainX1Y1 >= raftMoveMin && futureRaftTerrainX1Y1 <= raftMoveMax && typeof(futureRaftObjectY1) === "undefined" && typeof(futureRaftObjectX1Y1) === "undefined") {
	     okayToWalk = true;
	     moveRaft = true;
	    }
	   }
	   
	   // if future raft tiles are on waves, player is bumped in random direction
	   if (moveRaft && (futureRaftTerrain <= 0.05 || futureRaftTerrainX1 <= 0.05 || futureRaftTerrainY1 <= 0.05 || futureRaftTerrainX1Y1 <= 0.05)) {
	    bumpRaft = true;
	   }
	  
	   // if player is on raft and moveRaft is false, then raft is stuck, so allow player to walk
	   if (moveRaft === false && futureSpriteTerrainData > you.walk.min && futureSpriteTerrainData <= you.walk.max) {
	    okayToWalk = true;
	   // raft + special walkable tiles
	   } else if (moveRaft === false && $.inArray(futureSpriteTerrainData, specialWalkable) > -1) {
	    okayToWalk = true;
	   }
	  
	  // else future raft location is outside of map
	  } else {
	   okayToWalk = false;
	   moveRaft = false;
	  }


	 // else if player is on canoe
	 } else if (you.on.canoe) {
   // if future tiles are not outside of map
   if (futureSpriteX >= 0 && futureSpriteX <= game.mapTileMax && futureSpriteY >= 0 && futureSpriteY <= game.mapTileMax) {
    if (futureSpriteTerrainData >= canoeMoveMin && futureSpriteTerrainData <= canoeMoveMax && typeof(objects[objectId]) === "undefined") {
     okayToWalk = true;
     moveCanoe = true;
    }
	  	// if future tiles are on waves, player is bumped in random direction
	   if (moveCanoe && futureSpriteTerrainData <= 0.05) {
	    bumpCanoe = true;
	   }
	   // if player is on canoe and moveCanoe is false, then canoe is stuck, so allow player to walk
	   if (moveCanoe === false && futureSpriteTerrainData > you.walk.min && futureSpriteTerrainData <= you.walk.max) {
	    okayToWalk = true;
	   // raft + special walkable tiles
	   } else if (moveCanoe === false && $.inArray(futureSpriteTerrainData, specialWalkable) > -1) {
	    okayToWalk = true;
	   }
	  // else future location is outside of map
	  } else {
	   okayToWalk = false;
	   moveCanoe = false;
	  }

  // else not on vehicle, check if tile is walkable
  } else if (futureSpriteTerrainData > you.walk.min && futureSpriteTerrainData <= you.walk.max) {
   okayToWalk = true;
   
  // special walkable tiles
  } else if ($.inArray(futureSpriteTerrainData, specialWalkable) > -1) {
   okayToWalk = true;
   
  // if player has boots, okay to walk on higher terrain or tiles on either side of caves
  } else if (you.inventory.boots.count >= 1 && ((futureSpriteTerrainData > you.walk.min && futureSpriteTerrainData <= 1) || futureSpriteTerrainData === 2.1 || futureSpriteTerrainData === 2.3)) {
   okayToWalk = true;
  
  // else if not tile is not walkable, check if it is water and if player has stones
  } else {
   if (futureSpriteTerrainData > stepStoneMin && futureSpriteTerrainData <= stepStoneMax && okayToWalk === false && admin.fly === false && you.on.helicopter === false && you.inventory.stone.count > 0) {
    // if there is not already an object on this tile
    if (typeof(objects[objectId]) === "undefined") {
     
     okayToWalk = true;
     
     objects[objectId] = {'type': 'stepstone', 'timer': stepStoneSink, 'x': futureSpriteX, 'y': futureSpriteY};
     you.inventory.stone.count--;
     updateInventory();
     $inventoryGuide.empty(); // clear inventory text in case it says you can't carry any more items
    
    // else if there is a shell on the tile
    } else if (intersectObject.type === 'shell') {
     okayToWalk = true;
     enterWater = true;
    }

   // else if tile is water and player does not have stones
   } else if (
    futureSpriteTerrainData <= you.walk.min && you.inventory.stone.count <= 0 && okayToWalk === false && admin.fly === false && you.on.helicopter === false
     // and player is not currently standing on water (unless on stepstones or bridge), okay to walk into water
     && (mapArray[you.tile.x][you.tile.y] > you.walk.min || typeof(objects['X'+you.tile.x+'Y'+you.tile.y]) !== "undefined")
    ) {
	   okayToWalk = true;
	   // if there is an object on the tile, check to see if it is a stepstone, bridge, raft, or canoe else player falls into water
	   if (intersectObject) {
	    if (intersectObject.type !== 'stepstone' && intersectObject.type !== 'bridge' && intersectObject.type !== 'raft' && intersectObject.type !== 'canoe') {
	     enterWater = true;
	    }
	   } else {
	    enterWater = true;
	   }
	  }
  }
  
  // if walking on iceberg without boots, player becomes cold
  if (futureSpriteTerrainData >= 3 && futureSpriteTerrainData < 4 && you.inventory.boots.count <= 0 && you.on.helicopter === false) {
   you.status.cold = true;
   you.updateEnergy();
  }
  
  // if admin.fly, can always walk
  if (admin.fly) { okayToWalk = true; }
  if (you.on.helicopter) { okayToWalk = true; }

  // if not in helicopter
  if (you.on.helicopter === false) {

	  // check for intersections with walkable objects
	  if (typeof(intersectObject) !== "undefined") {
	   if (intersectObject.type === 'stepstone' || intersectObject.type === 'bridge' || intersectObject.type === 'raft' || intersectObject.type === 'canoe') {
	    okayToWalk = true;
	   }
	   // check entering cache
	   if (
	     intersectObject.type === 'camp'
	     || intersectObject.type === 'field station'
	     || (intersectObject.type === 'quarry' && intersectObject.part === 5)
	     // can only enter caves or crash if walking up
	     || ((intersectObject.type === 'cave' || intersectObject.type === 'crash') && direction === 'up')
	    ) {
	    okayToWalk = true;
	    enterCache = true;
	   }
	  } // end if not undefined
    
	  // check for intersections with fire
	  if (typeof(fires[objectId]) !== "undefined") {
	   if (!admin.fly) { okayToWalk = false; }
	   you.status.cold = false;
	   you.updateEnergy(-2);
	  }
	  
	  // make sure sprite doesn't walk through top of cave or crash
	  if (typeof(objects['X'+you.tile.x+'Y'+you.tile.y]) !== "undefined") {
	   if ((objects['X'+you.tile.x+'Y'+you.tile.y].type === 'cave' || objects['X'+you.tile.x+'Y'+you.tile.y].type === 'crash') && direction === 'up') {
		   if (!admin.fly) { okayToWalk = false; }
		  }
	  }
  } // end if not in helicopter

  if (okayToWalk || admin.fly) {

   // if not on helicopter
   if (you.on.helicopter === false) {
   
		  // check for intersections with objects
		  if (typeof(intersectObject) !== "undefined") {
		   var objectId = 'X'+futureSpriteX+'Y'+futureSpriteY;
	
			  // if walking into platform object, default is can't walk
			  if (intersectObject.type === 'platform') {
			   okayToWalk = false;
	
			   // if walkable platform tiles
			   if (intersectObject.part === 5 || intersectObject.part === 8) {
			    okayToWalk = true;
			    
			   // else if standing on object
			   } else if (typeof(objects[youTileId]) !== "undefined") {
			    // and object is platform center
			    if (objects[youTileId].type === 'platform' && objects[youTileId].part === 5) {
				    // and walking into zipline node, check for ziplines
					   if (objects[objectId].part === 2) {
					    if (platforms[you.on.platform].node1) {
					     you.status.paused2 = true;
					     zip(platforms[you.on.platform].node1);
					    }
					   } else if (objects[objectId].part === 4) {
					    if (platforms[you.on.platform].node2) {
					     you.status.paused2 = true;
					     zip(platforms[you.on.platform].node2);
					    }
					   } else if (objects[objectId].part === 6) {
					    if (platforms[you.on.platform].node3) {
					     you.status.paused2 = true;
					     zip(platforms[you.on.platform].node3);
					    }
					   }
					  }
			   }
			  
			  // if collectable, collect item
			  } else if (intersectObject.collectable && (you.inventory.count() < you.carry.now)) {
			   collect(intersectObject.collectItem, true, futureSpriteX, futureSpriteY, 'walk');
	 	   delete objects[objectId];
     
     // else either item is not collectable, or no room in inventory
     // berries are automatically eaten when inventory is full
	 	  } else if (intersectObject.type === 'berries' && you.inventory.count() >= you.carry.now) {
	     you.updateEnergy(you.energy.fromBerries);
	     $energyBar.addClass('increasing');
	     fadeSprite(futureSpriteX, futureSpriteY, 'walk');
	     delete objects[objectId];
	 	   
	 	  // backpack can be picked up even when inventory is full, since it increases carry limit
		   } else if (intersectObject.type === 'backpack') {
	 	   collect('backpack', true, futureSpriteX, futureSpriteY, 'walk');
	     delete objects[objectId];
	     
	    // snare is broken if stepped on
	 	  } else if (intersectObject.type === 'snare') {
	 	   delete objects[objectId];
	 	   delete snares[objectId];
	 	   status('You stepped on a snare and broke it.');
	 	   clearStatus();
	
	    // wood and bough / birchbark from firs / birches
	    } else if (intersectObject.type === 'tree' && (intersectObject.class === 'fir' || intersectObject.class === 'birch')) {
	     if (!admin.fly) { okayToWalk = false; }
	     // if no axe
	     if (you.inventory.axe.count <= 0) {
	      // if room in inventory and tree is not chopped, chop and collect items
	      if (you.inventory.count() < you.carry.now && intersectObject.chopped === 0) {
	       objects[objectId].chopped++;
	       you.updateEnergy(-1);
	       if (intersectObject.class === 'birch') {
		       collect('birchbark');
	       } else {
	        collect('boughs');
	       }
	      }
	     // else has axe
	     } else {
	      // if tree is not chopped, chop and collect birchbark / boughs
	      if (intersectObject.chopped === 0) {
	       objects[objectId].chopped++;
	       you.updateEnergy(-1);
	       // if birch and has room in inventory, collect birchbark
	       if (intersectObject.class === 'birch' && you.inventory.count() < you.carry.now) {
		       collect('birchbark');
	       // else collect boughs
	       } else if (intersectObject.class === 'fir' && you.inventory.count() < you.carry.now) {
	        collect('boughs');
	       }
	      // else if tree is partially chopped, chop
	      } else if (intersectObject.chopped > 0 && intersectObject.chopped < 5) {
	       objects[objectId].chopped++;
	       you.updateEnergy(-1);
	      // else finish chopping, and okay to walk
	      } else {
	       // if room in inventory, collect wood
	       if (you.inventory.count() < you.carry.now) {
	        collect('wood');
			     }
			     delete objects[objectId];
	       okayToWalk = true;
	      }
	     }
	
	    // else let player know inventory is full
		   } else if (you.inventory.count() >= you.carry.now) {
		    $inventoryGuide.text('You can\'t carry any more items.');
		   }
		   
		  } // else could not pick up item
   } // end if not on helicopter

	  
	  // if still okay to walk
	  if (okayToWalk) {

	   you.pause1(game.loopRate); // pausing player for a few milliseconds prevents events from overwhelming hit detection.
	
	   // if not on raft, water or very high ground, draw footprint
		  // note: terrain value 0.56 was used for tiles which are walkable but do not leave footprints (ice)
		  // was only doing this for land tiles, then started using .trail to clear fog for a while, so recording for every tile
		  //if (you.on.raft === false && you.on.canoe === false && you.on.zip === false && futureSpriteTerrainData > 0.56 && futureSpriteTerrainData < 0.99) {
		   /*
		   var canvas = document.getElementById('map');
				 var context = canvas.getContext("2d");
		   var jitterX, jitterY, ellipseW, ellipseH;
		   if (direction === 'left' || direction === 'right') { jitterX = randomBetween(-7, 7); jitterY = randomBetween(-3, 3); ellipseW = 5; ellipseH = 2.5; }
		   if (direction === 'up' || direction === 'down') { jitterX = randomBetween(-3, 3); jitterY = randomBetween(-7, 7); ellipseW = 2.5; ellipseH = 5; }
		   drawEllipse(context, futureSpriteXpx + game.tileSize/2 + jitterX, futureSpriteYpx + game.tileSize/2 + jitterY, ellipseW, ellipseH, 'rgba(70, 70, 60, 0.55)');
		   //*/
	
		   //mapArray[futureSpriteX][futureSpriteY].trail = mapArray[futureSpriteX][futureSpriteY].trail*1 + 1;
		  //}
	   
	   // move you
	   var previousTerrain = you.getTerrain();
	   you.tile.x = futureSpriteX;
	   you.tile.y = futureSpriteY;
	   mapOffsetX = you.tile.x - game.mapCanvasHalfTiles;
			 mapOffsetY = you.tile.y - game.mapCanvasHalfTiles;
	   drawOffsetX = mapOffsetX * game.tileSize;
	   drawOffsetY = mapOffsetY * game.tileSize;
	   stepCount++;
	   you.status.active = 12; // any less and helicopter wobbles when holding down arrow key
	   
	   // update canvases
	   redrawTerrain = true;
    if (admin.fog) { redrawFog = true; }
    if (admin.mini) { redrawMiniMapCursor = true; }
	   
	   // update energy; update map with generated objects, etc.
	   if (you.on.helicopter === false) {
 	   you.updateEnergy(-1);
 	  }
	   updateMap();
	   
	   // if radio is visible and radio reception has changed, reload radio
	   if ($radio.is(':visible') && getReception(previousTerrain) !== getReception(you.getTerrain())) {
	    reloadRadio(getReception(you.getTerrain()));
	   }


	   // move raft
	   if (moveRaft) {
	    rafts[you.on.raft] = {
	     'x': futureRaftX,
	     'y': futureRaftY
	    };
	    objects['X'+futureRaftX+'Y'+futureRaftY] = {'type': 'raft', 'id': you.on.raft, 'part': 1, 'x': futureRaftX, 'y': futureRaftY};
	    objects['X'+(futureRaftX+1)+'Y'+futureRaftY] = {'type': 'raft', 'id': you.on.raft, 'part': 2, 'x': futureRaftX, 'y': futureRaftY};
	    objects['X'+futureRaftX+'Y'+(futureRaftY+1)] = {'type': 'raft', 'id': you.on.raft, 'part': 3, 'x': futureRaftX, 'y': futureRaftY};
	    objects['X'+(futureRaftX+1)+'Y'+(futureRaftY+1)] = {'type': 'raft', 'id': you.on.raft, 'part': 4, 'x': futureRaftX, 'y': futureRaftY};
	    if (direction === 'left') {
	     delete objects['X'+(futureRaftX+2)+'Y'+futureRaftY];
	     delete objects['X'+(futureRaftX+2)+'Y'+(futureRaftY+1)];
	    } else if (direction === 'right') {
	     delete objects['X'+(futureRaftX-1)+'Y'+futureRaftY];
	     delete objects['X'+(futureRaftX-1)+'Y'+(futureRaftY+1)];
	    } else if (direction === 'up') {
	     delete objects['X'+futureRaftX+'Y'+(futureRaftY+2)];
	     delete objects['X'+(futureRaftX+1)+'Y'+(futureRaftY+2)];
	    } else if (direction === 'down') {
	     delete objects['X'+futureRaftX+'Y'+(futureRaftY-1)];
	     delete objects['X'+(futureRaftX+1)+'Y'+(futureRaftY-1)];
	    }
	    // redo intersectObject
	    var intersectObject = objects['X'+futureSpriteX+'Y'+futureSpriteY];
	   }


	   // move canoe
	   if (moveCanoe) {
	    canoes[you.on.canoe] = {
	     'x': futureSpriteX,
	     'y': futureSpriteY
	    };
	    objects['X'+futureSpriteX+'Y'+futureSpriteY] = {'type': 'canoe', 'id': you.on.canoe, 'x': futureSpriteX, 'y': futureSpriteY};
	    if (direction === 'left') {
	     objects['X'+futureSpriteX+'Y'+futureSpriteY].direction = 'horz';
	     delete objects['X'+(futureSpriteX+1)+'Y'+futureSpriteY];
	    } else if (direction === 'right') {
	     objects['X'+futureSpriteX+'Y'+futureSpriteY].direction = 'horz';
	     delete objects['X'+(futureSpriteX-1)+'Y'+futureSpriteY];
	    } else if (direction === 'up') {
	     objects['X'+futureSpriteX+'Y'+futureSpriteY].direction = 'vert';
	     delete objects['X'+futureSpriteX+'Y'+(futureSpriteY+1)];
	    } else if (direction === 'down') {
	     objects['X'+futureSpriteX+'Y'+futureSpriteY].direction = 'vert';
	     delete objects['X'+futureSpriteX+'Y'+(futureSpriteY-1)];
	    }
	    // redo intersectObject
	    var intersectObject = objects['X'+futureSpriteX+'Y'+futureSpriteY];
	   }


	   // get on helicopter, or move helicopter
	   if (you.on.helicopter) {
	    var helicopterDirection = helicopters[1].direction;
	    if (helicopterDirection === 'left' && direction === 'right') {
	     helicopterDirection = 'right';
	    } else if (helicopterDirection === 'right' && direction === 'left') {
	     helicopterDirection = 'left';
	    }
	    helicopters[1] = {
	     'x': futureSpriteX,
	     'y': futureSpriteY,
	     'direction': helicopterDirection
	    };
	   } else {
	    if (typeof(intersectObject) !== "undefined") {
		    if (intersectObject.type === 'helicopter') {
		     you.on.helicopter = intersectObject.id;
		     clearStatus();
		     updateInventory(); // changes available actions
		     // if radio is visible, reload radio
	      if ($radio.is(':visible')) {
	       reloadRadio(getReception(you.getTerrain()));
	      }
		     // delete helicopter object
		     delete objects['X'+futureSpriteX+'Y'+futureSpriteY];
		    }
		   }
			 }


	   // enter cache
	   if (typeof(intersectObject) !== "undefined" && enterCache) {
	    var cacheId = 'X'+intersectObject.x+'Y'+intersectObject.y;
	    you.on.cache = cacheId;
	    updateInventory(); // because might need to show aFur
	    updateCacheInventory(cacheId);
	   } else {
	    you.on.cache = false;
	    updateInventory(); // because might need to hide aFur
	    $cacheInventoryBox.hide();
	    $dimmer.hide();
	   }
	   
	   // get on platform
	   if (typeof(intersectObject) !== "undefined") {
	    if (intersectObject.type === 'platform' && intersectObject.part === 5) {
	     you.on.platform = 'X'+intersectObject.x+'Y'+intersectObject.y;
	    } else {
			   you.on.platform = false;
	    }
		  } else {
		   you.on.platform = false;
		  }
	   
	   // enter water
	   if (enterWater) {
	    you.on.water = true;
	    you.status.cold = true;
     you.updateEnergy();
	   } else {
	    you.on.water = false;
	   }
		  
		  // get on raft / bump raft
	   if (typeof(intersectObject) !== "undefined") {
	    if (intersectObject.type === 'raft' && you.on.zip === false && you.on.helicopter === false) {
	     you.on.raft = intersectObject.id;
	    } else {
			   you.on.raft = false;
	    }
		  } else {
		   you.on.raft = false;
		  }
		  if (bumpRaft) {
		   var randomBumpDirection = randomOneOf(['left', 'right', 'up' ,'down']);
		   if (randomBumpDirection === 'left') {
		    raftSplashLeft = 5;
		   } else if (randomBumpDirection === 'right') {
		    raftSplashRight = 5;
		   } else if (randomBumpDirection === 'up') {
		    raftSplashUp = 5;
		   } else {
		    raftSplashDown = 5;
		   }
		   you.pause2(game.loopRate*2);
		   requestTimeout(function() {
		    walk(randomBumpDirection, 1);
		    drawMap();
		   }, game.loopRate*2);
		  }

		  // get on canoe / bump canoe
	   if (typeof(intersectObject) !== "undefined") {
	    if (intersectObject.type === 'canoe' && you.on.zip === false && you.on.helicopter === false) {
	     you.on.canoe = intersectObject.id;
	    } else {
			   you.on.canoe = false;
	    }
		  } else {
		   you.on.canoe = false;
		  }
		  if (bumpCanoe) {
		   var randomBumpDirection = randomOneOf(['left', 'right', 'up' ,'down']);
		   you.pause2(game.loopRate*2);
		   requestTimeout(function() {
		    walk(randomBumpDirection, 1);
		    drawMap();
		   }, game.loopRate*2);
		  }

   } // end if okay to walk 2
  } // end if okay to walk

 }
 
 
 
 // collect item
 function collect(itemString, fadeItem, fadeX, fadeY, fadeType) {
  fadeItem = fadeItem || false; fadeX = fadeX || false; fadeY = fadeY || false; fadeType = fadeType || false; // set defaults if parameters are undefined
  you.inventory[itemString].count++;
		updateInventory(itemString);
		$inventoryGuide.text(you.inventory[itemString].found);
  if (fadeItem !== false && fadeX !== false && fadeY !== false && fadeType !== false) {
   fadeSprite(fadeX, fadeY, fadeType);
  }
  
  // if binoculars, redraw fog
  if (itemString === 'binoculars') {
   if (admin.fog) { redrawFog = true; }
  
  // if backpack, update carry
  } else if (itemString === 'backpack') {
   you.updateCarry();

  // if radio, load radio
  } else if (itemString === 'radio') {
   loadRadio();
  }

 } // end collect
 
 
 
 // check if can build
 function canBuild(buildableName) {
  if (!admin.free) {
   // if has supplies
	  for (var costItem in buildable[buildableName].cost) {
	   if (you.inventory[costItem].count >= buildable[buildableName].cost[costItem]) {
	    // okay
	   } else {
	    return false;
	   }
	  }
	 }
  // and if doesn't have any items that restrict building
  if (buildable[buildableName].restriction) {
   if (you.inventory[buildable[buildableName].restriction].count <= 0) {
    // okay
   } else {
    return false;
   }
  }
  return true;
 }
 
 
 
 // update inventory when building
 // note: canoe has special case where only canoe is used up, so this code is repeated there
 function hasBuilt(buildableName) {
  if (!admin.free) {
   for (var costItem in buildable[buildableName].cost) {
    you.inventory[costItem].count -= buildable[buildableName].cost[costItem];
   }
  }
  updateInventory();
  if (buildable[buildableName].action.is(':visible') && !buildable[buildableName].action.hasClass('craft')) {
   buildable[buildableName].action.click();
  } else {
   cursor.hide();
   resetActions();
  }
  you.updateEnergy(-buildable[buildableName].energy);
 }
 
 
 
 // make zipline connections
 function makeZip(fromPlatformId, fromNode) {
  platforms[fromPlatformId]['node'+fromNode] = true; // temporary value so that node is drawn
  you.status.paused2 = true;
  you.status.buildingZip = true;

  // check for nearby platforms; buffer 5 tiles
  var visiblePlatforms = [];
  for (var x=-2, xLimit=game.mapCanvasTileW+2; x<=xLimit; x++) {
   for (var y=-2, yLimit=game.mapCanvasTileH+2; y<=yLimit; y++) {
    if (typeof(mapArray[x+mapOffsetX]) !== "undefined" && x+mapOffsetX < game.mapTileCount) {
     if (typeof(mapArray[x+mapOffsetX][y+mapOffsetY]) !== "undefined" && y+mapOffsetY < game.mapTileCount) {
      var thisPlatform = platforms['X'+(x+mapOffsetX)+'Y'+(y+mapOffsetY)];
      if (typeof(thisPlatform) !== "undefined") {
       visiblePlatforms.push(thisPlatform);
      }
     }
    }
   } // end y loop
  } // end x loop
  if (visiblePlatforms.length > 1) {
   for (var i=0, iLimit=visiblePlatforms.length; i<iLimit; i++) {
    // if this is not the same platform the player is building on
    var thisPlatformId = 'X'+visiblePlatforms[i].x+'Y'+visiblePlatforms[i].y;
    if (thisPlatformId !== fromPlatformId) {
     if (platforms[thisPlatformId].node1 === false || platforms[thisPlatformId].node2 === false || platforms[thisPlatformId].node3 === false) {
		    $dimmer.show();
		    $cancel.show();
		    status("Click a zipline connection point to connect to.");
		    if (platforms[thisPlatformId].node1 === false) {
	 	    $system.append('<div class="zipNode" data-thisId="X' + visiblePlatforms[i].x + 'Y' + visiblePlatforms[i].y + '" data-thisNode="1" data-fromId="' + fromPlatformId + '" data-fromNode="' + fromNode + '" style="left: ' + Math.round((visiblePlatforms[i].x-mapOffsetX)*game.tileSize + zip1OffsetX - 15) + 'px; top: ' + Math.round((visiblePlatforms[i].y-mapOffsetY)*game.tileSize + zip1OffsetY - 15) + 'px;"></div>');
	 	   }
	 	   if (platforms[thisPlatformId].node2 === false) {
	 	    $system.append('<div class="zipNode" data-thisId="X' + visiblePlatforms[i].x + 'Y' + visiblePlatforms[i].y + '" data-thisNode="2" data-fromId="' + fromPlatformId + '" data-fromNode="' + fromNode + '" style="left: ' + Math.round((visiblePlatforms[i].x-mapOffsetX)*game.tileSize + zip2OffsetX - 15) + 'px; top: ' + Math.round((visiblePlatforms[i].y-mapOffsetY)*game.tileSize + zip2OffsetY - 15) + 'px;"></div>');
	 	   }
	 	   if (platforms[thisPlatformId].node3 === false) {
	 	    $system.append('<div class="zipNode" data-thisId="X' + visiblePlatforms[i].x + 'Y' + visiblePlatforms[i].y + '" data-thisNode="3" data-fromId="' + fromPlatformId + '" data-fromNode="' + fromNode + '" style="left: ' + Math.round((visiblePlatforms[i].x-mapOffsetX)*game.tileSize + zip3OffsetX - 15) + 'px; top: ' + Math.round((visiblePlatforms[i].y-mapOffsetY)*game.tileSize + zip3OffsetY - 15) + 'px;"></div>');
	 	   }
	 	  } else {
	 	   status("Nearby platforms do not have any free connection points.");
	 	   clearStatus();
      you.status.paused2 = false;
      you.status.buildingZip = false;
      platforms[fromPlatformId]['node'+fromNode] = false;
	 	  }
    }
   }
  } else {
   status("There are no nearby platforms to connect a zipline to.");
   clearStatus();
   you.status.paused2 = false;
   you.status.buildingZip = false;
   platforms[fromPlatformId]['node'+fromNode] = false;
  }
  
 } // end makeZip
 
 // clicking zipNode
 $system.on('click', 'div.zipNode', function(e) {
  var fromIdData = $(this).attr('data-fromId');
  var fromNodeData = parseInt($(this).attr('data-fromNode'));
  var thisIdData = $(this).attr('data-thisId');
  var thisNodeData = parseInt($(this).attr('data-thisNode'));
  platforms[fromIdData]['node'+fromNodeData] = {'fromId': fromIdData, 'fromNode': fromNodeData, 'toId': thisIdData, 'toNode': thisNodeData};
  platforms[thisIdData]['node'+thisNodeData] = {'fromId': thisIdData, 'fromNode': thisNodeData, 'toId': fromIdData, 'toNode': fromNodeData};
  $dimmer.hide();
  $cancel.hide();
  $system.find('div.zipNode').remove();
  you.status.paused2 = false;
  you.status.buildingZip = false;
  status("");
  hasBuilt('zip');
 });

 // clicking on cancel zipline button
 $cancel.on('click', function(e) {
  $dimmer.hide();
  $cancel.hide();
  $system.find('div.zipNode').remove();
  you.status.paused2 = false;
  you.status.buildingZip = false;
  status("");
  // remove any temporary node values
  for (var platform in platforms) {
   if (platforms[platform].node1 === true) { platforms[platform].node1 = false; }
   if (platforms[platform].node2 === true) { platforms[platform].node2 = false; }
   if (platforms[platform].node3 === true) { platforms[platform].node3 = false; }
  }
 });
 
 
 
 // zipline travel
 // see: http://stackoverflow.com/questions/5226285/requestTimeout-in-a-for-loop-and-pass-i-as-value
 function zip(nodeObject) {
  you.on.zip = true;
  you.updateEnergy(-1);

  // original values, based on top-left tile of platform
  var fromX = platforms[nodeObject.fromId].x;
  var fromY = platforms[nodeObject.fromId].y;
  var toX = platforms[nodeObject.toId].x;
  var toY = platforms[nodeObject.toId].y;
  
  // start and end tiles are centre tile of platform
  var zipPathStart = [[fromX+1, fromY+1]];
  var zipPathEnd = [toX+1, toY+1];
  
  // adjust values for path depending on node position
  if (nodeObject.fromNode === 1) {
	  fromX = platforms[nodeObject.fromId].x+1;
	  fromY = platforms[nodeObject.fromId].y;
	 } else if (nodeObject.fromNode === 2) {
	  fromX = platforms[nodeObject.fromId].x;
	  fromY = platforms[nodeObject.fromId].y+1;
	 } else if (nodeObject.fromNode === 3) {
	  fromX = platforms[nodeObject.fromId].x+3;
	  fromY = platforms[nodeObject.fromId].y+1;
	 }
	 if (nodeObject.toNode === 1) {
	  toX = platforms[nodeObject.toId].x+1;
	  toY = platforms[nodeObject.toId].y;
	 } else if (nodeObject.toNode === 2) {
	  toX = platforms[nodeObject.toId].x;
	  toY = platforms[nodeObject.toId].y+1;
	 } else if (nodeObject.toNode === 3) {
	  toX = platforms[nodeObject.toId].x+3;
	  toY = platforms[nodeObject.toId].y+1;
	 }

  // build path and append end tile
  var zipPathLine = bresenhamLine(fromX, fromY, toX, toY);
  zipPath = zipPathStart.concat(zipPathLine);
  zipPath.push(zipPathEnd);
  
  for(var i=0, iLimit=zipPath.length; i<iLimit; i++) {
   doZip(zipPath, i);
   //mapArray[zipPath[i][0]][zipPath[i][1]] = 1; // draw tile path using terrain
  }
  //console.log(zipPath);
 
  // this happens just after zip starts
  requestTimeout(function() {
	  you.on.platform = false;
	 }, game.loopRate);
  
  // this happens after the zip animation
  requestTimeout(function() {
	  you.on.platform = nodeObject.toId;
	  you.on.zip = false;
	  if (admin.fog) { redrawFog = true; }
	  clearMiniMapCursor();
	  if (admin.mini) { redrawMiniMapCursor = true; }
	  // if radio is visible and radio reception has changed, reload radio
	  if ($radio.is(':visible')) {
	   reloadRadio(getReception(you.getTerrain()));
	  }
	  you.status.paused2 = false;
	 }, zipPath.length*game.loopRate);
 }
 
 function doZip(zipPath, i) {
  requestTimeout(function() {
   redrawTerrain = true;
   if (admin.fog) { redrawFog = true; }
   if (admin.mini) { redrawMiniMapCursor = true; }
   drawZip(zipPath[i][0], zipPath[i][1]);
  }, i*game.loopRate);
 }
 
 function drawZip(zipX, zipY) {
  you.tile.x = zipX;
	 you.tile.y = zipY;
	 mapOffsetX = you.tile.x - game.mapCanvasHalfTiles;
	 mapOffsetY = you.tile.y - game.mapCanvasHalfTiles;
  drawOffsetX = mapOffsetX * game.tileSize;
  drawOffsetY = mapOffsetY * game.tileSize;
 }
 
 // bresenham's line algorithm to get tiles along a line
 // source: http://rosettacode.org/wiki/Bitmap/Bresenham%27s_line_algorithm#JavaScript
 // see also: http://stackoverflow.com/questions/3809247/find-the-closest-tile-along-a-path
 function bresenhamLine(x0, y0, x1, y1) {
  var tiles = [];
  var dx = Math.abs(x1 - x0), sx = x0 < x1 ? 1 : -1;
  var dy = Math.abs(y1 - y0), sy = y0 < y1 ? 1 : -1; 
  var err = (dx>dy ? dx : -dy)/2;
  while (true) {
   tiles.push([x0, y0]);
   //setPixel(x0,y0);
   if (x0 === x1 && y0 === y1) break;
   var e2 = err;
   if (e2 > -dx) { err -= dy; x0 += sx; }
   if (e2 < dy) { err += dx; y0 += sy; }
  }
  return tiles;
 }
 
 
 
 // fade sprite; fadeMode 'walk' fades sprite over you, 'click' fades over tile where sprite was
 function fadeSprite(fadeTileX, fadeTileY, fadeMode) {
  contextFader.clearRect(0, 0, game.tileSize, game.tileSize);
  contextFader.drawImage(canvasSprites, fadeTileX*game.tileSize - drawOffsetX, fadeTileY*game.tileSize - drawOffsetY, game.tileSize, game.tileSize, 0, 0, game.tileSize, game.tileSize);
  if (fadeMode === 'walk') {
   $fader.stop().css({'left': game.mapCanvasHalfTiles*game.tileSize, 'top': game.mapCanvasHalfTiles*game.tileSize, 'marginTop': 0, 'opacity': 1}).show().animate({'marginTop': '-=30px', 'opacity': 0}, 400, function() { $(this).hide(); });
  } else {
   $fader.stop().css({'left': fadeTileX*game.tileSize - drawOffsetX, 'top': fadeTileY*game.tileSize - drawOffsetY, 'marginTop': 0, 'opacity': 1}).show().animate({'marginTop': '-=30px', 'opacity': 0}, 400, function() { $(this).hide(); });
  }
 }
     



 // cursor highlights tile mouse is over
 $system.on('mousemove', function(e) {
  var cX = (Math.round(Math.round(e.pageX - cursor.offset.left - (game.tileSize/2)) / game.tileSize) * game.tileSize) + drawOffsetX;
  var cY = (Math.round(Math.round(e.pageY - cursor.offset.top - (game.tileSize/2)) / game.tileSize) * game.tileSize) + drawOffsetY;
  
  // if cursor is outside map area, or on zip or on helicopter, or building zip or letter, hide reach and cursor
  if (
    cX < 0 || cX/game.tileSize > game.mapTileMax || cY < 0 || cY/game.tileSize > game.mapTileMax
    || you.on.zip || you.on.helicopter || you.status.buildingZip || you.status.buildingLetter || you.status.buildingSign || $cacheInventory.is(':visible')
   ) {
   if ($cursor.is(':visible')) { cursor.hide(); }
 
  // else update cursor data
  } else {
  
   var cXtile = Math.round(cX / game.tileSize);
	  var cYtile = Math.round(cY / game.tileSize);
	  
	  // if cursor is on a different tile
	  if (cXtile !== cursor.tile.x || cYtile !== cursor.tile.y) {
	  
	   // store cursor data
	   $cursor.css({'left': cX - drawOffsetX, 'top': cY - drawOffsetY});
				cursor.tile.x = cXtile;
				cursor.tile.y = cYtile;
				cursor.offset = $system.offset();
				var objectId = 'X'+cXtile+'Y'+cYtile;
				
				// calculate distance between cursor and you
				var cDistance = getDistance(cursor.tile, you.tile);
				
				// variables for terrain of nearby tiles
				if (cXtile-1 < 0 || cYtile-1 < 0) { var cursorTerrainXm1Ym1 = 0; } else { var cursorTerrainXm1Ym1 = mapArray[cXtile-1][cYtile-1]; }
	   if (cYtile-1 < 0) { var cursorTerrainYm1 = 0; } else { var cursorTerrainYm1 = mapArray[cXtile][cYtile-1]; }
	   if (cXtile+1 > game.mapTileMax || cYtile-1 < 0) { var cursorTerrainX1Ym1 = 0; } else { var cursorTerrainX1Ym1 = mapArray[cXtile+1][cYtile-1]; }
	   if (cXtile-1 < 0) { var cursorTerrainXm1 = 0; } else { var cursorTerrainXm1 = mapArray[cXtile-1][cYtile]; }
				var cursorTerrain = mapArray[cXtile][cYtile];
	   if (cXtile+1 > game.mapTileMax) { var cursorTerrainX1 = 0; } else { var cursorTerrainX1 = mapArray[cXtile+1][cYtile]; }
	   if (cXtile-1 < 0 || cYtile+1 > game.mapTileMax) { var cursorTerrainXm1Y1 = 0; } else { var cursorTerrainXm1Y1 = mapArray[cXtile-1][cYtile+1]; }
	   if (cYtile+1 > game.mapTileMax) { var cursorTerrainY1 = 0; } else { var cursorTerrainY1 = mapArray[cXtile][cYtile+1]; }
	   if ((cXtile+1 > game.mapTileMax) || (cYtile+1 > game.mapTileMax)) { var cursorTerrainX1Y1 = 0; } else { var cursorTerrainX1Y1 = mapArray[cXtile+1][cYtile+1]; }
		
				// if admin.warp, show details about tile mouse is over
				if (admin.warp) {
					var cursorText = cXtile + ',&nbsp;' + cYtile + '<br />';
					cursorText += 'distance:&nbsp;' + cDistance + '<br />';
					cursorText += 'terrain:&nbsp;' + cursorTerrain + '<br />';
					if (typeof(objects[objectId]) !== "undefined") {
					 cursorText += 'objects:&nbsp;' + objects[objectId].type;
					 if (objects[objectId].type === 'tree') { cursorText += ' (' + objects[objectId].class + ')'; }
					 cursorText += '<br />';
					 if (objects[objectId].flammable) { cursorText += 'flammable!<br />'; }
					 if (objects[objectId].flagged === true) { cursorText += 'flagged!<br />'; }
					}
					if (typeof(fires[objectId]) !== "undefined") { cursorText += 'fire:&nbsp;' + fires[objectId] + '<br />'; }
					//if (mapArray[cXtile][cYtile].trail) { cursorText += 'trail:&nbsp;' + mapArray[cXtile][cYtile].trail + '<br />'; }
					$cursorInfo.html(cursorText);
				}
				
				// if cursor is near you, show appropriate cursor
				if (cDistance <= you.reach && you.status.sleep <= 0) {
					cursor.near = true;
					$('body').css('cursor', 'none');
					if (!$cursor.is(':visible')) { $cursor.removeClass().show(); }
					
					// if sign, read sign
					if (typeof(objects[objectId]) !== "undefined") {
					 if (typeof(objects[objectId].flagged) === "string") {
					  $inventoryGuide.html('The sign says:<br /><span class="signText">' + objects[objectId].flagged + '</span>');
					 } else {
					  $inventoryGuide.empty();
					 }
					} else {
					 $inventoryGuide.empty();
					}
					
					// only check for building if cursor.mode is not hand
					if (cursor.mode !== 'hand') {
	
		    // okay to build letter
		    if (
		      // if terrain is appropriate
		      (
		      (cursorTerrainXm1Ym1 > buildable.letter.terrain.min) && (cursorTerrainXm1Ym1 <= buildable.letter.terrain.max)
		       && (cursorTerrainYm1 > buildable.letter.terrain.min) && (cursorTerrainYm1 <= buildable.letter.terrain.max)
		       && (cursorTerrainX1Ym1 > buildable.letter.terrain.min) && (cursorTerrainX1Ym1 <= buildable.letter.terrain.max)
		       && (cursorTerrainXm1 > buildable.letter.terrain.min) && (cursorTerrainXm1 <= buildable.letter.terrain.max)
		       && (cursorTerrain > buildable.letter.terrain.min) && (cursorTerrain <= buildable.letter.terrain.max)
		       && (cursorTerrainX1 > buildable.letter.terrain.min) && (cursorTerrainX1 <= buildable.letter.terrain.max)
         && (cursorTerrainXm1Y1 > buildable.letter.terrain.min) && (cursorTerrainXm1Y1 <= buildable.letter.terrain.max)
		       && (cursorTerrainY1 > buildable.letter.terrain.min) && (cursorTerrainY1 <= buildable.letter.terrain.max)
		       && (cursorTerrainX1Y1 > buildable.letter.terrain.min) && (cursorTerrainX1Y1 <= buildable.letter.terrain.max)
		      )
		      // and cursor.mode matches
		      && (cursor.mode === 'letter')
		      // and if has right supplies
		      && (canBuild('letter'))
		      // and if there are no objects on the tiles
		      && (
		       (typeof(objects['X'+(cXtile-1)+'Y'+(cYtile-1)]) === "undefined")
		       && (typeof(objects['X'+cXtile+'Y'+(cYtile-1)]) === "undefined")
		       && (typeof(objects['X'+(cXtile+1)+'Y'+(cYtile-1)]) === "undefined")
		       && (typeof(objects['X'+(cXtile-1)+'Y'+cYtile]) === "undefined")
		       && (typeof(objects[objectId]) === "undefined")
		       && (typeof(objects['X'+(cXtile+1)+'Y'+cYtile]) === "undefined")
		       && (typeof(objects['X'+(cXtile-1)+'Y'+(cYtile+1)]) === "undefined")
		       && (typeof(objects['X'+cXtile+'Y'+(cYtile+1)]) === "undefined")
		       && (typeof(objects['X'+(cXtile+1)+'Y'+(cYtile+1)]) === "undefined")
		      )
		      // and if there are no holes on the tiles
		      && (
		       (typeof(holes['X'+(cXtile-1)+'Y'+(cYtile-1)]) === "undefined")
		       && (typeof(holes['X'+cXtile+'Y'+(cYtile-1)]) === "undefined")
		       && (typeof(holes['X'+(cXtile+1)+'Y'+(cYtile-1)]) === "undefined")
		       && (typeof(holes['X'+(cXtile-1)+'Y'+cYtile]) === "undefined")
		       && (typeof(holes[objectId]) === "undefined")
		       && (typeof(holes['X'+(cXtile+1)+'Y'+cYtile]) === "undefined")
		       && (typeof(holes['X'+(cXtile-1)+'Y'+(cYtile+1)]) === "undefined")
		       && (typeof(holes['X'+cXtile+'Y'+(cYtile+1)]) === "undefined")
		       && (typeof(holes['X'+(cXtile+1)+'Y'+(cYtile+1)]) === "undefined")
		      )
		     ) {
	      $cursor.removeClass().addClass('cursorLetter').show();


						// okay to build raft
		    } else if (
				    // if terrain is appropriate
						  (
						   // if left 2 sand, right 2 water
						   (cursorTerrain > buildable.raft.terrain.min) && (cursorTerrain <= buildable.raft.terrain.max) && (cursorTerrainX1 >= 0) && (cursorTerrainX1 <= 0.55) && (cursorTerrainY1 > buildable.raft.terrain.min) && (cursorTerrainY1 <= buildable.raft.terrain.max) && (cursorTerrainX1Y1 >= 0) && (cursorTerrainX1Y1 <= 0.55)
				     // or if top 2 sand, bottom 2 water
				     || (cursorTerrain > buildable.raft.terrain.min) && (cursorTerrain <= buildable.raft.terrain.max) && (cursorTerrainX1 > buildable.raft.terrain.min) && (cursorTerrainX1 <= buildable.raft.terrain.max) && (cursorTerrainY1 >= 0) && (cursorTerrainY1 <= 0.55) && (cursorTerrainX1Y1 >= 0) && (cursorTerrainX1Y1 <= 0.55)
		       // or if right 2 sand, left 2 water
		       || (cursorTerrain >= 0) && (cursorTerrain <= 0.55) && (cursorTerrainX1 > buildable.raft.terrain.min) && (cursorTerrainX1 <= buildable.raft.terrain.max) && (cursorTerrainY1 >= 0) && (cursorTerrainY1 <= 0.55) && (cursorTerrainX1Y1 > buildable.raft.terrain.min) && (cursorTerrainX1Y1 <= buildable.raft.terrain.max)
		       // or if bottom 2 sand, top 2 water
		       || (cursorTerrain >= 0) && (cursorTerrain <= 0.55) && (cursorTerrainX1 >= 0) && (cursorTerrainX1 <= 0.55) && (cursorTerrainY1 > buildable.raft.terrain.min) && (cursorTerrainY1 <= buildable.raft.terrain.max) && (cursorTerrainX1Y1 > buildable.raft.terrain.min) && (cursorTerrainX1Y1 <= buildable.raft.terrain.max)
		      )
		      // and cursor.mode matches
		      && (cursor.mode === 'raft')
		      // and if has supplies
		      && (canBuild('raft'))
		      // and if there are no objects on the tiles
		      && typeof(objects[objectId]) === "undefined"
		      && typeof(objects['X'+(cXtile+1)+'Y'+cYtile]) === "undefined"
		      && typeof(objects['X'+cXtile+'Y'+(cYtile+1)]) === "undefined"
		      && typeof(objects['X'+(cXtile+1)+'Y'+(cYtile+1)]) === "undefined"
		      // and if there are no holes on the tiles
		      && typeof(holes[objectId]) === "undefined"
		      && typeof(holes['X'+(cXtile+1)+'Y'+cYtile]) === "undefined"
		      && typeof(holes['X'+cXtile+'Y'+(cYtile+1)]) === "undefined"
		      && typeof(holes['X'+(cXtile+1)+'Y'+(cYtile+1)]) === "undefined"
		      // and all the tiles are within map limits
		      && (cXtile+1 <= game.mapTileMax) && (cYtile+1 <= game.mapTileMax)
		     ) {
	      $cursor.removeClass().addClass('cursorRaft').show();


						// okay to build canoe
		    } else if (
				    // if terrain is appropriate
						  (cursorTerrain > buildable.canoe.terrain.min && cursorTerrain <= buildable.canoe.terrain.max)
		      // and cursor.mode matches
		      && (cursor.mode === 'canoe')
		      // and if has supplies or carrying canoe
		      && (canBuild('canoe') || you.inventory.canoe.count >= 1)
		      // and if there are no objects on the tile
		      && (typeof(objects[objectId]) === "undefined")
		      // and if there are no holes on the tile
		      && (typeof(holes[objectId]) === "undefined")
		     ) {
	      $cursor.removeClass().addClass('cursorCanoe').show();


						// okay to build platform
		    } else if (
				    // if terrain is appropriate
		      (
		       (cursorTerrainXm1Ym1 > buildable.platform.terrain.min) && (cursorTerrainXm1Ym1 <= buildable.platform.terrain.max)
		       && (cursorTerrainYm1 > buildable.platform.terrain.min) && (cursorTerrainYm1 <= buildable.platform.terrain.max)
		       && (cursorTerrainX1Ym1 > buildable.platform.terrain.min) && (cursorTerrainX1Ym1 <= buildable.platform.terrain.max)
		       && (cursorTerrainXm1 > buildable.platform.terrain.min) && (cursorTerrainXm1 <= buildable.platform.terrain.max)
		       && (cursorTerrain > buildable.platform.terrain.min) && (cursorTerrain <= buildable.platform.terrain.max)
		       && (cursorTerrainX1 > buildable.platform.terrain.min) && (cursorTerrainX1 <= buildable.platform.terrain.max)
         && (cursorTerrainXm1Y1 > buildable.platform.terrain.min) && (cursorTerrainXm1Y1 <= buildable.platform.terrain.max)
		       && (cursorTerrainY1 > buildable.platform.terrain.min) && (cursorTerrainY1 <= buildable.platform.terrain.max)
		       && (cursorTerrainX1Y1 > buildable.platform.terrain.min) && (cursorTerrainX1Y1 <= buildable.platform.terrain.max)
		      )
		      // and cursor.mode matches
		      && (cursor.mode === 'platform')
		      // and has supplies
		      && (canBuild('platform'))
        // and you are not standing on any of the tiles
		      && (
		       (!(you.tile.x === (cXtile-1) && you.tile.y === (cYtile-1)))
		       && (!(you.tile.x === cXtile && you.tile.y === (cYtile-1)))
		       && (!(you.tile.x === (cXtile+1) && you.tile.y === (cYtile-1)))
		       && (!(you.tile.x === (cXtile-1) && you.tile.y === cYtile))
		       && (!(you.tile.x === cXtile && you.tile.y === cYtile))
		       && (!(you.tile.x === (cXtile+1) && you.tile.y === cYtile))
		       && (!(you.tile.x === (cXtile-1) && you.tile.y === (cYtile+1)))
		       && (!(you.tile.x === cXtile && you.tile.y === (cYtile+1)))
		       && (!(you.tile.x === (cXtile+1) && you.tile.y === (cYtile+1)))
		      )
		      // and there are no objects on the tiles
		      && (
		       (typeof(objects['X'+(cXtile-1)+'Y'+(cYtile-1)]) === "undefined")
		       && (typeof(objects['X'+cXtile+'Y'+(cYtile-1)]) === "undefined")
		       && (typeof(objects['X'+(cXtile+1)+'Y'+(cYtile-1)]) === "undefined")
		       && (typeof(objects['X'+(cXtile-1)+'Y'+cYtile]) === "undefined")
		       && (typeof(objects[objectId]) === "undefined")
		       && (typeof(objects['X'+(cXtile+1)+'Y'+cYtile]) === "undefined")
		       && (typeof(objects['X'+(cXtile-1)+'Y'+(cYtile+1)]) === "undefined")
		       && (typeof(objects['X'+cXtile+'Y'+(cYtile+1)]) === "undefined")
		       && (typeof(objects['X'+(cXtile+1)+'Y'+(cYtile+1)]) === "undefined")
		      )
		      // and there are no holes on the tiles
		      && (
		       (typeof(holes['X'+(cXtile-1)+'Y'+(cYtile-1)]) === "undefined")
		       && (typeof(holes['X'+cXtile+'Y'+(cYtile-1)]) === "undefined")
		       && (typeof(holes['X'+(cXtile+1)+'Y'+(cYtile-1)]) === "undefined")
		       && (typeof(holes['X'+(cXtile-1)+'Y'+cYtile]) === "undefined")
		       && (typeof(holes[objectId]) === "undefined")
		       && (typeof(holes['X'+(cXtile+1)+'Y'+cYtile]) === "undefined")
		       && (typeof(holes['X'+(cXtile-1)+'Y'+(cYtile+1)]) === "undefined")
		       && (typeof(holes['X'+cXtile+'Y'+(cYtile+1)]) === "undefined")
		       && (typeof(holes['X'+(cXtile+1)+'Y'+(cYtile+1)]) === "undefined")
		      )
		     ) {
	      $cursor.removeClass().addClass('cursorPlatform').show();
	     
	     
	     // okay to build zip
		    } else if (
				    // if there is an object on the tile
		      (typeof(objects[objectId]) !== "undefined")
		      // and cursor.mode matches
		      && (cursor.mode === 'zip')
		      // and if has supplies
		      && (canBuild('zip'))
		     ) {
		      var platformId = 'X'+objects[objectId].x+'Y'+objects[objectId].y;
		      // also if object is a platform, platform tile is appropriate and node is not taken
		      if (
		       (objects[objectId].type === 'platform')
		       && (
		        (objects[objectId].part === 2 && platforms[platformId].node1 === false)
		        || (objects[objectId].part === 4 && platforms[platformId].node2 === false)
		        || (objects[objectId].part === 6 && platforms[platformId].node3 === false)
		       )
		      ) {
 	       $cursor.removeClass().addClass('cursorZip').show();
 	      } else {
 	       $cursor.removeClass().show();
 	      }
 	    
 	    
 	    // okay to build roof
 	    } else if (
 	      // if there is an object on the tile
		      (typeof(objects[objectId]) !== "undefined")
		      // and cursor.mode matches
		      && (cursor.mode === 'roof')
		      // and if has supplies
		      && (canBuild('roof'))
		     ) {
		      var platformId = 'X'+objects[objectId].x+'Y'+objects[objectId].y;
		      // also if object is a platform, platform tile is appropriate and platform doesn't already have a roof
		      if (objects[objectId].type === 'platform' && objects[objectId].part === 5 && platforms[platformId].roof === false) {
  	      $cursor.removeClass().addClass('cursorRoof').show();
  	     } else {
  	      $cursor.removeClass().show();
  	     }


 	    // okay to build quarry
 	    } else if (
 	      // if there are holes on the tiles
 	      (
			      (typeof(holes['X'+(cXtile-1)+'Y'+(cYtile-1)]) !== "undefined")
			       && (typeof(holes['X'+cXtile+'Y'+(cYtile-1)]) !== "undefined")
			       && (typeof(holes['X'+(cXtile+1)+'Y'+(cYtile-1)]) !== "undefined")
			       && (typeof(holes['X'+(cXtile-1)+'Y'+cYtile]) !== "undefined")
			       && (typeof(holes[objectId]) !== "undefined")
			       && (typeof(holes['X'+(cXtile+1)+'Y'+cYtile]) !== "undefined")
			       && (typeof(holes['X'+(cXtile-1)+'Y'+(cYtile+1)]) !== "undefined")
			       && (typeof(holes['X'+cXtile+'Y'+(cYtile+1)]) !== "undefined")
			       && (typeof(holes['X'+(cXtile+1)+'Y'+(cYtile+1)]) !== "undefined")
		      )
		      // and there are no objects on the tiles
		      && (
		       (typeof(objects['X'+(cXtile-1)+'Y'+(cYtile-1)]) === "undefined")
		       && (typeof(objects['X'+cXtile+'Y'+(cYtile-1)]) === "undefined")
		       && (typeof(objects['X'+(cXtile+1)+'Y'+(cYtile-1)]) === "undefined")
		       && (typeof(objects['X'+(cXtile-1)+'Y'+cYtile]) === "undefined")
		       && (typeof(objects[objectId]) === "undefined")
		       && (typeof(objects['X'+(cXtile+1)+'Y'+cYtile]) === "undefined")
		       && (typeof(objects['X'+(cXtile-1)+'Y'+(cYtile+1)]) === "undefined")
		       && (typeof(objects['X'+cXtile+'Y'+(cYtile+1)]) === "undefined")
		       && (typeof(objects['X'+(cXtile+1)+'Y'+(cYtile+1)]) === "undefined")
		      )
		      // and cursor.mode matches
		      && (cursor.mode === 'quarry')
		      // and if has supplies
		      && (canBuild('quarry'))
		     ) {
  	    $cursor.removeClass().addClass('cursorQuarry').show();
						
						
						// okay to build camp
						} else if (
						  // if terrain is appropriate
						  (cursorTerrain > buildable.camp.terrain.min) && (cursorTerrain <= buildable.camp.terrain.max)
						   && (cursorTerrainX1 > buildable.camp.terrain.min) && (cursorTerrainX1 <= buildable.camp.terrain.max)
						   && (cursorTerrainY1 > buildable.camp.terrain.min) && (cursorTerrainY1 <= buildable.camp.terrain.max)
						   && (cursorTerrainX1Y1 > buildable.camp.terrain.min) && (cursorTerrainX1Y1 <= buildable.camp.terrain.max)
						  // and cursor.mode matches
		      && (cursor.mode === 'camp')
						  // and if has supplies
						  && (canBuild('camp'))
						  // and if there are no objects on the tiles
		      && typeof(objects[objectId]) === "undefined"
		      && typeof(objects['X'+(cXtile+1)+'Y'+cYtile]) === "undefined"
		      && typeof(objects['X'+cXtile+'Y'+(cYtile+1)]) === "undefined"
		      && typeof(objects['X'+(cXtile+1)+'Y'+(cYtile+1)]) === "undefined"
		      // and if there are no holes on the tiles
		      && typeof(holes[objectId]) === "undefined"
		      && typeof(holes['X'+(cXtile+1)+'Y'+cYtile]) === "undefined"
		      && typeof(holes['X'+cXtile+'Y'+(cYtile+1)]) === "undefined"
		      && typeof(holes['X'+(cXtile+1)+'Y'+(cYtile+1)]) === "undefined"
		      // and all the tiles are within map limits
		      && (cXtile+1 <= game.mapTileMax) && (cYtile+1 <= game.mapTileMax)
						 ) {
	      $cursor.removeClass().addClass('cursorCamp').show();
			 			
			 		// okay to build bridge
						} else if (
						  // if terrain is appropriate
						  (cursorTerrain > buildable.bridge.terrain.min && cursorTerrain <= buildable.bridge.terrain.max)
						  // and cursor.mode matches
		      && (cursor.mode === 'bridge')
		      // and if has supplies
						  && (canBuild('bridge'))
						  // and if there are no objects on the tile
						  && (typeof(objects[objectId]) === "undefined")
						  // and if there are no holes on the tile
						  && (typeof(holes[objectId]) === "undefined")
						 ) {
	      $cursor.removeClass().addClass('cursorBridge').show();
	     
	     // okay to build snare
						} else if (
						  // if terrain is appropriate
						  (cursorTerrain > buildable.snare.terrain.min && cursorTerrain <= buildable.snare.terrain.max)
						  // and if between two trees
						  && (
						   // if trees above and tree below
						   (objects['X'+cXtile+'Y'+(cYtile-1)] && objects['X'+cXtile+'Y'+(cYtile-1)].type === "tree" && objects['X'+cXtile+'Y'+(cYtile+1)] && objects['X'+cXtile+'Y'+(cYtile+1)].type === "tree")
				     // or if tree left and tree right
						   || (objects['X'+(cXtile-1)+'Y'+cYtile] && objects['X'+(cXtile-1)+'Y'+cYtile].type === "tree" && objects['X'+(cXtile+1)+'Y'+cYtile] && objects['X'+(cXtile+1)+'Y'+cYtile].type === "tree")
		      )
						  // and cursor.mode matches
		      && (cursor.mode === 'snare')
		      // and if has supplies
						  && (canBuild('snare'))
						  // and if there are no objects on the tile
						  && (typeof(objects[objectId]) === "undefined")
						  // and if there are no holes on the tile
						  && (typeof(holes[objectId]) === "undefined")
						 ) {
	      $cursor.removeClass().addClass('cursorSnare').show();
	     
	     // okay to build flag
						} else if (
						 // if large tree that is not already flagged
						 objects[objectId]
						 && (objects[objectId].class === "fir" || objects[objectId].class === "birch")
						 && objects[objectId].flagged === false
					  // and cursor.mode matches
	      && (cursor.mode === 'flag')
	      // and if has supplies
					  && (canBuild('flag'))
					 ) {
      $cursor.removeClass().addClass('cursorFlag').show();
     
      // okay to build sign
						} else if (
						 // if large tree that is not already flagged
						 objects[objectId]
						 && (objects[objectId].class === "fir" || objects[objectId].class === "birch")
						 && objects[objectId].flagged === false
					  // and cursor.mode matches
	      && (cursor.mode === 'sign')
	      // and if has supplies
					  && (canBuild('sign'))
					 ) {
      $cursor.removeClass().addClass('cursorSign').show();
	     
	     // else hand cursor
	     } else {
	      $cursor.removeClass().show();
						}


     // else if cursor.mode is hand
     // if has pickaxe, terrain is suitable, and not standing on tile
     } else if (you.inventory.pickaxe.count >= 1 && cursorTerrain >= pickaxeTerrainMin && cursorTerrain <= pickaxeTerrainMax && !(cXtile === you.tile.x && cYtile === you.tile.y)) {
      // if no object
      if (typeof(objects[objectId]) === "undefined") {
       $cursor.removeClass().addClass('cursorPickaxe').show();
      // else if object
      } else if (typeof(objects[objectId]) !== "undefined") {
       $cursor.removeClass().show();
      }
     // if has shovel, terrain is suitable, and not standing on tile
     } else if (you.inventory.shovel.count >= 1 && cursorTerrain > shovelTerrainMin && cursorTerrain <= shovelTerrainMax && !(cXtile === you.tile.x && cYtile === you.tile.y)) {
      // if no object and no hole
      if (typeof(objects[objectId]) === "undefined" && typeof(holes[objectId]) === "undefined") {
       $cursor.removeClass().addClass('cursorShovel').show();
      // else if object
      } else if (typeof(objects[objectId]) !== "undefined") {
       $cursor.removeClass().show();
      // else if hole
      } else if (typeof(holes[objectId]) !== "undefined") {
       $cursor.removeClass().addClass('cursorShovel').show();
      }
     /*
     // if has shovel, terrain is iceberg, and not standing on tile
     } else if (you.inventory.shovel.count >= 1 && cursorTerrain > 3 && cursorTerrain <= 3.4 && !(cXtile === you.tile.x && cYtile === you.tile.y)) {
      // if no object and no hole
      if (typeof(objects[objectId]) === "undefined" && typeof(holes[objectId]) === "undefined") {
       $cursor.removeClass().addClass('cursorShovel').show();
      } else {
       $cursor.removeClass().show();
      }
     */
     
     // else hand cursor
					} else {
					 $cursor.removeClass().show();
					} // end if cursor.mode

				// else hide cursor
				} else {
	    cursor.hide();
				}
			
			} // end if cursor is on a different tile
		}

 });
 
 
	
	// reset cursor
	function resetActions() {
	 $inventory.children('li').stop().fadeTo(50, 1);
	 $actionsItems.removeClass('selected');
  $aHand.click();
  $cursor.removeClass().hide();
	}



 // when player clicks on map
 $system.on('click', function(e) {
  // make sure everything has loaded
  if (typeof(mapArray[cursor.tile.x]) !== "undefined") {
	  var clickX = cursor.tile.x;
	  var clickY = cursor.tile.y;
	  var cursorTerrain = mapArray[clickX][clickY];
	  
	  if (clickX+1 > game.mapTileMax) { var cursorTerrainX1 = 0; } else { var cursorTerrainX1 = mapArray[clickX+1][clickY]; }
	  if (clickY+1 > game.mapTileMax) { var cursorTerrainY1 = 0; } else { var cursorTerrainY1 = mapArray[clickX][clickY+1]; }
	  if ((clickX+1 > game.mapTileMax) || (clickY+1 > game.mapTileMax)) { var cursorTerrainX1Y1 = 0; } else { var cursorTerrainX1Y1 = mapArray[clickX+1][clickY+1]; }
	  
	  // if cursor is near you
	  if (cursor.near) {
	   var youObject = objects['X'+you.tile.x+'Y'+you.tile.y];
	   var objectId = 'X'+clickX+'Y'+clickY;
	   var clickObject = objects[objectId];
		   
		  // if player has clicked on a tile with an object, and tile is not on fire, collect items
		  if (typeof(clickObject) !== "undefined" && typeof(fires[objectId]) === "undefined") {
		  
		   // if object is collectable, collect item
		  	if (clickObject.collectable && (you.inventory.count() < you.carry.now)) {
			   collect(clickObject.collectItem, true, clickX, clickY, 'click');
	 	   delete objects[objectId];
	 	   
	 	   if (clickObject.type === 'tree') {
	 	    delete trees[objectId];
	 	   }
	
	    // else either item is not collectable or inventory is full
	 	  // collect stepstones if not already standing on stepstone (to prevent infinite bridges)
	 	  } else if (clickObject.type === 'stepstone' && you.inventory.count() < you.carry.now) {
	 	   var onStepStone = false;
	 	   if (typeof(youObject) !== "undefined") { if (youObject.type === 'stepstone') { onStepStone = true; } }
	 	   if (!onStepStone) {
		     collect('stone'); // don't fade out collected stepstones as it looks too much like sinking
		     delete objects[objectId];
		    }

     // berries are automatically eaten when inventory is full
	 	  } else if (clickObject.type === 'berries' && you.inventory.count() >= you.carry.now) {
	     you.updateEnergy(you.energy.fromBerries);
	     $energyBar.addClass('increasing');
	     fadeSprite(clickX, clickY, 'click');
	     delete objects[objectId];

	 	  // backpack can be picked up even when inventory is full, since it increases carry limit
		   } else if (clickObject.type === 'backpack') {
		    collect('backpack', true, clickX, clickY, 'click');
		    you.updateCarry();
		    delete objects[objectId];
	
		   // collect boughs
	    } else if (clickObject.type === 'tree' && clickObject.class === 'fir' && you.inventory.count() < you.carry.now
	     && clickObject.chopped === 0 && !$cursor.hasClass('cursorFlag') && !$cursor.hasClass('cursorSign')) {
	     collect('boughs'); // no fade
	     objects[objectId].chopped++;
	     you.updateEnergy(-1);
		   
	    // collect birchbark
	    } else if (clickObject.type === 'tree' && clickObject.class === 'birch' && you.inventory.count() < you.carry.now
	     && clickObject.chopped === 0 && !$cursor.hasClass('cursorFlag') && !$cursor.hasClass('cursorSign')) {
	     collect('birchbark'); // no fade
	     objects[objectId].chopped++;
	     you.updateEnergy(-1);
		
			  // collect canoe
		   } else if (clickObject.type === 'canoe' && clickObject.id !== you.on.canoe) {
		    if (you.inventory.count()+2 < you.carry.now && you.inventory.canoe.count <= 0) {
		     collect('canoe'); // fading doesn't work well because canoe is 3 tiles wide
			    delete canoes[objects[objectId].id];
			    delete objects[objectId];
		    // else can't pick up canoe
			   } else {
		     $inventoryGuide.text('You can\'t pick up this canoe. A canoe takes up 3 inventory spaces and you can only carry one canoe at a time.');
		    }

	
	    // buildables on tiles with objects
		   // if player has clicked on a suitable tile, build zip
		   } else if ($cursor.hasClass('cursorZip')) {
		    var platformId = 'X'+objects[objectId].x+'Y'+objects[objectId].y;
		    if (clickObject.type === 'platform' && clickObject.part === 2) {
		     makeZip(platformId, 1);
		    } else if (clickObject.type === 'platform' && clickObject.part === 4) {
		     makeZip(platformId, 2);
		    } else if (clickObject.type === 'platform' && clickObject.part === 6) {
		     makeZip(platformId, 3);
		    }
		    // inventory adjustment happens during zip functions
		    if ($aZip.is(':visible')) {
		     $aZip.click();
		    } else {
		     cursor.hide();
		     resetActions();
		    }
	
	    // if player has clicked on a suitable tile, build roof
		   } else if ($cursor.hasClass('cursorRoof')) {
		    var platformId = 'X'+objects[objectId].x+'Y'+objects[objectId].y;
		    platforms[platformId].roof = true;
		    platforms[platformId].platformEnergy = platformEnergy;
		    hasBuilt('roof');
		   
		   // if player has clicked on a suitable tile and has flag, flag tree
		   } else if (clickObject.type === 'tree' && (clickObject.class === 'fir' || clickObject.class === 'birch') && $cursor.hasClass('cursorFlag')) {
	 	   if (admin.fog) { redrawFog = true; }
		    objects[objectId].flagged = true;
		    hasBuilt('flag');
		  
		  	// if player has clicked on a suitable tile and has sign, sign tree
		   } else if (clickObject.type === 'tree' && (clickObject.class === 'fir' || clickObject.class === 'birch') && $cursor.hasClass('cursorSign')) {
		    showSignInput();
	     $signInputBox.data({'clickX': clickX, 'clickY': clickY});
	     you.status.paused2 = true;
	     you.status.buildingSign = true;
      // build code is in $('#signInputSubmit').on click
	
	
	    // else let player know if inventory is full
		   } else if (you.inventory.count() >= you.carry.now) {
		    $inventoryGuide.text('You can\'t carry any more items.');
		   }
		   
		  
		  // else if player has clicked on a tile with a hole
		  } else if (typeof(holes[objectId]) !== "undefined") {

     // if player has clicked on a suitable tile, build quarry
     if ($cursor.hasClass('cursorQuarry')) {
		    objects['X'+(clickX-1)+'Y'+(clickY-1)] = {'type': 'quarry', 'part': 1, 'x': clickX, 'y': clickY};
		    objects['X'+clickX+'Y'+(clickY-1)] = {'type': 'quarry', 'part': 2, 'x': clickX, 'y': clickY};
		    objects['X'+(clickX+1)+'Y'+(clickY-1)] = {'type': 'quarry', 'part': 3, 'x': clickX, 'y': clickY};
		    objects['X'+(clickX-1)+'Y'+clickY] = {'type': 'quarry', 'part': 4, 'x': clickX, 'y': clickY};
		    objects[objectId] = {'type': 'quarry', 'part': 5, 'x': clickX, 'y': clickY};
		    objects['X'+(clickX+1)+'Y'+clickY] = {'type': 'quarry', 'part': 6, 'x': clickX, 'y': clickY};
		    objects['X'+(clickX-1)+'Y'+(clickY+1)] = {'type': 'quarry', 'part': 7, 'x': clickX, 'y': clickY};
		    objects['X'+clickX+'Y'+(clickY+1)] = {'type': 'quarry', 'part': 8, 'x': clickX, 'y': clickY};
		    objects['X'+(clickX+1)+'Y'+(clickY+1)] = {'type': 'quarry', 'part': 9, 'x': clickX, 'y': clickY};
		    
		    delete holes['X'+(clickX-1)+'Y'+(clickY-1)];
		    delete holes['X'+clickX+'Y'+(clickY-1)];
		    delete holes['X'+(clickX+1)+'Y'+(clickY-1)];
		    delete holes['X'+(clickX-1)+'Y'+clickY];
		    delete holes[objectId];
		    delete holes['X'+(clickX+1)+'Y'+clickY];
		    delete holes['X'+(clickX-1)+'Y'+(clickY+1)];
		    delete holes['X'+clickX+'Y'+(clickY+1)];
		    delete holes['X'+(clickX+1)+'Y'+(clickY+1)];
		    
		    var cacheId = 'X'+clickX+'Y'+clickY;
		    var quarrySlate = randomOneOf([0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2]);
		 	  var quarryQuartz = randomOneOf([0, 0, 0, 0, 0, 0, 0, 0, 1, 1]);
		 	  var quarryStone = 20 - quarrySlate - quarryQuartz;
		    caches[cacheId] = new Quarry(new Inventory(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, quarrySlate, quarryQuartz, quarryStone, 0, 0, 0, 0, 0));
		    //miniMapMarker(clickX, clickY, '#474747');
		    hasBuilt('quarry');

		  	// if player can dig, enlarge hole
		   } else if ($cursor.hasClass('cursorShovel')) {
		    // if adjacent terrain contains water
		    if (mapArray[clickX][clickY-1] <= 0.55 || mapArray[clickX-1][clickY] <= 0.55 || mapArray[clickX+1][clickY] <= 0.55 || mapArray[clickX][clickY+1] <= 0.55) {
		     if (holes[objectId].class < 2) {
		      holes[objectId].class++;
		      you.updateEnergy(-1);
		      var findItemChance = randomBetween(0, 10);
		      if (findItemChance === 1) { foundItem(clickX, clickY); }
		     } else if (holes[objectId].class === 2) {
		      holes[objectId].class = 4;
		     } else if (holes[objectId].class > 2) {
		      delete holes[objectId];
		      mapArray[clickX][clickY] = 0.54;
		      updateMiniMapPixel(clickX, clickY);
		      redrawTerrain = true;
		      $cursor.removeClass(); // otherwise player can click fast enough to dig a new hole
		      // if hole floods, update surrounding tiles
		      if (holes['X'+clickX+'Y'+(clickY-1)]) { if (holes['X'+clickX+'Y'+(clickY-1)].class === 3) { holes['X'+clickX+'Y'+(clickY-1)].class = 4; } }
		      if (holes['X'+(clickX-1)+'Y'+clickY]) { if (holes['X'+(clickX-1)+'Y'+clickY].class === 3) { holes['X'+(clickX-1)+'Y'+clickY].class = 4; } }
		      if (holes['X'+(clickX+1)+'Y'+clickY]) { if (holes['X'+(clickX+1)+'Y'+clickY].class === 3) { holes['X'+(clickX+1)+'Y'+clickY].class = 4; } }
		      if (holes['X'+clickX+'Y'+(clickY+1)]) { if (holes['X'+clickX+'Y'+(clickY+1)].class === 3) { holes['X'+clickX+'Y'+(clickY+1)].class = 4; } }
		     }
		    } else {
		     if (holes[objectId].class < 3) {
	 	     holes[objectId].class++;
		      you.updateEnergy(-1);
		      var findItemChance = randomBetween(0, 10);
		      if (findItemChance === 1) { foundItem(clickX, clickY); }
		     }
		    }
		   }
	
	
	   // else clicked tile does not have an object or hole
	   // if player has clicked on a suitable tile, build letter
	   } else if ($cursor.hasClass('cursorLetter')) {
	    showLetterSelection();
	    $letterSelectionBox.data({'clickX': clickX, 'clickY': clickY});
	    you.status.paused2 = true;
	    you.status.buildingLetter = true;
     // build code is in $('#letterSelectionBox ul li').on click
	
	
	   // if player has clicked on a suitable tile, build platform
	   } else if ($cursor.hasClass('cursorPlatform')) {
	    objects['X'+(clickX-1)+'Y'+(clickY-1)] = {'type': 'platform', 'part': 1, 'x': clickX-1, 'y': clickY-1};
	    objects['X'+clickX+'Y'+(clickY-1)] = {'type': 'platform', 'part': 2, 'x': clickX-1, 'y': clickY-1};
	    objects['X'+(clickX+1)+'Y'+(clickY-1)] = {'type': 'platform', 'part': 3, 'x': clickX-1, 'y': clickY-1};
	    objects['X'+(clickX-1)+'Y'+clickY] = {'type': 'platform', 'part': 4, 'x': clickX-1, 'y': clickY-1};
	    objects[objectId] = {'type': 'platform', 'part': 5, 'x': clickX-1, 'y': clickY-1};
	    objects['X'+(clickX+1)+'Y'+clickY] = {'type': 'platform', 'part': 6, 'x': clickX-1, 'y': clickY-1};
	    objects['X'+(clickX-1)+'Y'+(clickY+1)] = {'type': 'platform', 'part': 7, 'x': clickX-1, 'y': clickY-1};
	    objects['X'+clickX+'Y'+(clickY+1)] = {'type': 'platform', 'part': 8, 'x': clickX-1, 'y': clickY-1};
	    objects['X'+(clickX+1)+'Y'+(clickY+1)] = {'type': 'platform', 'part': 9, 'x': clickX-1, 'y': clickY-1};
	
	    var platformId = 'X'+(clickX-1)+'Y'+(clickY-1);
	    platforms[platformId] = {
			 	 'x': (clickX-1),
			 	 'y': (clickY-1),
			 	 'node1': false,
			 	 'node2': false,
			 	 'node3': false,
			 	 'roof': false,
			 	 'platformEnergy': 0
	    };
	    miniMapMarker(clickX-1, clickY-1, '#eab132');
	    if (admin.fog) { redrawFog = true; }
	    hasBuilt('platform');
	
	
	   // if player has clicked on a suitable tile, build raft
	   } else if ($cursor.hasClass('cursorRaft')) {
	    var raftId = 'raft'+raftCounter;
	    raftCounter++;
	    rafts[raftId] = {
	     'x': clickX,
	     'y': clickY
	    };
	    objects[objectId] = {'type': 'raft', 'id': raftId, 'part': 1, 'x': clickX, 'y': clickY};
	    objects['X'+(clickX+1)+'Y'+clickY] = {'type': 'raft', 'id': raftId, 'part': 2, 'x': clickX, 'y': clickY};
	    objects['X'+clickX+'Y'+(clickY+1)] = {'type': 'raft', 'id': raftId, 'part': 3, 'x': clickX, 'y': clickY};
	    objects['X'+(clickX+1)+'Y'+(clickY+1)] = {'type': 'raft', 'id': raftId, 'part': 4, 'x': clickX, 'y': clickY};
	    hasBuilt('raft');
	
	
	   // if player has clicked on a suitable tile, build canoe
	   } else if ($cursor.hasClass('cursorCanoe')) {
	    var canoeId = 'canoe'+canoeCounter;
	    canoeCounter++;
	    canoes[canoeId] = {
	     'x': clickX,
	     'y': clickY
	    };
	    objects[objectId] = {'type': 'canoe', 'id': canoeId, 'x': clickX, 'y': clickY, 'direction': 'horz'};
	    // if carrying canoe, place that one, otherwise build new canoe
	    if (you.inventory.canoe.count >= 1) {
	     you.inventory.canoe.count--;
	     updateInventory();
	     if ($aCanoe.is(':visible')) {
	      $aCanoe.click();
	     } else {
	      cursor.hide();
	      resetActions();
	     }
	    } else {
	     hasBuilt('canoe');
		   }
	
	
	   // if player has clicked on a suitable tile, build camp
	   } else if ($cursor.hasClass('cursorCamp')) {
	    objects[objectId] = {'type': 'camp', 'part': 1, 'x': clickX, 'y': clickY};
	    objects['X'+(clickX+1)+'Y'+clickY] = {'type': 'camp', 'part': 2, 'x': clickX, 'y': clickY};
	    objects['X'+clickX+'Y'+(clickY+1)] = {'type': 'camp', 'part': 3, 'x': clickX, 'y': clickY};
	    objects['X'+(clickX+1)+'Y'+(clickY+1)] = {'type': 'camp', 'part': 4, 'x': clickX, 'y': clickY};
	    var cacheId = 'X'+clickX+'Y'+clickY;
	    caches[cacheId] = new Camp(new Inventory(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0));
	    miniMapMarker(clickX, clickY, '#dc7640');
	    if (admin.fog) { redrawFog = true; }
	    hasBuilt('camp');
	    
	    // chance for nearby flammable objects to catch fire
	    var fireTop1 = [clickX, clickY-1];
	    var fireTop2 = [clickX+1, clickY-1];
	    var fireLeft1 = [clickX-1, clickY];
	    var fireLeft2 = [clickX-1, clickY+1];
	    var fireRight1 = [clickX+2, clickY];
	    var fireRight2 = [clickX+2, clickY+1];
	    var fireBottom1 = [clickX, clickY+2];
	    var fireBottom2 = [clickX+1, clickY+2];
	    var fireCheckArray = [fireTop1, fireTop2, fireLeft1, fireLeft2, fireRight1, fireRight2, fireBottom1, fireBottom2];
	    
	    for (var f=0, fLimit=fireCheckArray.length; f<fLimit; f++) {
	     // if tile to check is not outside $system
	     if ((fireCheckArray[f][0] > 0) && (fireCheckArray[f][0] <= game.mapTileMax) && (fireCheckArray[f][1] > 0) && (fireCheckArray[f][1] <= game.mapTileMax)) {
		     var fireCheckMapTile = mapArray[fireCheckArray[f][0]][fireCheckArray[f][1]];
		     var objectId = 'X'+fireCheckArray[f][0]+'Y'+fireCheckArray[f][1];
		     if (typeof(objects[objectId]) !== "undefined") {
			     if (objects[objectId].flammable) {
			     	if (typeof(fires[objectId]) === "undefined") {
			     	 fires[objectId] = 1;
				     } else {
				      fires[objectId]++;
				     }
				    }
			    }
			   } // end check if outside map
		    
		   } // end fireCheckArray loop
	   
	   
	   // if player has clicked on a suitable tile, build bridge
	   } else if ($cursor.hasClass('cursorBridge')) {
	    objects[objectId] = {'type': 'bridge', 'x': clickX, 'y': clickY, 'flammable': true};
	    hasBuilt('bridge');
	   
	   
	   // if player has clicked on a suitable tile, build snare
	   } else if ($cursor.hasClass('cursorSnare')) {
	    objects[objectId] = {'type': 'snare', 'x': clickX, 'y': clickY};
	    snares[objectId] = {'x': clickX, 'y': clickY};
	    hasBuilt('snare');
	
	
	   // if player can dig, generate ice or dig new hole
	   } else if ($cursor.hasClass('cursorShovel')) {
	    // if terrain is iceberg
		   //if (mapArray[clickX][clickY] > 3 && mapArray[clickX][clickY] <= 3.4) {
		   // foundItem(clickX, clickY);
		   //} else {
	     holes[objectId] = {'class': 1, 'x': clickX, 'y': clickY};
	     you.updateEnergy(-1);
	    //}


	   // if player can smash rocks, alter terrain
	   } else if ($cursor.hasClass('cursorPickaxe')) {
	    mapArray[clickX][clickY] = 0.88;
	    updateMiniMapPixel(clickX, clickY);
		   redrawTerrain = true;
		   $cursor.removeClass(); // otherwise player can click again quickly
	    you.updateEnergy(-1);
	
	
	   }
	
	   
	  } else if (!$cursor.is(':visible') && you.status.sleep) {
	   you.status.sleep--;
	   if (you.status.sleep === 0) {
	    you.animating.stand = 3;
	   }
	  }

	 }	// end check if everything has loaded
 });
 
 
 
 // found an item when digging
 function foundItem(clickX, clickY) {
  var objectId = 'X'+clickX+'Y'+clickY;
  // if tile is iceberg, find ice
  //if (mapArray[clickX][clickY] > 3 && mapArray[clickX][clickY] <= 3.4) {
  // var foundItem = 'ice';
  // else if tile is sand, chance to find shell
  //} else
  if (mapArray[clickX][clickY] > 0.55 && mapArray[clickX][clickY] <= 0.6) {
   var foundItem = randomOneOf(['stone', 'stone', 'stone', 'stone', 'stone', 'shell']);
  // else chance to find quartz
  } else {
   var foundItem = randomOneOf(['stone', 'stone', 'stone', 'stone', 'stone', 'quartz']);
  }
  if (typeof(objects[objectId]) === "undefined") {
   $cursor.removeClass().show();
   if (foundItem === 'stone') {
    objects[objectId] = {'type': foundItem, 'class': 'stone2', 'x': clickX, 'y': clickY, 'collectable': true, 'collectItem': foundItem};
   } else {
    objects[objectId] = {'type': foundItem, 'x': clickX, 'y': clickY, 'collectable': true, 'collectItem': foundItem};
   }
		}
 }
 
 
 
 // generate helicopter
 function generateHelicopter() {
  if (helicopterTilesArray.length) {
   // abandon attempt after a certain number of tries so that script can't loop infinitely
   var helicopterArrived = false, distanceRestriction = true, whileCount = 0;
  
	  while (!helicopterArrived) {
	   //console.log('attempted to generate helicopter');
	   whileCount++;
	   // if takes too many attempts, don't worry about placing near player
	   if (whileCount > 500 && distanceRestriction) {
	    //console.log('Unable to generate helicopter near player');
	    distanceRestriction = false;
	   }
	
	   // get random helicopterTile
		  var hS = randomOneOf(helicopterTilesArray);
				
				// if distanceRestriction, check distance from player
				if (distanceRestriction) {
				 var hDistance = getDistance(hS, you.tile);
				 if (
			   // if is relatively near player, but not too near
						hDistance > 15 && hDistance < 45
			   // if there are no objects on the tiles
			   && (typeof(objects['X'+(hS.x+1)+'Y'+(hS.y+2)]) === "undefined"
				   && typeof(objects['X'+(hS.x+2)+'Y'+(hS.y+2)]) === "undefined"
				   && typeof(objects['X'+(hS.x+3)+'Y'+(hS.y+2)]) === "undefined"
				   && typeof(objects['X'+(hS.x+4)+'Y'+(hS.y+2)]) === "undefined")
				  // and terrain is appropriate
				  && (mapArray[hS.x+1][hS.y+2] < you.walk.max && mapArray[hS.x+1][hS.y+2] > you.walk.min
				   && mapArray[hS.x+2][hS.y+2] < you.walk.max && mapArray[hS.x+2][hS.y+2] > you.walk.min
				   && mapArray[hS.x+3][hS.y+2] < you.walk.max && mapArray[hS.x+3][hS.y+2] > you.walk.min
				   && mapArray[hS.x+4][hS.y+2] < you.walk.max && mapArray[hS.x+4][hS.y+2] > you.walk.min)
			   ) {
			   helicopterArrived = true;
				  helicopters[1] = {
				   'x': (hS.x+2),
				   'y': (hS.y+2),
				   'direction': 'left'
				  };
				  if (distanceRestriction) {
 				  status('You hear a helicopter nearby.');
 				 } else {
 				  status('You hear a helicopter in the distance.');
 				 }
				  //clearStatus(5000);
				  objects['X'+(hS.x+2)+'Y'+(hS.y+2)] = {'type': 'helicopter', 'id': 1, 'x': (hS.x+2), 'y': (hS.y+2)};
				  // if testing, mark helicopter on miniMap
				  if (admin.heli) {
				   miniMapMarker(hS.x+5, hS.y+1, 'orange');
				  }
			  }
				
				// else no distance requirement
				} else {
				 if (
			   // if there are no objects on the tiles
			   (typeof(objects['X'+(hS.x+1)+'Y'+(hS.y+2)]) === "undefined"
				   && typeof(objects['X'+(hS.x+2)+'Y'+(hS.y+2)]) === "undefined"
				   && typeof(objects['X'+(hS.x+3)+'Y'+(hS.y+2)]) === "undefined"
				   && typeof(objects['X'+(hS.x+4)+'Y'+(hS.y+2)]) === "undefined")
				  // and terrain is appropriate
				  && (mapArray[hS.x+1][hS.y+2] < you.walk.max && mapArray[hS.x+1][hS.y+2] > you.walk.min
				   && mapArray[hS.x+2][hS.y+2] < you.walk.max && mapArray[hS.x+2][hS.y+2] > you.walk.min
				   && mapArray[hS.x+3][hS.y+2] < you.walk.max && mapArray[hS.x+3][hS.y+2] > you.walk.min
				   && mapArray[hS.x+4][hS.y+2] < you.walk.max && mapArray[hS.x+4][hS.y+2] > you.walk.min)
			   ) {
			   helicopterArrived = true;
				  helicopters[1] = {
				   'x': (hS.x+2),
				   'y': (hS.y+2),
				   'direction': 'left'
				  };
				  if (distanceRestriction) {
 				  status('You hear a helicopter nearby.');
 				 } else {
 				  status('You hear a helicopter in the distance.');
 				 }
				  //clearStatus(5000);
				  objects['X'+(hS.x+2)+'Y'+(hS.y+2)] = {'type': 'helicopter', 'id': 1, 'x': (hS.x+2), 'y': (hS.y+2)};
				  // if testing, mark helicopter on miniMap
				  if (admin.heli) {
       miniMapMarker(hS.x+5, hS.y+1, 'orange');
				  }
			  }
				  
				}
	  } // end while
  }
 }
 
 
 
 // try to land helicopter
 function landHelicopter() {
  // if helicopter is facing left
  if (
   helicopters[1].direction === 'left'
   // if there are no objects on the tiles
   && (
    typeof(objects['X'+(you.tile.x-1)+'Y'+you.tile.y]) === "undefined"
    && typeof(objects['X'+you.tile.x+'Y'+you.tile.y]) === "undefined"
    && typeof(objects['X'+(you.tile.x+1)+'Y'+you.tile.y]) === "undefined"
    && typeof(objects['X'+(you.tile.x+2)+'Y'+you.tile.y]) === "undefined"
   )
   // and terrain is appropriate
   && (
    mapArray[you.tile.x-1][you.tile.y] < you.walk.max && mapArray[you.tile.x-1][you.tile.y] > you.walk.min
    && mapArray[you.tile.x][you.tile.y] < you.walk.max && mapArray[you.tile.x][you.tile.y] > you.walk.min
    && mapArray[you.tile.x+1][you.tile.y] < you.walk.max && mapArray[you.tile.x+1][you.tile.y] > you.walk.min
    && mapArray[you.tile.x+2][you.tile.y] < you.walk.max && mapArray[you.tile.x+2][you.tile.y] > you.walk.min
   )
  ) {
   you.on.helicopter = false;
   objects['X'+you.tile.x+'Y'+you.tile.y] = {'type': 'helicopter', 'id': 1, 'x': you.tile.x, 'y': you.tile.y};
   updateInventory();
   if (admin.fog) { redrawFog = true; }
   // if radio is visible, reload radio
	  if ($radio.is(':visible')) {
	   reloadRadio(getReception(you.getTerrain()));
	  }
   
  // else if helicopter is facing right
  } else if (
  helicopters[1].direction === 'right'
   // if there are no objects on the tiles
   && (
    typeof(objects['X'+(you.tile.x-2)+'Y'+you.tile.y]) === "undefined"
    && typeof(objects['X'+(you.tile.x-1)+'Y'+you.tile.y]) === "undefined"
    && typeof(objects['X'+you.tile.x+'Y'+you.tile.y]) === "undefined"
    && typeof(objects['X'+(you.tile.x+1)+'Y'+you.tile.y]) === "undefined"
   )
   // and terrain is appropriate
   && (
    mapArray[you.tile.x-2][you.tile.y] < you.walk.max && mapArray[you.tile.x-2][you.tile.y] > you.walk.min
    && mapArray[you.tile.x-1][you.tile.y] < you.walk.max && mapArray[you.tile.x-1][you.tile.y] > you.walk.min
    && mapArray[you.tile.x][you.tile.y] < you.walk.max && mapArray[you.tile.x][you.tile.y] > you.walk.min
    && mapArray[you.tile.x+1][you.tile.y] < you.walk.max && mapArray[you.tile.x+1][you.tile.y] > you.walk.min
   )
  ) {
   you.on.helicopter = false;
   objects['X'+you.tile.x+'Y'+you.tile.y] = {'type': 'helicopter', 'id': 1, 'x': you.tile.x, 'y': you.tile.y};
   updateInventory();
   if (admin.fog) { redrawFog = true; }
   // if radio is visible, reload radio
	  if ($radio.is(':visible')) {
	   reloadRadio(getReception(you.getTerrain()));
	  }

  } else {
   $actionsItems.removeClass('selected');
   status('Cannot land helicopter here.');
   clearStatus();
  }
 }
 
 
 
 // read all letters written in charcoal by player
 // only called if radioRescue word is known
 function readLetters() {
  var letterClusters = [];
  
  // sort letters by x, or by y if x is equal
  lettersArray.sort(function(a, b){
   if (a.x - b.x === 0) {
    return a.y - b.y;
   } else {
    return a.x - b.x;
   }
  });
  
  // for each letter player has written
  for (var i=0, iLimit = lettersArray.length; i<iLimit; i++) {
   // if is valid letter
   if (lettersArray[i] !== 'other') {
  
	   // if there are no phrases yet, start one
	   if (letterClusters.length <= 0) {
	    letterClusters.push([[(lettersArray[i].x+1), (lettersArray[i].y+1)], [lettersArray[i]]]); // letterClusters = [ [[centerx,y], [letters]], [[centerx,y], [letters]] ]
	
	   // else check if y-value is near any existing clusters
	   } else {
	    var foundCluster = false;
	    for (var j=0, jLimit = letterClusters.length; j<jLimit; j++) {
	     // if haven't found cluster
	     if (!foundCluster) {
		     // if letter center is near this cluster center, add to cluster
		     var lDistance = getDistance({'x': lettersArray[i].x+1, 'y': lettersArray[i].y+1}, {'x': letterClusters[j][0][0], 'y': letterClusters[j][0][1]});
					  //console.log(lDistance + ', cluster length: ' + letterClusters[j][1].length);
					  var checkDistance = letterClusters[j][1].length*4;
					  if (checkDistance > 16) { checkDistance = 16; }
		     if (lDistance < checkDistance) { // note that since we are checking from distance from center of cluster, very long series of letters will split into two clusters
		      letterClusters[j][1].push(lettersArray[i]);
		      letterClusters[j][0] = recenterCluster(letterClusters[j][1]);
		      /*
		      contextTerrain.beginPath();
						  contextTerrain.arc(letterClusters[j][0][0]*game.tileSize - drawOffsetX + you.offset, letterClusters[j][0][1]*game.tileSize - drawOffsetY + you.offset, 6, 0, Math.PI*2, false);
						  contextTerrain.fillStyle = 'rgb(0,0,0)';
						  contextTerrain.fill();
     	  contextTerrain.closePath();
     	  */
		      foundCluster = true;
		     }
		    }
	    }
	    
	    // if didn't find cluster, start new cluster
	    if (!foundCluster) {
	     letterClusters.push([[(lettersArray[i].x+1), (lettersArray[i].y+1)], [lettersArray[i]]]);
	    }
	    
	   }
   } // end if is valid
  }
  //console.log(letterClusters);
  
  // check each cluster for radioRescue
  for (var k=0, kLimit = letterClusters.length; k<kLimit; k++) {
   var lettersX = '', lettersY = '';
  
   // check with x priority
	  // sort cluster by x, or by y if x is equal
	  letterClusters[k][1].sort(function(a, b){
	   if (a.x - b.x === 0) {
	    return a.y - b.y;
	   } else {
	    return a.x - b.x;
	   }
	  });
	  for (var l=0, lLimit = letterClusters[k][1].length; l<lLimit; l++) {
	   if (letterClusters[k][1][l].char !== 'other') {
 	   lettersX += letterClusters[k][1][l].char;
 	  }
	  }
	  //console.log(lettersX);
	  if (lettersX.indexOf(radioRescue) !== -1 && you.status.calledHelicopter === false) {
    generateHelicopter();
    you.status.calledHelicopter = true;
   }
   
   // check with y priority
	  // sort cluster by y, or by x if y is equal
	  letterClusters[k][1].sort(function(a, b){
	   if (a.y - b.y === 0) {
	    return a.x - b.x;
	   } else {
	    return a.y - b.y;
	   }
	  });
	  for (var m=0, mLimit = letterClusters[k][1].length; m<mLimit; m++) {
	   if (letterClusters[k][1][m].char !== 'other') {
 	   lettersY += letterClusters[k][1][m].char;
 	  }
	  }
	  //console.log(lettersY);
	  if (lettersY.indexOf(radioRescue) !== -1 && you.status.calledHelicopter === false) {
    generateHelicopter();
    you.status.calledHelicopter = true;
   }

  }
 }
 
 
 
 // determine new center point for cluster
 function recenterCluster(cluster) {
  var xTotal = 0, yTotal = 0, centerX, centerY;
  for (var i=0, iLimit = cluster.length; i<iLimit; i++) {
   xTotal += (cluster[i].x+1);
   yTotal += (cluster[i].y+1);
  }
  centerX = Math.round(xTotal/cluster.length);
  centerY = Math.round(yTotal/cluster.length);
  return [centerX, centerY];
 }
 
 
 
 // when mousing over inventory item, fade if it will be discarded or consumed on click
 $('#inventory')
  .on('mouseenter', 'li', function(e) {
	  var itemName = $(this).attr('data-name');
	  var itemDescription = $(this).attr('data-description');
	  if (you.on.cache && $cacheInventoryBox.is(':visible')) {
			 if (itemName === 'canoe' && (caches[you.on.cache].inventory.count()+2) < caches[you.on.cache].carry) {
			  $inventoryGuide.text(itemDescription + ' Click this item to store it in this ' + caches[you.on.cache].type + '.');
			 } else if (itemName !== 'canoe' && caches[you.on.cache].inventory.count() < caches[you.on.cache].carry) {
	 		 $inventoryGuide.text(itemDescription + ' Click this item to store it in this ' + caches[you.on.cache].type + '.');
	 		} else {
	 		 $inventoryGuide.text(itemDescription + ' There is no room in this ' + caches[you.on.cache].type + ' to store this item.');
	 		}
			} else {
	   $(this).fadeTo(50, 0.3);
	   if (itemName === 'berries') {
 	   $inventoryGuide.text(itemDescription + ' Click the berries to eat them.');
 	  } else {
 	   $inventoryGuide.text(itemDescription + ' Click this item to discard it.');
 	  }
			}
			// if map, hide miniMapFog
			if (admin.mini && admin.fog && itemName === 'map') {
			 $miniMapFog.hide();
			}
	 })
		.on('mouseleave', 'li', function(e) {
		 var itemName = $(this).attr('data-name');
		 $inventory.children('li').stop().fadeTo(50, 1);
		 $inventoryGuide.empty();
		})
		.on('mouseleave', function(e) {
		 if (admin.mini && admin.fog && !$miniMapFog.is(':visible')) { $miniMapFog.show(); }
		});
	


 // when mousing over cacheInventory item
 $('#cacheInventory')
  .on('mouseenter', 'li', function(e) {
   var itemName = $(this).attr('data-name');
   var itemDescription = $(this).attr('data-description');
   if ($(this).hasClass('infinite')) {
    itemDescription += ' There is a lot here.';
   }
   if (itemName === 'canoe' && (you.inventory.count()+2) < you.carry.now && you.inventory.canoe.count <= 0) {
    $cacheInventoryGuide.text(itemDescription + ' Click this item to pick it up.');
   } else if (itemName !== 'canoe' && you.inventory.count() < you.carry.now) {
 		 $cacheInventoryGuide.text(itemDescription + ' Click this item to pick it up.');
 		} else if (itemName === 'backpack') {
 		 $cacheInventoryGuide.text(itemDescription);
 		} else {
 		 $cacheInventoryGuide.text(itemDescription + ' You can\'t carry any more of this.');
 		}
		})
		.on('mouseleave', 'li', function(e) {
		 $cacheInventoryGuide.empty();
		});



 // if player clicks on inventory item
 $('#inventory').on('click', 'li', function(e) {
  var thisItemName = $(this).attr('data-name');
  
  // if at cache and cacheInventoryBox is visible, transfer to cache if there is room
  if (you.on.cache && $cacheInventoryBox.is(':visible')) {
   // if canoe
   if (thisItemName === 'canoe' && (caches[you.on.cache].inventory.count()+2) < caches[you.on.cache].carry && caches[you.on.cache].inventory.canoe.count <= 0) {
    $(this).fadeOut(20, function() {
	    you.inventory[thisItemName].count--;
		   caches[you.on.cache].inventory[thisItemName].count++;
		   updateInventory();
		   updateCacheInventory(you.on.cache, thisItemName);
		  });

   // else normal item
   } else if (thisItemName !== 'canoe' && caches[you.on.cache].inventory.count() < caches[you.on.cache].carry) {
	   $(this).fadeOut(20, function() {
	    you.inventory[thisItemName].count--;
	    if (caches[you.on.cache].inventory[thisItemName].count !== 'i') {
 		   caches[you.on.cache].inventory[thisItemName].count++;
 		  }
		   // if backpack, adjust carry limit
		   if (thisItemName === 'backpack') {
		    you.updateCarry();
		   }
		   // if binoculars, redraw fog
		   if (thisItemName === 'binoculars') {
		    if (admin.fog) { redrawFog = true; }
		   }
		   // if radio, hide radio feed
		   if (thisItemName === 'radio' && you.inventory.radio.count <= 0) {
		    unloadRadio();
		   }
		   updateInventory();
		   updateCacheInventory(you.on.cache, thisItemName);
		  });
		 } // else do nothing (can't discard items at camp even if camp is full)

		// else discard or consume item
  } else {
   // if canoe, click canoe action button and also discard
   if (thisItemName === 'canoe') {
    $aCanoe.click();
    $inventoryDiscard.data('itemToDiscard', $(this)).html('OK to discard ' + thisItemName + '?').show();
   // if berries consume, else show discard button
   } else if (thisItemName === 'berries') {
    $(this).fadeOut(20, function() {
     you.inventory[thisItemName].count--;
     you.updateEnergy(you.energy.fromBerries);
			  $energyBar.addClass('increasing');
			  updateInventory();
			 });
   } else {
    $inventoryDiscard.data('itemToDiscard', $(this)).html('OK to discard ' + thisItemName + '?').show();
   }
	 }
 });
 
 $('#inventory').on('mouseleave', function(e) {
  $inventoryGuide.empty();
 });

 $('#inventoryBox').on('mouseleave', function(e) {
  $inventoryDiscard.hide();
 });



 // inventory discard button
 $inventoryDiscard
  .on('mousedown', function(e) {
	  var $itemToDiscard = $(this).data('itemToDiscard');
	  var thisItemName = $itemToDiscard.attr('data-name');
	  $itemToDiscard.fadeOut(20, function() {
		   you.inventory[thisItemName].count--;
		   // if binoculars, redraw fog
		   if (thisItemName === 'binoculars') {
		    if (admin.fog) { redrawFog = true; }
		   }
		   // if radio, hide radio feed
		   if (thisItemName === 'radio' && you.inventory.radio.count <= 0) {
		    unloadRadio();
		   }
			  // if backpack, reduce carry limit
			  if (thisItemName === 'backpack') {
			   you.updateCarry();
			  }
			  updateInventory();
			  $inventoryDiscard.hide(); // works better in firefox when in fade callback
		  });
	 })
 .on('mouseenter', function(e) {
  var $itemToDiscard = $(this).data('itemToDiscard');
  var thisItemName = $itemToDiscard.attr('data-name');
		$inventory.children('li.' + thisItemName + 'Item:last').fadeTo(50, 0.3);
  })
 .on('mouseleave', function(e) {
   $inventory.children('li').stop().css('opacity', 1);
  });
 
 
 
 // if player clicks on camp inventory item
 $('#cacheInventory').on('click', 'li', function(e) {
  var thisItemName = $(this).attr('data-name');
  
  // if at camp and cacheInventoryBox is visible, transfer from camp to inventory if there is room
  if (you.on.cache && $cacheInventoryBox.is(':visible')) {
   // if canoe
   if (thisItemName === 'canoe' && (you.inventory.count()+2) < you.carry.now && you.inventory.canoe.count <= 0) {
    $(this).fadeOut(20, function() {
	    caches[you.on.cache].inventory[thisItemName].count--;
	    you.inventory[thisItemName].count++;
	    updateCacheInventory(you.on.cache);
		   updateInventory(thisItemName);
		  });
		 
		 // else normal item
   } else if (thisItemName !== 'canoe' && you.inventory.count() < you.carry.now) {
    // if item is infinite source
    if (caches[you.on.cache].inventory[thisItemName].count === 'i') {
     you.inventory[thisItemName].count++;
			  updateCacheInventory(you.on.cache);
			  updateInventory(thisItemName);
    } else {
	   	$(this).fadeOut(20, function() {
		    caches[you.on.cache].inventory[thisItemName].count--;
		    you.inventory[thisItemName].count++;
			   // if backpack, increase carry limit
			   if (thisItemName === 'backpack') {
			    you.updateCarry();
			   }
				  // if binoculars, redraw fog
			   if (thisItemName === 'binoculars') {
			    if (admin.fog) { redrawFog = true; }
			   }
			   // if radio, show radio feed
			   if (thisItemName === 'radio') {
			    loadRadio();
			   }
			   updateCacheInventory(you.on.cache);
			   updateInventory(thisItemName);
			  });
		  }

		 // else check if item is backpack, which can be taken even if at carry limit, since it increases carry limit
		 } else if (thisItemName === 'backpack') {
    caches[you.on.cache].inventory[thisItemName].count--;
    you.inventory[thisItemName].count++;
    you.updateCarry();
    updateCacheInventory(you.on.cache);
    updateInventory('backpack');
		 }
  } // can't discard items from camp
 });
 
 $('#cacheInventory').on('mouseleave', function(e) {
  $cacheInventoryGuide.empty();
 });



 // update inventory
 function updateInventory(itemToAnimate) {
  var inventoryHeight = you.carry.now / 5 * inventoryItemHeight;
  $inventory.css('height', inventoryHeight);

  // draw inventory
  var inventoryHTML = '';
  for (var item in you.inventory) {
   for (var j=0, jLimit=you.inventory[item].count; j<jLimit; j++) {
    inventoryHTML += '<li class="' + item + 'Item" data-name="' + item + '" data-description="' + you.inventory[item].description + '"></li>';
   }
  }
  $inventory.html(inventoryHTML);
  
  // animate
  if (typeof(itemToAnimate) !== "undefined" && itemToAnimate) {
   $inventory.children('li.' + itemToAnimate + 'Item:last').hide().fadeIn(100);
  }

  // if too many items (can happen if player discards backpack)
  if (you.inventory.count() > you.carry.now) {
   var excessItemCount = you.inventory.count() - you.carry.now;
   for (var e=0; e<excessItemCount; e++) {
    var $excessItem = $inventory.children('li').last();
    var excessItemName = $excessItem.attr('data-name');
    $excessItem.fadeOut(20, function() {
     you.inventory[excessItemName].count--;
     updateInventory();
    });
	  }
  }

  // update actions
  $actionsItems.hide();
  
  // if on helicopter, can only land helicopter
  if (you.on.helicopter) {
   $aLand.show();
   $actionsGuide.html($aLand.data('guide'));
   $actionsItems.removeClass('selected');
   $cursor.removeClass();
  
  } else {
  
	  $aHand.show();
	  
	  // can build platform
	  if (canBuild('platform')) {
	   $aPlatform.show();
	  }
	
	  // can build zip
	  if (canBuild('zip')) {
	   $aZip.show();
	  }
	
	  // can build slate roof
	  if (canBuild('roof')) {
	   $aRoof.show();
	  }
	
	  // can build quarry
	  if (canBuild('quarry')) {
	   $aQuarry.show();
	  }
	
	  // can build letter
	  if (canBuild('letter')) {
	   $aLetter.show();
	  }
	
			// can build raft
	  if (canBuild('raft')) {
	   $aRaft.show();
			}
	
			// can build canoe
	  if (canBuild('canoe') || you.inventory.canoe.count >= 1) {
	   if (you.inventory.canoe.count >= 1) {
	    $aCanoe.data('guide', 'Canoe: Place your canoe by clicking on 1&nbsp;sand tile.').show();
	   } else {
	    $aCanoe.data('guide', 'Canoe: Uses ' + buildable.canoe.cost.wood + '&nbsp;wood, ' + buildable.canoe.cost.birchbark + '&nbsp;birchbark. Build on 1&nbsp;sand tile.').show();
	   }
			}
			
			// can build camp
			if (canBuild('camp')) {
			 $aCamp.show();
			}
				
			// can build bridge
			if (canBuild('bridge')) {
			 $aBridge.show();
			}
			
			// can build flag
			if (canBuild('flag')) {
			 $aFlag.show();
			}
	
			// can build sign
			if (canBuild('sign')) {
			 $aSign.show();
			}
			
			// can build snare
			if (canBuild('snare')) {
			 $aSnare.show();
			}

			// can craft pickaxe
			if (canBuild('pickaxe')) {
			 $aPickaxe.show();
			}
	
			// can craft axe
			if (canBuild('axe')) {
			 $aAxe.show();
			}
	
			// can craft shovel
			if (canBuild('shovel')) {
			 $aShovel.show();
			}
	
			// can craft fur
			if (canBuild('fur')) {
			 $aFur.show();
			}
	
			// can craft boots
			if (canBuild('boots')) {
			 $aBoots.show();
			}
	
			// can craft radio
			if (canBuild('radio')) {
			 $aRadio.show();
			}
	
			// if has shovel and/or pickaxe, update aHand class (don't just .removeClass() as this breaks selected action highlighting)
			if (you.inventory.pickaxe.count > 0 && you.inventory.shovel.count > 0) {
			 $aHand.removeClass('pickaxeshovel pickaxe shovel').addClass('pickaxeshovel').data('guide', 'Hand/Shovel/Pickaxe: Click items to pick them up. Click field tiles to dig. Click rocks to smash them.');
			} else if (you.inventory.pickaxe.count > 0) {
			 $aHand.removeClass('pickaxeshovel pickaxe shovel').addClass('pickaxe').data('guide', 'Hand/Pickaxe: Click items to pick them up. Click rocks to smash them.');
			} else if (you.inventory.shovel.count > 0) {
			 $aHand.removeClass('pickaxeshovel pickaxe shovel').addClass('shovel').data('guide', 'Hand/Shovel: Click items to pick them up. Click field tiles to dig.');
			} else {
			 $aHand.removeClass('pickaxeshovel pickaxe shovel').data('guide', 'Hand: Click items to pick them up.');
			}
		} // end if not on helicopter

 } // end updateInventory



 // update cacheInventory
 function updateCacheInventory(thisCacheId, itemToAnimate) {
  $cacheInventoryLabel.text(caches[thisCacheId].type);
  $cacheInventoryDesc.text(caches[thisCacheId].description);
  showCacheInventory(thisCacheId);
  
  var cacheInventory = caches[thisCacheId].inventory;
  var cacheInventoryHTML = '';
  for (var item in cacheInventory) {
   var campItemCount = cacheInventory[item].count, itemClass = '';
   if (campItemCount === 'i') { campItemCount = 1; itemClass += ' infinite'; }
   for (var j=0, jLimit=campItemCount; j<jLimit; j++) {
    cacheInventoryHTML += '<li class="' + item + 'Item' + itemClass + '" data-name="' + item + '" data-description="' + you.inventory[item].description + '"><span></span></li>';
   }
  }
  $cacheInventory.html(cacheInventoryHTML);
  
  // animate
  if (typeof(itemToAnimate) !== "undefined" && itemToAnimate) {
   $cacheInventory.children('li.' + itemToAnimate + 'Item:last').hide().fadeIn(100);
  }
 }
 
 
 
 function showCacheInventory(thisCacheId) {
  var cacheInventoryHeight = caches[thisCacheId].carry/5*inventoryItemHeight;
		$cacheInventory.css('height', cacheInventoryHeight);
		$cacheInventoryBox.css({'left': game.mapCanvasW/2 + 85, 'top': game.mapCanvasH/2 - cacheInventoryHeight/2 - 30}).show();
		$dimmer.show();
 }



 function showLetterSelection() {
  cursor.hide();
		$letterSelectionBox.css({'left': game.mapCanvasW/2 + 35}).show();
		$dimmer.show();
 }



 function showSignInput() {
  cursor.hide();
		$signInputBox.css({'left': game.mapCanvasW/2 + 35}).show();
		$('#signInputBox input').focus();
		$dimmer.show();
 }
 

 
 // when actions are clicked
 $actionsItems
 .on('click', function(e) {
   $actionsGuide.html($(this).data('guide'));
   $actionsItems.removeClass('selected');
   $cursor.removeClass();
	  $(this).addClass('selected');
	  if ($letterSelectionBox.is(':visible')) {
	   $('#closeLetterSelection').click();
	  } else if ($signInputBox.is(':visible')) {
	   $('#closeSignInput').click();
	  }
  })
 .on('mouseenter', function(e) {
   $actionsGuide.html($(this).data('guide'));
  })
 .on('mouseleave', function(e) {
   $actionsGuide.empty();
  });
 
 $actions.on('mouseout', function(e) {
	 $actionsGuide.html($('#actions li.selected').data('guide'));
	});
  
 $aHand // guide text changes depending on context, see above
  .data('guide', 'Hand: Click items to pick them up.')
  .on('click', function(e) {
	  cursor.mode = 'hand';
			$inventory.children('li').stop().css('opacity', 1);
	 });

 $aBridge
  .data('guide', 'Bridge: Uses ' + buildable.bridge.cost.wood + '&nbsp;wood. Build on 1&nbsp;water tile.')
  .on('click', function(e) {
	  cursor.mode = 'bridge';
			$inventory.children('li').stop().css('opacity', 1);
			$inventory.children('li.woodItem').slice(buildable.bridge.cost.wood*-1).fadeTo(50, 0.3);
	 });

 $aFlag
  .data('guide', 'Flag: Uses ' + buildable.flag.cost.birchbark + '&nbsp;birchbark and ' + buildable.flag.cost.berries + '&nbsp;berries. Click on large trees to place a flag.')
  .on('click', function(e) {
	  cursor.mode = 'flag';
			$inventory.children('li').stop().css('opacity', 1);
   $inventory.children('li.birchbarkItem').slice(buildable.flag.cost.birchbark*-1).fadeTo(50, 0.3);
			$inventory.children('li.berriesItem').slice(buildable.flag.cost.berries*-1).fadeTo(50, 0.3);
	 });

 $aSign
  .data('guide', 'Sign: Uses ' + buildable.sign.cost.birchbark + '&nbsp;birchbark and ' + buildable.sign.cost.charcoal + '&nbsp;charcoal. Click on large trees to place a sign.')
  .on('click', function(e) {
	  cursor.mode = 'sign';
			$inventory.children('li').stop().css('opacity', 1);
   $inventory.children('li.birchbarkItem').slice(buildable.sign.cost.birchbark*-1).fadeTo(50, 0.3);
			$inventory.children('li.charcoalItem').slice(buildable.sign.cost.charcoal*-1).fadeTo(50, 0.3);
	 });
	
	$aSnare
  .data('guide', 'Snare: Uses ' + buildable.snare.cost.wire + '&nbsp;wire and ' + buildable.snare.cost.boughs + '&nbsp;boughs. Click between two trees to place a snare. Come back later to check it.')
  .on('click', function(e) {
	  cursor.mode = 'snare';
			$inventory.children('li').stop().css('opacity', 1);
   $inventory.children('li.wireItem').slice(buildable.snare.cost.wire*-1).fadeTo(50, 0.3);
			$inventory.children('li.boughsItem').slice(buildable.snare.cost.boughs*-1).fadeTo(50, 0.3);
	 });

 $aCamp
  .data('guide', 'Camp: Uses ' + buildable.camp.cost.stone + '&nbsp;stone, ' + buildable.camp.cost.wood + '&nbsp;wood, ' + buildable.camp.cost.boughs + '&nbsp;boughs. Build on 4&nbsp;field tiles.')
  .on('click', function(e) {
	  cursor.mode = 'camp';
			$inventory.children('li').stop().css('opacity', 1);
			$inventory.children('li.stoneItem').slice(buildable.camp.cost.stone*-1).fadeTo(50, 0.3);
			$inventory.children('li.woodItem').slice(buildable.camp.cost.wood*-1).fadeTo(50, 0.3);
			$inventory.children('li.boughsItem').slice(buildable.camp.cost.boughs*-1).fadeTo(50, 0.3);
	 });

 $aRaft
  .data('guide', 'Raft: Uses ' + buildable.raft.cost.wood + '&nbsp;wood. Build on 2&nbsp;sand, 2&nbsp;water tiles.')
  .on('click', function(e) {
	  cursor.mode = 'raft';
			$inventory.children('li').stop().css('opacity', 1);
			$inventory.children('li.woodItem').slice(buildable.raft.cost.wood*-1).fadeTo(50, 0.3);
	 });

 $aCanoe // guide text changes depending on context, see above
  .data('guide', 'Canoe: Place a canoe you are carrying, or build a new one using ' + buildable.canoe.cost.wood + '&nbsp;wood, ' + buildable.canoe.cost.birchbark + '&nbsp;birchbark. Place on 1&nbsp;sand tile.')
  .on('click', function(e) {
	  cursor.mode = 'canoe';
			$inventory.children('li').stop().css('opacity', 1);
			// if carrying canoe, place that one, otherwise build new canoe
			if (you.inventory.canoe.count >= 1) {
    $inventory.children('li.canoeItem').slice(-1).fadeTo(50, 0.3);
   } else {
    $inventory.children('li.woodItem').slice(buildable.canoe.cost.wood*-1).fadeTo(50, 0.3);
	  	$inventory.children('li.birchbarkItem').slice(buildable.canoe.cost.birchbark*-1).fadeTo(50, 0.3);
   }
	 });

 $aLetter
  .data('guide', 'Letter: Uses ' + buildable.letter.cost.charcoal + '&nbsp;charcoal. Build on 9&nbsp;field tiles.')
  .on('click', function(e) {
	  cursor.mode = 'letter';
			$inventory.children('li').stop().css('opacity', 1);
			$inventory.children('li.charcoalItem').slice(buildable.letter.cost.charcoal*-1).fadeTo(50, 0.3);
	 });

 $aPlatform
  .data('guide', 'Platform: Uses ' + buildable.platform.cost.wood + '&nbsp;wood, ' + buildable.platform.cost.boughs + '&nbsp;boughs. Build on 9&nbsp;field tiles.')
  .on('click', function(e) {
	  cursor.mode = 'platform';
			$inventory.children('li').stop().css('opacity', 1);
			$inventory.children('li.woodItem').slice(buildable.platform.cost.wood*-1).fadeTo(50, 0.3);
			$inventory.children('li.boughsItem').slice(buildable.platform.cost.boughs*-1).fadeTo(50, 0.3);
	 });

 $aZip
  .data('guide', 'Zipline: Uses ' + buildable.zip.cost.wire + '&nbsp;wire, ' + buildable.zip.cost.wood + '&nbsp;wood. Build on platform edge. Must be another platform nearby to connect to.')
  .on('click', function(e) {
	  cursor.mode = 'zip';
			$inventory.children('li').stop().css('opacity', 1);
			$inventory.children('li.wireItem').slice(buildable.zip.cost.wire*-1).fadeTo(50, 0.3);
			$inventory.children('li.woodItem').slice(buildable.zip.cost.wood*-1).fadeTo(50, 0.3);
	 });

 $aRoof
  .data('guide', 'Slate Roof: Uses ' + buildable.roof.cost.slate + '&nbsp;slate, ' + buildable.roof.cost.wood + '&nbsp;wood. Build on center of platform.')
  .on('click', function(e) {
	  cursor.mode = 'roof';
			$inventory.children('li').stop().css('opacity', 1);
			$inventory.children('li.slateItem').slice(buildable.roof.cost.slate*-1).fadeTo(50, 0.3);
			$inventory.children('li.woodItem').slice(buildable.roof.cost.wood*-1).fadeTo(50, 0.3);
	 });

 $aQuarry
  .data('guide', 'Quarry: Uses ' + buildable.quarry.cost.shovel + '&nbsp;shovel, ' + buildable.quarry.cost.wood + '&nbsp;wood. Build on 9&nbsp;holes.')
  .on('click', function(e) {
	  cursor.mode = 'quarry';
			$inventory.children('li').stop().css('opacity', 1);
			$inventory.children('li.shovelItem').slice(buildable.quarry.cost.shovel*-1).fadeTo(50, 0.3);
			$inventory.children('li.woodItem').slice(buildable.quarry.cost.wood*-1).fadeTo(50, 0.3);
	 });

 $aPickaxe
  .data('guide', 'Craft Pickaxe: Uses ' + buildable.pickaxe.cost.bone + '&nbsp;bone and ' + buildable.pickaxe.cost.wood + '&nbsp;wood.')
  .on('mouseenter', function(e) {
   $inventory.children('li').stop().css('opacity', 1);
   $inventory.children('li.boneItem').slice(buildable.pickaxe.cost.bone*-1).fadeTo(50, 0.3);
			$inventory.children('li.woodItem').slice(buildable.pickaxe.cost.wood*-1).fadeTo(50, 0.3);
   })
  .on('mouseleave', function(e) {
   $inventory.children('li').stop().css('opacity', 1);
   })
  .on('click', function(e) {
   you.inventory.pickaxe.count++;
   hasBuilt('pickaxe');
	 });

 $aAxe
  .data('guide', 'Craft Axe: Uses ' + buildable.axe.cost.slate + '&nbsp;slate and ' + buildable.axe.cost.wood + '&nbsp;wood.')
  .on('mouseenter', function(e) {
   $inventory.children('li').stop().css('opacity', 1);
   $inventory.children('li.slateItem').slice(buildable.axe.cost.slate*-1).fadeTo(50, 0.3);
			$inventory.children('li.woodItem').slice(buildable.axe.cost.wood*-1).fadeTo(50, 0.3);
   })
  .on('mouseleave', function(e) {
   $inventory.children('li').stop().css('opacity', 1);
   })
  .on('click', function(e) {
   you.inventory.axe.count++;
   hasBuilt('axe');
	 });

 $aShovel
  .data('guide', 'Craft Shovel: Uses ' + buildable.shovel.cost.shell + '&nbsp;shell and ' + buildable.shovel.cost.wood + '&nbsp;wood.')
  .on('mouseenter', function(e) {
   $inventory.children('li').stop().css('opacity', 1);
   $inventory.children('li.shellItem').slice(buildable.shovel.cost.shell*-1).fadeTo(50, 0.3);
			$inventory.children('li.woodItem').slice(buildable.shovel.cost.wood*-1).fadeTo(50, 0.3);
   })
  .on('mouseleave', function(e) {
   $inventory.children('li').stop().css('opacity', 1);
   })
  .on('click', function(e) {
   you.inventory.shovel.count++;
   hasBuilt('shovel');
	 });

 $aFur
  .data('guide', 'Cook Rabbit: Provides energy and fur. Uses ' + buildable.fur.cost.rabbit + '&nbsp;rabbit.')
  .on('mouseenter', function(e) {
   $inventory.children('li').stop().css('opacity', 1);
   $inventory.children('li.rabbitItem').slice(buildable.fur.cost.rabbit*-1).fadeTo(50, 0.3);
   })
  .on('mouseleave', function(e) {
   $inventory.children('li').stop().css('opacity', 1);
   })
  .on('click', function(e) {
   you.inventory.fur.count++;
   hasBuilt('fur');
   you.updateEnergy(you.energy.fromRabbit);
	 });

 $aBoots
  .data('guide', 'Craft Boots: Uses ' + buildable.boots.cost.fur + '&nbsp;fur and ' + buildable.boots.cost.birchbark + '&nbsp;birchbark.')
  .on('mouseenter', function(e) {
   $inventory.children('li').stop().css('opacity', 1);
   $inventory.children('li.furItem').slice(buildable.boots.cost.fur*-1).fadeTo(50, 0.3);
			$inventory.children('li.birchbarkItem').slice(buildable.boots.cost.birchbark*-1).fadeTo(50, 0.3);
   })
  .on('mouseleave', function(e) {
   $inventory.children('li').stop().css('opacity', 1);
   })
  .on('click', function(e) {
   you.inventory.boots.count++;
   hasBuilt('boots');
	 });

 $aRadio
  .data('guide', 'Craft Radio: Uses ' + buildable.radio.cost.wire + '&nbsp;wire, ' + buildable.radio.cost.shell + '&nbsp;shell, ' + buildable.radio.cost.quartz + '&nbsp;quartz.')
  .on('mouseenter', function(e) {
   $inventory.children('li').stop().css('opacity', 1);
   $inventory.children('li.wireItem').slice(buildable.radio.cost.wire*-1).fadeTo(50, 0.3);
			$inventory.children('li.shellItem').slice(buildable.radio.cost.shell*-1).fadeTo(50, 0.3);
			$inventory.children('li.quartzItem').slice(buildable.radio.cost.quartz*-1).fadeTo(50, 0.3);
   })
  .on('mouseleave', function(e) {
   $inventory.children('li').stop().css('opacity', 1);
   })
  .on('click', function(e) {
   you.inventory.radio.count++;
   hasBuilt('radio');
   loadRadio();
	 });

 $aLand // guide text changes depending on context, see above
  .data('guide', 'Land Helicopter: Position your shadow over 4&nbsp;field tiles.')
  .on('click', function(e) {
	  landHelicopter();
	 });

 $('#letterSelectionBox ul li')
  .on('click', function(e) {
    var clickX = $letterSelectionBox.data('clickX');
    var clickY = $letterSelectionBox.data('clickY');
    var objectId = 'X'+clickX+'Y'+clickY;
    $('#closeLetterSelection').click();
    var writeLetter = $(this).data("value").toLowerCase();
    var characters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
    // if input is not recognized character, use 'other'
    if (characters.indexOf(writeLetter) === -1) { writeLetter = 'other'; }
    // these letter are only two tiles wide
    if (writeLetter === 'e' || writeLetter === 'f' || writeLetter === 'i' || writeLetter === 'j' || writeLetter === 'l' || writeLetter === 's') {
	    objects['X'+(clickX-1)+'Y'+(clickY-1)] = {'type': 'letter', 'char': writeLetter, 'part': 1, 'x': clickX, 'y': clickY};
	    objects['X'+clickX+'Y'+(clickY-1)] = {'type': 'letter', 'char': writeLetter, 'part': 2, 'x': clickX, 'y': clickY};
	    objects['X'+(clickX-1)+'Y'+clickY] = {'type': 'letter', 'char': writeLetter, 'part': 4, 'x': clickX, 'y': clickY};
	    objects[objectId] = {'type': 'letter', 'char': writeLetter, 'part': 5, 'x': clickX, 'y': clickY};
	    objects['X'+(clickX-1)+'Y'+(clickY+1)] = {'type': 'letter', 'char': writeLetter, 'part': 7, 'x': clickX, 'y': clickY};
	    objects['X'+clickX+'Y'+(clickY+1)] = {'type': 'letter', 'char': writeLetter, 'part': 8, 'x': clickX, 'y': clickY};
	   } else {
	    objects['X'+(clickX-1)+'Y'+(clickY-1)] = {'type': 'letter', 'char': writeLetter, 'part': 1, 'x': clickX, 'y': clickY};
	    objects['X'+clickX+'Y'+(clickY-1)] = {'type': 'letter', 'char': writeLetter, 'part': 2, 'x': clickX, 'y': clickY};
	    objects['X'+(clickX+1)+'Y'+(clickY-1)] = {'type': 'letter', 'char': writeLetter, 'part': 3, 'x': clickX, 'y': clickY};
	    objects['X'+(clickX-1)+'Y'+clickY] = {'type': 'letter', 'char': writeLetter, 'part': 4, 'x': clickX, 'y': clickY};
	    objects[objectId] = {'type': 'letter', 'char': writeLetter, 'part': 5, 'x': clickX, 'y': clickY};
	    objects['X'+(clickX+1)+'Y'+clickY] = {'type': 'letter', 'char': writeLetter, 'part': 6, 'x': clickX, 'y': clickY};
	    objects['X'+(clickX-1)+'Y'+(clickY+1)] = {'type': 'letter', 'char': writeLetter, 'part': 7, 'x': clickX, 'y': clickY};
	    objects['X'+clickX+'Y'+(clickY+1)] = {'type': 'letter', 'char': writeLetter, 'part': 8, 'x': clickX, 'y': clickY};
	    objects['X'+(clickX+1)+'Y'+(clickY+1)] = {'type': 'letter', 'char': writeLetter, 'part': 9, 'x': clickX, 'y': clickY};
	   }
    lettersArray.push({
		 	 'x': (clickX-1),
		 	 'y': (clickY-1),
		 	 'char': writeLetter
    });
    hasBuilt('letter');
    if (radioRescue) { readLetters(); } // only need to read letters if rescue word is known
  });
 
 

 // pressing Enter key when entering sign text
 $('#signInputBox input')
  .keypress(function(e) {
   if (e.which == 13) { // enter key
    $(this).blur();
    $('#signInputSubmit').focus().click();
    e.preventDefault();
    return false;
   }
  });

 $('#signInputSubmit')
  .on('click', function(e) {
   var clickX = $signInputBox.data('clickX');
   var clickY = $signInputBox.data('clickY');
   var objectId = 'X'+clickX+'Y'+clickY;
   var signText = $('#signInputBox input').val().trim();
   signText = signText.replace(/[^A-Za-z0-9~`!@#$%^&*()_+=;'\\:"|,.\/? -]/g,'');
   $('#closeSignInput').click();
   if (signText.length > 0) {
    if (signText.length > 90) { signText = "(incoherent scribbles)"; } // maxlength = 100
    objects[objectId].flagged = signText;
    hasBuilt('sign');
   }
  });



 // if admin, warp to new location on miniMap click
 if (admin.warp && admin.mini) {
  $miniMap.on('click', function(e) {
   var miniMapOffset = $miniMap.offset();
   var mcX = Math.round(e.pageX - miniMapOffset.left) * game.mapTileMultiplier;
   var mcY = Math.round(e.pageY - miniMapOffset.top) * game.mapTileMultiplier;
   you.tile.x = mcX;
   you.tile.y = mcY;
   mapOffsetX = you.tile.x - game.mapCanvasHalfTiles;
	  mapOffsetY = you.tile.y - game.mapCanvasHalfTiles;
   drawOffsetX = mapOffsetX * game.tileSize;
   drawOffsetY = mapOffsetY * game.tileSize;
   redrawTerrain = true;
   if (admin.fog) { redrawFog = true; }
   clearMiniMapCursor();
   if (admin.mini) { redrawMiniMapCursor = true; }
   // if radio is visible, reload radio
	  if ($radio.is(':visible')) {
	   reloadRadio(getReception(you.getTerrain()));
	  }
  });
 }



 // map size switcher
 $('#switch528').on('click', function(e) {
  if (game.mapCanvasW !== 528) {
   switchSize('528');
   $('#page').addClass('compact');
   $('#switchSize li').removeClass('currentSize');
   $(this).addClass('currentSize');
  }
 });
 $('#switch624').on('click', function(e) {
  if (game.mapCanvasW !== 624) {
   switchSize('624');
   $('#page').removeClass();
   $('#switchSize li').removeClass('currentSize');
   $(this).addClass('currentSize');
  }
 });
 $('#switch784').on('click', function(e) {
  if (game.mapCanvasW !== 784) {
   switchSize('784');
   $('#page').removeClass();
   $('#switchSize li').removeClass('currentSize');
   $(this).addClass('currentSize');
  }
 });
 
 function switchSize(size) {
  // if building zipline, cancel building
  if (you.status.buildingZip) {
   $cancel.click();
  }

  $mapTerrain.css('background', '#36516f'); // set to background colour to avoid blinking while everything is redrawn
	 game.mapCanvasW = size;
	 game.mapCanvasH = size;
	 game.mapCanvasTileW = game.mapCanvasW / game.tileSize;
	 game.mapCanvasTileH = game.mapCanvasW / game.tileSize;
	 game.mapCanvasHalfTiles = game.mapCanvasHalfTiles = game.mapCanvasTileW/2;

  // if view area is odd number of tiles wide and high (game.mapCanvasTileW%2 is 0 if even number of tiles, 1 if odd number of tiles)
  if (game.mapCanvasTileW%2) {
   game.mapCanvasHalfTiles = game.mapCanvasHalfTiles - 0.5;
  }
	 
	 game.miniMapVisW = game.mapCanvasTileW / game.mapTileMultiplier;
  game.miniMapVisH = game.mapCanvasTileH / game.mapTileMultiplier;
	 
	 $system.attr({'width': game.mapCanvasW, 'height': game.mapCanvasH}).css({'width': game.mapCanvasW, 'height': game.mapCanvasH});
	 $dimmer.attr({'width': game.mapCanvasW, 'height': game.mapCanvasH}).css({'width': game.mapCanvasW, 'height': game.mapCanvasH});

  $mapTerrain.attr({'width': game.mapCanvasW, 'height': game.mapCanvasH}).css({'width': game.mapCanvasW, 'height': game.mapCanvasH});
  $mapSprites.attr({'width': game.mapCanvasW, 'height': game.mapCanvasH}).css({'width': game.mapCanvasW, 'height': game.mapCanvasH});
  $mapCover.attr({'width': game.mapCanvasW, 'height': game.mapCanvasH}).css({'width': game.mapCanvasW, 'height': game.mapCanvasH});
  $mapFog.attr({'width': game.mapCanvasW, 'height': game.mapCanvasH}).css({'width': game.mapCanvasW, 'height': game.mapCanvasH});
  $fader.attr({'width': game.tileSize, 'height': game.tileSize}).css({'left': game.mapCanvasHalfTiles*game.tileSize, 'top': game.mapCanvasHalfTiles*game.tileSize});
  
  // adjust positions of visible overlay boxes
  if ($cacheInventoryBox.is(':visible')) {
   showCacheInventory(you.on.cache);
  }
  if ($letterSelectionBox.is(':visible')) {
   showLetterSelection();
  }
  if ($signInputBox.is(':visible')) {
   showSignInput();
  }

  mapOffsetX = you.tile.x - game.mapCanvasHalfTiles;
		mapOffsetY = you.tile.y - game.mapCanvasHalfTiles;
  drawOffsetX = mapOffsetX * game.tileSize;
  drawOffsetY = mapOffsetY * game.tileSize;
  
  redrawTerrain = true;
  if (admin.fog) { redrawFog = true; }
  clearMiniMapCursor();
  if (admin.mini) { redrawMiniMapCursor = true; }

  // if radio is visible, unload and load again (since width will change)
	 if ($radio.is(':visible')) {
	  unloadRadio();
	  loadRadio();
	 }
	 
	 // set mapTerrain background back to waves after brief delay
	 requestTimeout(function(){ $mapTerrain.css('background', '#4c829e url(\'images/waves-deep.gif\') 0 0 repeat'); return false; }, 50);
 }
 

 // close camp inventory
 $('#closeCacheInventory').on('click', function(e) {
  $cacheInventoryBox.hide();
	 $dimmer.hide();
 });

 // unpause player and close letter selection
 $('#closeLetterSelection').on('click', function(e) {
  $letterSelectionBox.data({'clickX': '', 'clickY': ''});
  you.status.paused2 = false;
  you.status.buildingLetter = false;
  $letterSelectionBox.hide();
	 $dimmer.hide();
 });

 // unpause player and close sign input
 $('#closeSignInput').on('click', function(e) {
  $signInputBox.data({'clickX': '', 'clickY': ''});
  $('#signInputBox input').val('');
  you.status.paused2 = false;
  you.status.buildingSign = false;
  $signInputBox.hide();
	 $dimmer.hide();
 });

 // close update message
 $('#closeupdate').on('click', function(e) {
  $('#menu-news').remove();
 });






 /* object and sprite manipulation functions */

 // given tile x, y and terrain value min and max, return random adjacent suitable tile if there is one
 function getRandomAdjacentTerrainTile(originalTileX, originalTileY, terrainMin, terrainMax) {
 
  var terrainMatch = false;
  var randomAdjacentX, randomAdjacentY, terrainTileX, terrainTileY, tileDirection, terrainTileData;
  
  // abandon attempt after a certain number of tries so that script can't loop infinitely
  var whileCount = 0;
  while (!terrainMatch) {
   whileCount++;
   if (whileCount > 20) { return false; } // was 100
   
   // find a random adjacent tile, making sure not to end up with the original tile (0,0)
   var randomAdjacentX = randomOneOf([-1, 0, 1]);
   if (randomAdjacentX === 0) {
    var randomAdjacentY = randomOneOf([-1, 1]);
   } else {
    var randomAdjacentY = randomOneOf([-1, 0, 1]);
   }
   terrainTileX = originalTileX+randomAdjacentX*1; // *1 ensures evaluation as a number
   terrainTileY = originalTileY+randomAdjacentY*1;
   
   // if this map tile exists (is not outside the map area)
   if ((terrainTileX <= game.mapTileMax) && (terrainTileX > 0) && (terrainTileY <= game.mapTileMax) && (terrainTileY > 0)) {
   
    terrainTileData = mapArray[terrainTileX][terrainTileY];
    
    // if there is already an object on the tile, abandon this attempt (otherwise too many attempts, and script stalls)
    if (typeof(objects['X'+terrainTileX+'Y'+terrainTileY]) !== "undefined") {
     return false;
    }
    
     // if terrain tile is suitable, use this tile; otherwise try again
     if ((terrainTileData > terrainMin) && (terrainTileData < terrainMax)) {
      if (randomAdjacentX === -1 && randomAdjacentY === -1) {
       tileDirection = 'up';
      } else if (randomAdjacentX === 0 && randomAdjacentY === -1) {
       tileDirection = 'up';
      } else if (randomAdjacentX === 1 && randomAdjacentY === -1) {
       tileDirection = 'right';
      } else if (randomAdjacentX === 1 && randomAdjacentY === 0) {
       tileDirection = 'right';
      } else if (randomAdjacentX === 1 && randomAdjacentY === 1) {
       tileDirection = 'down';
      } else if (randomAdjacentX === 0 && randomAdjacentY === 1) {
       tileDirection = 'down';
      } else if (randomAdjacentX === -1 && randomAdjacentY === 1) {
       tileDirection = 'left';
      } else if (randomAdjacentX === -1 && randomAdjacentY === 0) {
       tileDirection = 'left';
      }
      terrainMatch = true;
     }

   // else terrain tile is outside map area
   } else {
    return false;
   }
  }
  return {'x': terrainTileX, 'y': terrainTileY, 'direction': tileDirection};
 
 }



 // given tile x, y, return random adjacent flammable tile if there is one
 function getRandomAdjacentFlammableTile(originalTileX, originalTileY) {
 
  var tileMatch = false;
  var randomAdjacentX, randomAdjacentY, fireTileX, fireTileY, fireTileData;
  
  // abandon attempt after a certain number of tries so that script can't loop infinitely
  var whileCount = 0;
  while (!tileMatch) {
   whileCount++;
   if (whileCount > 20) { return false; } // was 100
   
   // find a random adjacent tile, making sure not to end up with the original tile (0,0)
   var randomAdjacentX = randomOneOf([-1, 0, 1]);
   if (randomAdjacentX === 0) {
    var randomAdjacentY = randomOneOf([-1, 1]);
   } else {
    var randomAdjacentY = randomOneOf([-1, 0, 1]);
   }
   fireTileX = originalTileX+randomAdjacentX*1; // *1 ensures evaluation as a number
   fireTileY = originalTileY+randomAdjacentY*1;
   
   // if this map tile exists (is not outside the map area)
   if ((fireTileX <= game.mapTileMax) && (fireTileX > 0) && (fireTileY <= game.mapTileMax) && (fireTileY > 0)) {
   
    fireCheckMapTile = mapArray[fireTileX][fireTileY];
    var objectId = 'X'+fireTileX+'Y'+fireTileY;
    
    // if this tile is already on fire
    if (typeof(fires[objectId]) !== "undefined") {
     // if fire is less than max size, okay for fire to spread here
     if (fires[objectId] < 3) {
      tileMatch = true;
     // else abandon this attempt
     } else {
      return false;
     }
    }
    
    if (typeof(objects[objectId]) !== "undefined") {
     if (objects[objectId].flammable) {
      tileMatch = true;
     }
    }

   // else terrain tile is outside map area
   } else {
    return false;
   }
  }
  return {'x': fireTileX, 'y': fireTileY, 'xPx': fireTileX*game.tileSize, 'yPx': fireTileY*game.tileSize};
 
 }
 
 
 
 // load radio feed
 function loadRadio() {
  // if radio has been contacted before
  if (radioRescue) {
   reloadRadio(getReception(you.getTerrain()));
   $radio.show();
  
  // else radio for first time, so load keyword
  } else {

	  $.ajax({
	   type: "POST",
	   url: 'radio.php',
	   cache: false,
	   data: '',
	   dataType: "text",
	   success: function(data) {
	    radioRescue = data;
	    reloadRadio(getReception(you.getTerrain()));
	    $radio.show();
	   },
	   // if ajax request fails
	   error: function() {
	    reloadRadio(getReception(you.getTerrain()));
	    $radio.show();
	   }
	  }); // end ajax
  
  }
 }
 
 
 
 // get terrain radio reception level
 function getReception(terrain) {
  var reception;
  
  if (you.on.helicopter) {
   reception = 7;
  } else {
   
	  // icebergs
	  if (terrain === 3.1 || terrain === 3.2 || terrain === 3.3 || terrain === 3.4) {
	   reception = 6;
	   
	  // inside cave, crash site, or field station
	  } else if (terrain === 2.2 || terrain === 4.12 || (terrain >= 6 && terrain < 7)) {
	   reception = 5;
	   
	  // mountains, range1, range2
	  } else if ((terrain > 0.98 && terrain <= 1.4) || (terrain >= 5 && terrain < 6)) {
	   reception = 4;
	  
	  // hills
	  } else if (terrain >= 0.9 && terrain <= 0.98) {
	   reception = 3;
	   
	  // high field
	  } else if (terrain >= 0.7) {
	   reception = 2;
	  
	  // field
	  } else if (terrain >= 0.5) {
	   reception = 1;
	  
	  // water
	  } else {
	   reception = 0;
	  }

	 }
  return reception;
 }
 
 
 
 // reload radio feed
 function reloadRadio(reception) {
  var radioArray, radioString = '';
  switch (reception) {
   case 7:
    radioArray = [' . . &#9834; out along the edges .', '&#9835; metal under tension ..&#9834; . .', ' . . right into the. ', '&#9834;&#9834; ., .. .', ' ..DANGER ZONE ..&#9834; . ', '. . head\'n into twilight .. &#9835; . ', '. .. DANGER ZONE &#9835; .', '.. listen to her ..  ..', ' . &#9834; . red line overload .. ', ' &#9834;. gonna take you . .'];
    break;
   
   case 6:
    radioArray = ['&#9834; .. . &#9835; .', '&#9835; ..&#9834; . .', ' . .. ', '&#9834;&#9834; ., .. .', '. ..&#9834; . ', '. . .. &#9835;&#9834;..', '. ,. .. &#9835; .', '.. ..  ..', '&#9834;.. ,. .. ,', ' . ..  .&#9834;.'];
    break;
   
   case 5:
    radioArray = ['. &nbsp;&nbsp;. &nbsp;. ', '.&nbsp;&nbsp; . . ', ' .&nbsp; &nbsp;. &nbsp;&nbsp;.', '.   .&nbsp; &nbsp;. ', ' . &nbsp;&nbsp;. . &nbsp;. &nbsp;&nbsp;.', ' .&nbsp; . .. .&nbsp; ', '.&nbsp;&nbsp; .&nbsp; .', ' ..&nbsp;&nbsp; . .&nbsp;&nbsp;. ', ' . .&nbsp;&nbsp;&nbsp; &nbsp; ', '.&nbsp; . . &nbsp;&nbsp;&nbsp;. . '];
    break;
   
   case 4:
	   radioArray = [' . .missing since.. ', '. crash. .', '. .. . ', '.. search aircraft ...', '.. friday. ', '. islands near . .', '.. believed to have .. ', ' .. looking for . .', ' . search and rescue .. ', '. . wreckage of .. ', '..unfortunate .. ', ' . hoping to . . ', ' .looking . .', '.. incident .', ' . .spotted .. '];
	   if (radioRescue) {
	    radioRescueText = radioRescue.toUpperCase();
	    radioArray.push(' . hoping to find ' + radioRescueText + ' . ');
	    radioArray.push('.. looking for ' + radioRescueText + ' . .');
	   }
    break;
   
   case 3:
    radioArray = ['... .. ,...', '..lo. ,o.', '.. , :...', 'king. ,..', ').days...', '. ...(', ', ...(.sea', '. ...', '.est,, .. ...', '. lone... .. ', '.rch . ,.. (', '. los..) . ,t,', '.:.is.. .,, .', ',land.. ', ' , .. ,,a .', '. ,, for.', '..hop .. .:. e .'];
    break;
   
   case 2:
    radioArray = ['.....', '... .', '.,, ...', ', ...(..', '.,, . ..)..', '. . ,.. (', '. ...) . ,,', '.:... .,, .', ',.,... ', ' , .. ,, .', '.... .. .'];
    break;
   
   case 1:
    radioArray = ['. .. ..', '., .. .', '. .. ...', '. ... ...', '.., . . ..', '. . ... .', '. ..., . . .', '.. . .. ... .', '. ... .... .', ' . ., .. .', '.... ., .'];
    break;
   
   default:
  	 radioArray = ['. . ,&nbsp;', '. .&nbsp; . .&nbsp;', '&nbsp;.&nbsp;, &nbsp; &nbsp; .', '. &nbsp; .&nbsp; ..&nbsp;', '&nbsp; &nbsp;. . ,.&nbsp; .', '&nbsp;. .&nbsp;&nbsp;,. . &nbsp; ', '. . &nbsp;.', ' .. &nbsp; . . .&nbsp;&nbsp;', '&nbsp;. . .&nbsp;', '., .&nbsp;. .&nbsp; . .&nbsp;'];
    break;
  } // end switch

 	for (i=0; i<10; i++) {
 	 radioString += randomOneOf(radioArray);
 	}
 	$('#radioFeed').empty();
 	radioFeed = new Marquee($('#radioFeed'), radioString, game.mapCanvasW);
 }
 
 
 
 // unload radio feed
 function unloadRadio() {
  radioFeed = null;
  $('#radioFeed').empty();
  $radio.hide();
 }
 
 
 
 // click icon to show / hide radio feed
 $('#radioIcon').on('click', function(e) {
  $('#radioFeedBox').slideToggle(200);
 });



 // marquee scrolling for radio
 // see: http://stackoverflow.com/questions/3175332/twitter-like-marquee-fadeing-steamlessly
 // also: http://www.markinns.com/articles/full/recreating_the_fade_scrolling_text_marquee_on_twitter
	var Marquee = function(j, s, w) {
  var self = this;
  var jTarget = j;
  var strText = s;
  var intWidth = w;
  var intPaddingLeft = 60;
  var jText, intTextWidth;
  var update = function() {
   intPaddingLeft -= 2;
   if (intPaddingLeft < -intTextWidth) {
    intPaddingLeft += intTextWidth;
   }
   jText.css('left', intPaddingLeft);
  };
  var setup = function() {
	  jText = $('<div id="radioScroll"></div>').html(strText);
	  jTarget
    .append(jText)
    .append($('<div class="marqueeFader"></div>').html('&nbsp;'))
    .append($('<div class="marqueeFader left"></div>').html('&nbsp;'));
	  intTextWidth = $('#radioScroll').width();
	  jTarget.width(intWidth);
	  jText.html(strText + " " + strText);
	  update();
  };
  setup();
  requestInterval(update, game.loopRate);
  return self;
	};






 /* start game */
 seedMap(mapData);
 seedMap(airData);
	generateMap();
	loadPlayer();

});