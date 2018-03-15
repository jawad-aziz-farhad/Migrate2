import { Component, Input, ViewChild, ElementRef, Renderer } from '@angular/core';

/**
 * Generated class for the AccordianComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'accordian',
  templateUrl: 'accordian.html'
})
export class AccordianComponent {

  @ViewChild('expandWrapper', {read: ElementRef}) expandWrapper;
  @Input('expanded') expanded;
  @Input("location") location;
  @Input('expandHeight') expandHeight;

  constructor(public renderer: Renderer) {}


  ngAfterViewInit(){
    this.renderer.setElementStyle(this.expandWrapper.nativeElement, 'height', this.expandHeight + 'px');   
  }

  open_close_Time(from, to) {
    let time = '';
    if(typeof from !== 'undefined' && typeof to !== 'undefined'){
    
      if(from.trim() !== "00 - 00"){
        if(from.trim() !== "00 - 00")
          time += from;
        
        if(to.trim() !== "00 - 00")
          time += ' - ' + to; 
        else
          time += ' - Closed' ;
    }
    else
      time = '  Closed ';
    
  
  }
  
  else
      time = '  Closed ';
    
      return time; 
  }

}
