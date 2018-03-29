import { Injectable } from '@angular/core';
import { AllStudyData, Rounds , StudyElements } from '../../models/index';

/*
  Generated class for the ParserProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ParserProvider {

  private all_data: AllStudyData;
  private rounds: Rounds;
  private studyElements: StudyElements;

  constructor() {
    console.log('Hello ParserProvider Provider');
  }

  setAllData(all_data: AllStudyData){ this.all_data = all_data; }
  setRounds(rounds: Rounds){ this.rounds = rounds;}

  geAllData(): AllStudyData { return this.all_data; }
  getRounds(): Rounds { return this.rounds; }

  clearRounds(){ this.rounds = new Rounds(); }
  clearAllData(){ this.all_data = new AllStudyData(); }
}
