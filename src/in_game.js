import Phaser from 'phaser';

var cargo;
var bodyPool;
var rockPool
var mountainGraphics;
var mountainStart;
var isWheelCollide;
////////////////////////////////Testing
var timedEvent;
var timerText;


var carSpeed;
var rodadepan;
var rodabelakang;

let carBody;
let frontWheel;
let rearWheel;

let bodies;
var isMoving;

var distanceCheck;
var distanceText;
var distanceValue;
var distanceInfoText;
var timeGraphics;

var timeBar;

var scoreText;
var scoreValue;
var scoreInfoText;

var gameOption = {

  mountainTotal : 3,
  length: [150,350],
  slopePerMountain: 6,
  startHeigthTerrain: 0.5,
  amplitude: 100,
  speed: 0.5,
  stoneRatio: 5
}

var simplify = require('simplify-js');

export class InGame extends Phaser.Scene {

  constructor(){

    super("PlayScene");
  }

  preload(){

    this.load.image('time', './src/assets/time.png');
    this.load.image('timebar', './src/assets/time_bar.png');
    this.load.image('crate','./src/assets/Crate.png');
    this.load.image('Roda','./src/assets/roda.png');
  }

  create(){

    bodyPool = [];
    rockPool= [];
    mountainGraphics = [];
    distanceCheck = false;
    mountainStart = new Phaser.Math.Vector2(-200, Math.random());

    for(let i = 0; i < gameOption.mountainTotal; i++){

      mountainGraphics[i] =  this.add.graphics();
      mountainStart = this.generateGround(mountainGraphics[i], mountainStart);
    }

    isMoving = false;

    this.addPlayerCar(250, 400);

    this.matter.world.on('collisionstart', (event, objectA, objectB) => {

      if((objectA.label == 'cargo' && objectB.label != 'car') || (objectB.label == 'cargo' && objectA.label != 'car')){

        this.scene.start('PlayScene');
      }
    });

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

    timeGraphics = this.add.graphics().setScale(2.5);
    timeGraphics.setOrigin
    timeGraphics.fillStyle(0x8b0000, 1);
    timeGraphics.fillRect(10, 20, 100, 8);

    distanceValue = 0;
    distanceInfoText = this.add.text(0, 30, 'DISTANCE', {
      font: 'bold 26px Arial',
      fill: 'white',
      align: 'center'
    }).setOrigin(0.5, 0.5);

    distanceText = this.add.text(0, 70, '0', {
      font: 'bold 42px Arial',
      fill: 'white',
      align: 'center'
    }).setOrigin(0.5, 0.5);

    scoreValue = 0;
    scoreInfoText = this.add.text(0, 30, 'SCORE' ,{

      font: 'bold 26px Arial',
      fill: 'white',
      align: 'center'
    }).setOrigin(0.5, 0.5);

    scoreText = this.add.text(0, 70, ''+scoreValue, {

      font: 'bold 42px Arial',
      fill: 'white',
      align: 'center'
    }).setOrigin(0.5, 0.5);

    timerText = this.add.text(0,150,''+timedEvent,{
      font: 'bold 42px Arial',
      fill: 'white',
      align: 'center'
    }).setOrigin(0.5, 0.5);
    timerText.setScale(0.9);

    this.input.on("pointerdown", () => this.accelerateCar());
    this.input.on("pointerup", () => this.decelerateCar());
    timedEvent = this.time.delayedCall(30000,this.restart(),[],this);
  }

  update(){

    this.cameras.main.scrollX = carBody.position.x - this.game.config.width / 8;

    if(isMoving){

      let carVelocity;
      carVelocity = frontWheel.body.angularSpeed + gameOption.speed;
      //console.log(frontWheel.body.angularSpeed);
      carVelocity = Phaser.Math.Clamp(carVelocity, 0, 0.7);

      this.matter.body.setAngularVelocity(rearWheel.body, carVelocity);
      this.matter.body.setAngularVelocity(frontWheel.body, carVelocity);
      //console.log(frontWheel.angularSpeed);
      //console.log(rearWheel.angularSpeed);
    }

    mountainGraphics.forEach((graphics) => {

      if(this.cameras.main.scrollX > graphics.x + graphics.width + 10){

        mountainStart = this.generateGround(graphics, mountainStart);
      }
    })

    bodies = this.matter.world.localWorld.bodies;

    bodies.forEach((body) => {

      if(this.cameras.main.scrollX > body.position.x + this.game.config.width && !body.inPool){

        switch (body.label) {
          case 'ground':
            bodyPool.push(body);
            break;
          case 'rock':
            rockPool.push(body);
            break;
        }

        body.inPool = true;
      }
    })

    if(distanceValue % 30 == 0 && distanceValue != 0){

      if (distanceCheck === false) {

        distanceCheck = true
        scoreValue += 1;
      }
      else {

        scoreValue += 0;
      }
    }
    else {

      distanceCheck = false;
    }

    distanceValue = Math.floor(this.cameras.main.scrollX / 100)
    distanceInfoText.x = this.cameras.main.scrollX + 80;
    distanceText.x = this.cameras.main.scrollX + 80;
    distanceText.setText('' + distanceValue);

    //timeBar.x = this.cameras.main.scrollX + 220;
    //timeBar.scaleX -= 0.002;

    scoreInfoText.x = this.cameras.main.scrollX + 640;
    scoreText.x = this.cameras.main.scrollX + 640;
    scoreText.setText(''+scoreValue);

    timerText.setText('Timer: ' + timedEvent.getProgress().toString().substr(0,4));
    timerText.x = this.cameras.main.scrollX + this.game.config.width/2;

    timeGraphics.x = this.cameras.main.scrollX + 210;

    if(timedEvent.getProgress() < 1 && timeGraphics.scaleX > 0){

      timeGraphics.scaleX -= 0.0014;
    }
  }

  addPlayerCar(posX, posY){

    let container_floor = Phaser.Physics.Matter.Matter.Bodies.rectangle(posX, posY, 110, 20, {
      label: 'car',
    });
    let container_left_wall = Phaser.Physics.Matter.Matter.Bodies.rectangle(posX - 55, posY - 25, 20, 30, {
      label: 'car',
    });
    let container_right_wall = Phaser.Physics.Matter.Matter.Bodies.rectangle(posX + 55, posY - 25, 20, 30,{
      label: 'car',
    });

    carBody = Phaser.Physics.Matter.Matter.Body.create({

      parts: [container_floor, container_left_wall, container_right_wall],
      friction: 1,
      restitution: 0,
    })

    this.matter.world.add(carBody);
    //console.log(posX);

    cargo = this.matter.add.sprite(posX, posY - 4, 'crate', 0, {

      label: 'cargo',
      friction: 1,
      restitution: 0,
    }).setScale(0.08);


    frontWheel = this.matter.add.sprite(posX + 40, posY + 25, 'Roda').setScale(0.37);
    frontWheel.setCircle(20, {
      label: 'wheel',
      friction: 0.5,
      restitution: 0,
    })
    rearWheel = this.matter.add.sprite(posX - 40, posY + 25, 'Roda').setScale(0.37);
    rearWheel.setCircle(20, {
      label: 'wheel',
      friction: 0.5,
      restitution: 0,
    })
    //console.log(rearWheel);

    this.matter.add.constraint(carBody, frontWheel, 30, 0, {
      pointA:{
        x: 35,
        y: 10
      }
    });

    this.matter.add.constraint(carBody, frontWheel, 30, 0, {
      pointA:{
        x: 50,
        y: 10
      }
    })

    this.matter.add.constraint(carBody, rearWheel, 30, 0, {
      pointA:{
        x: -35,
        y: 10
      }
    });

    this.matter.add.constraint(carBody, rearWheel, 30, 0, {
      pointA:{
        x: -50,
        y: 10
      }
    })
  }

  accelerateCar(){

    isMoving = true;
  }

  decelerateCar(){

    isMoving = false;
  }

  restart(){
    //console.log("loop");
  }

  generateGround(graphics, start){

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

      graphics.lineTo(point.x, point.y)
    })
    graphics.lineTo(pointX, this.game.config.height);
    graphics.lineTo(0, this.game.config.height);
    graphics.closePath();
    graphics.fillPath();

    graphics.lineStyle(16, 0x6b9b1e);
    graphics.beginPath();
    simpleSlope.forEach((point) => {

      graphics.lineTo(point.x, point.y);
    })
    graphics.strokePath();

    for(let i = 1; i < simpleSlope.length; i++){

      let body;
      let line  = new Phaser.Geom.Line(simpleSlope[i-1].x, simpleSlope[i-1].y,simpleSlope[i].x, simpleSlope[i].y);
      let distance = Phaser.Geom.Line.Length(line);
      let center = Phaser.Geom.Line.GetPoint(line, 0.5);
      let angle = Phaser.Geom.Line.Angle(line);

      if(bodyPool.length == 0){

        body = this.matter.add.rectangle(center.x + start.x, center.y, distance, 10, {

          label: 'ground',
          isStatic: true,
          angle: angle,
          friction: 1,
          restitution: 0
        })

        body.inPool = false;
      }
      else {

        body = bodyPool.shift();
        body.inPool = false;
        this.matter.body.setPosition(body, {
          x: center.x + start.x,
          y: center.y
        })

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
        let rockY = center.y + depth * Math.sin(angle + Math.PI / 2)

        graphics.fillStyle(0x6b6b6b, 1);
        graphics.fillCircle(rockX - start.x, rockY, size);

        if(rockPool.length == 0 ){

          rock = this.matter.add.circle(rockX, rockY, size, {

            label: 'rock',
            isStatic: true,
            angle: angle,
            friction: 1,
            restitution: 0,
            collionFilter:{
              category: 2
            }
          })

          rock.inPool = false;
        }

        else {

          rock = rockPool.shift();
          this.matter.body.scale(rock, size / rock.circleRadius, size / rock.circleRadius)
          this.matter.body.setPosition(rock, {
            x: rockX,
            y: rockY
          })

          rock.inPool = false
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


}
