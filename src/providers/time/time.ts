import { Injectable } from '@angular/core';
import { TimerObservable } from "rxjs/observable/TimerObservable";
import { ModalController } from 'ionic-angular';
import 'rxjs/add/operator/takeWhile';

@Injectable()
export class Time {

    public roundTime: number;
    public isTimerRunning: boolean;
    public ticks: number = 0;
    
    constructor(private modalCtrl: ModalController){
    }
    /* SETTING ROUND TIME */
    setRoundTime(roundTime: number){
      this.roundTime = roundTime;
    }
    /* GETTING ROUND TIME */
    getRoundTime(): number {
      return this.roundTime;
    }

    /* RUNNING TIMER */
    runTimer() {
      this.isTimerRunning = true;
      TimerObservable.create(1, 1000)
      .takeWhile(() => this.isTimerRunning)
      .subscribe(t => {
        this.ticks = this.getRoundTime() - t;
        if(this.ticks <= 0)
          this.timerEnds();
      });
    }

    /* DESTROING TIMER */
    destroyTimer(){
      console.log('Destorying Timer.');
      this.isTimerRunning = false;
    }
    
    /* IF TIME IS UP, SHOWING POPUP TO THE USER */
    timerEnds(){
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