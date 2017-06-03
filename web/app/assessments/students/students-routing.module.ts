import { NgModule }			from '@angular/core';
import { RouterModule, Routes }		from '@angular/router';

import { StudentsComponent }		from './students.component';
//import { GroupChartsComponent }		from './group-charts.component';

//import { CanDeactivateGuard }		from '../../can-deactivate-guard.service';

const studentsRoutes: Routes = [
    {
	path: '',
	component: StudentsComponent/*,
	children: [
	    {
                path: ':assessment_id',
                component: GroupChartsComponent
            }
	]*/
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
