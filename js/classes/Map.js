class Map {
  constructor(scene, key, tileSetName, bgLayerName, blockedLayerName) {
    this.scene = scene;
    this.key = key; // Json key name
    this.tileSetName = tileSetName;
    this.bgLayerName = bgLayerName;
    this.blockedLayerName = blockedLayerName;
    this.createMap();
  }

  createMap() {
    this.map = this.scene.make.tilemap({ key: this.key });
    // layname
    //key
    this.tiles = this.map.addTilesetImage(
      this.tileSetName,
      this.tileSetName,
      32,
      32,
      1,
      2
    );

    this.backgroundLayer = this.map.createLayer(
      this.bgLayerName,
      this.tiles,
      0,
      0
    );

    this.blockedLayer = this.map.createLayer(
      this.blockedLayerName,
      this.tiles,
      0,
      0
    );

    this.backgroundLayer.setScale(2);
    this.blockedLayer.setScale(2);
    this.blockedLayer.setCollisionByExclusion([-1]); // All tiles inside layer will have collisoon detect

    // Update world bounds
    this.scene.physics.world.bounds.width = this.map.widthInPixels * 2;
    this.scene.physics.world.bounds.height = this.map.heightInPixels * 2;

    // Limit camera bound to size of map to get irid of empty black screen
    this.scene.cameras.main.setBounds(
      0,
      0,
      this.map.widthInPixels * 2,
      this.map.heightInPixels * 2
    );
  }
}
