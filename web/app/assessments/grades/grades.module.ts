import { NgModule } 			from '@angular/core';

import { UtilsModule }			from '../../utils/utils.module';

import { GradesComponent }		from './grades.component';
import { GradesTableComponent }		from './grades-table.component';

import { GradesRoutingModule }	from './grades-routing.module';

@NgModule({
    imports: [
	UtilsModule,
	GradesRoutingModule
    ],
    declarations: [
	GradesComponent,
	GradesTableComponent
    ]
})

export class GradesModule {}
