import { Component, Input } from '@angular/core';

import { Assessment } from './model/assessment';
import { Student } from './model/student';
    
@Component({
	selector: 'assessment-list',
	templateUrl: 'app/assessment-list.component.html',
	styleUrls: ['app/assessment-list.component.css']
})
export class AssessmentListComponent {
	@Input()
	assessment: Assessment;
	@Input()
	students: Student[];
	@Input()
	studentStats: {};

	selectedStudent: Student;

	onSelect(student: Student) {
		this.selectedStudent = student;
	}

	isWarning(student: Student) {
		return student.num_failed[this.session.order-1] > 1 && student.num_failed[this.session.order-1] < 4
	}

	isDanger(student: Student) {
		return student.num_failed[this.session.order-1] > 3
	}
}

