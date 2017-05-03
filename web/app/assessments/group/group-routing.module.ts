import { NgModule }			from '@angular/core';
import { RouterModule, Routes }		from '@angular/router';

import { GroupComponent }		from './group.component';
import { GroupChartsComponent }		from './group-charts.component';

//import { CanDeactivateGuard }		from '../../can-deactivate-guard.service';

const groupRoutes: Routes = [
    {
	path: '',
	component: GroupComponent,
	children: [
	    {
                path: ':assessment_id',
                component: GroupChartsComponent
            }
	]
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
