import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the SortPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'sort',
})
export class SortPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(array: Array<any>, popularity: string, element_id: string, order: any): Array<any> {
    array.sort((a: any, b: any) => {
      if (a[popularity] < b[popularity]) {
        return -1;
      } else if (a[popularity] > b[popularity]) {
        return 1;
      } else {
        return 0;
      }
    });

    if(order){
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
    }             
    
    return array;
  }
}
