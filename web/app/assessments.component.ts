import { Component, OnInit } from '@angular/core';

import { DataService } from './data.service';
import { Course } from './model/course';
import { Group } from './model/group';
//import { Assessment } from './model/assessment';
//import { Student } from './model/student';
//import { AssessmentStats } from './model/assessment-stats';
//import { Stats } from './model/stats';
import { BreadcrumbSelectorSelect } from './utils/breadcrumb-selector.component';
import { BreadcrumbSelectorEvent } from './utils/breadcrumb-selector.component';

@Component({
    selector: 'assessments',
    templateUrl: 'app/assessments.component.html',
    styleUrls: ['app/assessments.component.css']
})
export class AssessmentsComponent implements OnInit {
    selects: BreadcrumbSelectorSelect[] = [];
    selectedYear: string;
    selectedCourse: Course;
    selectedGroup: Group;
  
    checkedButtonId: string;  
	
    /*
    courseId: string;
    course: Course;
    assessmentId: string;
    assessment: Assessment;
    assessmentOrder: number;
    prevAssessment: Assessment;
    students: any;
    studentStats: any;
    subjectStats: any;
    levelStats: any;
    */

    constructor( private dataService: DataService ) {}

    ngOnInit() {
        this.dataService.getGroupsSelectYear()
            .then(select => this.selects.push(select));
    }

    onSelectorChanged(event: BreadcrumbSelectorEvent) {
	let value = event.select_value;
	switch(event.select_id) {
	    case 'year':
		this.selectedGroup = null;
		this.selectedCourse = null;
                
		while(this.selects.length > 1) {
		    this.selects.pop();
		}
		
		if (value == -1) {
		    this.selectedYear = null;
		}
 		else {
		    this.selectedYear = value;
		    this.dataService.getGroupsSelectCourse(this.selectedYear)
			.then(select => this.selects.push(select));
		}
		break;
	    case 'course':
		this.selectedGroup = null;
                
		while(this.selects.length > 2) {
                    this.selects.pop();
                }
		
		if (value == '-1') {
		    this.selectedCourse = null;
		}
                else {
		    //this.selectedCourseId = value
		    this.dataService.getCourse(value, this.selectedYear)
			.then(course => this.selectedCourse = course);
                    this.dataService.getGroupsSelectGroup(this.selectedYear, value)
                        .then(select => this.selects.push(select));
                }
		break;
	    case 'group':
		//this.selectedGroupId = value == -1 ? null : value;
		if (value == -1) {
		    this.selectedGroup = null;
		}
		else {
		    this.dataService.getGroup(value, this.selectedYear)
                        .then(group => this.selectedGroup = group);
		}
		break;
	    default:
		break;
	}

	this.checkedButtonId = "btn-marks";
    }

    onButtonClicked(event: any) {
	this.checkedButtonId = event.target.id;
    }

    /*
    onSelectedCourseChanged(event: string) {
        this.courseId = event;

        if (this.courseId != null) {
            this.loadCourse(this.courseId);
        }
        else {
            this.course = null;
            this.studentStats = null;
	    this.subjectStats = null;
	    this.levelStats = null;
        }
    }

    onSelectedAssessmentChanged(event: string) {
	this.assessmentId = event;

	if (this.assessmentId != null) {
	    this.loadAssessment(this.assessmentId);
	}
	else {
	    this.assessment = null;
	    this.students = null;
	}
    }

    private loadCourse(id: string) {
        this.dataService.getCourse(id)
            .then(course => this.course = course);
    }

    private loadAssessment(id: string) {
        this.dataService.getAssessment(id)
            .then(assessment => this.loadData(assessment));
    }

    onSaveAssessment(save: boolean) {
	if (save) {
	    this.dataService.replaceAssessment(this.assessment)
		.then(result => this.loadData(this.assessment));
	}
	else {
	    this.loadAssessment(this.assessmentId);
	}
    }

    private loadStats() {
	let course = this.course;

	// Get students stats
	this.dataService.getStudentStats(course._id)
	    .then(stats => this.processStudentStats(stats));

	// Get subject stats
	this.dataService.getSubjectStats(course._id)
	    .then(stats => this.processSubjectStats(stats));

	// Get course level stats
	this.dataService.getLevelStats(course.start_year,
				       course.stage,
				       course.level,
		    // TODO: Change when removing order from Course model...
				       this.assessmentOrder+1)
	    .then(stats => this.processLevelStats(stats));
    }

    private loadData(assessment: Assessment) {
	// Get students id array
        let ids: any[];
        for (var i=0; i<assessment.students.length; i++) {
            ids.push(assessment.students[i].student_id);
        }

        // Get students data
        this.dataService.getStudents(ids)
            .then(students => this.processStudents(students));

	this.assessment = assessment;

	// Find current assessment order in course
	var order = -1;
	let course = this.course;
        for (let i=0; i<course.assessments.length; i++) {
            let _a = course.assessments[i];
            if (_a.assessment_id === assessment._id) {
                order = i;
            }
	}
	this.assessmentOrder = order;

	// Load previous assessment in course
	if (order > 0) {
	    let _pId = this.course.assessments[order-1].assessment_id;
	    this.dataService.getAssessment(_pId)
		.then(assessment => this.prevAssessment = assessment);
	}

	// Get stats
        this.loadStats();
    }

    private processStudents(students: Student[]) {
	let s = {};

	for (let i=0; i<students.length; i++) {
	    s[students[i]._id] = students[i];
	}

	this.students = s;
    }

    private processStudentStats(stats: AssessmentStats[]) {
        this.studentStats = this.processAssessmentStats(stats);
    }

    private processSubjectStats(stats: AssessmentStats[]) {
        this.subjectStats = this.processAssessmentStats(stats);
    }

    private processAssessmentStats(stats: AssessmentStats[]): any {
        let assessmentHash = {};

        for (let i=0; i<stats.length; i++) {
            let _assessment = stats[i];
            let _stats = _assessment.stats;
            let _statsHash = {};
            
            for (let j=0; j<_stats.length; j++) {
                _statsHash[_stats[j]._id] = _stats[j];
            }
            
            let _assessmentHash = {};
            _assessmentHash['_id'] = _assessment._id;
            _assessmentHash['stats'] = _statsHash;

            assessmentHash[_assessment._id] = _assessmentHash;
        }

        return assessmentHash;
    }

    private processLevelStats(stats: Stats[]) {
	let subjectStats = {};

	for (let i=0; i<stats.length; i++) {
	    subjectStats[stats[i]._id] = stats[i];
	}

	this.levelStats = subjectStats;
    }
    */
}

