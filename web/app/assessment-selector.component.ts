import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { DataService } from './data.service';
import { SelectorAssessment } from './model/selector-assessment';
import { SelectorCourse } from './model/selector-course';
import { SelectorCoursesTree } from './model/selector-courses-tree';

@Component({
    selector: 'assessment-selector',
    templateUrl: 'app/assessment-selector.component.html',
    styleUrls: [ 'app/assessment-selector.component.css' ]
})
export class AssessmentSelectorComponent implements OnInit {
    coursesTree: SelectorCoursesTree[];
    courses: SelectorCourse[];
    assessments: SelectorAssessment[];
    selectedCourseId: string;
    selectedAssessmentId: string;
    
    @Output()
    assessmentChanged: EventEmitter<string> = new EventEmitter<string>();

    constructor( private dataService: DataService ) {}

    ngOnInit() {
        this.dataService.getCoursesByYear().then(coursesTree => this.coursesTree = coursesTree);
    }

    yearSelected(event: any) {
	let index = event.target.value;
	this.courses = index > -1 ? this.coursesTree[index].courses : null;
	
	this.selectedCourseId = null;
	this.assessments = null;
	this.selectedAssessmentId = null;

	this.notifyAssessmentChanged(null);
    }

    courseSelected(event: any) {
	let index = event.target.value;
	if (index > -1) {
	    this.selectedCourseId = this.courses[index].course_id;
	    this.assessments = this.courses[index].assessments;
	}
	else {
	    this.selectedCourseId = null;
	    this.assessments = null;
	}

	this.selectedAssessmentId = null;

	this.notifyAssessmentChanged(null);
    }

    assessmentSelected(event: any) {
	let index = event.target.value;
        if (index > -1) {
	    this.selectedAssessmentId = this.assessments[index].assessment_id;

	    this.notifyAssessmentChanged(this.selectedAssessmentId);
        }
        else {
	    this.selectedAssessmentId = null;

	    this.notifyAssessmentChanged(null);
        }
    }

    notifyAssessmentChanged(assessmentId: string) {
	this.assessmentChanged.emit(assessmentId);
    }
}
