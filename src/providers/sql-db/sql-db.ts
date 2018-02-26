import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Storage } from '@ionic/storage';
import { Projects } from '../../models/projects.interface';
import { ParserProvider } from '../parser/parser';
import 'rxjs/add/operator/map';
import { BehaviorSubject } from 'rxjs/Rx';
import * as $ from 'jQuery';
import { Observable } from 'rxjs/Observable';
/*
  Generated class for the SqlDbProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SqlDbProvider {

  private database: SQLiteObject;
  private databaseReady: BehaviorSubject<boolean>;
  private studyDataIndex: number = 0;
  private studyID: any = null;
  private config: any = {
    name: 'retime_ras.db',
    location: 'default'
  };
 
  constructor(private storage: Storage, private sqlite: SQLite, private platform: Platform, private parser: ParserProvider) {
    this.databaseReady = new BehaviorSubject(false);
    this.platform.ready().then(() => {
      this.sqlite.create(this.config)
        .then((db: SQLiteObject) => {
          this.database = db;
          this.storage.get('database_filled').then(val => {
            if (val) {
              this.databaseReady.next(true);
            } else {
              console.log('NO DATA Found.');
              this.databaseReady.next(true);
            }
          });
        });
    });
  }
 
  /* ADDING DATA TO TABLE */
  addData(table , data): Promise<any> {
    let query = this.insertQuery(table);
    return new Promise((resolve, reject) => {
      for(let i = 0; i < data.length; i++) {
            let row_data = this.dataforRow(table, data, i);
            if(table == 'Create_Area' || table == 'Create_Element' || table == 'Create_Role')
             console.log(query + '\n' +JSON.stringify(row_data));
            
            this.database.executeSql(query, row_data).then(result => {
              console.log('RECORD ADDED: '+JSON.stringify(result));
            }, err => {
              console.error('Error: '+ JSON.stringify(err));
              reject(err);
            });
        }
        resolve(true);
    });
    
  }
 
  /* GETTING DATA FOR ONE ROW */
  dataforRow(table, data, index){
      let _data = [];
      if(table == 'Projects')
        _data = [data[index]._id, data[index].name, this.isValueAvailable(data[index].customer.image), null , data[index].customer._id , data[index].customer.name];      
      else if(table == 'Locations')
        _data = [data[index]._id , data[index].projectID,  data[index].customerID , data[index].name, data[index].addressOne, data[index].addressTwo, data[index].addressThree, data[index].addressFour, null, data[index].contactName, data[index].telephone,
                data[index].schedule[0].openingHour + ' - ' + data[index].schedule[0].openingMinute + ' ' + data[index].schedule[0].openingTimeFormat,
                data[index].schedule[1].openingHour + ' - ' + data[index].schedule[1].openingMinute + ' ' + data[index].schedule[1].openingTimeFormat,
                data[index].schedule[2].openingHour + ' - ' + data[index].schedule[2].openingMinute + ' ' + data[index].schedule[2].openingTimeFormat,
                data[index].schedule[3].openingHour + ' - ' + data[index].schedule[3].openingMinute + ' ' + data[index].schedule[3].openingTimeFormat,
                data[index].schedule[4].openingHour + ' - ' + data[index].schedule[4].openingMinute + ' ' + data[index].schedule[4].openingTimeFormat,
                data[index].schedule[5].openingHour + ' - ' + data[index].schedule[5].openingMinute + ' ' + data[index].schedule[5].openingTimeFormat,
                data[index].schedule[6].openingHour + ' - ' + data[index].schedule[6].openingMinute + ' ' + data[index].schedule[6].openingTimeFormat,
              
                data[index].schedule[0].closingHour + ' - ' + data[index].schedule[0].closingMinute + ' ' + data[index].schedule[0].closingTimeFormat,
                data[index].schedule[1].closingHour + ' - ' + data[index].schedule[1].closingMinute + ' ' + data[index].schedule[1].closingTimeFormat,
                data[index].schedule[2].closingHour + ' - ' + data[index].schedule[2].closingMinute + ' ' + data[index].schedule[2].closingTimeFormat,
                data[index].schedule[3].closingHour + ' - ' + data[index].schedule[3].closingMinute + ' ' + data[index].schedule[3].closingTimeFormat,
                data[index].schedule[4].closingHour + ' - ' + data[index].schedule[4].closingMinute + ' ' + data[index].schedule[4].closingTimeFormat,
                data[index].schedule[5].closingHour + ' - ' + data[index].schedule[5].closingMinute + ' ' + data[index].schedule[5].closingTimeFormat,
                data[index].schedule[6].closingHour + ' - ' + data[index].schedule[6].closingMinute + ' ' + data[index].schedule[6].closingTimeFormat
              ]
      else if(table == 'Areas_IDs'  || table == 'Roles_IDs' || table == 'Elements_IDs' || table == 'Locations_IDs')        
        _data = [localStorage.getItem('projectID'), data[index]];     
      else if(table == 'Areas')
        _data = [data[index].name, data[index]._id , data[index].popularity, null , null , data[index].projectID];
      else if(table == 'Elements')
        _data = [data[index].name, data[index]._id , data[index].popularity, data[index].rating, data[index].numericID, data[index].projectID];
      else if(table == 'Roles') 
        _data = [data[index].name, data[index]._id , data[index].popularity, null , null ,data[index].projectID]; 
      else if(table == 'Create_Area')
        _data = [data[index]._id, data[index].name, data[index].projectID, data[index].addedby , data[index].id_of_addedby , data[index].status, data[index].date];   
      else if(table == 'Create_Role')
        _data = [data[index]._id, data[index].name, data[index].position , data[index].projectID, data[index].addedby , data[index].id_of_addedby , data[index].status, data[index].date];   
      else if(table == 'Create_Element')
        _data = [data[index]._id, data[index].name, data[index].type , data[index].rating , data[index].category ,  data[index].efficiency_study, data[index].activity_study, data[index].role_study , data[index].projectID , data[index].addedby , data[index].id_of_addedby , data[index].status, data[index].date , data[index].userAdded];
      else if(table == 'Study')
        _data = [this.parser.geAllData().getTitle() , this.parser.geAllData().getCustomer()._id ,this.parser.geAllData().getSutdyStartTime(), this.parser.geAllData().getSutdyEndTime()];
      else if(table == 'Study_Data')
        _data = [data[index].role._id , data[index].area._id , data[index].element._id , data[index].rating , data[index].frequency , data[index].notes ,data[index].photo ,  data[index].observationTime, this.parser.geAllData().getRoundData()[this.studyDataIndex].roundStartTime , this.parser.geAllData().getRoundData()[this.studyDataIndex].roundEndTime, this.studyID];  
      else if(table == 'Categories')
         _data = [data[index]._id , data[index].name];
      return _data;
  }

  studyData(table, id){
    this.studyID = id;
    return new Promise((resolve, reject) => {
      $(this.parser.geAllData().getRoundData()).each((index,element) => {
          this.studyDataIndex = index;
          this.addData( table, element.data).then(res => {
              if((index + 1) == this.parser.geAllData().getRoundData().length)
                  resolve(true);
          }).catch(error => {
              reject(error);
        });
    });
    });
    
  }

  /* CHECKING THE NUMBER AND ADDING ZERO IF NUMBER IS LESS THAN 10 */
  pad(number) {
    if(typeof number == 'undefined' || number == null || number == '')
      return '00';
    else
      return (number < 10) ? ("0" + number) : number;
 }
 /* CHECKING VALUE IS AVAILABLE OR NOT */
 isValueAvailable(value){
   return (typeof value == 'undefined') ? '' : value;
 }
  
  /* CREATE TABLE QUERY ACCORDING TO PARAMETER */
  createTable(table): Promise<any> {
      let query = '';
      if(table == 'Projects')
        query = 'CREATE TABLE IF NOT EXISTS Projects(id INTEGER PRIMARY KEY AUTOINCREMENT, _id TEXT , name TEXT,logo TEXT,headoffice TEXT, customer_id TEXT, customer_name TEXT)';
      else if(table == 'Areas_IDs'  || table == 'Roles_IDs' || table == 'Elements_IDs' || table == 'Locations_IDs')
        query = 'CREATE TABLE IF NOT EXISTS ' + `${table}` +'(id INTEGER PRIMARY KEY AUTOINCREMENT, projectID TEXT, _id TEXT)';
      else if(table == 'Locations')
        query = 'CREATE TABLE IF NOT EXISTS Locations(id INTEGER PRIMARY KEY AUTOINCREMENT, _id TEXT NOT NULL UNIQUE, projectID TEXT,  customer_id TEXT , locationname TEXT, addresslineone TEXT , addresslinetwo TEXT , addresslinethree TEXT , addresslinefour TEXT , addresslinefive TEXT , contactname TEXT , telephone TEXT, monday_time_from TEXT, tuesday_time_from TEXT, wednesday_time_from TEXT, thursday_time_from TEXT, friday_time_from TEXT, saturday_time_from TEXT, sunday_time_from TEXT,monday_time_to TEXT, tuesday_time_to TEXT, wednesday_time_to TEXT, thursday_time_to TEXT, friday_time_to TEXT, saturday_time_to TEXT, sunday_time_to TEXT )';  
      else if(table == 'Areas' || table == 'Roles' || table == 'Elements')
        query = 'CREATE TABLE IF NOT EXISTS ' + `${table}` +'(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, _id TEXT, popularity INT, rating TEXT, numericID BIGINT, projectID)'; 
      else if(table == 'Study')
        query = 'CREATE TABLE IF NOT EXISTS ' + `${table}` +'(id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, projectID TEXT, studyStartTime BIGINT, studyEndTime BIGINT)';
      else if(table == 'Study_Data')
        query = 'CREATE TABLE IF NOT EXISTS ' + `${table}` +'(id INTEGER PRIMARY KEY AUTOINCREMENT, roundStartTime BIGINT, roundEndTime BIGINT, role TEXT, area TEXT, element TEXT, rating INT,frequency INT, notes TEXT, photo TEXT, observationTime BIGINT, Study_Id TEXT, FOREIGN KEY(Study_Id) REFERENCES Study(id))';   
      else if(table == 'Create_Role')
        query = 'CREATE TABLE IF NOT EXISTS ' + `${table}` +'(id INTEGER PRIMARY KEY AUTOINCREMENT, _id TEXT, name TEXT, position TEXT, projectID TEXT, addedby TEXT, id_of_addedby TEXT, status TEXT, date TEXT)';
      else if(table == 'Create_Area')
        query = 'CREATE TABLE IF NOT EXISTS ' + `${table}` +'(id INTEGER PRIMARY KEY AUTOINCREMENT, _id TEXT, name TEXT, projectID TEXT, addedby TEXT, id_of_addedby TEXT, status TEXT, date TEXT)';
      else if(table == 'Create_Element')
        query = 'CREATE TABLE IF NOT EXISTS ' + `${table}` +'(id INTEGER PRIMARY KEY AUTOINCREMENT, _id TEXT, name TEXT, type TEXT, rating TEXT, category TEXT,  efficiency_study NUMBER, activity_study NUMBER, role_study NUMBER, types TEXT, projectID TEXT, addedby TEXT, id_of_addedby TEXT, status TEXT, date TEXT, userAdded boolean)';  
      else if(table == 'Categories')
        query = 'CREATE TABLE IF NOT EXISTS ' + `${table}` +'(id INTEGER PRIMARY KEY AUTOINCREMENT, _id TEXT, name TEXT)';
        return this.database.executeSql(query, {}).then(() => {
          return table + ' created successfully.';
        }).catch(error => {
            return error;
      });
  }
  
  /* INSERT QUERY ACCORDING TO PARAMETER */
  insertQuery(table): string {
    let query = '';
    if(table == 'Projects')
      query = 'INSERT INTO Projects (_id, name, logo, headoffice, customer_id, customer_name) VALUES (? , ? , ? , ?, ?, ?)';
    else if(table == 'Areas_IDs'  || table == 'Roles_IDs' || table == 'Elements_IDs' || table == 'Locations_IDs')
      query = 'INSERT INTO ' + table + '(projectID , _id) VALUES (?, ?)';
    else if(table == 'Locations')
      query = 'INSERT INTO Locations (_id , projectID ,customer_id , locationname, addresslineone, addresslinetwo, addresslinethree, addresslinefour, addresslinefive, contactname, telephone, monday_time_from, tuesday_time_from, wednesday_time_from, thursday_time_from, friday_time_from, saturday_time_from, sunday_time_from, monday_time_to, tuesday_time_to, wednesday_time_to, thursday_time_to, friday_time_to, saturday_time_to, sunday_time_to) VALUES (? , ? , ? ,? , ? , ?, ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ?, ? , ? , ? , ? , ? , ? , ?)';  
    else if(table == 'Areas' || table == 'Roles' || table == 'Elements')
      query = 'INSERT INTO ' + table + '(name, _id, popularity, rating, numericID, projectID) VALUES (?, ?, ?, ?, ?, ?)';
    else if(table == 'Study')
      query = 'INSERT INTO ' + table + '(title , projectID , studyStartTime , studyEndTime) VALUES (? , ? , ? , ?)';           
    else if(table == 'Study_Data')
      query = 'INSERT INTO ' + table + '(role, area, element , rating, frequency, notes, photo, observationTime, roundStartTime, roundEndTime, Study_Id) VALUES (? , ? , ? , ? , ? , ? , ? , ? , ? , ?, ?)';   
    else if(table == 'Create_Role')
      query = 'INSERT INTO ' + table + '(_id ,name , position, projectID , addedby, id_of_addedby, status, date) VALUES (? , ? , ? , ? , ?, ?, ?, ?)' ;
    else if(table == 'Create_Area')
      query = 'INSERT INTO ' + table + '(_id ,name , projectID , addedby, id_of_addedby, status, date) VALUES (? , ? , ? , ?, ?, ?, ?)' ;
    else if(table == 'Create_Element')  
      query = 'INSERT INTO ' + table + '(_id ,name , type , rating , category  , efficiency_study , activity_study , role_study , projectID , addedby, id_of_addedby, status, date, userAdded )  VALUES (? , ? , ?  , ? , ?, ?, ?, ?, ? , ? , ? , ? , ?, ? )';
    else if(table == 'Categories')  
      query = 'INSERT INTO ' + table + '(_id , name) VALUES (? , ? )';
    return query;  
  }
  
  /* GETTING ALL RECORDS FROM TABLE */
  getAllData(table: string) {
    let query = "SELECT * FROM " + `${table}`;
    return this.database.executeSql(query, []).then((result) => {
      let data = [];
      if (result.rows.length > 0) 
         data = this.putDatainArray(table, result);
      return data;
    }, err => {
      console.error('Error AT TABLE: '+ table + ' ' + err);
      return [];
    });
  }

  /* GETTING IDS OF ROLES, ELEMENTS, AREAS TO FETCH DATA  */
  getIDData(table, id): Promise<any> {
    let query = '';
    if(table == 'Areas' || table == 'Elements' || table == 'Roles')
      query = "SELECT * FROM " + `${table}` + " WHERE projectID=?";
    else if(table == 'Create_Area' || table == 'Create_Element' || table == 'Create_Role')
      query = "SELECT * FROM " + `${table}` + " WHERE _id=?";
    else
     query = "SELECT * FROM " + `${table}`  + " WHERE projectID=?";
     
    return new Promise((resolve, reject) => {
      this.database.executeSql(query, [id]).then((result) => {
      let data = [];
      if (result.rows.length > 0) 
          data = this.putDatainArray(table, result);
      resolve(data);
    }, err => {
      console.log('Error AT TABLE: '+ table + ' ' + JSON.stringify(err));
      reject(err);
    });
   }); 
 }

 getLikeData(table){
    let query = "SELECT * FROM " + `${table}`  + " WHERE _id LIKE ?";
    console.log(query);
    return new Promise((resolve, reject) => {
      this.database.executeSql(query, ['%-%']).then((result) => {
      let data = [];
      if (result.rows.length > 0) 
          data = this.putDatainArray(table, result);
      resolve(data);
    }, err => {
      console.log('Error AT TABLE: '+ table + ' ' + JSON.stringify(err));
      reject(err);
    });
   }); 
 }


  putDatainArray(table, result){
    let data = [];
    for (let i = 0; i < result.rows.length; i++) {
          if(table == 'Projects')
            data.push(new Projects(result.rows.item(i)._id, result.rows.item(i).name, result.rows.item(i).logo , result.rows.item(i).headoffice  , result.rows.item(i).customer_id , result.rows.item(i).customer_name ));
          else if(table == 'Locations')
            data.push({_id: result.rows.item(i)._id, projectID: result.rows.item(i).projectID, customer_id: result.rows.item(i).customer_id,locationname: result.rows.item(i).locationname , addresslineone : result.rows.item(i).addresslineone, addresslinetwo: result.rows.item(i).addresslinetwo ,  
                       addresslinethree: result.rows.item(i).addresslinethree,addresslinefour: result.rows.item(i).addresslinefour ,addresslinefive: result.rows.item(i).addresslinefive , contactname: result.rows.item(i).contactname, telephone: result.rows.item(i).telephone,
                       monday_time_from: result.rows.item(i).monday_time_from, tuesday_time_from: result.rows.item(i).tuesday_time_from, wednesday_time_from: result.rows.item(i).wednesday_time_from, thursday_time_from: result.rows.item(i).thursday_time_from,
                       friday_time_from: result.rows.item(i).friday_time_from, saturday_time_from: result.rows.item(i).saturday_time_from, sunday_time_from: result.rows.item(i).sunday_time_from,
                       monday_time_to: result.rows.item(i).monday_time_to, tuesday_time_to: result.rows.item(i).tuesday_time_to, wednesday_time_to: result.rows.item(i).wednesday_time_to, thursday_time_to: result.rows.item(i).thursday_time_to,
                       friday_time_to: result.rows.item(i).friday_time_to, saturday_time_to: result.rows.item(i).saturday_time_to, sunday_time_to: result.rows.item(i).sunday_time_to
                      });
          else if(table == 'Areas')
            data.push({_id: result.rows.item(i)._id , name: result.rows.item(i).name, popularity: result.rows.item(i).popularity, projectID: result.rows.item(i).projectID});
          else if(table == 'Roles') 
             data.push({_id: result.rows.item(i)._id, name: result.rows.item(i).name, popularity: result.rows.item(i).popularity, projectID: result.rows.item(i).projectID}); 
          else if(table == 'Elements')
             data.push({_id: result.rows.item(i)._id ,name: result.rows.item(i).name , popularity: result.rows.item(i).popularity, rating: result.rows.item(i).rating,numericID: result.rows.item(i).numericID, projectID: result.rows.item(i).projectID});
           else if(table == 'Create_Role')
            data.push({_id: result.rows.item(i)._id , name: result.rows.item(i).name, position: result.rows.item(i).position , projectID: result.rows.item(i).projectID, addedby: result.rows.item(i).addedby, id_of_addedby: result.rows.item(i).id_of_addedby, status: result.rows.item(i).status ,date: result.rows.item(i).date});
          else if(table == 'Create_Area') 
            data.push({_id: result.rows.item(i)._id ,name: result.rows.item(i).name,  projectID: result.rows.item(i).projectID, 
                       addedby: result.rows.item(i).addedby, id_of_addedby: result.rows.item(i).id_of_addedby, status: result.rows.item(i).status ,date: result.rows.item(i).date});  
           else if(table == 'Create_Element')
           data.push({_id: result.rows.item(i)._id , name: result.rows.item(i).name, efficiency_study: result.rows.item(i).efficiency_study,
                      activity_study: result.rows.item(i).activity_study ,role_study: result.rows.item(i).role_study,
                      type: result.rows.item(i).type, rating: result.rows.item(i).rating, category: result.rows.item(i).category, 
                      projectID: result.rows.item(i).projectID, addedby: result.rows.item(i).addedby, 
                      userId: result.rows.item(i).id_of_addedby, status: result.rows.item(i).status ,date: result.rows.item(i).date, userAdded: result.rows.item(i).userAdded});
          else if(table == 'Areas_IDs'  || table == 'Roles_IDs' || table == 'Elements_IDs' || table == 'Locations_IDs')
            data.push(result.rows.item(i)._id);
          else if(table == 'Categories')
            data.push({ _id: result.rows.item(i)._id, name : result.rows.item(i).name });
          else if(table == 'Study')
            data.push({id: result.rows.item(i).id, title: result.rows.item(i).title, projectID: result.rows.item(i).projectID, studyStartTime: result.rows.item(i).studyStartTime, studyEndTime: result.rows.item(i).studyEndTime});
          else if(table == 'Study_Data')
            data.push({roundStartTime: result.rows.item(i).roundStartTime ,roundEndTime: result.rows.item(i).roundEndTime , role: result.rows.item(i).role, area: result.rows.item(i).area , element: result.rows.item(i).element , rating: result.rows.item(i).rating ,frequency: result.rows.item(i).frequency , notes: result.rows.item(i).notes , photo: result.rows.item(i).photo , observationTime: result.rows.item(i).observationTime, Study_Id: result.rows.item(i).Study_Id })
         
        }
      
      return data;
  }
 
  /* CHECKING DATA EXISTS IN THE TABLE OR NOT */
  isDataAvailable(table: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
        this.getAllData(table).then(result => {
          if(result.length == 0 || result == null || typeof result == 'undefined')
            resolve(false);
          else
            resolve(true);  
        }).catch(error => {
            reject(error);
        });
    });
  }
  /* REMOVING ALL DATA FROM TABLE */
  dropTable(table: string): Promise<any> {
    let query = "DROP TABLE IF EXISTS "+ table;
    return new Promise((resolve, reject) => {
      this.database.executeSql(query, []).then(() => {
        resolve(table + ' data removed successfully.');
      }, err => {
        reject(err);
      });
    });
  }
  
  /* GETTING DATA BASE STATE */
  getDatabaseState() {
    return this.databaseReady.asObservable();
  }

  /* GETTING OFFLINE DATA FOR SPECIFIC ID */  
  getOfflineStudyData(studyId) {
    let query = "SELECT * FROM Study join Study_Data on Study.id=Study_Data.Study_Id join Projects on Projects._id=Study.projectID Where Study.id=" +`${studyId}`;
    return new Promise((resolve, reject) => {
      this.database.executeSql(query, []).then((result) => {
        let data = [];
        if (result.rows.length > 0) {
          for (let i = 0; i < result.rows.length; i++) {
            data.push({ id: result.rows.item(i).id, title: result.rows.item(i).title, projectID: result.rows.item(i).projectID, studyStartTime: result.rows.item(i).studyStartTime, studyEndTime: result.rows.item(i).studyEndTime,
                        roundStartTime: result.rows.item(i).roundStartTime ,roundEndTime: result.rows.item(i).roundEndTime , role: result.rows.item(i).role, area: result.rows.item(i).area ,element: result.rows.item(i).element , 
                        rating: result.rows.item(i).rating ,frequency: result.rows.item(i).frequency , notes: result.rows.item(i).notes , photo: result.rows.item(i).photo , observationTime: result.rows.item(i).observationTime, 
                        customer: new Projects(result.rows.item(i)._id, result.rows.item(i).name, result.rows.item(i).logo , result.rows.item(i).headoffice  , result.rows.item(i).customer_id , result.rows.item(i).customer_name )
            });    
          }
        }
        
        resolve(data);

      }, err => {
        reject(err);
        return [];
      });
    });
  }


  addRow(table, data){
    let query = this.insertQuery(table);
    let row_data = [];
    return new Promise((resolve, reject) => {
        row_data = [data.projectID, data._id];
        this.database.executeSql(query, row_data).then(result => {
          resolve(true);
        }, err => {
          console.error('Error: '+ JSON.stringify(err));
          reject(err);
        });
    });
  }

  dropAllTables(): Observable<any> {

    const table1 = this.dropTable("Projects");
    const table2 = this.dropTable("Roles");
    const table3 = this.dropTable("Roles_IDs");
    const table4 = this.dropTable("Areas");
    const table5 = this.dropTable("Areas_IDs");
    const table6 = this.dropTable("Elements");
    const table7 = this.dropTable("Elements_IDs");
    const table8 = this.dropTable("Locations");
    const table9 = this.dropTable("Categories");
    const table10 = this.dropTable("Locations_IDs")
    // const table11 = this.dropTable("Create_Area");
    // const table12 = this.dropTable("Create_Element");
    // const table13 = this.dropTable("Create_Role");

    const observableArray = [table1, table2, table3, table4, table5, table6, table7, table8, table9, table10 ];

    return Observable.forkJoin(observableArray);
  }


  updateTable(table, data): Promise<any>{
    let query = null;
    if(table == 'Areas' || table == 'Roles' || table == 'Elements')
      query = "UPDATE "+ `${table}` + " SET _id=? , numericID=?  WHERE _id=?"

    return this.database.executeSql(query,[data.live, data.numericID, data.offline]).then(result => {
      return result;
    }).catch(error => {
      return error;
    });
  }
}
