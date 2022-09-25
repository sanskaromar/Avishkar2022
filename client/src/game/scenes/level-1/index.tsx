/* eslint-disable no-unused-vars */
import Phaser, { GameObjects, Scene, Tilemaps, Physics } from 'phaser';

import { Player } from '../../classes/player';
import { Enemy } from '../../classes/enemy';
import { gameObjectsToObjectPoints } from '../../helpers/gameobject-to-object-point';

import { EVENTS_NAME } from '../../consts';
import { NPC } from '../../classes/npc';

export class Level1 extends Scene {
  private player!: Player;
  private map!: Tilemaps.Tilemap;
  private tileset!: Tilemaps.Tileset;
  private tileset2!: Tilemaps.Tileset;
  private layer!: Tilemaps.TilemapLayer;
  private layer2!: Tilemaps.TilemapLayer;
  private layer3!: Tilemaps.TilemapLayer;
  private layer4!: Tilemaps.TilemapLayer;
  private layer5!: Tilemaps.TilemapLayer;
  private layer6!: Tilemaps.TilemapLayer;
  private layer7!: Tilemaps.TilemapLayer;
  private chests!: GameObjects.Sprite[];
  private enemies!: Enemy[];
  private npcs!: NPC[];
  private npcChatSprites!: Physics.Arcade.Sprite[];

  private debugText!: GameObjects.Text;

  constructor() {
    super('level-1-scene');
  }

  create(): void {
    this.initMap();
    this.player = new Player(this, 100, 100);
    // this.initChests();
    // this.initEnemies();
    // this.initNPCs();
    this.initCamera();

    this.physics.add.collider(this.player, this.layer5);
    this.physics.add.collider(this.player, this.layer6);

    // this.layer5.renderDebug(this.debug);
    // this.layer6.renderDebug(this.debug);
    // this.layer7.renderDebug(this.debug);
    this.showDebug();
  }

  update(): void {
    this.player.update();
    this.getTileProperties();
  }

  private initMap(): void {
    // this.map = this.make.tilemap({ key: 'dungeon', tileWidth: 16, tileHeight: 16 });
    this.map = this.make.tilemap({ key: 'try5', tileWidth: 16, tileHeight: 16 });
    // this.tileset = this.map.addTilesetImage('dungeon', 'tiles');
    this.tileset = this.map.addTilesetImage('SpriteChan', 'tileSpriteChan', 16, 16, 0, 0);
    this.tileset2 = this.map.addTilesetImage('Interior', 'tileInterior', 16, 16, 0, 0);

    this.layer = this.map.createLayer('Base Tiles Layer', [this.tileset, this.tileset2], 0, 0);
    this.layer2 = this.map.createLayer(' Floor Layer', [this.tileset, this.tileset2], 0, 0);
    this.layer3 = this.map.createLayer('Interior Layer 1', [this.tileset, this.tileset2], 0, 0);
    this.layer4 = this.map.createLayer('Interior Layer 2', [this.tileset, this.tileset2], 0, 0);
    this.layer5 = this.map.createLayer('Walls Layer', [this.tileset, this.tileset2], 0, 0);
    this.layer6 = this.map.createLayer('WallSides Layer', [this.tileset, this.tileset2], 0, 0);
    this.layer7 = this.map.createLayer(' Roof Layer', [this.tileset, this.tileset2], 0, 0);

    // const layer2 = this.map.createLayer(1, this.tileset2, 0, 0);
    // this.groundLayer = this.map.createLayer('Ground', this.tileset, 0, 0);
    // this.wallsLayer = this.map.createLayer('Walls', this.tileset, 0, 0);
    this.layer5.setCollisionByProperty({ collides: true }, true);
    this.layer6.setCollisionByProperty({ collides: true }, true);

    this.physics.world.setBounds(0, 0, this.layer.width, this.layer.height);
    // this.showDebug();
  }

  private initChests(): void {
    const chestPoints = gameObjectsToObjectPoints(
      this.map.filterObjects('Chests', (obj) => obj.name === 'ChestPoint')
    );

    this.chests = chestPoints.map((chestPoint) =>
      this.physics.add.sprite(chestPoint.x, chestPoint.y, 'tiles_spr', 595).setScale(1.5)
    );

    this.chests.forEach((chest) => {
      this.physics.add.overlap(this.player, chest, (_obj1, obj2) => {
        this.game.events.emit(EVENTS_NAME.chestLoot);
        obj2.destroy();
        // this.cameras.main.flash();
      });
    });
  }

  private initEnemies(): void {
    const enemiesPoints = gameObjectsToObjectPoints(
      this.map.filterObjects('Enemies', (obj) => obj.name === 'EnemyPoint')
    );

    this.enemies = enemiesPoints.map((enemyPoint) =>
      new Enemy(this, enemyPoint.x, enemyPoint.y, 'tiles_spr', this.player, 503)
        .setName(enemyPoint.id.toString())
        .setScale(1.5)
    );

    // this.physics.add.collider(this.enemies, this.wallsLayer);
    this.physics.add.collider(this.enemies, this.enemies);
    this.physics.add.collider(
      this.player,
      this.enemies,
      (obj1, _obj2) => {
        (obj1 as Player).getDamage(1);
      },
      undefined,
      this
    );
  }

  private initNPCs(): void {
    const npcsPoints = gameObjectsToObjectPoints(
      this.map.filterObjects('NPCs', (obj) => obj.name === 'NPCPoint')
    );

    this.npcs = npcsPoints.map((npcPoint) =>
      new NPC(
        this,
        npcPoint.x,
        npcPoint.y,
        'tiles_spr',
        this.player,
        360,
        npcPoint.properties.filter((prop) => prop.name === 'left')[0].value
      )
        .setName(npcPoint.id.toString())
        .setScale(1.5)
    );
    this.npcChatSprites = npcsPoints.map((npcsPoint) => {
      const sprite = new Physics.Arcade.Sprite(
        this,
        npcsPoint.x - 16,
        npcsPoint.y - 16,
        'tiles_spr',
        765
      )
        .setName(npcsPoint.id.toString())
        .setScale(1)
        .setVisible(false);
      this.add.existing(sprite);
      return sprite;
    });
    // console.log(this.npcChatSprites, this.npcs);

    this.physics.add.collider(this.npcs, this.npcs);
    // this.physics.add.collider(this.npcs, this.wallsLayer);
    this.physics.add.collider(this.player, this.npcs);
    this.game.events.on(
      EVENTS_NAME.interact,
      (name: string) => {
        this.npcChatSprites.filter((prop) => prop.name === name)[0].setVisible(true);
      },
      this
    );
    this.game.events.on(
      EVENTS_NAME.resetInteract,
      (name: string) => {
        this.npcChatSprites.filter((prop) => prop.name === name)[0].setVisible(false);
      },
      this
    );
  }

  private initCamera(): void {
    this.cameras.main.setSize(this.game.scale.width, this.game.scale.height);
    this.cameras.main.startFollow(this.player, true, 0.09, 0.09);
    this.cameras.main.setZoom(1.5);
  }

  private showDebug(): void {
    const debugGraphics = this.add.graphics().setAlpha(0.7);
    this.layer5.renderDebug(debugGraphics, {
      tileColor: null, // Color of colliding tiles
      collidingTileColor: new Phaser.Display.Color(243, 234, 48, 255)
    });
    this.layer6.renderDebug(debugGraphics, {
      tileColor: null, // Color of colliding tiles
      collidingTileColor: new Phaser.Display.Color(150, 234, 234, 255)
    });
    this.player.setDebug(true, true, 250);

    this.debugText = this.add.text(10, 10, '', { font: '16px Courier', color: '#00ff00' });
    this.debugText.text = 'Debug text';
  }

  private getTileProperties(): void {
    var tile = this.layer5.getTileAtWorldXY(
      this.game.input.activePointer.worldX,
      this.game.input.activePointer.worldY
    );

    if (!tile) return;

    // Note: JSON.stringify will convert the object tile properties to a string
    let currentDataString = JSON.stringify(tile.properties);

    console.log(currentDataString);
  }
}
