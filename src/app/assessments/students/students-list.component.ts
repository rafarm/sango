import { Component, OnInit, OnDestroy } 	from '@angular/core';
import { Router, ActivatedRoute, Params }       from '@angular/router';
import { Observable }                           from 'rxjs/Observable';
import { Subscription }                         from 'rxjs/Subscription';
import { BreakpointObserver,
         Breakpoints }                          from '@angular/cdk/layout';

import { AssessmentsService }			from '../assessments.service';

import { Group }                        	from '../../model/group';
    

const DrawerMode = {
    OVER: 'over',
    PUSH: 'push',
    SIDE: 'side'
}

@Component({
    templateUrl: './students-list.component.html',
    styleUrls: ['./students-list.component.scss']
})
export class StudentsListComponent implements OnInit, OnDestroy {
    year: string;
    group_id: string;
    assessment_id: string;
    students: any;
    subjects: any;
    studentStats: any;

    drawerMode: string;
    drawerOpened: boolean;

    private statsSubscription: Subscription;


    constructor(
	private assessmentsService: AssessmentsService,
	private route: ActivatedRoute,
	private router: Router,
        breakpointObserver: BreakpointObserver
    ) {
	breakpointObserver.observe('(max-width: 720px)')
            .subscribe(result => {
                this.drawerMode = result.matches ? DrawerMode.OVER : DrawerMode.SIDE;
            });
	breakpointObserver.observe('(min-width: 721px)')
            .subscribe(result => {
                this.drawerOpened = result.matches ? true : false;
            });
    }

    ngOnInit() {
	this.year = this.route.parent.parent.parent.snapshot.params['year'];
        this.group_id = this.route.parent.parent.parent.snapshot.params['group_id'];
	this.statsSubscription = this.route.params.subscribe((params: Params) => {
	    this.assessment_id = params['assessment_id'];

	    // Get students and subjects...
	    this.assessmentsService.getGroup(this.group_id)
		.subscribe((group: Group) => {
		    this.students = group.students;
		    this.subjects = group.subjects;
		});

	    // Get students' stats...
	    this.assessmentsService.getStudentStats(this.assessment_id, this.group_id).subscribe((stats: any) => this.studentStats = stats.stats);
	});
    }

    ngOnDestroy() {
        this.statsSubscription.unsubscribe();
    }

    onListClick() {
	if (this.drawerMode == DrawerMode.OVER) {
	    this.drawerOpened = false;
	}
    }

    private hasFailed(student_id: string): boolean {
	return this.studentStats[student_id].failed > 0;
    }

    private failedBadgeClasses(student_id: string): any {
	let classes = {};
	let failed = this.studentStats[student_id].failed;

	classes['sg-badge-warning'] = failed > 0 && failed <= 2;
	classes['sg-badge-danger'] = failed > 2;

	return classes;
    }
}

