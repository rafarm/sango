import { Component, OnInit, OnDestroy}		from '@angular/core';
import { Router, ActivatedRoute, Params }       from '@angular/router';
import { Observable }                    	from 'rxjs/Observable';
import { Subscription }                      	from 'rxjs/Subscription';

import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/concatMap';

import { AssessmentsService } 			from '../assessments.service';
import { CanComponentDeactivate }		from '../../can-deactivate-guard.service';
import { DialogService }			from '../../core/dialog.service';
import { Group } 				from '../../model/group';
import { Student } 				from '../../model/student';
import { Subject } 				from '../../model/subject';
import { Grade } 				from '../../model/grade';
import { Grades } 				from '../../model/grades';
    
@Component({
    templateUrl: './grades-table.component.html',
    styleUrls: ['./grades-table.component.css']
})
export class GradesTableComponent implements OnInit, OnDestroy, CanComponentDeactivate {
    year: string;
    assessment_id: string;
    group_id: string;
    subjects: Subject[];
    students: Student[];
    
    private _grades: Grades;
    get grades(): Grades {
        return this._grades;
    }
    set grades(newGrades: Grades) {
        this._grades = newGrades;
        this.edited = false;
        this.saving = false;
    }
    
    private edited: boolean;
    private saving: boolean;
    private editingRow: Element;

    private gradesSubscription: Subscription;

    constructor(
	private assessmentsService: AssessmentsService,
	private dialogService: DialogService,
        private route: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit() {
	this.year = this.route.parent.parent.parent.snapshot.params['year'];
	this.group_id = this.route.parent.parent.parent.snapshot.params['group_id'];
	this.gradesSubscription = this.route.params
	    .switchMap((params: Params) => {
		this.assessment_id = params['assessment_id'];

		//this.grades = null;
		
		if (this.year != undefined && this.group_id != undefined && this.assessment_id != undefined) {
		    return this.assessmentsService.getGroup(this.group_id);
		}

		return Observable.throw(new Error('Invalid parameters'));
	    })
	    .concatMap((group: Group) => {
		this.subjects = group.subjects;
		this.students = group.students;

		return this.assessmentsService.getGrades(this.assessment_id, this.group_id);
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

    save() {
        this.saving = true;
	this.assessmentsService.updateQualifications(this.grades)
	    .concatMap(result => {
		return this.assessmentsService.getGrades(this.assessment_id, this.group_id, true);
	    })
	    .subscribe((grades: Grades) => this.grades = grades);
    }

    cancel() {
        this.saving = true;
	this.assessmentsService.getGrades(this.assessment_id, this.group_id, true).subscribe((grades: Grades) => this.grades = grades);
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
}

