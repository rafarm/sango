import { Component, Input } from '@angular/core';

import { Course } from './model/course';
import { Assessment } from './model/assessment';
//import { Student } from './model/student';
    
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
    assessmentOrder: number;
    @Input()
    prevAssessment: Assessment;
    @Input()
    students: any;
    @Input()
    studentStats: any;
    @Input()
    subjectStats: any;

    selectedStudentId: string;
    selectedStudentIndex: number;

    onSelect(studentId: string, index: number) {
	this.selectedStudentId = studentId;
	this.selectedStudentIndex = index;
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

