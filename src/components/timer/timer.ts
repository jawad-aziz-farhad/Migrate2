import { Component , Input, EventEmitter , OnInit, OnDestroy } from '@angular/core';
import { NavController, ModalController,  NavParams } from 'ionic-angular';
import { Time } from '../../providers';
/**
 * Generated class for the TimerComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'timer',
  templateUrl: 'timer.html'
})
export class TimerComponent {
  
    constructor(private modalCtrl: ModalController,
                private time: Time) {
    }

    private getSeconds(ticks: number) {
      return this.pad(ticks % 60);
    }

    private getMinutes(ticks: number) {
         return this.pad((Math.floor(ticks / 60)) % 60);
    }

    private getHours(ticks: number) {
        return this.pad(Math.floor((ticks / 60) / 60));
    }

    private pad(digit: any) { 
        return digit <= 9 ? '0' + digit : digit;
    }

}
