import { NgModule } 			from '@angular/core';

import { UtilsModule }			from '../../utils/utils.module';
//import { CoreModule }			from '../../core/core.module';

import { StudentsRoutingModule }	from './students-routing.module';

import { StudentsComponent }		from './students.component';
//import { GroupChartsComponent }		from './group-charts.component';

@NgModule({
    imports: [
	UtilsModule,
	StudentsRoutingModule
    ],
    declarations: [
	StudentsComponent
	//GroupChartsComponent,
    ]
})

export class StudentsModule {}
