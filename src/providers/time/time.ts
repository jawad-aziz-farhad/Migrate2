import { Injectable, ViewChild } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ModalController } from 'ionic-angular';

@Injectable()
export class Time {

    public time: number;
    public roundTime: number;
    public isTimerRunning: boolean;
    public ticks = 0;
    // Subscription object
    public sub: Subscription;

    constructor(private modalCtrl: ModalController){
      this.isTimerRunning = false;
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
    
    setStatus(isTimerRunning: boolean){
      this.isTimerRunning = isTimerRunning;
    }

    getStatus(){
      return this.isTimerRunning;
    }

    runTimer() {
      let timer = Observable.timer(1, 1000);
      this.sub = timer.subscribe(t => {
        this.ticks = this.getTime() - t;
        console.log('Ticks: '+ this.ticks);
        if(this.ticks <= 0)
          this.destroyTimer();
      });
    }
    
    destroyTimer(){
      this.sub.unsubscribe();
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