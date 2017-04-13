import { Component, Input, OnInit }		from '@angular/core';
import { Router, ActivatedRoute, Params }       from '@angular/router';
import { Observable }                           from 'rxjs/Observable';
//import { Subscription }                         from 'rxjs/Subscription';

import 'rxjs/add/operator/switchMap';

//import { DataService } from './data.service';
import { GradesService }			from './grades.service';

import { Course } 				from '../../model/course';
//import { Group } 				from '../../model/group';
import { Assessment } 				from '../../model/assessment';
//import { Student } from './model/student';
//import { AssessmentStats } from './model/assessment-stats';
//import { Stats } from './model/stats';

@Component({
    moduleId: module.id,
    templateUrl: './grades.component.html',
    providers: [ GradesService ]
})
export class GradesComponent implements OnInit {
    /*@Input()
    course: Course;
    @Input()
    group: Group;*/

    //private routerSubscription: Subscription;

    assessments: Observable<Assessment[]>;
    //selectedIndex: number = 0;
    //selectedAssessmentId: string;
    
    constructor(
	private gradesService: GradesService,
	private route: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit() {
	this.assessments = this.route.params
            .switchMap((params: Params) => {
		const year = params['year'];
                const course_id = params['course_id'];
		//this.selectedAssessmentId = params['assessment_id'];
		
		let observable = Observable.empty();
		if (year != undefined && course_id != undefined) {
		    observable = this.gradesService.getCourse(course_id, year);
		}

		return observable;
	    })/*.subscribe((course: Course) => this.assessments = course.assessments)*/;
    }

    /*
    onAssChanged(event: any) {
	let index = event.target.id;
	this.selectedIndex = index;
	//this.selectedAssessment = this.assessments[index];
    }
    */
}
