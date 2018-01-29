import { Injectable, ViewChild } from '@angular/core';
import { TimerComponent } from '../../components/timer/timer';

@Injectable()
export class Time {

    public time: number;
    public roundTime: number;
    public isTimerRunning: boolean;

    constructor(){
      this.isTimerRunning = false;
    }

    setRoundTime(roundTime: number){
      this.roundTime = roundTime;
    }

    getRoundTime(): number{
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

}