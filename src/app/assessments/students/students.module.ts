import { NgModule } 			from '@angular/core';

import { UtilsModule }			from '../../utils/utils.module';

import { CustomMaterialModule }         from '../../custom-material/custom-material.module';
import { StudentsRoutingModule }	from './students-routing.module';

import { StudentsComponent }		from './students.component';
import { StudentsListComponent }	from './students-list.component';
import { StudentDetailComponent }	from './student-detail.component';
import { StudentGradesChartComponent }	from './student-grades-chart.component';
import { StudentDeltasChartComponent }	from './student-deltas-chart.component';
import { StudentFailedChartComponent }	from './student-failed-chart.component';

@NgModule({
    imports: [
	UtilsModule,
	CustomMaterialModule,
	StudentsRoutingModule
    ],
    declarations: [
	StudentsComponent,
	StudentsListComponent,
	StudentDetailComponent,
	StudentGradesChartComponent,
	StudentDeltasChartComponent,
	StudentFailedChartComponent
    ]
})

export class StudentsModule {}
