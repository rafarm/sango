import { Component, Input, OnInit, OnDestroy }	from '@angular/core';
import { Router, ActivatedRoute, Params }       from '@angular/router';
import { Observable }                           from 'rxjs/Observable';
import { Subscription }                         from 'rxjs/Subscription';

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
export class GradesComponent implements OnInit, OnDestroy {
    /*@Input()
    course: Course;
    @Input()
    group: Group;*/

    private routerSubscription: Subscription;

    assessments: Assessment[];
    selectedIndex: number = 0;
    //selectedAssessment: Assessment;
    
    constructor(
	private gradesService: GradesService,
	private route: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit() {
	this.routerSubscription = this.route.params
            .switchMap((params: Params) => {
		const year = params['year'];
                const course_id = params['course_id'];
		let observable = Observable.empty();

		if (year != undefined && course_id != undefined) {
		    observable = this.gradesService.getCourse(course_id, year);
		}

		return observable;
	    }).subscribe((course: Course) => this.assessments = course.assessments);
    }

    ngOnDestroy() {
	this.routerSubscription.unsubscribe();
    }

    onAssChanged(event: any) {
	let index = event.target.id;
	this.selectedIndex = index;
	//this.selectedAssessment = this.assessments[index];
    }
}
