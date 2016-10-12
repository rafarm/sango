import { Component, Input } from '@angular/core';

import { Assessment } from './model/assessment';
//import { Student } from './student';
    
@Component({
	selector: 'assessment-table',
	templateUrl: 'app/assessment-table.component.html',
	styleUrls: ['app/assessment-table.component.css']
})
export class AssessmentTableComponent {
	@Input()
	assessment: Assessment;
	changed: boolean;
	saving: boolean;

	trackByIndex(index: number, obj: any): any {
		return index;
	}

	// Filters qualification input
	processInput(oldValue: Number, input: any): Number {
		var newValue = input*1;
		
		if (newValue >=0 && newValue <=10) {
			return newValue;
		}
	
		return oldValue;		
	}

	cellBackgroundColor(qualification: Number): String {
		if (qualification == null) {
			return 'WhiteSmoke';
		}
		
		return qualification < 5 ? 'Tomato': 'transparent';
	}
}

