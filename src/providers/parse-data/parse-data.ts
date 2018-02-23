import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { StudyData , AllStudyData} from '../../models';
import { Observable } from 'rxjs';
/*
  Generated class for the ParseDataProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ParseDataProvider {

  private data: StudyData;
  private data_array: Array<StudyData>;
  public final_data: {title: any , data: Array<StudyData> };
  public round_data: { roundStartTime: any, roundEndTime: any, data: Array<StudyData>};
  public rounds: Array<any>;

  constructor(public http: Http) {
    console.log('Hello ParseDataProvider Provider');
    this.data_array = [];
    this.final_data = {title: '' , data: []};
    this.rounds = [];
    this.round_data = {roundStartTime: '', roundEndTime: '', data: [ ]};
  }

  setData(data: StudyData) {
     this.data = data;
  }

  getData(): StudyData{
    return this.data;
  }

  clearData(): void {
    this.data = new StudyData();
    this.data = null;
  }

  setDataArray(data: StudyData){
    this.data_array.push(data);
    this.setFinalData(data);
  }

  getDataArray(): Array<StudyData> {
    return this.data_array;
  }

  clearDataArray(){
    this.data_array = [];
    this.final_data = {title: '', data: [] };
  }

  clearRuondsDataArray(){
    this.rounds = [];
    this.round_data = {roundStartTime: '', roundEndTime: '', data: [ ]} ;
  }
  setFinalData(data: StudyData){
    let _data = this.getFinalData();
    _data.title = new AllStudyData().getTitle();
    _data.data.push(data);
  }

  getFinalData(): any{
    return this.final_data;
  }

  setRoundsArray(data){
    this.rounds.push(data);
  }

  getRoundsArray(){
    return this.rounds;
  }
  
}
