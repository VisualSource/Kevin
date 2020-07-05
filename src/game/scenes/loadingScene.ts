import {Scene} from 'phaser';
import {JsonLoader} from '@visualsource/vs_api';
import {CardDeckMannager} from '../utils/Loader';
import QueryableWorker from '../../game/state/OpponentHander';
export default class LoadingScene extends Scene{
    cardManager = CardDeckMannager.getInstance();
    constructor(){
        super("loading");
    }
    preload(){	
        this.cardManager.loadDeck();
        const width = this.game.config.width as number;
        const height = this.game.config.height as number;
        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics().fillStyle(0x222222, 0.8).fillRect((width/3) + 150, (height/2) + 100, 320, 50)
        const loadingText = this.make.text({
            x: width / 2,
            y: height / 2 + 80,
            text: 'Loading...',
            style: {
                font: '20px',
                fill: '#ffffff'
            }
        }).setOrigin(0.5, 0.5)
        const percentText = this.make.text({
            x: width / 2,
            y: height / 2 + 125,
            text: '0%',
            style: {
                font: '18px',
                fill: '#ffffff'
            }
        }).setOrigin(0.5, 0.5)
        const assetText = this.make.text({
            x: width / 2,
            y: height / 2 + 160,
            text: '',
            style: {
                font: '18px',
                fill: '#ffffff'
            }
        }).setOrigin(0.5, 0.5)
        this.load.image("logo","/assets/logo_transparent.png");
        this.load.on("progress",(value: any)=>{
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect((width/3) + 160,(height/2) + 110, 300 * value, 30);
            percentText.setText((parseInt((value * 100) as any) as any) + '%');
        });
        this.load.on("fileprogress",(file: any)=>{
            assetText.setText('Loading asset: ' + file.key);
        });
        this.load.on("complete",()=>{
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
            assetText.destroy();
        });
        this.load.glsl("shader","assets/shader.frag");
        JsonLoader.getInst().fetch<{ assets: { name: string, texture: string}[]}>().then(data=>{
            data.assets.forEach(asset=>{
                this.load.image(asset.name,asset.texture);
            }); 
        });
    }
    create(){
        this.add.image(window.innerWidth/2,window.innerHeight/2, "logo").setScale(0.5).setOrigin(0.5);
        this.cardManager.fetchOpponentDeck().then(()=>{
            this.scene.start("main");
        });
    }

    

}