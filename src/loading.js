import Phaser from "phaser";

var progressBar;
var progressBox;
var background_loading;

export class Loading extends Phaser.Scene{

  constructor(){
    super({
      key: 'Loading'     
    });
  }

  preload(){
    this.load.image('ad_button','./src/assets/ad_button.png');
    this.load.image('play_button', './src/assets/play_button.png');
    this.load.image('Leaderboard','./src/assets/Leaderboard.png');
    this.load.image('Leaderboard_panel','./src/assets/Leaderboard_panel.png');
    this.load.image("Exit",'./src/assets/Exit.png');
    this.load.image('Instruksi','./src/assets/Instruksi.png');
    this.load.image('Instruksi_panel','./src/assets/Instruksi_panel.png');
    this.load.image('panel','./src/assets/panel.png');
    this.load.image('music','./src/assets/music.png');
    this.load.image('banned','./src/assets/banned.png');
    this.load.image('music_on','./src/assets/music_on.png');
    this.load.image('music_off','./src/assets/music_off.png');
    this.load.image('TAP', './src/assets/TAP_SIGN.png');

//////////////////////////////////////////////////////////////////Atas Dummy Assets bawah real assets

    this.load.image('time', './src/assets/time.png');
    this.load.image('timebar', './src/assets/time_bar.png');
    this.load.image('crate','./src/assets/Crate.png');
    this.load.image('Roda','./src/assets/roda.png');
    this.load.image('flag','./src/assets/flag.png');
    this.load.image('Exit','./src/assets/Exit.png');
    this.load.image('Leaderboard','./src/assets/Leaderboard_panel.png');
    this.load.image('score','./src/assets/score.png');

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

      this.scene.start("MainMenu");
    })
  }

}
