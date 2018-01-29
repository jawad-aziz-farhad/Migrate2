import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FilterRolesPage } from './filter-roles';

@NgModule({
  declarations: [
    FilterRolesPage,
  ],
  imports: [
    IonicPageModule.forChild(FilterRolesPage),
  ],
})
export class FilterRolesPageModule {}
