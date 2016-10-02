import { Component } from '@angular/core';

import { SessionId } from './sessionid';

@Component({
    selector: 'viewer',
    templateUrl: 'app/viewer.component.html',
    styleUrls: ['app/viewer.component.css']
})
export class ViewerComponent {
    sessionId: SessionId;

    onSessionChanged(event) {
	this.sessionId = event;
    }
}

