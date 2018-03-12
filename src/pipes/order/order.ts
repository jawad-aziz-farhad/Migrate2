import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the OrderPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'order',
})
export class OrderPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(data: Array<any>, ...args) {
    
    return data.sort((a: any, b: any) => {

      let value1 = null ; let value2 = null;
      if(a.numericID){
        value1 = a.numericID;
        value2 = b.numericID;
      }
      else {
        value1 = a.name.toLowerCase();
        value2 = b.name.toLowerCase();
      }
      if (value1 < value2) return -1;
      
      else if (value1 > value2) return 1;
      
      else return 0;
      
    });
  }
}
