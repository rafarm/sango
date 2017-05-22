import { Component, OnInit, OnDestroy } 	from '@angular/core';
import { Router, ActivatedRoute, Params }       from '@angular/router';
import { Observable }                           from 'rxjs/Observable';
import { Subscription }                         from 'rxjs/Subscription';

import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/concatMap';

//import { DataService } from './data.service';
import { GradesService } 			from './grades.service';
import { CanComponentDeactivate }		from '../../can-deactivate-guard.service';
import { DialogService }			from '../../core/dialog.service';
//import { Assessment } from '../../model/assessment';
import { Group } 				from '../../model/group';
import { Student } 				from '../../model/student';
import { Subject } 				from '../../model/subject';
import { Grade } 				from '../../model/grade';
import { Grades } 				from '../../model/grades';
    
@Component({
    moduleId: module.id,
    templateUrl: './grades-table.component.html',
    styleUrls: ['./grades-table.component.css'],
    providers: [ GradesService ]
})
export class GradesTableComponent implements OnInit, OnDestroy, CanComponentDeactivate {
    year: string;
    //@Input()
    assessment_id: string;
    //@Input()
    group_id: string;
    //@Input()
    subjects: Subject[];
    //@Input()
    students: Student[];
    grades: Grades;
    
    private edited: boolean;
    private saving: boolean;
    private editingRow: Element;

    private gradesSubscription: Subscription;

    /*
    @Output()
    onSaveAssessment: EventEmitter<boolean> = new EventEmitter<boolean>();
    */

    constructor(
	private gradesService: GradesService,
	private dialogService: DialogService,
        private route: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit() {
	this.year = this.route.parent.parent.parent.snapshot.params['year'];
	this.group_id = this.route.parent.parent.parent.snapshot.params['group_id'];
	this.gradesSubscription = this.route.params
	    .switchMap((params: Params) => {
		//const year = params['year'];
		//this.group_id = params['group_id'];
		this.assessment_id = params['assessment_id'];

		//console.log("GradesTable - params: (" + this.year + ", " + this.group_id + ", " + this.assessment_id + ")");

		this.edited = false;
		this.saving = false;
		this.grades = null;
		
		if (this.year != undefined && this.group_id != undefined && this.assessment_id != undefined) {
		    return this.gradesService.getGroup(this.group_id, this.year);
		}

		return Observable.throw(new Error('Invalid parameters'));
	    })
	    .concatMap((group: Group) => {
		this.subjects = group.subjects;
		this.students = group.students;

		return this.getGrades();
	    }).subscribe((grades: Grades) => this.grades = grades);	
    }

    ngOnDestroy() {
	this.gradesSubscription.unsubscribe();
    }

    canDeactivate(): Promise<boolean> | boolean {
	if (!this.edited) {
	    return true;
	}

	return this.dialogService.confirm('Discard changes?');
    }

    private getGrades(): Observable<Grades> {
	return this.gradesService.getQualifications(this.assessment_id, this.group_id)
	    .concatMap(res => {
		let grades = this.generateGrades();
		if (res.grades != undefined) {
		    res.grades.forEach((st: any) => {
			st.qualifications.forEach((q: any) => {
			    let gs = grades.students[st.student_id].grades;
			    gs[q.subject_id].value = q.qualification;
			});
		    });
		}
		//this.grades = grades;
		this.edited = false;
		this.saving = false;

		return Observable.of(grades);
	    });
    }

    private generateGrades(): Grades {
	let grades = new Grades();
	grades.assessment_id = this.assessment_id;
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

	return grades;
    }

    save() {
        this.saving = true;
	this.gradesService.updateQualifications(this.grades)
	    .concatMap(result => {
		return this.getGrades();
	    })
	    .subscribe((grades: Grades) => this.grades = grades);
	//this.onSaveAssessment.emit(true);
    }

    cancel() {
        this.saving = true;
	this.getGrades().subscribe((grades: Grades) => this.grades = grades);
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

