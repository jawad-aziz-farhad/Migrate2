import { Injectable } from '@angular/core';
import { TimerObservable } from "rxjs/observable/TimerObservable";
import 'rxjs/add/operator/takeWhile';

@Injectable()
export class Time {

    public isTimerRunning: boolean;
    public ticks: number = 0;
    public isNext: boolean = false;
    
    constructor(){
    }

    /* RUNNING TIMER */
    runTimer() {
      this.isNext = false;
      this.isTimerRunning = true;
      TimerObservable.create(1, 1000)
      .takeWhile(() => this.isTimerRunning)
      .subscribe(t => {
        this.ticks = 0 + t;
        console.log("TICKS: "+ this.ticks);
      },
      error => console.error("TIMER ERROR"),
      () => {
        console.log("TIME COMPLETED.");
        if(this.isNext)
          this.runTimer();
      });
    }

  /* DESTROING TIMER */
  destroyTimer(){
    this.ticks = 0;
    this.isTimerRunning = false; 
  }
  /* STOPPING TIMER */
  stopTimer(){
    this.isTimerRunning = false;
  }

}