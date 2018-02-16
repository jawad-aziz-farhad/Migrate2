import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'reverse',
  pure: false
})

export class ReversePipe implements PipeTransform {
  transform (array: Array<any>, numericID: string, order: any) {
    array.sort((a: any, b: any) => {
      if(order == 'ascending'){
        if (a[numericID] < b[numericID]) {
          return -1;
        } else if (a[numericID] > b[numericID]) {
          return 1;
        } else {
          return 0;
        }
      }

      else if(order == 'descending'){
        if (a[numericID] < b[numericID]) {
          return 1;
        } else if (a[numericID] > b[numericID]) {
          return -1;
        } else {
          return 0;
        }
      }
     
    });                
    
    return array;
  }
}