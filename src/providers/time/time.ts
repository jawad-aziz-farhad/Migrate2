import { Injectable } from '@angular/core';
import { TimerObservable } from "rxjs/observable/TimerObservable";
import { ModalController } from 'ionic-angular';
import 'rxjs/add/operator/takeWhile';
import { ParserProvider } from '../parser/parser';
import { ParseDataProvider } from '../parse-data/parse-data';

@Injectable()
export class Time {

    public roundTime: number;
    public isTimerRunning: boolean;
    public ticks: number = 0;
    
    constructor(private modalCtrl: ModalController,
                private parser: ParserProvider,
                private parseData: ParseDataProvider){
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
      if(data && data.action == 'continue'){
        this.parsingData();        
        this.runTimer();  
      }
      else{
        this.isTimerRunning = false;
        console.log('ENDING STUDY.');
      }
        
    });
    modal.present();
  }

  /* PARSING DATA OF THIS ROUND AND STARTING NEXT ROUND */
  parsingData(){
    
    if(this.parseData.getDataArray().length > 0){
      this.parseData.setDataArray(this.parseData.getData());
      this.parser.getRounds().setRoundData(this.parseData.getDataArray());
      this.parser.getRounds().setRoundEndTime(new Date().getTime())
      this.parser.setRounds(this.parser.getRounds());
      this.parser.geAllData().setRoundData(this.parser.getRounds());
    }

    console.log("\n\nDATA AT END TIME IS: "+ JSON.stringify(this.parser.geAllData()) + "\n\nDATA " +JSON.stringify(this.parseData.getData()) );


    this.parseData.clearDataArray();
    this.parser.clearRounds();
  }
}