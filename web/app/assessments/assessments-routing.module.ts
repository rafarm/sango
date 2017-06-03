import { NgModule }			from '@angular/core';
import { RouterModule, Routes }		from '@angular/router';

import { AssessmentsComponent }		from './assessments.component';
import { AssessmentSelectorComponent }	from './assessment-selector.component';

import { GradesModule }			from './grades/grades.module';
import { GroupModule }			from './group/group.module';
import { StudentsModule }		from './students/students.module';

const assessmentsRoutes: Routes = [
    {
	path: 'assessments',
	component: AssessmentsComponent,
	children: [
	    {
                path: '',
		redirectTo: '-1/-1/-1',
		pathMatch: 'full'
            },
	    {
		path: ':year',
		redirectTo: ':year/-1/-1',
                pathMatch: 'full'
	    },
	    {
		path: ':year/:course_id',
		redirectTo: ':year/:course_id/-1',
                pathMatch: 'full'
	    },
	    {
                path: ':year/:course_id/:group_id',
                component: AssessmentSelectorComponent,
		children: [
		    {
			path: 'grades',
			loadChildren: () => GradesModule
		    },
		    {
			path: 'group',
			loadChildren: () => GroupModule
		    },
		    {
			path: 'students',
			loadChildren: () => StudentsModule
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
