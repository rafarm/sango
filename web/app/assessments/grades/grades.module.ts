import { NgModule } 			from '@angular/core';

import { UtilsModule }			from '../../utils/utils.module';
import { AssessmentsDividerComponent }	from '../assessments-divider.component';

import { GradesComponent }		from './grades.component';
import { GradesTableComponent }		from './grades-table.component';

import { GradesRoutingModule }	from './grades-routing.module';

@NgModule({
    imports: [
	UtilsModule,
	AssessmentsDividerComponent,
	GradesRoutingModule
    ],
    declarations: [
	GradesComponent,
	GradesTableComponent
    ]
})

export class GradesModule {}
