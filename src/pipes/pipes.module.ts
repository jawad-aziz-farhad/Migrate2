import { NgModule } from '@angular/core';
import { ReversePipe } from './../pipes/reverse/reverse';
import { SortPipe } from './sort/sort';
import { StudyItemsPipe } from './study-items/study-items';
import { OrderPipe } from './order/order';
@NgModule({
	declarations: [ReversePipe,
    SortPipe,
    StudyItemsPipe,
    OrderPipe],
	imports: [],
	exports: [ReversePipe,
    SortPipe,
    StudyItemsPipe,
    OrderPipe]
})
export class PipesModule {}
