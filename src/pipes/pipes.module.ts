import { NgModule } from '@angular/core';
import { ReversePipe } from './../pipes/reverse/reverse';
import { SortPipe } from './sort/sort';
import { StudyItemsPipe } from './study-items/study-items';
@NgModule({
	declarations: [ReversePipe,
    SortPipe,
    StudyItemsPipe],
	imports: [],
	exports: [ReversePipe,
    SortPipe,
    StudyItemsPipe]
})
export class PipesModule {}
