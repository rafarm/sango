import { NgModule }			from '@angular/core';
import { RouterModule, Routes }		from '@angular/router';

import { AssessmentsComponent }		from './assessments.component';
import { AssessmentSelectorComponent }	from './assessment-selector.component';

import { GradesModule }			from './grades/grades.module';

const assessmentsRoutes: Routes = [
    {
	path: 'assessments',
	component: AssessmentsComponent,
	children: [
	    {
                path: '',
                component: AssessmentSelectorComponent
            },
	    {
                path: ':group_id',
                component: AssessmentSelectorComponent,
		children: [
		    {
			path: 'grades',
			loadChildren: () => GradesModule
		    }
		]
            }
	    /*{
		path: ':course_id',
		redirectTo: ':course_id/grades',
		pathMatch: 'prefix'
	    }*/
	]
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
