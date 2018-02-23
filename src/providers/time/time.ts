import { Injectable } from '@angular/core';
import { TimerObservable } from "rxjs/observable/TimerObservable";
import { ModalController } from 'ionic-angular';
import 'rxjs/add/operator/takeWhile';

@Injectable()
export class Time {

    public time: number;
    public roundTime: number;
    public isTimerRunning: boolean;
    public ticks: number = 0;
    
    constructor(private modalCtrl: ModalController){
    }

    setRoundTime(roundTime: number){
      this.roundTime = roundTime;
    }

    getRoundTime(): number {
      return this.roundTime;
    }

    setTime(time: number){
      this.time = time;
    }

    getTime(): number {
      return this.time;
    }
    
    runTimer() {
      this.isTimerRunning = true;
      TimerObservable.create(1, 1000)
      .takeWhile(() => this.isTimerRunning)
      .subscribe(t => {
          this.ticks = this.getTime() - t;
          console.log('Ticks: '+ this.ticks);
          if(this.ticks <= 0)
            this.timerEnds();
      });
    }

    destroyTimer(){
      console.log('Destorying Timer.');
      this.isTimerRunning = false;
    }
    
    timerEnds(){
      console.log('Timer Ended.');
      this.isTimerRunning = false;
      this.openModal();
    }

  /* OPENING MODAL WHEN STUDY TIME IS OVER */
  openModal() {    
    let modal = this.modalCtrl.create('TimerExpiredPage', null, { cssClass: 'inset-modal timer-expired-modal' });
    modal.onDidDismiss(data => {
        console.log('TIME EXPIRED FOR ROUND.');
    });
    modal.present();
  }
}