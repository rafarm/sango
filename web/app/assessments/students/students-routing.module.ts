import { NgModule }			from '@angular/core';
import { RouterModule, Routes }		from '@angular/router';

import { StudentsComponent }		from './students.component';
import { StudentsListComponent }	from './students-list.component';

const studentsRoutes: Routes = [
    {
	path: '',
	component: StudentsComponent,
	children: [
	    {
                path: ':assessment_id',
                component: StudentsListComponent
            }
	]
    }
];

@NgModule({
    imports: [
	RouterModule.forChild(studentsRoutes)
    ],
    exports: [
	RouterModule
    ]
})

export class StudentsRoutingModule {}
