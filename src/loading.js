import Phaser from "phaser";

var progressBar;
var progressBox;
var background_loading;

export class Loading extends Phaser.Scene{

  constructor(){
    super({
      key: 'Loading',
      pack: {
        files: [
          { type: 'image', key: 'LOADING_BOX', url: 'src/assets/LOADING_BOX.png'},
          { type: 'image', key: 'LOADING_BG', url: 'src/assets/LOADING_BG.jpg'},
          { type: 'image', key: 'TITLE', url: './src/assets/LOGO.png'},
          { type: 'image', key: 'WM_EL', url: './src/assets/WM_EL.png'}
        ]
      }
    });
  }

  preload(){
    // this.load.image('MENU_BG', './src/assets/MENU_BG.jpg');
    this.load.image('TAP', './src/assets/TAP_SIGN.png');
    // this.load.image('BM_1P', './src/assets/BM_1P.png');
    // this.load.image('BM_1BPP10', './src/assets/BM_1BPP10.png');
    // this.load.image('BM_1AAD', './src/assets/BM_1AAD.png');
    // this.load.image('BM_2I','./src/assets/BM_2I.png');
    // this.load.image('BM_3TC','./src/assets/BM_3TC.png');
    // this.load.image('BM_4LD','./src/assets/BM_4LD.png');
    // this.load.image('BM_5N','./src/assets/BM_5N.png');
    // this.load.image('BM_5F','./src/assets/BM_5F.png');
    // this.load.image("BM_GEXB",'./src/assets/BM_GEXB.png');
    // this.load.image('BM_CPP','./src/assets/BM_CPP.png');
    // this.load.image('BM_DPP','./src/assets/BM_DPP.png');
    // this.load.image('BM_NEXT','./src/assets/BM_NEXT.png');
    // this.load.image('BM_PREV','./src/assets/BM_PREV.png');
    // this.load.image('PM_1I','./src/assets/PM_1I.png');
    // this.load.image('PM_2TC','./src/assets/PM_2TC.png');
    // this.load.image('PM_3LD','./src/assets/PM_3LD.png');
    // this.load.image('PM_PY','./src/assets/PM_PY.png');
    // this.load.image('LIFE', './src/assets/LIFE.png');
    // this.load.image('DM_PW', './src/assets/DM_PW.png')
    // this.load.image('DM_PP10', './src/assets/DM_PP10.png')
    // this.load.image('DM_ADL', './src/assets/DM_ADL.png')
    // this.load.image('WM_EVW', './src/assets/WM_EVW.png');
    // this.load.image('WM_SE', './src/assets/WM_SE.png');

//////////////////////////////////////////////////////////////////Atas Dummy Assets bawah real assets

    this.load.image('CRATE','./src/assets/CRATE.png');
    this.load.image('time', './src/assets/time.png');
    this.load.image('timebar', './src/assets/time_bar.png');
    this.load.image('Roda','./src/assets/roda.png');
    this.load.image('flag','./src/assets/flag.png');
    this.load.image('Exit','./src/assets/Exit.png');
    //this.load.image('score','./src/assets/score.png');

    this.load.image('cloud1','./src/assets/cloud.png');
    this.load.image('cloud2','./src/assets/cloud2.png');
    this.load.image('cloud3','./src/assets/cloud3.png');

    this.load.image('airplane','./src/assets/pesawat.png');
    
    this.load.image('bangunan','./src/assets/building.png');

    this.load.image('TestCar','./src/assets/MobilTest.png');
    this.load.json('jsonMobil', './src/assets/Car.json');

    progressBar = this.add.graphics();
    progressBox = this.add.sprite(360, 640, 'LOADING_BOX').setScale(0.4);

    var width = this.cameras.main.width;
    var height = this.cameras.main.height;

    // var loadingText = this.make.text({
    //   x: width / 2,
    //   y: height / 2 - 50,
    //   text: 'Loading...',
    //   style: {
    //     font: '36px monospace',
    //     fill: '#ffffff'
    //   }
    // });
    // loadingText.setOrigin(0.5, 0.5);

    // var percentText = this.make.text({
    // x: width / 2,
    // y: height / 2 + 80,
    // text: '0%',
    // style: {
    //     font: 'bold 36px Arial',
    //     fill: '#F17CF7'
    //   }
    // });
    // percentText.setOrigin(0.5, 0.5);

    // var assetText = this.make.text({
    // x: width / 2,
    // y: height / 2 + 100,
    // text: '',
    // style: {
    //     font: 'bold 30px Arial',
    //     fill: '#F17CF7'
    //   }
    // });
    // assetText.setOrigin(0.5, 0.5);

    this.load.on('progress', function (value) {
      progressBar.clear();

      progressBar.fillStyle(0xF17CF7, 1);
      progressBar.fillRect(180, 615, 360 * value, 50);
      progressBar.setDepth(1)
    });

    this.load.on('fileprogress', function (file) {

    });

    this.load.on('complete', () => {

      progressBox.setDepth(1);
      progressBar.fillStyle(0xF17CF7, 1)
      progressBar.fillRect(180, 615, 360, 50);
      progressBar.setDepth(1)
    });
  }

  create(){

    var tapSign = this.add.sprite(360, 800, 'TAP').setScale(0.4);
    tapSign.setOrigin(0.5, 0.5)
    //var ad = this.add.sprite(360, 1150, 'ad_logo').setScale(0.25)
    //ad.setOrigin(0.5, 0.5);

    //tapSign.anims.play('blink', true);

    this.input.on("pointerdown", () => {

      this.scene.start("PlayScene");
    })
  }

}
