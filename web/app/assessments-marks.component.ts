import { Component, Input, OnChanges } from '@angular/core';

import { DataService } from './data.service';
//import { Course } from './model/course';
//import { Assessment } from './model/assessment';
//import { Student } from './model/student';
//import { AssessmentStats } from './model/assessment-stats';
//import { Stats } from './model/stats';
import { AssessmentId } from './model/assessment-id';

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

    assessmentsId: AssessmentId[];
    selectedAssId: string;

    constructor( private dataService: DataService ) {}

    ngOnChanges() {
	if (this.year != null && this.courseId != null && this.groupId != null) {
	    this.dataService.getAssessments(this.year, this.courseId)
		.then(assId => {
		    this.assessmentsId = assId
		    if (assId.length > 0) {
			this.selectedAssId = assId[0]._id
		    }
		});
	}
	else {
	    this.assessmentsId = null;
	    this.selectedAssId = null;
	}
    }

    onAssChanged(event: any) {
	this.selectedAssId = event.target.id;
    }
}
