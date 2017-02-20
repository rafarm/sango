import { Component, EventEmitter, OnInit, Output } from '@angular/core';

//import { DataService } from './data.service';
//import { SelectorAssessment } from './model/selector-assessment';
//import { SelectorCourse } from './model/selector-course';
//import { SelectorCoursesTree } from './model/selector-courses-tree';

@Component({
    selector: 'breadcrumb-selector',
    templateUrl: 'app/breadcrumb-selector.component.html',
    styleUrls: [ 'app/breadcrumb-selector.component.css' ]
})
export class BreadcrumbSelectorComponent /*implements OnInit*/ {
    /*
    coursesTree: SelectorCoursesTree[];
    courses: SelectorCourse[];
    assessments: SelectorAssessment[];
    selectedCourseId: string;
    selectedAssessmentId: string;
    
    @Output()
    selectedCourseChanged: EventEmitter<string> = new EventEmitter<string>();
    @Output()
    selectedAssessmentChanged: EventEmitter<string> = new EventEmitter<string>();

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
	
	this.notifyCourseChanged(null);
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
	
	this.notifyCourseChanged(this.selectedCourseId);
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

    notifyCourseChanged(courseId: string) {
	this.selectedCourseChanged.emit(courseId);
    }

    notifyAssessmentChanged(assessmentId: string) {
	this.selectedAssessmentChanged.emit(assessmentId);
    }
    */
}
