import {Component} from '@angular/core';
import {Platform, ToastController} from 'ionic-angular';
import {IonicDeploy} from "../../IonicDeloy";

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  // 当前是否在运行版本更新
  runningDeploy: boolean = false;

  constructor(private ionicDeploy: IonicDeploy,
              private platform: Platform,
              public toastCtrl: ToastController) {

  }

  update(){

    if (this.platform.is('cordova')) {
      if (this.runningDeploy) return;

      let toast = this.toastCtrl.create({
        message: '下载中 ... 0%',
        position: 'top',
        showCloseButton: false,
        closeButtonText: '关闭'
      });

      this.ionicDeploy.init()
        .then(() => this.ionicDeploy.check())
        .then(snapshotAvailable => {
          if (snapshotAvailable) {
            toast.present();
            this.runningDeploy = true;
            return this.ionicDeploy.download(percent => toast.setMessage('下载中 ... ' + percent + '%'));
          }
        })
        .then(() => this.ionicDeploy.extract(percent => toast.setMessage('解压中 ... ' + percent + '%')))
        .then(() => this.ionicDeploy.load())
        .then(() => toast.dismiss())
        .then(() => this.runningDeploy = false)
        .catch(() => {
          this.runningDeploy = false;
          toast.setMessage('对不起，由于网络问题更新失败, 请在次手动更新！');
        })
    }else{
      console.error('版本热更新不能在非真实机器上运行！')
    }
  }

}
