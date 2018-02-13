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
        _data = [data[index]._id, data[index].name, data[index].customer.userimage, data[index].locations[0].location , data[index].customer._id , data[index].customer.name];      
      else if(table == 'Locations')
        _data = [data[index]._id ,data[index].customer_id , data[index].locationname, data[index].addresslineone, data[index].addresslinetwo, data[index].addresslinethree, data[index].addresslinefour, data[index].addresslinefive, data[index].contactname, data[index].telephone,
                this.pad(data[index].monday_time.openinghour) + ' - ' + this.pad(data[index].monday_time.openingminute) + ' ' + this.isValueAvailable(data[index].monday_time.openingtimeformat)  , 
                this.pad(data[index].tuesday_time.openinghour) + ' - ' + this.pad(data[index].tuesday_time.openingminute) + ' ' + this.isValueAvailable(data[index].tuesday_time.openingtimeformat), 
                this.pad(data[index].wednesday_time.openinghour) + ' - ' + this.pad(data[index].wednesday_time.openingminute) + ' ' + this.isValueAvailable(data[index].wednesday_time.openingtimeformat), 
                this.pad(data[index].thursday_time.openinghour) + ' - ' + this.pad(data[index].thursday_time.openingminute) + ' ' + this.isValueAvailable(data[index].thursday_time.openingtimeformat), 
                this.pad(data[index].friday_time.openinghour) + ' - ' + this.pad(data[index].friday_time.openingminute) + ' ' + this.isValueAvailable(data[index].friday_time.openingtimeformat),
                this.pad(data[index].saturday_time.openinghour) + ' - ' + this.pad(data[index].saturday_time.openingminute) + ' ' + this.isValueAvailable(data[index].saturday_time.openingtimeformat),
                this.pad(data[index].sunday_time.openinghour) + ' - ' + this.pad(data[index].sunday_time.openingminute) + ' ' + this.isValueAvailable(data[index].sunday_time.openingtimeformat),
              
                this.pad(data[index].monday_time.closinghour) + ' - ' + this.pad(data[index].monday_time.closingminute) + ' ' + this.isValueAvailable(data[index].monday_time.closingtimeformat)  , 
                this.pad(data[index].tuesday_time.closinghour) + ' - ' + this.pad(data[index].tuesday_time.closingminute) + ' ' + this.isValueAvailable(data[index].tuesday_time.closingtimeformat), 
                this.pad(data[index].wednesday_time.closinghour) + ' - ' + this.pad(data[index].wednesday_time.closingminute) + ' ' + this.isValueAvailable(data[index].wednesday_time.closingtimeformat), 
                this.pad(data[index].thursday_time.closinghour) + ' - ' + this.pad(data[index].thursday_time.closingminute) + ' ' + this.isValueAvailable(data[index].thursday_time.closingtimeformat), 
                this.pad(data[index].friday_time.closinghour) + ' - ' + this.pad(data[index].friday_time.closingminute) + ' ' + this.isValueAvailable(data[index].friday_time.closingtimeformat),
                this.pad(data[index].saturday_time.closinghour) + ' - ' + this.pad(data[index].saturday_time.closingminute) + ' ' + this.isValueAvailable(data[index].saturday_time.closingtimeformat),
                this.pad(data[index].sunday_time.closinghour) + ' - ' + this.pad(data[index].sunday_time.closingminute) + ' ' + this.isValueAvailable(data[index].sunday_time.closingtimeformat)
              ]
      else if(table == 'Areas_IDs'  || table == 'Roles_IDs' || table == 'Elements_IDs')        
        _data = [data[index].project_id, data[index]._id];     
      else if(table == 'Areas')
        _data = [data[index].areaname, data[index]._id , data[index].popularity_number, null , null , data[index].project_id];
      else if(table == 'Create_Area')
        _data = [data[index]._id, data[index].areaname, data[index].areatype , data[index].id_of_project, data[index].addedby , data[index].id_of_addedby , data[index].status, data[index].dateadded];   
      else if(table == 'Roles') 
        _data = [data[index].rolename, data[index]._id , data[index].popularity_number, null , null ,data[index].project_id]; 
      else if(table == 'Create_Role')
        _data = [data[index]._id, data[index].rolename, data[index].position , data[index].id_of_project, data[index].addedby , data[index].id_of_addedby , data[index].status, data[index].dateadded];   
      else if(table == 'Elements')
        _data = [data[index].description, data[index]._id , data[index].popularity_number, data[index].rating, data[index].id,  data[index].project_id];
      else if(table == 'Create_Element')
        _data = [data[index]._id, data[index].description, data[index].element_type , data[index].rating , data[index].category , data[index].popularity_number , data[index].types , data[index].id_of_project , data[index].addedby , data[index].id_of_addedby , data[index].status, data[index].dateadded];
      else if(table == 'Study')
        _data = [this.parser.geAllData().getTitle() , this.parser.geAllData().getCustomer()._id ,this.parser.geAllData().getSutdyStartTime(), this.parser.geAllData().getSutdyEndTime()];
      else if(table == 'Study_Data'){
        _data = [data[index].role._id , data[index].area._id , data[index].element._id , data[index].rating , data[index].frequency , data[index].notes ,data[index].photo ,  data[index].observationTime, this.parser.geAllData().getRoundData()[this.studyDataIndex].roundStartTime , this.parser.geAllData().getRoundData()[this.studyDataIndex].roundEndTime, this.studyID];  
      } 
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
      else if(table == 'Areas_IDs'  || table == 'Roles_IDs' || table == 'Elements_IDs')
        query = 'CREATE TABLE IF NOT EXISTS ' + `${table}` +'(id INTEGER PRIMARY KEY AUTOINCREMENT, project_id TEXT, _id TEXT)';
      else if(table == 'Locations')
        query = 'CREATE TABLE IF NOT EXISTS Locations(id INTEGER PRIMARY KEY AUTOINCREMENT, _id TEXT NOT NULL UNIQUE, customer_id TEXT , locationname TEXT, addresslineone TEXT , addresslinetwo TEXT , addresslinethree TEXT , addresslinefour TEXT , addresslinefive TEXT , contactname TEXT , telephone TEXT, monday_time_from TEXT, tuesday_time_from TEXT, wednesday_time_from TEXT, thursday_time_from TEXT, friday_time_from TEXT, saturday_time_from TEXT, sunday_time_from TEXT,monday_time_to TEXT, tuesday_time_to TEXT, wednesday_time_to TEXT, thursday_time_to TEXT, friday_time_to TEXT, saturday_time_to TEXT, sunday_time_to TEXT )';  
      else if(table == 'Areas' || table == 'Roles' || table == 'Elements')
        query = 'CREATE TABLE IF NOT EXISTS ' + `${table}` +'(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT, _id TEXT, popularity_number INT, rating TEXT, element_id BIGINT, project_id)'; 
      else if(table == 'Study')
        query = 'CREATE TABLE IF NOT EXISTS ' + `${table}` +'(id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, project_id TEXT, studyStartTime BIGINT, studyEndTime BIGINT)';
      else if(table == 'Study_Data')
        query = 'CREATE TABLE IF NOT EXISTS ' + `${table}` +'(id INTEGER PRIMARY KEY AUTOINCREMENT, roundStartTime BIGINT, roundEndTime BIGINT, role TEXT, area TEXT, element TEXT, rating INT,frequency INT, notes TEXT, photo TEXT, observationTime BIGINT, Study_Id TEXT, FOREIGN KEY(Study_Id) REFERENCES Study(id))';   
      else if(table == 'Create_Role')
        query = 'CREATE TABLE IF NOT EXISTS ' + `${table}` +'(id INTEGER PRIMARY KEY AUTOINCREMENT, _id TEXT, rolename TEXT, position TEXT, id_of_project TEXT, addedby TEXT, id_of_addedby TEXT, status TEXT, dateadded TEXT)';
      else if(table == 'Create_Area')
        query = 'CREATE TABLE IF NOT EXISTS ' + `${table}` +'(id INTEGER PRIMARY KEY AUTOINCREMENT, _id TEXT, areaname TEXT, areatype TEXT, id_of_project TEXT, addedby TEXT, id_of_addedby TEXT, status TEXT, dateadded TEXT)';
      else if(table == 'Create_Element')
        query = 'CREATE TABLE IF NOT EXISTS ' + `${table}` +'(id INTEGER PRIMARY KEY AUTOINCREMENT, _id TEXT, description TEXT, element_type TEXT, rating TEXT, category TEXT, popularity_number TEXT, types TEXT, id_of_project TEXT, addedby TEXT, id_of_addedby TEXT, status TEXT, dateadded TEXT)';  
      
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
    else if(table == 'Areas_IDs'  || table == 'Roles_IDs' || table == 'Elements_IDs')
      query = 'INSERT INTO ' + table + '(project_id , _id) VALUES (?, ?)';
    else if(table == 'Locations')
      query = 'INSERT INTO Locations (_id , customer_id , locationname, addresslineone, addresslinetwo, addresslinethree, addresslinefour, addresslinefive, contactname, telephone, monday_time_from, tuesday_time_from, wednesday_time_from, thursday_time_from, friday_time_from, saturday_time_from, sunday_time_from, monday_time_to, tuesday_time_to, wednesday_time_to, thursday_time_to, friday_time_to, saturday_time_to, sunday_time_to) VALUES (? , ? ,? , ? , ?, ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ?, ? , ? , ? , ? , ? , ? , ?)';  
    else if(table == 'Areas' || table == 'Roles' || table == 'Elements')
      query = 'INSERT INTO ' + table + '(name, _id, popularity_number, rating, element_id, project_id) VALUES (?, ?, ?, ?, ?, ?)';
    else if(table == 'Study')
      query = 'INSERT INTO ' + table + '(title , project_id , studyStartTime , studyEndTime) VALUES (? , ? , ? , ?)';           
    else if(table == 'Study_Data')
      query = 'INSERT INTO ' + table + '(role, area, element , rating, frequency, notes, photo, observationTime, roundStartTime, roundEndTime, Study_Id) VALUES (? , ? , ? , ? , ? , ? , ? , ? , ? , ?, ?)';   
    else if(table == 'Create_Role')
      query = 'INSERT INTO ' + table + '(_id ,rolename , position, id_of_project , addedby, id_of_addedby, status, dateadded) VALUES (? , ? , ? , ? , ?, ?, ?, ?)' ;
    else if(table == 'Create_Area')
      query = 'INSERT INTO ' + table + '(_id ,areaname , areatype, id_of_project , addedby, id_of_addedby, status, dateadded) VALUES (? , ? , ? , ? , ?, ?, ?, ?)' ;
    else if(table == 'Create_Element')  
      query = 'INSERT INTO ' + table + '(_id ,description , element_type , rating , category , popularity_number , types , id_of_project , addedby, id_of_addedby, status, dateadded)  VALUES (? , ?  , ? , ?, ?, ?, ?, ? , ? , ? , ? , ?)';
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
    if(table == 'Locations')
      query = "SELECT * FROM " + `${table}` + " WHERE customer_id=?"
    else if(table == 'Areas' || table == 'Elements' || table == 'Roles')
      query = "SELECT * FROM " + `${table}` + " WHERE project_id=?";
    else if(table == 'Create_Area' || table == 'Create_Element' || table == 'Create_Role')
      query = "SELECT * FROM " + `${table}` + " WHERE _id=?";
    else
     query = "SELECT * FROM " + `${table}`  + " WHERE project_id=?";
     
    return this.database.executeSql(query, [id]).then((result) => {
      let data = [];
      if (result.rows.length > 0) 
          data = this.putDatainArray(table, result);
      return data;
    }, err => {
      console.log('Error AT TABLE: '+ table + ' ' + JSON.stringify(err));
      return [];
    });
  }


  putDatainArray(table, result){
    let data = [];
    for (let i = 0; i < result.rows.length; i++) {
          if(table == 'Projects')
            data.push(new Projects(result.rows.item(i)._id, result.rows.item(i).name, result.rows.item(i).logo , result.rows.item(i).headoffice  , result.rows.item(i).customer_id , result.rows.item(i).customer_name ));
          else if(table == 'Areas_IDs'  || table == 'Roles_IDs' || table == 'Elements_IDs')
            data.push({ project_id: result.rows.item(i).project_id, _id:  result.rows.item(i)._id});
          else if(table == 'Locations')
            data.push({_id: result.rows.item(i)._id, customer_id: result.rows.item(i).customer_id,locationname: result.rows.item(i).locationname , addresslineone : result.rows.item(i).addresslineone, addresslinetwo: result.rows.item(i).addresslinetwo ,  
                       addresslinethree: result.rows.item(i).addresslinethree,addresslinefour: result.rows.item(i).addresslinefour ,addresslinefive: result.rows.item(i).addresslinefive , contactname: result.rows.item(i).contactname, telephone: result.rows.item(i).telephone,
                       monday_time_from: result.rows.item(i).monday_time_from, tuesday_time_from: result.rows.item(i).tuesday_time_from, wednesday_time_from: result.rows.item(i).wednesday_time_from, thursday_time_from: result.rows.item(i).thursday_time_from,
                       friday_time_from: result.rows.item(i).friday_time_from, saturday_time_from: result.rows.item(i).saturday_time_from, sunday_time_from: result.rows.item(i).sunday_time_from,
                       monday_time_to: result.rows.item(i).monday_time_to, tuesday_time_to: result.rows.item(i).tuesday_time_to, wednesday_time_to: result.rows.item(i).wednesday_time_to, thursday_time_to: result.rows.item(i).thursday_time_to,
                       friday_time_to: result.rows.item(i).friday_time_to, saturday_time_to: result.rows.item(i).saturday_time_to, sunday_time_to: result.rows.item(i).sunday_time_to
                      });
          else if(table == 'Areas')
            data.push({_id: result.rows.item(i)._id , areaname: result.rows.item(i).name, popularity_number: result.rows.item(i).popularity_number, project_id: result.rows.item(i).project_id});
          else if(table == 'Roles') 
             data.push({_id: result.rows.item(i)._id, rolename: result.rows.item(i).name, popularity_number: result.rows.item(i).popularity_number, project_id: result.rows.item(i).project_id}); 
          else if(table == 'Elements')
             data.push({_id: result.rows.item(i)._id ,description: result.rows.item(i).name , popularity_number: result.rows.item(i).popularity_number, rating: result.rows.item(i).rating,element_id: result.rows.item(i).element_id, project_id: result.rows.item(i).project_id});
          else if(table == 'Study')
              data.push({id: result.rows.item(i).id, title: result.rows.item(i).title, project_id: result.rows.item(i).project_id, studyStartTime: result.rows.item(i).studyStartTime, studyEndTime: result.rows.item(i).studyEndTime});
          else if(table == 'Study_Data')
            data.push({roundStartTime: result.rows.item(i).roundStartTime ,roundEndTime: result.rows.item(i).roundEndTime , role: result.rows.item(i).role, area: result.rows.item(i).area ,element: result.rows.item(i).element , rating: result.rows.item(i).rating ,frequency: result.rows.item(i).frequency , notes: result.rows.item(i).notes , photo: result.rows.item(i).photo , observationTime: result.rows.item(i).observationTime, Study_Id: result.rows.item(i).Study_Id })
          else if(table == 'Create_Role')
            data.push({_id: result.rows.item(i)._id , rolename: result.rows.item(i).rolename, position: result.rows.item(i).position , id_of_project: result.rows.item(i).id_of_project, addedby: result.rows.item(i).addedby, id_of_addedby: result.rows.item(i).id_of_addedby, status: result.rows.item(i).status ,dateadded: result.rows.item(i).dateadded});
          else if(table == 'Create_Area') 
            data.push({_id: result.rows.item(i)._id ,areaname: result.rows.item(i).areaname, areatype: result.rows.item(i).areatype, id_of_project: result.rows.item(i).id_of_project, 
                       addedby: result.rows.item(i).addedby, id_of_addedby: result.rows.item(i).id_of_addedby, status: result.rows.item(i).status ,dateadded: result.rows.item(i).dateadded});  
           else if(table == 'Create_Element')
           data.push({_id: result.rows.item(i)._id , description: result.rows.item(i).description, types: result.rows.item(i).types,
                      element_type: result.rows.item(i).element_type, rating: result.rows.item(i).rating, category: result.rows.item(i).category, 
                      popularity_number: 0, id_of_project: result.rows.item(i).id_of_project, addedby: result.rows.item(i).addedby, 
                      userId: result.rows.item(i).id_of_addedby, status: result.rows.item(i).status ,dateadded: result.rows.item(i).dateadded});
          else if(table == 'Areas_IDs'  || table == 'Roles_IDs' || table == 'Elements_IDs')
            data.push(result.rows.item(i)._id);
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

   /* ADDING IDs to  */
   addingIDs(table, data) {
    let query = this.insertQuery(table);
    return new Promise((resolve, reject) => {
      for(let i = 0; i < data.length; i++) {
            let item = data[i];
            let loopFor = this.loopFor(table,item);
            
            $(loopFor).each((index, sub_item) => {
              let row_data = [item._id , sub_item];
              console.log(query + '\n\n' + JSON.stringify(row_data));
              this.database.executeSql(query, row_data).then(result => {
                console.log('RECORD ADDED: '+JSON.stringify(result));
              }, err => {
                console.error('Error: '+ JSON.stringify(err));
                reject(err);
              });
            });
           
        }
        resolve(true);
    });
  }

  loopFor(table, data) {
      let array = [];
      if(table == 'Areas_IDs')
        array = data.areas;
      else if(table == 'Roles_IDs')
        array = data.roles;
      else  if(table == 'Elements_IDs')
        array = data.elements;

      return array;
    }

  /* GETTING OFFLINE DATA FOR SPECIFIC ID */  
  getOfflineStudyData(studyId) {
    let query = "SELECT * FROM Study join Study_Data on Study.id=Study_Data.Study_Id join Projects on Projects._id=Study.project_id Where Study.id=" +`${studyId}`;
    return new Promise((resolve, reject) => {
      this.database.executeSql(query, []).then((result) => {
        let data = [];
        if (result.rows.length > 0) {
          for (let i = 0; i < result.rows.length; i++) {
            data.push({ id: result.rows.item(i).id, title: result.rows.item(i).title, project_id: result.rows.item(i).project_id, studyStartTime: result.rows.item(i).studyStartTime, studyEndTime: result.rows.item(i).studyEndTime,
                        roundStartTime: result.rows.item(i).roundStartTime ,roundEndTime: result.rows.item(i).roundEndTime , role: result.rows.item(i).role, area: result.rows.item(i).area ,element: result.rows.item(i).element , 
                        rating: result.rows.item(i).rating ,frequency: result.rows.item(i).frequency , notes: result.rows.item(i).notes , photo: result.rows.item(i).photo , observationTime: result.rows.item(i).observationTime, 
                        customer: new Projects(result.rows.item(i)._id, result.rows.item(i).name, result.rows.item(i).logo , result.rows.item(i).headoffice  , result.rows.item(i).customer_id , result.rows.item(i).customer_name )
            });    
          }
        }
        else
          console.log('NO DATA')
        
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
        row_data = [data.project_id, data._id];
        this.database.executeSql(query, row_data).then(result => {
          resolve(true);
        }, err => {
          console.error('Error: '+ JSON.stringify(err));
          reject(err);
        });
    });
    
  }

 
  deleteDB(): Observable<any> {
    return new Observable((observer) => {
     this.platform.ready().then(() => {
       this.sqlite.deleteDatabase(this.config)
       .then((db: SQLiteObject) => {
           observer.next(db);
           observer.complete();
       }).catch(error => {
         observer.next(error);
         observer.complete();
       });
    });
     
   });
  }


  updateTable(table, column, data): Promise<any>{
    let query = "UPDATE "+ `${table}` + " SET " + `${column}` + "=? WHERE "+ `${column}` +"=?"
    return this.database.executeSql(query,[data.live, data.offline]).then(result => {
      return result;
    }).catch(error => {
      return error;
    });
  }
}
