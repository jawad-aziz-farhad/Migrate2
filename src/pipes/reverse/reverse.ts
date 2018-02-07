import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'reverse',
  pure: false
})

export class ReversePipe implements PipeTransform {
  transform (array: Array<any>, element_id: string, order: any) {
    array.sort((a: any, b: any) => {
      if(order == 'ascending'){
        if (a[element_id] < b[element_id]) {
          return -1;
        } else if (a[element_id] > b[element_id]) {
          return 1;
        } else {
          return 0;
        }
      }

      else if(order == 'descending'){
        if (a[element_id] < b[element_id]) {
          return 1;
        } else if (a[element_id] > b[element_id]) {
          return -1;
        } else {
          return 0;
        }
      }
     
    });                
    
    return array;
  }
}