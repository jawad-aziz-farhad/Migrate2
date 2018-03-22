import { NgModule } from '@angular/core';
import { ReversePipe } from './../pipes/reverse/reverse';
import { SortPipe } from './sort/sort';
import { StudyItemsPipe } from './study-items/study-items';
import { OrderPipe } from './order/order';
import { SearchPipe } from './search/search';
@NgModule({
	declarations: [ReversePipe,
    SortPipe,
    StudyItemsPipe,
    OrderPipe,
    SearchPipe],
	imports: [],
	exports: [ReversePipe,
    SortPipe,
    StudyItemsPipe,
    OrderPipe,
    SearchPipe]
})
export class PipesModule {}
