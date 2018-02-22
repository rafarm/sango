import { Component, OnInit, OnDestroy } 	from '@angular/core';
import { Router, ActivatedRoute, Params }       from '@angular/router';
import { Observable }                           from 'rxjs/Observable';
import { Subscription }                         from 'rxjs/Subscription';
import { BreakpointObserver }			from '@angular/cdk/layout';

import { AssessmentsService }			from '../assessments.service';

import { Group }                        	from '../../model/group';
    
@Component({
    templateUrl: './group-charts.component.html'
})
export class GroupChartsComponent implements OnInit, OnDestroy {
    year: string;
    group_id: string;
    assessment_id: string;
    students: any;
    subjects: any;
    studentStats: any;
    subjectStats: any;
    levelStats: any;

    cols: number;

    private statsSubscription: Subscription;

    constructor(
	private assessmentsService: AssessmentsService,
	private route: ActivatedRoute,
	private router: Router,
	breakpointObserver: BreakpointObserver
    ) {
	breakpointObserver.observe('(max-width: 720px)')
	    .subscribe(result => {
		this.cols = result.matches ? 1 : 2;
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
	    
	    // Get subjects' stats...
	    this.assessmentsService.getSubjectStats(this.assessment_id, this.group_id).subscribe((stats: any) => this.subjectStats = stats.stats);
	    
	    // Get subjects' level stats...
	    this.assessmentsService.getSubjectStats(this.assessment_id).subscribe((stats: any) => this.levelStats = stats.stats);
	});
    }

    ngOnDestroy() {
        this.statsSubscription.unsubscribe();
    }
}

