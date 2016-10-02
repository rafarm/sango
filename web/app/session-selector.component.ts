import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { CoursesTree } from './courses-tree';
import { Course } from './course';
import { SessionId } from './sessionid';
import { DataService } from './data.service';

@Component({
    selector: 'session-selector',
    templateUrl: 'app/session-selector.component.html',
    styleUrls: [ 'app/session-selector.component.css' ]
})
export class SessionSelectorComponent implements OnInit {
    coursesTree: CoursesTree[];
    groups: Course[];
    sessions: string[];
    selectedCourseId: string;
    selectedSessionIndex: number;
    
    @Output()
    sessionChanged: EventEmitter<SessionId> = new EventEmitter<SessionId>();

    constructor( private dataService: DataService ) {}

    ngOnInit() {
        this.dataService.getCoursesTree().then(coursesTree => this.coursesTree = coursesTree);
    }

    yearSelected(event: any) {
	let index = event.target.value;
	this.groups = index > -1 ? this.coursesTree[index].groups : null;
	
	this.selectedCourseId = null;
	this.sessions = null;
	this.selectedSessionIndex = null;

	this.notifySessionChanged(null);
    }

    groupSelected(event: any) {
	let index = event.target.value;
	if (index > -1) {
	    this.selectedCourseId = this.groups[index].course_id;
	    this.sessions = this.groups[index].sessions;
	}
	else {
	    this.selectedCourseId = null;
	    this.sessions = null;
	}

	this.selectedSessionIndex = null;

	this.notifySessionChanged(null);
    }

    sessionSelected(event: any) {
	let index = event.target.value;
        if (index > -1) {
	    this.selectedSessionIndex = index;

	    let sessionId = new SessionId();
	    sessionId.courseId = this.selectedCourseId;
	    sessionId.order = String(this.selectedSessionIndex);

	    this.notifySessionChanged(sessionId);
        }
        else {
	    this.selectedSessionIndex = null;

	    this.notifySessionChanged(null);
        }
    }

    notifySessionChanged(sessionId: SessionId) {
	this.sessionChanged.emit(sessionId);
    }
}
