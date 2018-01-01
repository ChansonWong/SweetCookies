import {Injectable} from "@angular/core";
import {Platform} from "ionic-angular";

declare var IonicCordova;

@Injectable()
export class IonicDeploy{
  private isCordovaEnv: boolean = false;
  // 是否已经初始化
  private pluginWasInitialized: boolean = false;
  private _channel: string = 'Master';

  constructor(private platform: Platform) {
    this.isCordovaEnv = platform.is('cordova');
  }

  // 初始化Deploy插件
  init() {
    this.onlyIfCordovaEnv();
    return new Promise((resolve, reject) => {
      IonicCordova.deploy.init({channel: this._channel}, () => {
        this.pluginWasInitialized = true;
        resolve(true);
      }, err => reject(err));
    });
  }

  // 判断是否为Cordova环境
  private onlyIfCordovaEnv() {
    if (!this.isCordovaEnv) {
      console.error('IonicDeploy was not runned in cordova environment!');
      return;
    }
  }
}
