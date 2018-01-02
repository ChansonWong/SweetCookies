import {Injectable, NgZone} from "@angular/core";
import {Platform} from "ionic-angular";

declare var IonicCordova;

@Injectable()
export class IonicDeploy{
  private isCordovaEnv: boolean = false;
  // 是否已经初始化
  private pluginWasInitialized: boolean = false;
  private _channel: string = 'Master';

  constructor(private platform: Platform,
              private zone: NgZone) {
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

  // 检查是否有可用更新
  check() {
    this.onlyIfPluginInitialized();
    return new Promise((resolve, reject) => {
      IonicCordova.deploy.check(result => resolve((result === 'true') ? true : false), err => reject(err));
    });
  }

  // 一个新版本可用下载
  download(onProgress) {
    this.onlyIfPluginInitialized();
    return new Promise((resolve, reject) => {
      IonicCordova.deploy.download(result => {
        const percent = (result === 'true' || result === 100) ? 100 : result;
        this.zone.run(() => onProgress(percent));
        if (percent === 100) resolve();
      }, err => {
        reject(err);
      });
    });
  }

  // 解压最新版本
  extract(onProgress) {
    this.onlyIfPluginInitialized();
    return new Promise((resolve, reject) => {
      IonicCordova.deploy.extract(result => {
        const percent = (result === 'done') ? 100 : result;
        this.zone.run(() => onProgress(percent));
        if (percent === 100) resolve();
      }, err => {
        reject(err);
      });
    });
  }

  // 加载最新版本
  load() {
    this.onlyIfPluginInitialized();
    return new Promise((resolve, reject) => {
      IonicCordova.deploy.redirect(() => resolve(true), err => reject(err));
    });
  }

  // 获取该设备的当前版本信息
  info() {
    this.onlyIfPluginInitialized();
    return new Promise((resolve, reject) => {
      IonicCordova.deploy.info(result => resolve(result), err => reject(err));
    });
  }

  // 获取该设备中已经下载的版本
  getVersions() {
    this.onlyIfPluginInitialized();
    return new Promise((resolve, reject) => {
      IonicCordova.deploy.getVersions(result => resolve(result), err => reject(err));
    });
  }

  // 根据UUID删除该设备已经下载的版本
  deleteVersion(uuid) {
    this.onlyIfPluginInitialized();
    return new Promise((resolve, reject) => {
      IonicCordova.deploy.deleteVersion(uuid, () => resolve(true), err => reject(err));
    });
  }

  // 判断是否为Cordova环境
  private onlyIfCordovaEnv() {
    if (!this.isCordovaEnv) {
      console.error('IonicDeploy不能在非真实机器上运行！');
      return;
    }
  }

  // 检查插件是否已经初始化
  private onlyIfPluginInitialized() {
    if (!this.pluginWasInitialized) {
      console.error('IonicDeploy未被初始化, 你需要先执行init方法！');
      return;
    }
  }
}
