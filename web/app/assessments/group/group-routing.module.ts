import { NgModule }			from '@angular/core';
import { RouterModule, Routes }		from '@angular/router';

import { GroupComponent }		from './group.component';
//import { GradesTableComponent }		from './grades-table.component';

//import { CanDeactivateGuard }		from '../../can-deactivate-guard.service';

const groupRoutes: Routes = [
    {
	path: '',
	component: GroupComponent/*,
	children: [
	    {
                path: ':assessment_id',
                component: GradesTableComponent,
		canDeactivate: [CanDeactivateGuard]
            }
	]*/
    }
];

@NgModule({
    imports: [
	RouterModule.forChild(groupRoutes)
    ],
    exports: [
	RouterModule
    ]
})

export class GroupRoutingModule {}
