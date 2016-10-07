import { Component } from '@angular/core';

@Component({
    selector: 'viewer',
    templateUrl: 'app/viewer.component.html',
    styleUrls: ['app/viewer.component.css']
})
export class ViewerComponent {
    assessmentId: string;

    onAssessmentChanged(event) {
	this.assessmentId = event;
    }
}

