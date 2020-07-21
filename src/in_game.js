import Phaser from 'phaser';

var cargo;
var bodyStore;
var rockStore;
var checkpointSpawn;
//////////////////////////////// Storage untuk penyimpanan body dan Rock untuk random generated assets//
var terrainGraphics;
var startLine;
var isWheelCollide;
/////////////////////////////// Variable Generate Mountain//
var tresholdTime;
var timeUi;
/////////////////////////////// Variable Time bar yang digunakan untuk set Waktu//
let cartStructure;
let cartwheelFront;
let cartwheelRear;
////////////////////////////// Cart Structure generation
let bodies;
var isMoving;
var canMoving;

var syaratfinalscore;
var final_panel_appear;
var final_panel;
var flag;
var syaratspawn;
var berhenti;

var distanceTreshold;
var distanceSpawn;
var distanceUi;
var tresholdValue;
var distanceConvertString;
var graphics;
var checkpoint_TreshHold;
var maximumTreshHold = 10;
var minimumTreshHold = 0;
var staticTreshHold = 3;
//////////////////////////////// Semua Function Untuk pengaruhin treshhold

var background;
var awan1;
var awan2;
var awan3;

//var timeBar;

var scoreUi;
var valueScore;
var infoTextui;
var gameData = {}
var gameOption = {
  timeConfig: 30,
  mountainTotal : 3,
  length: [150,350],
  slopePerMountain: 6,
  startHeigthTerrain: 0.5,
  amplitude: 100,
  speed: 0.5,
  stoneRatio: 5
};

var CryptoJS = require('crypto-js')
var simplify = require('simplify-js');

export class InGame extends Phaser.Scene {

  constructor(){

    super("Game");
  }

  init(data){
    gameData.id = data.id;
    gameData.session = data.session
    gameData.score = data.game_score
    gameData.sound = data.sound_status
    gameData.url = data.game_apiURL
    gameData.token = data.game_token
  }

  preload(){
    this.load.json('car', './src/assets/Car.json');
    this.load.atlas('car_sheet', './src/assets/car_sheet.png', './src/assets/car_sheet.json');
  }

  create(){

    bodyStore = [];
    rockStore= [];
    terrainGraphics = [];
    checkpointSpawn = [];
    distanceTreshold = false;
    startLine = new Phaser.Math.Vector2(-200, Math.random());
    syaratspawn = 0;
    berhenti = 0;
    //syaratfinalscore = 0;
    syaratfinalscore = 1;
    for(let i = 0; i < gameOption.mountainTotal; i++){

      terrainGraphics[i] =  this.add.graphics();
      startLine = this.terrainGeneration(terrainGraphics[i], startLine);
    }

    isMoving = false;

    this.generatePlayercar(250, 400);



    // var carJson = this.cache.json.get('car')
    // var mobil = this.matter.add.sprite(360, 640,'car_sheet', 'MobilTest.png', {
    //   shape: carJson.MobilTest
    // }).setScale(0.2)
    // console.log();// fungsi Badan jangan diapus

    // this.matter.world.on('collisionactive', (e) => {
    //
    //   isWheelCollide = false;
    //
    //   e.pairs.forEach((p) => {
    //
    //     if(p.objectA.label == 'wheel' || p.objectB.label == 'wheel'){
    //
    //       isWheelCollide = true;
    //     }
    //   })
    // })

    // timeBar = this.add.sprite(0, 100, 'timebar').setOrigin(0, 0.5);
    // timeBar.scaleX = 3;
    // timeBar.scaleY = 2;
    graphics = this.add.graphics(0, 100)
    graphics.fillStyle(0x8b0000, 1);
    graphics.fillRect(0, 60, 300, 15);
    //console.log(graphics);

    tresholdValue = 0;

    distanceSpawn = 5;
    distanceConvertString = this.add.text(0, 30, 'DISTANCE', {
      font: 'bold 26px Arial',
      fill: 'white',
      align: 'center'
    }).setOrigin(0.5, 0.5);

    distanceUi = this.add.text(0, 70, '0', {
      font: 'bold 42px Arial',
      fill: 'white',
      align: 'center'
    }).setOrigin(0.5, 0.5);

    valueScore = 0;
    infoTextui = this.add.text(0, 30, 'SCORE' ,{

      font: 'bold 26px Arial',
      fill: 'white',
      align: 'center'
    }).setOrigin(0.5, 0.5);

    scoreUi = this.add.text(0, 70, '' + valueScore, {

      font: 'bold 42px Arial',
      fill: 'white',
      align: 'center'
    }).setOrigin(0.5, 0.5);

    // timeUi = this.add.text(0,150,''+tresholdTime,{
    //   font: 'bold 42px Arial',
    //   fill: 'white',
    //   align: 'center'
    // }).setOrigin(0.5, 0.5);
    // timeUi.setScale(0.9);// command time.UI

    this.input.on("pointerdown", () => this.accelerateCar());
    this.input.on("pointerup", () => this.decelerateCar());

    //tresholdTime = this.time.delayedCall(30000, this.restart(),[],this);
    tresholdTime = this.time.addEvent({
      delay: 1000,
      callback: this.timeEvent,
      callbackScope: this,
      loop: true
    })

    flag = this.add.sprite(0, 220, 'Flag').setScale(2);
    flag.setOrigin(0.5, 0.5);

    final_panel = this.add.sprite(0, 380, 'score').setScale(0.5).setDepth(1);
    final_panel.setOrigin(0.5, 0.5);

    this.matter.world.on('collisionstart', (events) =>{
      events.pairs.forEach((pair) => {
        const {bodyA, bodyB} = pair;
        if((bodyA.label == 'cargo' && bodyB.label != 'car') || (bodyB.label == 'cargo' && bodyA.label != 'car')){
          final_panel_appear = this.time.addEvent({ delay: 1000, callback: this.appear, callbackScope: this});//function untuk tampilin pake delay
          graphics.scaleX = 0;
          tresholdTime.remove(false)
          console.log('Drop');
          //isMoving = false;
          //this.input.on("pointerdown", () => this.decelerateCar());
        }
      })
    });// function object collision

    // checkpoint_TreshHold = Phaser.Math.Between(minimumTreshHold, maximumTreshHold);// INI juga jangan dihapus
    checkpoint_TreshHold = staticTreshHold;
    background = this.add.image(0,280,'bangunan').setScale(1).setDepth(-1000);
    background.setOrigin(0,0);

    awan1 = this.add.sprite(250, 50, 'cloud1').setScale(2).setDepth(-500).setOrigin(0,0);
    awan2 = this.add.sprite(60, 130, 'cloud2').setScale(0.5).setDepth(-500).setOrigin(0,0);
    awan3 = this.add.sprite(670, 170, 'cloud3').setScale(1).setDepth(-500).setOrigin(0,0);


  }

  update(){

    final_panel.visible = false; //set visibility untuk final score
    flag.visible = false; //set visibility untuk checkpoint
    this.cameras.main.scrollX = cartStructure.position.x - this.game.config.width / 8;
    if(isMoving){

      let carVelocity;
      carVelocity = cartwheelFront.body.angularSpeed + gameOption.speed;
      //console.log(frontWheel.body.angularSpeed);
      carVelocity = Phaser.Math.Clamp(carVelocity, 0, 0.7);

      this.matter.body.setAngularVelocity(cartwheelRear.body, carVelocity);
      this.matter.body.setAngularVelocity(cartwheelFront.body, carVelocity);
      //console.log(frontWheel.angularSpeed);
      //console.log(rearWheel.angularSpeed);
    }

    terrainGraphics.forEach((graphics) => {

      if(this.cameras.main.scrollX > graphics.x + graphics.width + 10){
        startLine = this.terrainGeneration(graphics, startLine);
      }
    });

    bodies = this.matter.world.localWorld.bodies;

    bodies.forEach((body) => {

      if(this.cameras.main.scrollX > body.position.x + this.game.config.width && !body.inPool){

        switch (body.label) {
          case 'ground':
            bodyStore.push(body);
            break;
          case 'rock':
            rockStore.push(body);
            break;
        }
        body.inPool = true;
      }
    });

    //console.log(checkpoint_TreshHold);
    if(tresholdValue == checkpoint_TreshHold && tresholdValue != 0){
      if (distanceTreshold === false) {
        distanceTreshold = true;
        valueScore += 1;
        ////////////////////////////////
              // minimumTreshHold = minimumTreshHold+5;
              // maximumTreshHold = maximumTreshHold+5;
              // checkpoint_TreshHold = Phaser.Math.Between(minimumTreshHold, maximumTreshHold);
              // console.log("Berganti Angka Menjadi");
              // console.log(checkpoint_TreshHold);
        /////////////////////////////// Dynamic Checkpoint Treshhold
        staticTreshHold = staticTreshHold + 3;
        checkpoint_TreshHold = staticTreshHold;
        //console.log(staticTreshHold - 2);

        gameOption.timeConfig += (staticTreshHold - 2)
        graphics.scaleX += ((1 / 30) * (staticTreshHold - 2))
        /////////////////////////////// Static Checkpoint TreshHold

      }
      else {
        valueScore += 0;
      }
    }
    else {
      distanceTreshold = false;
    }

    if(distanceSpawn  == checkpoint_TreshHold && tresholdValue != 0){
      //this.SpawningSystem();
      //console.log("Masuk");
      flag.visible = true;//fungsi nampilin checkpoint
    }

    //this.checkpoint(distanceTreshold);

    tresholdValue = Math.floor(this.cameras.main.scrollX / 100);
    distanceSpawn = Math.floor(this.cameras.main.scrollX/100);
    distanceConvertString.x = this.cameras.main.scrollX + 80;
    distanceUi.x = this.cameras.main.scrollX + 80;
    distanceUi.setText('' + tresholdValue);


    //timeBar.x = this.cameras.main.scrollX + 220;
    //timeBar.scaleX -= 0.002;

    infoTextui.x = this.cameras.main.scrollX + 640;
    scoreUi.x = this.cameras.main.scrollX + 640;
    scoreUi.setText(''+valueScore);

    // timeUi.setText('Timer: ' + tresholdTime.getProgress().toString().substr(0,4));
    // timeUi.x = this.cameras.main.scrollX+this.game.config.width/2;

    flag.x = this.cameras.main.scrollX+this.game.config.width/2;
    final_panel.x = this.cameras.main.scrollX+this.game.config.width/2;
    background.x = this.cameras.main.scrollX-220;
    graphics.x = this.cameras.main.scrollX + 210;

    if(gameOption.timeConfig > 0){
      canMoving = true;
      //console.log(1 / tresholdTimeEnd);
      //graphics.scaleX = (1 - tresholdTime.getProgress()) * 2;
      //graphics.scaleX = (1 / tresholdTimeEnd)
    }
    else {
      if(syaratfinalscore === 1){
        //final_panel_appear = this.time.delayedCall(7000,this.appear(),[],this);
        isMoving = false;
        tresholdTime.remove(false)
        syaratfinalscore = 0
        final_panel_appear = this.time.addEvent({ delay: 1000, callback: this.appear, callbackScope: this});//function untuk tampilin pake delay
        console.log('Time Out');
      }
      else {

      }
    }

    if(gameOption.timeConfig > 30){
      gameOption.timeConfig = 30
      graphics.scaleX = 1
    }
    //syarat penampilan final panel score

    /////////////////////////////////////////////////
    if(awan1.x<this.cameras.main.scrollX-230)
    {
      awan1.x = this.cameras.main.scrollX+650;
    }

    if(awan2.x<this.cameras.main.scrollX-100)
    {
      awan2.x = this.cameras.main.scrollX+650;
    }

    if(awan3.x<this.cameras.main.scrollX-100)
    {
      awan3.x = this.cameras.main.scrollX+650;
    }
    //////////////////////////////////////////////// Fungsi Kasar Awan
  }



  generatePlayercar(posX, posY){

    let container_floor = Phaser.Physics.Matter.Matter.Bodies.rectangle(posX, posY-40, 110, 20, {
      label: 'car',
    });
    let container_left_wall = Phaser.Physics.Matter.Matter.Bodies.rectangle(posX - 55, posY - 65, 20, 30, {
      label: 'car',
    });
    let container_right_wall = Phaser.Physics.Matter.Matter.Bodies.rectangle(posX + 55, posY - 65, 20, 30,{
      label: 'car',
    });
    let badanmobil = Phaser.Physics.Matter.Matter.Bodies.rectangle(posX, posY, 150, 50,{
      label: 'car',
    });

    cartStructure = Phaser.Physics.Matter.Matter.Body.create({

      parts: [container_floor, container_left_wall, container_right_wall,badanmobil],
      friction: 1,
      restitution: 0,
    });

    this.matter.world.add(cartStructure);
    //console.log(posX);

    cargo = this.matter.add.sprite(posX, posY - 100, 'crate', 0, {

      label: 'cargo',
      friction: 1,
      restitution: 0,
    }).setScale(0.09).setDepth(1);


    cartwheelFront = this.matter.add.sprite(posX + 40, posY + 25, 'Roda').setScale(0.37);
    cartwheelFront.setCircle(20, {
      label: 'wheel',
      friction: 0.5,
      restitution: 0,
    });
    cartwheelRear = this.matter.add.sprite(posX - 40, posY + 25, 'Roda').setScale(0.37);
    cartwheelRear.setCircle(20, {
      label: 'wheel',
      friction: 0.5,
      restitution: 0,
    });
    //console.log(rearWheel);

    this.matter.add.constraint(cartStructure, cartwheelFront, 30, 0, {
      pointA:{
        x: 50,
        y: 35
      }
    });

    this.matter.add.constraint(cartStructure, cartwheelFront, 30, 0, {
      pointA:{
        x: 70,
        y: 35
      }
    });

    this.matter.add.constraint(cartStructure, cartwheelRear, 30, 0, {
      pointA:{
        x: -50,
        y: 35
      }
    });

    this.matter.add.constraint(cartStructure, cartwheelRear, 30, 0, {
      pointA:{
        x: -70,
        y: 35
      }
    });
  }

  accelerateCar(){
    isMoving = canMoving === true ? true : false;
  }

  decelerateCar(){
    isMoving = false;
  }

  timeEvent(){
    graphics.scaleX -= (1 / 30)
    gameOption.timeConfig--
    //console.log(gameOption.timeConfig);
    if(gameOption.timeConfig <= 0){
      gameOption.timeConfig = 0
      graphics.scaleX = 0
      tresholdTime.remove(false)
    }
    //Phaser.Physics.Arcade.isPaused = true;
  }

  appear(){
    //isMoving = false
    final_panel.visible = true;
    final_panel_appear.remove(false)

    let timeOver = new Date()
    this.gameOver(timeOver)
    //final_panel.visible = true;
    //console.log("APPEAR");
  }

  terrainGeneration(graphics, start){

    //console.log(start);

    let slopePoint = [];
    let slopes = 0;
    let slopeStart = new Phaser.Math.Vector2(0, start.y);
    //let slopeStartHeight = start.y;
    //let y;

    let slopeLength = Phaser.Math.Between(gameOption.length[0], gameOption.length[1]);
    let slopeEnd = (start.x == 0) ? new Phaser.Math.Vector2(slopeStart.x + gameOption.length[1] * 1.5, 0) : new Phaser.Math.Vector2(slopeStart.x + slopeLength, Math.random());
    //let slopeEnd = slopeStart + slopeLength;
    //let slopeEndHeight = Math.random();

    //let currentPoint = 0
    let pointX = 0;

    while(slopes < gameOption.slopePerMountain){

      let interpolationVal = this.interpolate(slopeStart.y, slopeEnd.y, (pointX - slopeStart.x)/(slopeEnd.x - slopeStart.x));

      if(pointX == slopeEnd.x){

        slopes++;
        //slopeStart = slopeEndHeight;
        //slopeEndHeight = Math.random();

        //y = this.game.config.height * gameOption.startHeigthTerrain + slopeStartHeight * gameOption.amplitude;

        slopeStart = new Phaser.Math.Vector2(pointX, slopeEnd.y);
        //slopeLength = Phaser.Math.Between(gameOption.length[0], gameOption.length[1]);
        slopeEnd = new Phaser.Math.Vector2(slopeEnd.x + Phaser.Math.Between(gameOption.length[0], gameOption.length[1]), Math.random());
        interpolationVal = slopeStart.y;
      }

      // else {
      //
      //   y = (this.game.config.height * gameOption.startHeigthTerrain) + this.interpolate(slopeStartHeight, slopeEndHeight, (currentPoint - slopeStart)/(slopeEnd - slopeStart)) * gameOption.amplitude;
      // }

      let pointY = this.game.config.height * gameOption.startHeigthTerrain + interpolationVal * gameOption.amplitude;

      slopePoint.push(new Phaser.Math.Vector2(pointX, pointY));
      pointX++;
    }

    let simpleSlope = simplify(slopePoint, 1, true);

    graphics.x = start.x;
    graphics.clear();

    graphics.moveTo(0, this.game.config.height);
    graphics.fillStyle(0x654b35);
    graphics.beginPath();
    simpleSlope.forEach((point) => {

      graphics.lineTo(point.x, point.y);
    });
    graphics.lineTo(pointX, this.game.config.height);
    graphics.lineTo(0, this.game.config.height);
    graphics.closePath();
    graphics.fillPath();

    graphics.lineStyle(16, 0x6b9b1e);
    graphics.beginPath();
    simpleSlope.forEach((point) => {

      graphics.lineTo(point.x, point.y);
    });
    graphics.strokePath();

    for(let i = 1; i < simpleSlope.length; i++){

      let body;
      let line  = new Phaser.Geom.Line(simpleSlope[i-1].x, simpleSlope[i-1].y,simpleSlope[i].x, simpleSlope[i].y);
      let distance = Phaser.Geom.Line.Length(line);
      let center = Phaser.Geom.Line.GetPoint(line, 0.5);
      let angle = Phaser.Geom.Line.Angle(line);

      if(bodyStore.length == 0){

        body = this.matter.add.rectangle(center.x + start.x, center.y, distance, 10, {

          label: 'ground',
          isStatic: true,
          angle: angle,
          friction: 1,
          restitution: 0
        });

        body.inPool = false;
      }
      else {

        body = bodyStore.shift();
        body.inPool = false;
        this.matter.body.setPosition(body, {
          x: center.x + start.x,
          y: center.y
        });

        let length = body.area / 10;
        this.matter.body.setAngle(body, 0);
        this.matter.body.scale(body, 1 / length, 1);
        this.matter.body.scale(body, distance, 1);
        this.matter.body.setAngle(body, angle);
      }

      if ((Phaser.Math.Between(0, 100) < gameOption.stoneRatio) && (start.x > 0 || i != 1)) {

        let rock;
        let size = Phaser.Math.Between(20, 30);
        let depth = Phaser.Math.Between(0, size / 2);
        let rockX = center.x + start.x + depth * Math.cos(angle + Math.PI / 2);
        let rockY = center.y + depth * Math.sin(angle + Math.PI / 2);

        graphics.fillStyle(0x6b6b6b, 1);
        graphics.fillCircle(rockX - start.x, rockY, size);

        if(rockStore.length == 0 ){

          rock = this.matter.add.circle(rockX, rockY, size, {

            label: 'rock',
            isStatic: true,
            angle: angle,
            friction: 1,
            restitution: 0,
            collisionFilter:{
              category: 2
            }
          });

          rock.inPool = false;
        }

        else {

          rock = rockStore.shift();
          this.matter.body.scale(rock, size / rock.circleRadius, size / rock.circleRadius);
          this.matter.body.setPosition(rock, {
            x: rockX,
            y: rockY
          });

          rock.inPool = false;
        }
      }
    }

    graphics.width = pointX - 1;
    return new Phaser.Math.Vector2(graphics.x + pointX - 1, slopeStart.y);
  }

  interpolate(vFrom, vTo, delta){

    let interpolation = (1 - Math.cos(delta * Math.PI)) * 0.5;
    return vFrom * (1 - interpolation) + vTo * interpolation;
  }

  gameOver(over){

    //console.log(userLog);

    let requestID = CryptoJS.AES.encrypt('LG'+'+'+gameData.token+'+'+Date.now(), 'c0dif!#l1n!9am#enCr!pto9r4pH!*').toString()
    let dataID;
    let data = {
      linigame_platform_token: gameData.token,
      session: gameData.session,
      game_end: over,
      score: valueScore,
      id: gameData.id,
      //log: userLog
    }
    //console.log(data);
    let datas = {
      datas: CryptoJS.AES.encrypt(JSON.stringify(data), 'c0dif!#l1n!9am#enCr!pto9r4pH!*').toString()
    }

    fetch(gameData.url+"api/v1.0/leaderboard/wheels?lang=id", {

      method: "PUT",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'request-id' : requestID
      },
      body: JSON.stringify(datas)
    }).then(response => {

      if(!response.ok){
        return response.json().then(error => Promise.reject(error));
      }
      else {
        return response.json();
      }

    }).then(data => {
      console.log(data.result);
    }).catch(error => {
      console.log(error.result);
    });
  }
}
