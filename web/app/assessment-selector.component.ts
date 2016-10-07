import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { CoursesTree } from './courses-tree';
import { Course } from './course';
import { DataService } from './data.service';

@Component({
    selector: 'assessment-selector',
    templateUrl: 'app/assessment-selector.component.html',
    styleUrls: [ 'app/assessment-selector.component.css' ]
})
export class AssessmentSelectorComponent implements OnInit {
    coursesTree: CoursesTree[];
    groups: Course[];
    assessments_id: string[];
    assessments_name: string[];
    selectedCourseId: string;
    selectedAssessmentId: string;
    
    @Output()
    assessmentChanged: EventEmitter<string> = new EventEmitter<string>();

    constructor( private dataService: DataService ) {}

    ngOnInit() {
        this.dataService.getCoursesTree().then(coursesTree => this.coursesTree = coursesTree);
    }

    yearSelected(event: any) {
	let index = event.target.value;
	this.groups = index > -1 ? this.coursesTree[index].groups : null;
	
	this.selectedCourseId = null;
	this.assessments_id = null;
	this.assessments_name = null;
	this.selectedAssessmentId = null;

	this.notifyAssessmentChanged(null);
    }

    groupSelected(event: any) {
	let index = event.target.value;
	if (index > -1) {
	    this.selectedCourseId = this.groups[index].course_id;
	    this.assessments_id = this.groups[index].assessments_id;
	    this.assessments_name = this.groups[index].assessments_name;
	}
	else {
	    this.selectedCourseId = null;
	    this.assessments_id = null;
	    this.assessments_name = null;
	}

	this.selectedAssessmentId = null;

	this.notifyAssessmentChanged(null);
    }

    assessmentSelected(event: any) {
	let index = event.target.value;
        if (index > -1) {
	    this.selectedAssessmentId = this.assessments_id[index];

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
