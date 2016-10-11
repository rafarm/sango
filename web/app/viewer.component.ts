import { Component } from '@angular/core';

import { DataService } from './data.service';
import { Assessment } from './model/assessment';

@Component({
    selector: 'viewer',
    templateUrl: 'app/viewer.component.html',
    styleUrls: ['app/viewer.component.css']
})
export class ViewerComponent {
    assessmentId: string;
    assessment: Assessment;

    constructor( private dataService: DataService ) {}

    onAssessmentChanged(event) {
	this.assessmentId = event;

	if (this.assessmentId != null) {
            this.dataService.getAssessment(this.assessmentId)
                .then(assessment => this.assessment = assessment);
        }
    }
}

