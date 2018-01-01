import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {IonicDeploy} from "../../IonicDeloy";

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  constructor(public navCtrl: NavController,
              public ionicDeplay: IonicDeploy) {

  }

  update(){
    this.ionicDeplay.init();
  }

}
