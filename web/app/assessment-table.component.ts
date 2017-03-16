import { Component, Input, OnChanges, SimpleChange,
	 Output/*, EventEmitter*/ } from '@angular/core';

import { Assessment } from './model/assessment';
import { Student } from './model/student';
import { Subject } from './model/subject';
import { Grade } from './model/grade';
import { Grades } from './model/grades';
    
@Component({
    selector: 'assessment-table',
    templateUrl: 'app/assessment-table.component.html',
    styleUrls: ['app/assessment-table.component.css']
})
export class AssessmentTableComponent implements OnChanges {
    @Input()
    assessment: Assessment;
    @Input()
    students: Student[];
    @Input()
    subjects: Subject[];
    
    edited: boolean;
    saving: boolean;
    grades: Grades;

    /*
    @Output()
    onSaveAssessment: EventEmitter<boolean> = new EventEmitter<boolean>();
    */

    ngOnChanges(changes: {[propertyName: string]: SimpleChange}) {
	this.edited = false;
	this.saving = false;
	this.grades = null;
    
	if (this.assessment != null && this.students != null && this.subjects != null) {
	    // TODO: Get assessment's grades. If no grade is returned generate
	    // empty table.
	    this.generateGrades();
	}
    }

    generateGrades() {
	let grades = new Grades();
	grades.assessment_id = this.assessment._id;
	grades.students = {};
	
	this.students.forEach(student => {
	    let marks = {};
	    this.subjects.forEach(subject => {
		marks[subject._id] = new Grade();
	    });
	    
	    student.subjects.forEach(subject => {
		let mark = marks[subject.subject_id];
		mark.adapted = subject.adapted;
		mark.enroled = true;
	    });

	    let qualifications = {};
	    qualifications['grades'] = marks;

	    grades.students[student._id] = qualifications;
	});

	this.grades = grades;
    }

    save() {
        this.saving = true;
	//this.onSaveAssessment.emit(true);
    }

    cancel() {
        this.saving = true;
	//this.onSaveAssessment.emit(false);
    }

    trackByIndex(index: number, obj: any): any {
    	return index;
    }

    // Filters qualification input
    processInput(oldValue: Number, newValue: any, element: any): Number {
        newValue = newValue*1;
    	
        if (newValue >=0 && newValue <=10) {
	    this.edited = true;
	    return newValue;
        }

	element.value = oldValue;
	console.log(oldValue);	
	return oldValue;		
    }

    cellBackgroundColor(grade: Grade): String {
    	if (grade.enroled == false) {
	    return 'WhiteSmoke';
	}
		
	return grade.grade < 5 ? 'Tomato': 'transparent';
    }
}

