import { NgModule } 			from '@angular/core';

import { UtilsModule }			from '../../utils/utils.module';
//import { CoreModule }			from '../../core/core.module';

import { StudentsRoutingModule }	from './students-routing.module';

import { StudentsComponent }		from './students.component';
import { StudentsListComponent }	from './students-list.component';
import { StudentDetailComponent }	from './student-detail.component';

@NgModule({
    imports: [
	UtilsModule,
	StudentsRoutingModule
    ],
    declarations: [
	StudentsComponent,
	StudentsListComponent,
	StudentDetailComponent
    ]
})

export class StudentsModule {}
