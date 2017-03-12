import { Component, Input, OnChanges } from '@angular/core';

import { DataService } from './data.service';
import { Course } from './model/course';
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
    course: Course;
    @Input()
    groupId: string;

    assessments: Assessment[];
    selectedIndex: number;
    selectedAssessment: Assessment;
    
    /*
    private _selectedAssessment: Assessment;
    get selectedAssessment(): Assessment {
	return this._selectedAssessment;
    }
    set selectedAssessment(assessment: Assessment) {
	if (assessment.students == null) {
            console.log("Assessment has no students...");
        }
	//TODO: Get students' qualifications...
	this._selectedAssessment = assessment;
    }
    */

    constructor( private dataService: DataService ) {}

    ngOnChanges() {
	if (/*this.year != null &&*/ this.course != null && this.groupId != null) {
	    /*
	    this.dataService.getAssessments(this.year, this.courseId)
		.then(assessments => {
		    this.assessments = assessments;
		    if (assessments.length > 0) {
			this.selectedIndex = 0;
			this.selectedAssessment = this.assessments[0];
		    }
		});
	    */
	    this.assessments = this.course.assessments;
	    this.selectedAssessment = this.assessments[0];
	    this.selectedIndex = 0;

	    console.log(this.course);
	}
	else {
	    this.assessments = null;
	    this.selectedIndex = null;
	    this.selectedAssessment = null;
	}
    }

    onAssChanged(event: any) {
	let index = event.target.id;
	this.selectedIndex = index;
	this.selectedAssessment = this.assessments[index];
    }
}
