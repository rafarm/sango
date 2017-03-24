import { Component, Input, OnChanges, SimpleChange,
	 Output/*, EventEmitter*/ } from '@angular/core';

import { DataService } from './data.service';
import { Assessment } from './model/assessment';
import { Group } from './model/group';
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
    group: Group;
    //@Input()
    subjects: Subject[];
    //@Input()
    students: Student[];
    
    edited: boolean;
    saving: boolean;
    grades: Grades;
    editingRow: Element;

    /*
    @Output()
    onSaveAssessment: EventEmitter<boolean> = new EventEmitter<boolean>();
    */

    constructor( private dataService: DataService ) {}

    ngOnChanges(changes: {[propertyName: string]: SimpleChange}) {
	this.edited = false;
	this.saving = false;
	this.grades = null;
    
	if (this.assessment != null && this.group != null /*this.students != null && this.subjects != null*/) {
	    this.subjects = this.group.subjects;
	    this.students = this.group.students;
	    this.getGrades();
	}
    }

    getGrades() {
	// TODO: Get assessment's grades. If no grade is returned generate
	// empty table.
	this.generateGrades();

	this.dataService.getQualifications(this.assessment._id, this.group._id)
	    .then(res => {
		console.log(res);
		if (res.grades != undefined) {
		    res.grades.forEach((st: any) => {
			st.qualifications.forEach((q: any) => {
			    let gs = this.grades.students[st.student_id].grades;
			    gs[q.subject_id].value = q.qualification;
			});
		    });
		}
		this.edited = false;
		this.saving = false;
	    });
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
	console.log(this.grades);
	this.dataService.updateQualifications(this.grades)
	    .then(result => {
		this.getGrades();
	    });
	//this.onSaveAssessment.emit(true);
    }

    cancel() {
        this.saving = true;
	this.getGrades();
	//this.onSaveAssessment.emit(false);
    }

    trackByIndex(index: number, obj: any): any {
    	return index;
    }

    // Filters qualification input
    processInput(oldValue: Number, newValue: any, element: any): Number {
	let numValue = newValue != '' ? newValue * 1 : null;

	if (newValue == '' || (numValue >=0 && numValue <=10)) {
	    this.edited = true;
	    return numValue;
        }

	element.value = oldValue;	
	return oldValue;		
    }

    onInputFocus(event: any) {
	let row = event.target.parentElement.parentElement.parentElement;
	
	if (this.editingRow != row) {
	    let classActive = 'table-active';
	    if (this.editingRow != null) {
		this.editingRow.classList.remove(classActive);
	    }
	    row.classList.add(classActive);
	    this.editingRow = row;
	}
    }

    cellClasses(grade: Grade): any {
	let classes = {};

	classes['table-danger'] = grade.enroled && grade.value != null && grade.value  < 5;
	classes['table-warning'] = grade.value == null;
	classes['not-enroled'] = !grade.enroled;
	classes['bg-adapted'] = grade.adapted;

	return classes;
    }
    /*
    isGradeDanger(grade: Grade): boolean {
	return (grade.enroled && grade.value != null && grade.value  < 5);	
    }

    isGradeMissing(grade: Grade): boolean {
	return grade.value == null;
    }
    */
    /*
    cellBackgroundColor(grade: Grade): String {
    	if (grade.enroled == false) {
	    return 'WhiteSmoke';
	}
		
	return grade.grade < 5 ? 'Tomato': 'transparent';
    }
    */
}

