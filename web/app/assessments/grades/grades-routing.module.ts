import { NgModule }			from '@angular/core';
import { RouterModule, Routes }		from '@angular/router';

import { GradesComponent }		from './grades.component';
import { GradesTableComponent }		from './grades-table.component';

const gradesRoutes: Routes = [
    {
	path: '',
	component: GradesComponent,
	children: [
	    {
                path: ':assessment_id',
                component: GradesTableComponent
            }
	]
    }
];

@NgModule({
    imports: [
	RouterModule.forChild(gradesRoutes)
    ],
    exports: [
	RouterModule
    ]
})

export class GradesRoutingModule {}
