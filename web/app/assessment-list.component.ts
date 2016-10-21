import { Component, Input } from '@angular/core';

import { Course } from './model/course';
import { Assessment } from './model/assessment';
import { Student } from './model/student';
    
@Component({
    selector: 'assessment-list',
    templateUrl: 'app/assessment-list.component.html',
    styleUrls: ['app/assessment-list.component.css']
})
export class AssessmentListComponent {
    @Input()
    course: Course;
    @Input()
    assessment: Assessment;
    @Input()
    students: {};
    @Input()
    studentStats: {};
    @Input()
    subjectStats: {};

    selectedStudentId: string;

    onSelect(studentId: string) {
	this.selectedStudentId = studentId;
    }

    isWarning(studentId: string) {
	let assessment_id = this.assessment._id
	let failed = this.studentStats[assessment_id].stats[studentId].failed;
	
	return failed > 1 && failed < 4;
    }

    isDanger(studentId: string) {
	let assessment_id = this.assessment._id
	let failed = this.studentStats[assessment_id].stats[studentId].failed;
	return failed > 3;
    }
}

