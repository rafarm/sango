import { Component, Input, OnChanges, SimpleChange,
	 Output, EventEmitter } from '@angular/core';

import { Assessment } from './model/assessment';
//import { Student } from './model/student';
    
@Component({
    selector: 'assessment-table',
    templateUrl: 'app/assessment-table.component.html',
    styleUrls: ['app/assessment-table.component.css']
})
export class AssessmentTableComponent implements OnChanges {
    @Input()
    assessment: Assessment;
    @Input()
    students: any;
    
    edited: boolean;
    saving: boolean;

    @Output()
    onSaveAssessment: EventEmitter<boolean> = new EventEmitter<boolean>();

    ngOnChanges(changes: {[propertyName: string]: SimpleChange}) {
	this.edited = false;
	this.saving = false;
    }	

    save() {
        this.saving = true;
	this.onSaveAssessment.emit(true);
    }

    cancel() {
        this.saving = true;
	this.onSaveAssessment.emit(false);
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
	
	return oldValue;		
    }

    cellBackgroundColor(qualification: Number): String {
    	if (qualification == null) {
	    return 'WhiteSmoke';
	}
		
	return qualification < 5 ? 'Tomato': 'transparent';
    }
}

