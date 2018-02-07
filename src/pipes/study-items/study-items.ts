import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the StudyItemsPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'studyItems',
})
export class StudyItemsPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(array: Array<any>, isStudyEnded: boolean): any {
    let data = [];
    if(!isStudyEnded)
      data.push(array[array.length -1])
    else
      data = array;

    return data;
  }
}
