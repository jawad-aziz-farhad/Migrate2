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
  
  constructor(public http: Http) {
    console.log('Hello ParseDataProvider Provider');
    this.dataArray = [];
  }
  /* SETTING STUDY DATA */
  setStudyData(data: StudyData) { this.studyData = data }
  /* GETTING STUDY DATA */
  getStudyData(): StudyData{ return this.studyData; }

  setData(data: Data){ this.data = data; }
  getData(): Data { return this.data; }

  setDataArray(data: Data){ this.dataArray.push(data); }
  getDataArray(): Array<Data> { return this.dataArray; }
  
  clearDataArray(){ this.dataArray = []; }
  clearData(){ this.data = null; }
  clearStudyData(): void { this.data = null; }

  setFrequency(frequency) { this.frequency = frequency; }
  getFrequency(): number { return this.frequency; }

}
