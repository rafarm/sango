import { Component } from '@angular/core';

import { DataService } from './data.service';
import { Assessment } from './model/assessment';
import { Student } from './model/student';
import { AssessmentStudentStats } from './model/assessment-student-stats';

@Component({
    selector: 'viewer',
    templateUrl: 'app/viewer.component.html',
    styleUrls: ['app/viewer.component.css']
})
export class ViewerComponent {
    assessmentId: string;
    assessment: Assessment;
    students: any;
    studentsStats: any;

    constructor( private dataService: DataService ) {}

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

    onSaveAssessment(save) {
	if (save) {
	    this.dataService.replaceAssessment(this.assessment)
		.then(result => this.loadRefData(this.assessment));
	}
	else {
	    this.loadAssessment(this.assessmentId);
	}
    }

    loadAssessment(id: string) {
	this.dataService.getAssessment(id)
	    .then(assessment => this.loadRefData(assessment));
    }

    loadRefData(assessment: Assessment) {
	// Get students id array
        let ids = [];
        for (var i=0; i<assessment.students.length; i++) {
            ids.push(assessment.students[i].student_id);
        }

        // Get students data
        this.dataService.getStudents(ids)
            .then(students => this.processStudents(students));

        // Get students statistics
        this.dataService.getAssessmentStudentsStats(assessment._id)
            .then(stats => this.processStudentsStats(stats));
	
	this.assessment = assessment;

    }

    processStudents(students: Student[]) {
	var s = {};

	for (var i=0; i<students.length; i++) {
	    s[students[i]._id] = students[i];
	}

	this.students = s;
    }

    processStudentsStats(stats: AssessmentStudentStats[]) {
	var s = {};

	for (var i=0; i<stats.length; i++) {
            s[stats[i]._id] = stats[i];
        }

        this.studentsStats = s;
    }
}

