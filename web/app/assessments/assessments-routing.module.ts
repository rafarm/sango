import { NgModule }			from '@angular/core';
import { RouterModule, Routes }		from '@angular/router';

import { AssessmentsComponent }		from './assessments.component';
//import { AssessmentSelectorComponent }	from './assessment-selector.component';

const assessmentsRoutes: Routes = [
    {
	path: 'assessments',
	component: AssessmentsComponent/*,
	children: [
	    {
		path: '',
		component: AssessmentSelectorComponent
	    }
	]*/
    }
];

@NgModule({
    imports: [
	RouterModule.forChild(assessmentsRoutes)
    ],
    exports: [
	RouterModule
    ]
})

export class AssessmentsRoutingModule {}
