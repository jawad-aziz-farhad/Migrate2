import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { StudyData , Data } from '../../models';
/*
  Generated class for the ParseDataProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ParseDataProvider {

  private studyData: StudyData;
  private data: Data;
  private dataArray: Array<Data>;
  private frequency: number = 0;
  private rating: number = 0;
  private elements: Array<any> = [];
  
  constructor(public http: Http) {
    console.log('Hello ParseDataProvider Provider');
    this.dataArray = [];
  }
  /* SETTING STUDY DATA */
  setStudyData(data: StudyData) { this.studyData = data }
  /* GETTING STUDY DATA */
  getStudyData(): StudyData { return this.studyData; }

  /* SETTING STUDIED DATA */
  setData(data: Data){ this.data = data; }
  /* GETTING STUDIED DATA */
  getData(): Data { return this.data; }

  /* PUSHING DATA IN ARRAY */
  setDataArray(data: Data){ this.dataArray.push(data); }
  /* GETTING DATA ARRAY */
  getDataArray(): Array<Data> { return this.dataArray; }

  /* CLEARING ALL DATA OBJECTS AND ARRAY */
  clearDataArray(){ this.dataArray = []; }
  clearData(){ this.data = null; this.data = new Data(); this.rating = this.frequency = null; }
  clearStudyData(): void { this.data = null; }

  setElements(elements: Array<any>){this.elements = elements;}
  getElements(): Array<any> { return this.elements;}

  /* SETTING UP FREQUENCY HERE SO IF USER PRESS BACK BUTTON, WE CAN GET FREQUENCY FROM THE GETTER FUNCTION */
  setFrequency(frequency) { this.frequency = frequency; }
  getFrequency(): number { return this.frequency; }

  /* SETTING UP RATING HERE SO IF USER PRESS BACK BUTTON, WE CAN GET RATING FROM THE GETTER FUNCTION */
  setRating(rating) { this.rating = rating; }
  getRating(): number { return this.rating; }


}
