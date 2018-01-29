import { NgModule } from '@angular/core';
import { ReversePipe } from './../pipes/reverse/reverse';
import { SortPipe } from './sort/sort';
@NgModule({
	declarations: [ReversePipe,
    SortPipe],
	imports: [],
	exports: [ReversePipe,
    SortPipe]
})
export class PipesModule {}
