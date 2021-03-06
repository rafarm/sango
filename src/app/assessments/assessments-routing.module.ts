import { NgModule }			from '@angular/core';
import { RouterModule, Routes }		from '@angular/router';

import { AssessmentsComponent }		from './assessments.component';
import { AssessmentSelectorComponent }	from './assessment-selector.component';

import { GradesModule }			from './grades/grades.module';
import { GroupModule }			from './group/group.module';
import { StudentsModule }		from './students/students.module';

/*
export function gradesModule() {
	return GradesModule;
}

export function groupModule() {
	return GroupModule;
}

export function studentsModule() {
	return StudentsModule;
}
*/

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
			//loadChildren: gradesModule
			loadChildren: 'app/assessments/grades/grades.module#GradesModule'
		    },
		    {
			path: 'group',
			//loadChildren: groupModule
			loadChildren: 'app/assessments/group/group.module#GroupModule'
		    },
		    {
			path: 'students',
			//loadChildren: studentsModule
			loadChildren: 'app/assessments/students/students.module#StudentsModule'
		    }
		]
            }
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
