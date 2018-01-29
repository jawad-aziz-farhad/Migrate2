import { Component , Input, EventEmitter , OnInit, OnDestroy } from '@angular/core';
import { NavController, ModalController,  NavParams } from 'ionic-angular';
import { Timer } from '../../models';
import { Time , StudyStatusProvider} from '../../providers';
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
export class TimerComponent implements OnInit {
  
  @Input() timeInSeconds: number;
  public timer: Timer;
  public timeInterval: any = null; 
 
  constructor(private modalCtrl: ModalController,
              private time: Time,
              private studyStatus: StudyStatusProvider) {
  }
  
  ngOnInit() {
    this.initTimer();
  }

  ionViewWillLeave(){
    this.timer.displayTime = '';
  }

  /* INITIALIZING TIMER */
  initTimer() {
      this.timeInSeconds = this.time.getTime();
      if(!this.timeInSeconds) { this.timeInSeconds = 0; }

      this.timer = <Timer> {
          seconds: this.timeInSeconds,
          runTimer: false,
          hasStarted: false,
          hasFinished: false,
          secondsRemaining: this.timeInSeconds
      };
      
      this.timer.displayTime = '';
      this.timer.displayTime = this.getTimeAsDigitalClock(this.timer.secondsRemaining);
  }

  /* STARTING TIMER */
  startTimer() {
      this.timer.secondsRemaining = this.time.getTime();
      this.timer.hasStarted = true;
      this.timer.runTimer = true;
      this.timerTick();
  }
  /* PAUSING TIMER */
  pauseTimer() {
    this.timer.runTimer = false;
  } 

  killTimer(){
    this.stopTimer();
    // this.timer.hasStarted = false;
    // this.timer.runTimer = false;
    // this.timer.hasFinished = true;
    // this.timer.secondsRemaining = 0;
    // this.timer.seconds = 0;
  }

  /* RESUMING TIMER */
  resumeTimer() {
    this.startTimer();
  }

  /* GETTING REMAINING TIME */
  getRemainingTime(): number {
    return this.timer.secondsRemaining;
  }

  /* TIMER IS FINISHED */
  hasFinished() {
    return this.timer.hasFinished;
  }   
   
  /* SHOWING STUDY TIME AFTER EACH SECOND */  
  timerTick() {

    if(!this.studyStatus.getStatus()){
      this.stopTimer();
      this.timer.hasFinished = true;
      this.timer.runTimer = false;
      return;
    }
    
    this.timeInterval = setTimeout(() => {
          if (!this.timer.runTimer || this.timer.secondsRemaining <= 0 || this.timer.hasFinished) { return; }
          this.timer.secondsRemaining--;
          this.timer.displayTime = this.getTimeAsDigitalClock(this.timer.secondsRemaining);
          if (this.timer.secondsRemaining > 0) {
            this.timerTick();
          }
          else {
              this.timer.runTimer = false;
              this.timer.hasFinished = true;
              //this.time.setStatus(true);
              this.stopTimer();
              this.openModal();
          }
      }, 1000);


  }

  /* STOPPING TIMER */
  public stopTimer(){
    clearTimeout(this.timeInterval);
  }

  clearTimer(){
    this.timer.displayTime = '00:00';
  }

  /* CALCULATING REMAINING TIME */
  getTimeAsDigitalClock(inputSeconds: number) {
      var sec_num = parseInt(inputSeconds.toString(), 10); // don't forget the second param
      var hours   = Math.floor(sec_num / 3600);
      var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
      var seconds = sec_num - (hours * 3600) - (minutes * 60);
      var hoursString = '';
      var minutesString = '';
      var secondsString = '';
      hoursString = (hours < 10) ? "0" + hours : hours.toString();
      minutesString = (minutes < 10) ? "0" + minutes : minutes.toString();
      secondsString = (seconds < 10) ? "0" + seconds : seconds.toString();
      //return hoursString + ':' + minutesString + ':' + secondsString;
      return minutesString + ':' + secondsString;
  }

  
  /* OPENING MODAL WHEN STUDY TIME IS OVER */
  openModal() {
    
    this.timer.runTimer = false;  
    let modal = this.modalCtrl.create('TimerExpiredPage', null, { cssClass: 'inset-modal' });
    modal.onDidDismiss(data => {
        console.log('TIME EXPIRED FOR ROUND.');
        if(data.action.toLowerCase().trim() == 'continue')
          this.time.setTime(this.time.getRoundTime());
     });
     
    modal.present();

  }
  

}
