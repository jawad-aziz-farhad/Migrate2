import { Component, OnInit, OnDestroy } from '@angular/core';
import {  ModalController, NavController } from 'ionic-angular';
import { Observable, Subscription , Subject } from 'rxjs/Rx';
import { TimerService, Time } from '../../providers';

/**
 * Generated class for the NewTimerComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'new-timer',
  templateUrl: 'new-timer.html'
})
export class NewTimerComponent {

  private playPauseStopUnsubscribe: any;

    start = 0;
    ticks = 0;
    
    minutesDisplay: number = 0;
    hoursDisplay: number = 0;
    secondsDisplay: number = 0;

    sub: Subscription;
    started:boolean;
    presented: boolean;

    constructor(private modalCtrl: ModalController,
                private navCtrl: NavController,
                private time: Time) {        
    }

    ngOnInit() {
        this.started = this.presented = false;
        this.start = this.time.getTime();
        //this.playPauseStopUnsubscribe = this.timerService.playPauseStop$.subscribe((res: any) => this.playPauseStop(res));
    }

    ngOnDestroy() {
      //this.playPauseStopUnsubscribe.unsubscribe();;
    }

    private playPauseStop(res: any) {
        if(res.play) {
            this.startTimer();
        } else if(res.pause) {
            this.pauseTimer();
        } else if (res.stop) {
            this.stopTimer();
        }
    }

    public startTimer() {

        let timer = Observable.timer(1, 1000);
        this.sub = timer.subscribe(
            t => {
                this.ticks = this.time.getTime() - t;
                
                this.secondsDisplay = this.getSeconds(this.ticks);
                this.minutesDisplay = this.getMinutes(this.ticks);
                this.hoursDisplay = this.getHours(this.ticks);

                if(this.ticks < 1 && this.started){
                    this.openModal();
                }
                this.started = true;
            }
        );
    }

    

    public pauseTimer() {
        this.start = 0;
        this.minutesDisplay = 0;
        this.hoursDisplay = 0;
        this.secondsDisplay = 0;
        if (this.sub) {
            this.sub.unsubscribe();
            this.sub = null;
            this.ngOnDestroy();
        }
    }

    public resumeTime(){
        this.startTimer();
    }

    getRemainingTime(){
       return this.ticks;
    }

    private stopTimer() {
        this.start = 0;
        this.ticks = 0;
        this.minutesDisplay = 0;
        this.hoursDisplay = 0;
        this.secondsDisplay = 0;
        if (this.sub) {
            this.sub.unsubscribe();
            this.sub = null;
        }
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


  /* OPENING MODAL WHEN STUDY TIME IS OVER */
  openModal() {
    this.presented = true;
    this.stopTimer();
    let modal = this.modalCtrl.create('TimerExpiredPage', null, { cssClass: 'inset-modal' });
     modal.onDidDismiss(data => {
        console.log('TIME EXPIRED FOR ROUND.');
     });
 
     modal.present();
     
     
  }


}
