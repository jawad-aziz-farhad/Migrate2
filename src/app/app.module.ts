/* MODULES */
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { Http, HttpModule, RequestOptions  } from "@angular/http";
import { FormsModule } from '@angular/forms';
import { ComponentsModule } from "../components/components.module";
import { DirectivesModule } from "../directives/directives.module";
import { PipesModule } from "../pipes/pipes.module";
import { ProgressHttpModule } from "angular-progress-http";

import { MyApp } from './app.component';

/* PAGES */
import { LoginPage } from '../pages/login/login';
import { ResetpassPage } from '../pages/resetpass/resetpass';
import { ResetsuccessPage } from '../pages/resetsuccess/resetsuccess';
import { CreateElementPage } from '../pages/create-element/create-element';
import { CreateRolePage } from '../pages/create-role/create-role';
import { CreateAreaPage } from '../pages/create-area/create-area';
import { CreateTaskPage } from '../pages/create-task/create-task';
import { AreasPage } from '../pages/areas/areas';
import { AreaDetailPage } from '../pages/area-detail/area-detail';
import { ProjectsPage } from '../pages/projects/projects';
import { ResetPasswordPage } from '../pages/reset-password/reset-password';
import { SelectAreaPage } from '../pages/select-area/select-area';
import { SelectElementPage } from '../pages/select-element/select-element';
import { SelectRolePage } from '../pages/select-role/select-role';
import { SelectTaskPage } from '../pages/select-task/select-task';
import { RatingsPage } from '../pages/ratings/ratings';
import { EnterRatingPage } from '../pages/enter-rating/enter-rating';
import { StudyNotesPage } from '../pages/study-notes/study-notes';
import { StudyPhotoPage } from '../pages/study-photo/study-photo';
import { AddFrequencyPage} from '../pages/add-frequency/add-frequency';
import { ObservationSummaryPage } from '../pages/observation-summary/observation-summary';
import { StudyItemsPage } from '../pages/study-items/study-items';
import { SubmitDataProgressPage } from '../pages/submit-data-progress/submit-data-progress';
import { OfflineStudyDataPage } from '../pages/offline-study-data/offline-study-data';
import { AboutPage } from '../pages/about/about';
import { ReportProblemPage } from '../pages/report-problem/report-problem';
import { HelpPage } from '../pages/help/help';
import { SettingsPage } from '../pages/settings/settings';
import { PrivacyPolicyPage } from '../pages/privacy-policy/privacy-policy';
import { TermsOfServicesPage } from '../pages/terms-of-services/terms-of-services';
import { PopOverPage } from '../pages/pop-over/pop-over';

/* PROVIDERS  */
import { AuthProvider } from '../providers/auth/auth';
import { HeadersProvider } from '../providers/headers/headers';
import { ToastProvider } from '../providers/toast/toast';
import { LoaderProvider } from '../providers/loader/loader';
import { AlertProvider } from '../providers/alert/alert';
import { OperationsProvider } from '../providers/operations/operations';
import { ParseDataProvider } from '../providers/parse-data/parse-data';
import { NetworkProvider } from '../providers/network/network';
import { Time } from '../providers/time/time';
import { SqlDbProvider } from '../providers/sql-db/sql-db';
import { FormBuilderProvider } from '../providers/form-builder/form-builder';
import { ParserProvider } from '../providers/parser/parser';
import { Sync } from '../providers/sync/sync';

import { JwtHelper, AuthConfig, AuthHttp } from "angular2-jwt";
import { CustomFormsModule } from 'ng2-validation'

/*PLUGINS */
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage, IonicStorageModule } from "@ionic/storage";
import { Deeplinks } from '@ionic-native/deeplinks';
import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { FileTransfer, FileTransferObject, } from '@ionic-native/file-transfer';
import { SQLite } from '@ionic-native/sqlite';
import { Network } from '@ionic-native/network';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { Keyboard } from '@ionic-native/keyboard';

export function authHttpServiceFactory(http: Http, options: RequestOptions, storage: Storage) {
  const authConfig = new AuthConfig({
    tokenGetter: (() => storage.get('jwt')),
  });
  return new AuthHttp(authConfig, http, options);
}

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    ResetpassPage,
    ResetsuccessPage,  
    CreateAreaPage,
    CreateElementPage,
    CreateRolePage,
    CreateTaskPage,
    AreasPage,
    AreaDetailPage,
    ProjectsPage,
    ResetPasswordPage,
    SelectAreaPage,
    SelectElementPage,
    SelectRolePage,
    SelectTaskPage,
    StudyNotesPage,
    StudyPhotoPage,
    RatingsPage,
    EnterRatingPage,
    AddFrequencyPage,
    ObservationSummaryPage,
    StudyItemsPage,
    SubmitDataProgressPage,
    OfflineStudyDataPage,
    AboutPage,
    ReportProblemPage,
    HelpPage,
    SettingsPage,
    PrivacyPolicyPage,
    TermsOfServicesPage,
    PopOverPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot({
      name: 'reTime',
      driverOrder: ['sqlite', 'indexeddb', 'websql']
    }),
    CustomFormsModule,
    HttpModule,
    FormsModule,
    ComponentsModule,
    DirectivesModule,
    PipesModule,
    ProgressHttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    ResetpassPage,
    ResetsuccessPage,
    CreateAreaPage,
    CreateElementPage,
    CreateRolePage,
    CreateTaskPage,
    AreasPage,
    AreaDetailPage,
    ProjectsPage,
    ResetPasswordPage,
    SelectAreaPage,
    SelectElementPage,
    SelectTaskPage,
    SelectRolePage,
    StudyNotesPage,
    StudyPhotoPage,
    RatingsPage,
    EnterRatingPage,
    AddFrequencyPage,
    ObservationSummaryPage,
    StudyItemsPage,
    SubmitDataProgressPage,
    OfflineStudyDataPage,
    AboutPage,
    ReportProblemPage,
    HelpPage,
    SettingsPage,
    PrivacyPolicyPage,
    TermsOfServicesPage,
    PopOverPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Deeplinks,
    Camera,
    File,
    FilePath,
    FileTransfer ,
    FileTransferObject,
    SQLite,
    Network,
    ScreenOrientation,
    Keyboard,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthProvider,
    HeadersProvider,
    LoaderProvider,
    NetworkProvider,
    Time,
    JwtHelper, {
      provide: AuthHttp,
      useFactory: authHttpServiceFactory,
      deps: [Http, RequestOptions, Storage]
    },
    ToastProvider,
    AlertProvider,
    OperationsProvider,
    ParseDataProvider,
    SqlDbProvider,
    FormBuilderProvider,
    ParserProvider,
    Sync
  ]
})
export class AppModule {}
