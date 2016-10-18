import { Component } from '@angular/core';

import { DataService } from './data.service';
import { Course } from './model/course';
import { Assessment } from './model/assessment';
import { Student } from './model/student';
import { AssessmentStats } from './model/assessment-stats';
import { Stats } from './model/stats';

@Component({
    selector: 'viewer',
    templateUrl: 'app/viewer.component.html',
    styleUrls: ['app/viewer.component.css']
})
export class ViewerComponent {
    courseId: string;
    course: Course;
    assessmentId: string;
    assessment: Assessment;
    students: any;
    studentStats: any;
    subjectStats: any;
    levelStats: any;

    constructor( private dataService: DataService ) {}

    onSelectedCourseChanged(event) {
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

    onSelectedAssessmentChanged(event) {
	this.assessmentId = event;

	if (this.assessmentId != null) {
	    this.loadAssessment(this.assessmentId);
	}
	else {
	    this.assessment = null;
	    this.students = null;
	}
    }

    loadCourse(id: string) {
        this.dataService.getCourse(id)
            .then(course => this.course = course);
    }

    loadAssessment(id: string) {
        this.dataService.getAssessment(id)
            .then(assessment => this.loadData(assessment));
    }

    onSaveAssessment(save) {
	if (save) {
	    this.dataService.replaceAssessment(this.assessment)
		.then(result => this.loadStats());
	}
	else {
	    this.loadAssessment(this.assessmentId);
	}
    }

    loadStats() {
	let course = this.course;

	// Get students stats
	this.dataService.getStudentStats(course._id)
	    .then(stats => this.processStudentStats(stats));

	// Get subject stats
	this.dataService.getSubjectStats(course._id)
	    .then(stats => this.processSubjectStats(stats));

	// Get course level stats
        var order = 0;
        for (let i in course.assessments) {
            let assessment = course.assessments[i];
            if (assessment.assessment_id == this.assessmentId) {
                order = assessment.order;
            }
        }
	this.dataService.getLevelStats(course.start_year, course.stage, course.level, order)
	    .then(stats => this.processLevelStats(stats));
    }

    loadData(assessment: Assessment) {
	// Get students id array
        let ids = [];
        for (var i=0; i<assessment.students.length; i++) {
            ids.push(assessment.students[i].student_id);
        }

        // Get students data
        this.dataService.getStudents(ids)
            .then(students => this.processStudents(students));

	this.assessment = assessment;

	// Get stats
        this.loadStats();
    }

    processStudents(students: Student[]) {
	let s = {};

	for (let i=0; i<students.length; i++) {
	    s[students[i]._id] = students[i];
	}

	this.students = s;
    }

    processStudentStats(stats: AssessmentStats[]) {
        this.studentStats = this.processAssessmentStats(stats);
    }

    processSubjectStats(stats: AssessmentStats[]) {
        this.subjectStats = this.processAssessmentStats(stats);
    }

    processAssessmentStats(stats: AssessmentStats[]): any {
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

    processLevelStats(stats: Stats[]) {
	let subjectStats = {};

	for (let i=0; i<stats.length; i++) {
	    subjectStats[stats[i]._id] = stats[i];
	}

	this.levelStats = subjectStats;
    }
}

