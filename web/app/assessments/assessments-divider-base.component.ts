import { Component, OnInit }			from '@angular/core';
import { Router, ActivatedRoute, Params }    	from '@angular/router';
import { Observable }                           from 'rxjs/Observable';

import 'rxjs/add/operator/switchMap';

import { AssessmentsService }			from './assessments.service';

import { Course } 				from '../model/course';
import { Assessment } 				from '../model/assessment';

@Component({
    moduleId: module.id,
    template: ``
})
export class AssessmentsDividerBaseComponent implements OnInit {
    assessments: Observable<Assessment[]>;
    
    constructor(
	private assessmentsService: AssessmentsService,
	private route: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit() {
	this.assessments = this.route.parent.parent.params
            .switchMap((params: Params) => {
		const year = params['year'];
                const course_id = params['course_id'];
		//this.selectedAssessmentId = params['assessment_id'];
		
		let observable = Observable.empty();
		if (year != undefined && course_id != undefined) {
		    observable = this.assessmentsService.getCourse(course_id, year);
		}

		return observable;
	    })
	    .map((course: Course) => {
		/*
		let assessments = course.assessments;

		if (assessments.length > 0 && this.route.children.length == 0) {
		    this.router.navigate(
			[assessments[0]._id],
			{ relativeTo: this.route }
		    );
		}
		*/
		return course.assessments;
	    });
    }
}
