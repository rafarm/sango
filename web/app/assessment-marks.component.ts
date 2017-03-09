import { Component, Input, OnChanges } from '@angular/core';

import { DataService } from './data.service';
//import { Course } from './model/course';
import { Assessment } from './model/assessment';
//import { Student } from './model/student';
//import { AssessmentStats } from './model/assessment-stats';
//import { Stats } from './model/stats';

@Component({
    selector: 'assessments-marks',
    templateUrl: 'app/assessments-marks.component.html'/*,
    styleUrls: ['app/assessments-marks.component.css']*/
})
export class AssessmentsMarksComponent implements OnChanges {
    @Input()
    year: string;
    @Input()
    courseId: string;
    @Input()
    groupId: string;

    assessments: Assessment[];
    selectedIndex: number;

    constructor( private dataService: DataService ) {}

    ngOnChanges() {
	if (this.year != null && this.courseId != null && this.groupId != null) {
	    this.dataService.getAssessments(this.year, this.courseId)
		.then(assessments => {
		    this.assessments = assessments;
		    if (assessments.length > 0) {
			this.selectedIndex = 0;
		    }
		});
	}
	else {
	    this.assessments = null;
	    this.selectedIndex = null;
	}
    }

    onAssChanged(event: any) {
	this.selectedIndex = event.target.id;
    }
}
