import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Storage } from '@ionic/storage';
import { Projects } from '../../models/projects.interface';
import { ParseDataProvider } from '../parse-data/parse-data';
import 'rxjs/add/operator/map';
import { BehaviorSubject } from 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { NO_DATA_FOUND } from '../../config/config';
/*
  Generated class for the SqlDbProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SqlDbProvider {

  private database: SQLiteObject;
  private databaseReady: BehaviorSubject<boolean>;
  private studyID: any = null;

  private config: any = {
    name: 'retime_ras.db',
    location: 'default'
  };
 
  constructor(private storage: Storage, private sqlite: SQLite, private platform: Platform, private parser: ParseDataProvider) {
    this.databaseReady = new BehaviorSubject(false);
    this.platform.ready().then(() => {
      this.sqlite.create(this.config)
        .then((db: SQLiteObject) => {
          this.database = db;
          this.storage.get('database_filled').then(val => {
            if (val) {
              this.databaseReady.next(true);
            } else {
              console.log(NO_DATA_FOUND);
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
      if(!data)
        resolve(NO_DATA_FOUND);
      for(let i = 0; i < data.length; i++) {

            let row_data = this.dataforRow(table, data, i);
        
            if(table == 'Elements')
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
        _data = [data[index]._id, data[index].name, this.isValueAvailable(data[index].customer.image), null , data[index].customer._id , data[index].customer.name, data[index].rating];      
      else if(table == 'Locations')
        _data = [data[index]._id , data[index].projectID,  data[index].customerID , data[index].name, data[index].addressOne, data[index].addressTwo, data[index].addressThree, data[index].addressFour, null, data[index].contactName, data[index].telephone,
                data[index].schedule[0].openingHour + ':' + data[index].schedule[0].openingMinute + ' ' + data[index].schedule[0].openingTimeFormat,
                data[index].schedule[1].openingHour + ':' + data[index].schedule[1].openingMinute + ' ' + data[index].schedule[1].openingTimeFormat,
                data[index].schedule[2].openingHour + ':' + data[index].schedule[2].openingMinute + ' ' + data[index].schedule[2].openingTimeFormat,
                data[index].schedule[3].openingHour + ':' + data[index].schedule[3].openingMinute + ' ' + data[index].schedule[3].openingTimeFormat,
                data[index].schedule[4].openingHour + ':' + data[index].schedule[4].openingMinute + ' ' + data[index].schedule[4].openingTimeFormat,
                data[index].schedule[5].openingHour + ':' + data[index].schedule[5].openingMinute + ' ' + data[index].schedule[5].openingTimeFormat,
                data[index].schedule[6].openingHour + ':' + data[index].schedule[6].openingMinute + ' ' + data[index].schedule[6].openingTimeFormat,
              
                data[index].schedule[0].closingHour + ':' + data[index].schedule[0].closingMinute + ' ' + data[index].schedule[0].closingTimeFormat,
                data[index].schedule[1].closingHour + ':' + data[index].schedule[1].closingMinute + ' ' + data[index].schedule[1].closingTimeFormat,
                data[index].schedule[2].closingHour + ':' + data[index].schedule[2].closingMinute + ' ' + data[index].schedule[2].closingTimeFormat,
                data[index].schedule[3].closingHour + ':' + data[index].schedule[3].closingMinute + ' ' + data[index].schedule[3].closingTimeFormat,
                data[index].schedule[4].closingHour + ':' + data[index].schedule[4].closingMinute + ' ' + data[index].schedule[4].closingTimeFormat,
                data[index].schedule[5].closingHour + ':' + data[index].schedule[5].closingMinute + ' ' + data[index].schedule[5].closingTimeFormat,
                data[index].schedule[6].closingHour + ':' + data[index].schedule[6].closingMinute + ' ' + data[index].schedule[6].closingTimeFormat
      ]
      else if(table == 'Areas_IDs' || table == 'Elements_IDs')        
        _data = [localStorage.getItem('projectID'), data[index]];     
      else if(table == 'assignedLocations')
        _data = [data[index], localStorage.getItem("projectID")];
      else if(table == 'Areas')
        _data = [data[index].name, data[index]._id , data[index].popularity, null , null , data[index].projectID, null , null, null];
      else if(table == 'Elements')
        _data = [data[index].name, data[index]._id , data[index].popularity, data[index].rating, data[index].numericID, data[index].projectID, data[index].category, data[index].studyType, data[index].type, data[index].taskID , data[index].count];
      else if(table == 'Tasks')
        _data = [data[index].name, data[index]._id, data[index].popularity, null, null, data[index].projectID, null, null, null]
      else if(table == 'Create_Area')
        _data = [data[index]._id, data[index].name, data[index].projectID, data[index].addedby , data[index].id_of_addedby , data[index].status, data[index].date];   
      else if(table == 'Create_Element')
        _data = [data[index]._id, data[index].name, data[index].type , data[index].rating , data[index].category ,  data[index].efficiency_study, data[index].activity_study, data[index].role_study , data[index].projectID , data[index].addedby , data[index].id_of_addedby , data[index].status, data[index].date , data[index].userAdded];
      else if(table == 'Create_Task')
        _data = [data[index]._id, data[index].name, data[index].projectID, data[index].addedby, data[index].id_of_addedby, data[index].status, data[index].date]      
      else if(table == 'Study'){
        let data = this.parser.getStudyData();
        _data = [data.getTitle() , data.getCustomer()._id , data.getSutdyStartTime(), data.getSutdyEndTime(), data.getCustomer().customer_id, data.getLocationID() , localStorage.getItem("userID"), data.getArea()._id ];
      }  
      else if(table == 'Study_Data')
        _data = [data[index].task._id ,data[index].element._id , data[index].rating , data[index].frequency , data[index].notes ,data[index].photo , data[index].time,  data[index].startTime ,  data[index].endTime ,  data[index].duration ,localStorage.getItem("studyID")];  
      else if(table == 'Categories')
         _data = [data[index]._id , data[index].name , data[index].studyType];

      return _data;
      
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
        query = 'CREATE TABLE IF NOT EXISTS Projects(id INTEGER PRIMARY KEY AUTOINCREMENT, _id TEXT , name TEXT,logo TEXT,headoffice TEXT, customer_id TEXT, customer_name TEXT, rating NUMBER)';
      else if(table == 'Areas_IDs' || table == 'Elements_IDs')
        query = 'CREATE TABLE IF NOT EXISTS ' + `${table}` +'(id INTEGER PRIMARY KEY AUTOINCREMENT, projectID TEXT, _id TEXT)';
      else if(table == 'Locations')
        query = 'CREATE TABLE IF NOT EXISTS Locations(id INTEGER PRIMARY KEY AUTOINCREMENT, _id TEXT NOT NULL, projectID TEXT,  customer_id TEXT , locationname TEXT, addresslineone TEXT , addresslinetwo TEXT , addresslinethree TEXT , addresslinefour TEXT , addresslinefive TEXT , contactname TEXT , telephone TEXT, monday_time_from TEXT, tuesday_time_from TEXT, wednesday_time_from TEXT, thursday_time_from TEXT, friday_time_from TEXT, saturday_time_from TEXT, sunday_time_from TEXT,monday_time_to TEXT, tuesday_time_to TEXT, wednesday_time_to TEXT, thursday_time_to TEXT, friday_time_to TEXT, saturday_time_to TEXT, sunday_time_to TEXT )';  
      else if(table == 'assignedLocations')
        query = 'CREATE TABLE IF NOT EXISTS assignedLocations (id INTEGER PRIMARY KEY AUTOINCREMENT, locationID TEXT NOT NULL, projectID TEXT)';
      else if(table == 'Areas' || table == 'Tasks')
        query = 'CREATE TABLE IF NOT EXISTS ' + `${table}` +'(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, _id TEXT, popularity INT, rating TEXT, numericID BIGINT, projectID TEXT, category TEXT, studyType INT, type INT)'; 
      else if(table == 'Elements')
        query = 'CREATE TABLE IF NOT EXISTS ' + `${table}` +'(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, _id TEXT, popularity INT, rating TEXT, numericID BIGINT, projectID TEXT, category TEXT, studyType INT, type INT, taskID TEXT , count INT , UNIQUE(_id, taskID) ON CONFLICT REPLACE)'; 
      else if(table == 'Study')
        query = 'CREATE TABLE IF NOT EXISTS ' + `${table}` +'(id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, projectID TEXT, studyStartTime BIGINT, studyEndTime BIGINT, customerID TEXT, locationID TEXT, userID TEXT, area TEXT)';
      else if(table == 'Study_Data')
        query = 'CREATE TABLE IF NOT EXISTS ' + `${table}` +'(id INTEGER PRIMARY KEY AUTOINCREMENT, task TEXT, element TEXT, rating INT,frequency INT, notes TEXT, photo TEXT, time BIGINT, startTime, endTime , duration, Study_Id INTEGER, FOREIGN KEY(Study_Id) REFERENCES Study(id))';   
      else if(table == 'Create_Area')
        query = 'CREATE TABLE IF NOT EXISTS ' + `${table}` +'(id INTEGER PRIMARY KEY AUTOINCREMENT, _id TEXT, name TEXT, projectID TEXT, addedby TEXT, id_of_addedby TEXT, status TEXT, date TEXT)';
      else if(table == 'Create_Task')
        query = 'CREATE TABLE IF NOT EXISTS ' + `${table}` +'(id INTEGER PRIMARY KEY AUTOINCREMENT, _id TEXT, name TEXT, projectID TEXT, addedby TEXT, id_of_addedby TEXT, status TEXT, date TEXT)';
      else if(table == 'Create_Element')
        query = 'CREATE TABLE IF NOT EXISTS ' + `${table}` +'(id INTEGER PRIMARY KEY AUTOINCREMENT, _id TEXT, name TEXT, type TEXT, rating TEXT, category TEXT,  efficiency_study NUMBER, activity_study NUMBER, role_study NUMBER, types TEXT, projectID TEXT, addedby TEXT, id_of_addedby TEXT, status TEXT, date TEXT, userAdded boolean)';  
      else if(table == 'Categories')
        query = 'CREATE TABLE IF NOT EXISTS ' + `${table}` +'(id INTEGER PRIMARY KEY AUTOINCREMENT, _id TEXT, name TEXT , studyType  INT)';
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
      query = 'INSERT INTO Projects (_id, name, logo, headoffice, customer_id, customer_name, rating) VALUES (? , ? , ? , ? , ?, ?, ?)';
    else if(table == 'Areas_IDs' || table == 'Elements_IDs')
      query = 'INSERT INTO ' + table + '(projectID , _id) VALUES (?, ?)';
    else if(table == 'Locations')
      query = 'INSERT INTO Locations (_id , projectID ,customer_id , locationname, addresslineone, addresslinetwo, addresslinethree, addresslinefour, addresslinefive, contactname, telephone, monday_time_from, tuesday_time_from, wednesday_time_from, thursday_time_from, friday_time_from, saturday_time_from, sunday_time_from, monday_time_to, tuesday_time_to, wednesday_time_to, thursday_time_to, friday_time_to, saturday_time_to, sunday_time_to) VALUES (? , ? , ? ,? , ? , ?, ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ?, ? , ? , ? , ? , ? , ? , ?)';  
    else if(table == 'assignedLocations')
      query = 'INSERT INTO assignedLocations (locationID , projectID) VALUES (? , ?)';
    else if(table == 'Areas' || table == 'Tasks')
      query = 'INSERT INTO ' + table + '(name, _id, popularity, rating, numericID, projectID, category, studyType ,type) VALUES (? , ?, ?, ?, ?, ?, ?, ?, ?)';
    else if(table == 'Elements')
      query = 'INSERT INTO ' + table + '(name, _id, popularity, rating, numericID, projectID, category, studyType ,type, taskID , count) VALUES (?, ?, ? , ?, ?, ?, ?, ?, ?, ?, ?)';
    else if(table == 'Study')
      query = 'INSERT INTO ' + table + '(title , projectID , studyStartTime , studyEndTime, customerID, locationID, userID, area) VALUES (? , ?, ? , ? , ? , ? ,? , ?)';           
    else if(table == 'Study_Data')
      query = 'INSERT INTO ' + table + '(task, element , rating, frequency, notes, photo, time, startTime, endTime , duration, Study_Id) VALUES (? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ?)';   
    else if(table == 'Create_Area' || table == 'Create_Task')
      query = 'INSERT INTO ' + table + '(_id ,name , projectID , addedby, id_of_addedby, status, date) VALUES (? , ? , ? , ?, ?, ?, ?)' ;
    else if(table == 'Create_Element')  
      query = 'INSERT INTO ' + table + '(_id ,name , type , rating , category  , efficiency_study , activity_study , role_study , projectID , addedby, id_of_addedby, status, date, userAdded )  VALUES (? , ? , ?  , ? , ?, ?, ?, ?, ? , ? , ? , ? , ?, ? )';
    else if(table == 'Categories')  
      query = 'INSERT INTO ' + table + '(_id , name, studyType) VALUES (? , ? , ?)';
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
      console.error('Error AT TABLE: '+ table + ' ' + JSON.stringify(err));
      return [];
    });
  }

  /* GETTING ELEMENTS, AREAS TO FETCH DATA  */
  getIDData(table, id): Promise<any> {
    let query = '';
    if(table == 'Areas' || table == 'Tasks')
      query = "SELECT * FROM " + `${table}` + " WHERE projectID=?";
    else if(table == 'Elements')
      query = "SELECT * FROM " + `${table}` + " WHERE taskID=?";  
    else if(table == 'Create_Area' || table == 'Create_Element')
      query = "SELECT * FROM " + `${table}` + " WHERE _id=?";
   else if(table == 'Study_Data')
      query = "SELECT * FROM " + `${table}` + " WHERE Study_Id=?";

    else if(table == 'OfflineElement'){
      
      if(id.indexOf('element') > -1 )
      table = 'Create_Element';
    else  
      table = 'Elements';
     
      query =  "SELECT * FROM " + `${table}` +" WHERE _id=?";
    }     
    else if(table == 'OfflineArea'){

      if(id.indexOf('area') > -1 )
        table = 'Create_Area';
      else  
        table = 'Areas';
      query =  "SELECT * FROM " + `${table}` +" WHERE _id=?";
    }      
    else if(table == 'OfflineTask'){

      if(id.indexOf('task') > -1 )
        table = 'Create_Task';
      else  
        table = 'Tasks';
      query =  "SELECT * FROM " + `${table}` +" WHERE _id=?";
    }          
   else
     query = "SELECT * FROM " + `${table}`  + " WHERE projectID=?";
    
    return new Promise((resolve, reject) => {
      this.database.executeSql(query, [id]).then((result) => {
        let data = [];
        if(result.rows.length > 0) 
          data = this.putDatainArray(table, result);
        resolve(data);
      }, err => {
        console.log('Error AT TABLE: '+ table + ' ' + JSON.stringify(err));
        reject(err);
      });
   }); 
 }

 getLikeData(table) {
    let query = "SELECT * FROM " + `${table}`  + " WHERE photo LIKE ?";   
    return new Promise((resolve, reject) => {
      this.database.executeSql(query, ['%file%']).then((result) => {
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

  /*  PUTTING ALL THE DATA IN ARRAY AND RETURNING IT BACK TO THE VIEW */
  putDatainArray(table, result){
    let data = [];
    for (let i = 0; i < result.rows.length; i++) {
          if(table == 'Projects')
            data.push(new Projects(result.rows.item(i)._id, result.rows.item(i).name, result.rows.item(i).logo , result.rows.item(i).headoffice  , result.rows.item(i).customer_id , result.rows.item(i).customer_name , result.rows.item(i).rating));
          else if(table == 'Locations')
            data.push({_id: result.rows.item(i)._id, projectID: result.rows.item(i).projectID, customer_id: result.rows.item(i).customer_id,locationname: result.rows.item(i).locationname , addresslineone : result.rows.item(i).addresslineone, addresslinetwo: result.rows.item(i).addresslinetwo ,  
                       addresslinethree: result.rows.item(i).addresslinethree,addresslinefour: result.rows.item(i).addresslinefour ,addresslinefive: result.rows.item(i).addresslinefive , contactname: result.rows.item(i).contactname, telephone: result.rows.item(i).telephone,
                       monday_time_from: result.rows.item(i).monday_time_from, tuesday_time_from: result.rows.item(i).tuesday_time_from, wednesday_time_from: result.rows.item(i).wednesday_time_from, thursday_time_from: result.rows.item(i).thursday_time_from,
                       friday_time_from: result.rows.item(i).friday_time_from, saturday_time_from: result.rows.item(i).saturday_time_from, sunday_time_from: result.rows.item(i).sunday_time_from,
                       monday_time_to: result.rows.item(i).monday_time_to, tuesday_time_to: result.rows.item(i).tuesday_time_to, wednesday_time_to: result.rows.item(i).wednesday_time_to, thursday_time_to: result.rows.item(i).thursday_time_to,
                       friday_time_to: result.rows.item(i).friday_time_to, saturday_time_to: result.rows.item(i).saturday_time_to, sunday_time_to: result.rows.item(i).sunday_time_to
                      });
          else if(table == 'assignedLocations')
            data.push(result.rows.item(i).locationID);
          else if(table == 'Areas' || table == 'Tasks')
            data.push({_id: result.rows.item(i)._id , name: result.rows.item(i).name, popularity: result.rows.item(i).popularity, projectID: result.rows.item(i).projectID});
          else if(table == 'Elements')
             data.push({_id: result.rows.item(i)._id ,name: result.rows.item(i).name , popularity: result.rows.item(i).popularity, rating: result.rows.item(i).rating,numericID: result.rows.item(i).numericID, 
                        projectID: result.rows.item(i).projectID , category: result.rows.item(i).category,studyType: result.rows.item(i).studyType, type: result.rows.item(i).type, taskID: result.rows.item(i).taskID, count: result.rows.item(i).count});
          else if(table == 'Create_Area' || table == 'Create_Task') 
            data.push({_id: result.rows.item(i)._id ,name: result.rows.item(i).name, projectID: result.rows.item(i).projectID, 
                       addedby: result.rows.item(i).addedby, id_of_addedby: result.rows.item(i).id_of_addedby, status: result.rows.item(i).status ,date: result.rows.item(i).date});  
           else if(table == 'Create_Element')
           data.push({_id: result.rows.item(i)._id , name: result.rows.item(i).name, efficiency_study: result.rows.item(i).efficiency_study,
                      activity_study: result.rows.item(i).activity_study ,role_study: result.rows.item(i).role_study,
                      type: result.rows.item(i).type, rating: result.rows.item(i).rating, category: result.rows.item(i).category, 
                      projectID: result.rows.item(i).projectID, addedby: result.rows.item(i).addedby, 
                      userId: result.rows.item(i).id_of_addedby, status: result.rows.item(i).status ,date: result.rows.item(i).date, userAdded: result.rows.item(i).userAdded});
          else if(table == 'Areas_IDs' || table == 'Elements_IDs')
            data.push(result.rows.item(i)._id);
          else if(table == 'Categories')
            data.push({ _id: result.rows.item(i)._id, name : result.rows.item(i).name, studyType: result.rows.item(i).studyType });
          else if(table == 'Study')
            data.push({id: result.rows.item(i).id, title: result.rows.item(i).title, projectID: result.rows.item(i).projectID, studyStartTime: result.rows.item(i).studyStartTime, studyEndTime: result.rows.item(i).studyEndTime, customerID: result.rows.item(i).customerID, locationID: result.rows.item(i).locationID, userID: result.rows.item(i).userID , role: result.rows.item(i).role, area : result.rows.item(i).area });
          else if(table == 'Study_Data')
            data.push({id: result.rows.item(i).id , task: result.rows.item(i).task , element: result.rows.item(i).element , rating: result.rows.item(i).rating ,frequency: result.rows.item(i).frequency , notes: result.rows.item(i).notes , photo: result.rows.item(i).photo , time: result.rows.item(i).time, startTime: result.rows.item(i).startTime, endTime: result.rows.item(i).endTime, duration: result.rows.item(i).duration, Study_Id: result.rows.item(i).Study_Id })
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
  
  addRow(table, data){
    let query = this.insertQuery(table);
    let row_data = [];
    return new Promise((resolve, reject) => {
      if(table == 'Study')
        row_data = this.dataforRow('Study', null, null);
      else
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
    const table2 = this.dropTable("Areas");
    const table3 = this.dropTable("Areas_IDs");
    const table4 = this.dropTable("Elements");
    const table5 = this.dropTable("Elements_IDs");
    const table6 = this.dropTable("Locations");
    const table7 = this.dropTable("Categories");
    const table8 = this.dropTable("assignedLocations")
    const table9 = this.dropTable("Tasks");

    // const table12 = this.dropTable("Create_Area");
    // const table13 = this.dropTable("Create_Element");
    // const table15 = this.dropTable("Study");
    // const table16 = this.dropTable("Study_Data");
    
    // const observableArray = [table1, table2, table3, table4, table5, table6, table7, table8, table9, table10, table11 , table12, table13, table14, table15, table16 ];
    const observableArray = [table1, table2, table3, table4, table5, table6, table7, table8, table9];
    return Observable.forkJoin(observableArray);
  } 

  /* UPDATING TABLE  */
  updateTable(table, column , data): Promise<any> {

    let query = null; let query_data = null;
    
    if(table == 'Areas' || table == 'Elements' || table == 'Tasks'){
      query = "UPDATE "+ `${table}` + " SET _id=? , name=? ,numericID=?  WHERE _id=?"
      query_data = [data._id, data.name , data.numericID , data.offline];
    }
    else if(table == 'Study_Data'){

      /* UPDATING OFFLINE DATA FROM OBSERVATION SUMMARY PAGE */
      if(data.element && data.rating && data.frequency){
        query = "UPDATE "+ `${table}` + " SET element=? , rating=?, frequency=?  WHERE id=?"

        query_data = [data.element, data.rating, data.frequency, data.id];
      }

      /* UPDATING OFFLINE DATA ON SYNCING */
      else{
        if(data.photo)
          query_data = [data.path, data.photo]; 
        else
          query_data = [data._id , data.offline];

        query = "UPDATE "+ `${table}` + " SET "+`${column}`+"=?   WHERE "+`${column}`+"=?"

      }
      
    }

    return this.database.executeSql(query, query_data).then(result => {
      return result;
    }).catch(error => {
      return error;
    });
  }
  /* DELETING RECORD FROM SQLITE TABLE */
  deleteRecord(table,data){
    let query = '';
    if(table == 'Study_Data')
      query = "DELETE FROM " + `${table}` + " WHERE id=?";
    else if(table == 'Elements')
      query =  "DELETE FROM " + `${table}` + " WHERE taskID=?";
    return this.database.executeSql(query, [data.id]).then(result => {
      return result;
    }).catch(error => {
      return error;
    }); 
      
  }
}
