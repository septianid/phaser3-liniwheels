import Phaser from 'phaser';

var cargo;
var bodyStore;
var rockStore;
var checkpointSpawn;
//////////////////////////////// Storage untuk penyimpanan body dan Rock untuk random generated assets//
var terrainGraphics;
var startLine;
//var isWheelCollide;
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
var isFalling;
var canMoving;

var final_panel_appear;
var final_panel;
var flag;
//var syaratspawn;
//var berhenti;
var distanceTreshold;
var distanceSpawn;
var distanceUi;
var tresholdValue;
var distanceConvertString;
var timeBar;
var checkpoint_TreshHold;
var maximumTreshHold = 10;
var minimumTreshHold = 0;
var staticTreshHold;
//////////////////////////////// Semua Function Untuk pengaruhin treshhold
var badanmobil
var background;
var awan1;
var awan2;
var awan3;
var finalScoreText
var latestHighScoreText
var exitButton;
var scoreUi;
var valueScore;
var infoTextui;
var playLog = []
var gameData = {}
var executeOnce = {};
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
    // this.load.json('car', './src/assets/Car.json');
    // this.load.atlas('car_sheet', './src/assets/car_sheet.png', './src/assets/car_sheet.json');
    // this.load.json('Wheel','./src/assets/Roda_Collider.json');
    // this.load.atlas('Wheel_Sheet','./src/assets/Roda_Sheet.png','./src/assets/Roda_Sheet.json');
  }

  create(){
    tresholdValue = 0;
    valueScore = 0;
    staticTreshHold = 3
    bodyStore = [];
    rockStore = [];
    executeOnce = {
      isDrop: 1,
      isTimeOut: 1
    }
    terrainGraphics = [];
    checkpointSpawn = [];
    distanceTreshold = false;
    startLine = new Phaser.Math.Vector2(-500, 300);
    //syaratspawn = 0;
    //berhenti = 0;
    for(let i = 0; i < gameOption.mountainTotal; i++){

      terrainGraphics[i] =  this.add.graphics();
      startLine = this.terrainGeneration(terrainGraphics[i], startLine);
    }

    isMoving = false;

    this.generatePlayercar(200, 400);

    // var carJson = this.cache.json.get('car')
    // var mobil = this.matter.add.sprite(360, 640,'car_sheet', 'MobilTest.png', {
    //   shape: carJson.MobilTest
    // }).setScale(0.2)
    // console.log();// fungsi Badan jangan diapus

    // var carJson = this.cache.json.get('Kart');
    // var mobil = this.matter.add.sprite(360,640,'Kart_Sheet','Kart.png',{
    //   shape : carJson.Kart_Sheet
    // }).setScale(0.2);

    // var WheelJson = this.cache.json.get('Wheel');
    // var Roda2 = this.matter.add.sprite(360,640,'Wheel_Sheet','roda2.png',{
    //   shape : WheelJson.Roda_Sheet
    // }).setScale(0.2);


    // var Roda3 = this.matter.add.sprite(360,670,'Wheel_Sheet','roda2.png',{
    //   shape : WheelJson.Roda_Sheet
    // }).setScale(0.2);


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
    timeBar = this.add.graphics(0, 100)
    timeBar.fillStyle(0x8b0000, 1);
    timeBar.fillRect(0, 60, 300, 15);
    //console.log(graphics);

    distanceSpawn = 5;
    distanceConvertString = this.add.text(0, 30, 'DISTANCE', {
      font: '26px FredokaOne',
      fill: 'white',
      align: 'center'
    }).setOrigin(0.5, 0.5);

    distanceUi = this.add.text(0, 70, '0', {
      font: '42px FredokaOne',
      fill: 'white',
      align: 'center'
    }).setOrigin(0.5, 0.5);

    valueScore = 0;
    infoTextui = this.add.text(0, 30, 'SCORE' ,{

      font: '26px FredokaOne',
      fill: 'white',
      align: 'center'
    }).setOrigin(0.5, 0.5);

    scoreUi = this.add.text(0, 70, '' + valueScore, {

      font: '42px FredokaOne',
      fill: 'white',
      align: 'center'
    }).setOrigin(0.5, 0.5);

    finalScoreText = this.add.text(0, 570, '0', {
      font: '64px FredokaOne',
      fill: '#FFFFFF',
    }).setOrigin(0.5, 0.5)
    finalScoreText.setDepth(1)
    finalScoreText.visible = false

    latestHighScoreText = this.add.text(0, 720, '0', {
      font: '64px FredokaOne',
      fill: '#FFFFFF',
    }).setOrigin(0.5, 0.5)
    latestHighScoreText.setDepth(1)
    latestHighScoreText.visible = false

    // timeUi = this.add.text(0,150,''+tresholdTime,{
    //   font: 'bold 42px Arial',
    //   fill: 'white',
    //   align: 'center'
    // }).setOrigin(0.5, 0.5);
    // timeUi.setScale(0.9);// command time.UI

    this.input.on("pointerdown", () => this.accelerateCar());
    this.input.on("pointerup", () => this.decelerateCar());

    tresholdTime = this.time.addEvent({
      delay: 1000,
      callback: this.timeEvent,
      callbackScope: this,
      loop: true
    })

    flag = this.add.sprite(0, 220, 'Flag').setScale(2);
    flag.setOrigin(0.5, 0.5);

    exitButton = this.add.sprite(360, 820, 'BG_GO').setScale(0.45)
    exitButton.setOrigin(0.5, 0.5)
    exitButton.setDepth(1)
    exitButton.visible = false

    final_panel = this.add.sprite(360, 640, 'DG_GO').setScale(0.5);
    final_panel.setOrigin(0.5, 0.5);
    final_panel.visible = false; //set visibility untuk final score

    isFalling = false

    this.matter.world.on('collisionstart', (events) =>{
      events.pairs.forEach((pair) => {
        const {bodyA, bodyB} = pair;
        if((bodyA.label == 'cargo' && bodyB.label != '') || (bodyB.label == 'cargo' && bodyA.label != '')){
          isFalling = true
          canMoving = false
          timeBar.scaleX = 0;
          tresholdTime.remove(false);
          //final_panel_appear = this.time.addEvent({delay: 1000, callback: this.appear(true), callbackScope: this});//function untuk tampilin pake delay
        }
      })
    });// function object collision

    // checkpoint_TreshHold = Phaser.Math.Between(minimumTreshHold, maximumTreshHold);// INI juga jangan dihapus
    checkpoint_TreshHold = staticTreshHold;
    background = this.add.image(0, 280,'bangunan').setScale(1).setDepth(-1000);
    background.setOrigin(0, 0);

    awan1 = this.add.sprite(250, 50, 'cloud1').setScale(2).setDepth(-500).setOrigin(0,0);
    awan2 = this.add.sprite(60, 150, 'cloud2').setScale(0.5).setDepth(-500).setOrigin(0,0);
    awan3 = this.add.sprite(670, 170, 'cloud3').setScale(1).setDepth(-500).setOrigin(0,0);


  }

  update(){

    flag.visible = false; //set visibility untuk checkpoint
    this.cameras.main.scrollX = badanmobil.body.position.x - this.game.config.width / 8;
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

        let time = new Date()
        playLog.push({
          time: time,
          score: valueScore,
          distance: tresholdValue,
          fail_type: null
        })
        ////////////////////////////////
              // minimumTreshHold = minimumTreshHold+5;
              // maximumTreshHold = maximumTreshHold+5;
              // checkpoint_TreshHold = Phaser.Math.Between(minimumTreshHold, maximumTreshHold);
              // console.log("Berganti Angka Menjadi");
              // console.log(checkpoint_TreshHold);
        /////////////////////////////// Dynamic Checkpoint Treshhold
        staticTreshHold = staticTreshHold + 3;
        checkpoint_TreshHold = staticTreshHold;

        gameOption.timeConfig += (staticTreshHold - 2)
        timeBar.scaleX += ((1 / 30) * (staticTreshHold - 2))
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
      flag.visible = true;//fungsi nampilin checkpoint
    }

    //this.checkpoint(distanceTreshold);
    //timeBar.x = this.cameras.main.scrollX + 220;
    //timeBar.scaleX -= 0.002;
    // timeUi.setText('Timer: ' + tresholdTime.getProgress().toString().substr(0,4));
    // timeUi.x = this.cameras.main.scrollX+this.game.config.width/2;

    tresholdValue = Math.floor(this.cameras.main.scrollX / 100);
    distanceSpawn = Math.floor(this.cameras.main.scrollX/100);
    distanceConvertString.x = this.cameras.main.scrollX + 80;
    distanceUi.x = this.cameras.main.scrollX + 80;
    distanceUi.setText('' + tresholdValue);

    infoTextui.x = this.cameras.main.scrollX + 640;
    scoreUi.x = this.cameras.main.scrollX + 640;
    scoreUi.setText(''+valueScore);

    flag.x = this.cameras.main.scrollX + this.game.config.width / 2;
    final_panel.x = this.cameras.main.scrollX + this.game.config.width / 2;
    finalScoreText.x = this.cameras.main.scrollX + this.game.config.width / 2
    exitButton.x = this.cameras.main.scrollX + this.game.config.width / 2
    latestHighScoreText.x = this.cameras.main.scrollX + this.game.config.width / 2
    background.x = this.cameras.main.scrollX - 220;
    timeBar.x = this.cameras.main.scrollX + 210;

    if(gameOption.timeConfig > 0 && isFalling === false){
      canMoving = true;
    }
    else if (gameOption.timeConfig > 0 && isFalling === true) {
      if(executeOnce.isDrop === 1){
        this.gameEndData('BOX DROP')
        executeOnce.isDrop = 0;
      }
      else {

      }
    }
    else {
      if(executeOnce.isTimeOut === 1){
        this.gameEndData('TIME OUT')
        executeOnce.isTimeOut = 0
      }
      else {

      }
    }

    if(gameOption.timeConfig > 30){
      gameOption.timeConfig = 30
      timeBar.scaleX = 1
    }
    //syarat penampilan final panel score

    /////////////////////////////////////////////////
    if(awan1.x < this.cameras.main.scrollX - 330){
      awan1.x = this.cameras.main.scrollX + 750;
    }

    if(awan2.x < this.cameras.main.scrollX - 200){
      awan2.x = this.cameras.main.scrollX + 750;
    }

    if(awan3.x < this.cameras.main.scrollX - 200){
      awan3.x = this.cameras.main.scrollX + 750;
    }
    //////////////////////////////////////////////// Fungsi Kasar Awan
  }



  generatePlayercar(posX, posY){

    var carJson = this.cache.json.get('Kart');
    // let container_floor = Phaser.Physics.Matter.Matter.Bodies.rectangle(posX, posY-40, 110, 20, {
    //   label: 'car',
    // });
    // let container_left_wall = Phaser.Physics.Matter.Matter.Bodies.rectangle(posX - 55, posY - 65, 20, 30, {
    //   label: 'car',
    // });
    // let container_right_wall = Phaser.Physics.Matter.Matter.Bodies.rectangle(posX + 55, posY - 65, 20, 30,{
    //   label: 'car',
    // });
    // let badanmobil = Phaser.Physics.Matter.Matter.Bodies.rectangle(posX, posY, 150, 50,{
    //   label: 'car',
    // });
    badanmobil = this.matter.add.sprite(posX, posY, 'Kart_Sheet', 'Kart.png',{
        shape : carJson.Kart_Sheet,
        label: 'Kart_Sheet'
    }).setScale(0.4, 0.3);

    //console.log(badanmobil);
    cartStructure = Phaser.Physics.Matter.Matter.Body.create({

      parts: [badanmobil.body],
      friction: 1,
      restitution: 0,
    });

    this.matter.world.add(badanmobil);
    //console.log(posX);

    cargo = this.matter.add.sprite(posX, posY - 100, 'CRATE', 0, {
      label: 'cargo',
      friction: 1,
      restitution: 0,
    }).setScale(0.1).setDepth(1);


    cartwheelFront = this.matter.add.sprite(posX + 40, posY + 65, 'Roda_Test').setScale(0.35);
    cartwheelFront.setCircle(25, {
      label: 'wheel',
      friction: 0.5,
      restitution: 0,
    });
    cartwheelRear = this.matter.add.sprite(posX - 40, posY + 65, 'Roda_Test').setScale(0.35);
    cartwheelRear.setCircle(25, {
      label: 'wheel',
      friction: 0.5,
      restitution: 0,
    });
    //console.log(rearWheel);

    this.matter.add.constraint(badanmobil, cartwheelFront, 40, 0, {
      pointA:{
        x: 40,
        y: 38
      }
    });

    this.matter.add.constraint(badanmobil, cartwheelFront, 40, 0, {
      pointA:{
        x: 70,
        y: 38
      }
    });

    this.matter.add.constraint(badanmobil, cartwheelRear, 40, 0, {
      pointA:{
        x: -70,
        y: 35
      }
    });

    this.matter.add.constraint(badanmobil, cartwheelRear, 40, 0, {
      pointA:{
        x: -40,
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
    timeBar.scaleX -= (1 / 30)
    gameOption.timeConfig--
    //console.log(gameOption.timeConfig);
    if(gameOption.timeConfig <= 0){
      gameOption.timeConfig = 0
      timeBar.scaleX = 0
      tresholdTime.remove(false)
    }
    //Phaser.Physics.Arcade.isPaused = true;
  }

  gameEndData(type){
    let timeOver = new Date()

    playLog.push({
      time: timeOver,
      score: valueScore,
      distance: tresholdValue,
      fail_type: type
    })

    final_panel.visible = true;
    finalScoreText.visible = true;
    finalScoreText.setText(''+valueScore)
    this.gameOver(timeOver)
    canMoving = false
    tresholdTime.remove(false)
    final_panel_appear = this.time.addEvent({ delay: 1000, callback: this.appear, callbackScope: this});

    //console.log(playLog);
  }

  appear(){
    //console.log(finalScoreText)
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
      log: playLog
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
      //console.log(data.result);
      latestHighScoreText.visible = true
      latestHighScoreText.setDepth(1)
      latestHighScoreText.setText(''+data.result.user_highscore)
      exitButton.visible = true
      exitButton.setInteractive()
      exitButton.on('pointerdown', () => {

        this.scene.start('MainMenu', {
          sound_status: gameData.sound,
        });
        playLog = []
      })
    }).catch(error => {
      console.log(error.result);
    });
  }
}
