import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FilterElementsPage } from './filter-elements';

@NgModule({
  declarations: [
    FilterElementsPage,
  ],
  imports: [
    IonicPageModule.forChild(FilterElementsPage),
  ],
})
export class FilterElementsPageModule {}
