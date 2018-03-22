import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the SearchPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'search',
})
export class SearchPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(items: any[], field: string, value: string): any[] {
    if (!value) return items;
    return items.filter(it => it[field].toLowerCase().indexOf(value.toLowerCase()) > -1);
  }
}
