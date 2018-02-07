import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';

/* COMPONENTS */
import { HeaderComponent } from './header/header';
import { TimerComponent } from './timer/timer';
import { NavMenuComponent } from './nav-menu/nav-menu';
import { NewTimerComponent } from './new-timer/new-timer';
import { ImgComponent } from './img/img';
import { InStudyHeaderComponent } from './in-study-header/in-study-header';
import { ProgressBarComponent } from './progress-bar/progress-bar';
import { InOneComponent } from './in-one/in-one';
import { PipesModule } from "../pipes/pipes.module";

@NgModule({
	declarations: [HeaderComponent , TimerComponent,
    NavMenuComponent,
    TimerComponent,
    NewTimerComponent,
    ImgComponent,
    InStudyHeaderComponent,
    ProgressBarComponent,
    InOneComponent
    ],
	imports: [IonicModule , PipesModule],
	exports: [HeaderComponent , TimerComponent,
    NavMenuComponent,
    TimerComponent,
    NewTimerComponent,
    ImgComponent,
    InStudyHeaderComponent,
    ProgressBarComponent,
    InOneComponent
    ]
})
export class ComponentsModule {}
