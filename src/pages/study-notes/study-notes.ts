import { Component , Renderer, ElementRef } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { ParseDataProvider } from '../../providers';
import { Keyboard } from '@ionic-native/keyboard';
/**
 * Generated class for the StudyNotesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-study-notes',
  templateUrl: 'study-notes.html',
})
export class StudyNotesPage {
  
  public notes: string = '';

  constructor(public navCtrl: NavController,
              public parseData: ParseDataProvider,
              public renderer: Renderer,
              public elementRef: ElementRef,
              public keyboard: Keyboard) {
  }

  ionViewDidLoad(){   
    this.setFocus();
  }
  
  /* SETTING FOCUS TO TEXT FIELD AND SHOING KEY-BOARD */
  setFocus(){
    let element = this.elementRef.nativeElement.querySelector('textarea');
    setTimeout(() => {
      this.renderer.invokeElementMethod(element, 'focus', []);   
      this.keyboard.show();
    }, 200);
  }

  /* ADDING NOTES FOR STUDY */
  add_Notes(){
    this.parseData.getData().setNotes(this.notes);
    this.parseData.setData(this.parseData.getData());
    this.navCtrl.pop();
  }
  
}
