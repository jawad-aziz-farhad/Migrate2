import { Component , ViewChild , Renderer, ElementRef } from '@angular/core';
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
  
  @ViewChild('notes') notesInput;

  public notes: any;

  constructor(public navCtrl: NavController,
              public parseData: ParseDataProvider,
              public renderer: Renderer,
              public elementRef: ElementRef,
              public keyboard: Keyboard) {          
    this.initView();
  }

  ionViewDidLoad(){   
    let element = this.elementRef.nativeElement.querySelector('textarea');
    setTimeout(() => {
      this.renderer.invokeElementMethod(element, 'focus', []);   
      this.keyboard.show();
    }, 500);
      
  }

  initView(){
    this.notes = '';    
  }

  /* ADDING NOTES FOR STUDY */
  add_Notes(){
    this.parseData.getData().setNotes(this.notes);
    this.parseData.setData(this.parseData.getData());
    this.navCtrl.pop();
  }
  
}
