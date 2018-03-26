import { Injectable } from '@angular/core';
import { TimerObservable } from "rxjs/observable/TimerObservable";
import { ModalController } from 'ionic-angular';
import { ParserProvider } from '../parser/parser';
import { ParseDataProvider } from '../parse-data/parse-data';
import 'rxjs/add/operator/takeWhile';

@Injectable()
export class Time {

    public roundTime: number;
    public isTimerRunning: boolean;
    public ticks: number = 0;
    public isPopupPresent: boolean = false;
    public isStudyEnded : boolean = false;
    
    constructor(private modalCtrl: ModalController,
                private parser: ParserProvider,
                private parseData: ParseDataProvider){
    }
    /* SETTING ROUND TIME */
    setRoundTime(roundTime: number) {
      this.roundTime = roundTime;
    }
    /* GETTING ROUND TIME */
    getRoundTime(): number {
      return this.roundTime;
    }

    /* RUNNING TIMER */
    runTimer() {
      this.isStudyEnded = false;
      this.isTimerRunning = true;
      TimerObservable.create(1, 1000)
      .takeWhile(() => this.isTimerRunning)
      .subscribe(t => {
        this.ticks = this.getRoundTime() - t;
        console.log("TICKS: "+ this.ticks);
        if(this.ticks == 0)
          this.destroyTimer();
      },
      error => console.error("TIMER ERROR"),
      () => {
        console.log("TIME COMPLETED.")
        if(!this.isStudyEnded){
          this.runTimer();
          if(!this.isPopupPresent)
            this.openModal();
        }
      });
    }

    /* DESTROING TIMER */
    destroyTimer(){
      this.isTimerRunning = false;
    }
    
   
  /* OPENING MODAL WHEN STUDY TIME IS OVER */
  openModal() { 
    let modal = this.modalCtrl.create('TimerExpiredPage', null, { cssClass: 'inset-modal timer-expired-modal' });
    modal.onDidDismiss(data => {
      this.isPopupPresent = false;
      if(data && data.action == 'continue'){
        this.parse_Data();
      }
      else {
        this.ticks = 0;
        this.isTimerRunning = false; 
        this.isStudyEnded = true;
      }       
    });
    
    this.isPopupPresent = true;
    modal.present();
  }

  /* PARSING DATA OF THIS ROUND AND STARTING NEXT ROUND */
  parse_Data(){
    
    if(this.parseData.getDataArray().length > 0){
      this.parseData.setDataArray(this.parseData.getData());
      this.parser.getRounds().setRoundData(this.parseData.getDataArray());
      this.parser.getRounds().setRoundEndTime(new Date().getTime())
      this.parser.setRounds(this.parser.getRounds());
      this.parser.geAllData().setRoundData(this.parser.getRounds());
      this.parseData.clearDataArray();
      this.parser.clearRounds();
      this.parser.getRounds().setRoundStartTime(new Date().getTime());  
    }
  }
}