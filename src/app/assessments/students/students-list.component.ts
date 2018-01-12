import { Component, OnInit, OnDestroy } 	from '@angular/core';
import { Router, ActivatedRoute, Params }       from '@angular/router';
import { Observable }                           from 'rxjs/Observable';
import { Subscription }                         from 'rxjs/Subscription';

import { AssessmentsService }			from '../assessments.service';

import { Group }                        	from '../../model/group';
    
@Component({
    moduleId: module.id,
    templateUrl: './students-list.component.html',
    styleUrls: ['./students-list.component.css']
})
export class StudentsListComponent implements OnInit, OnDestroy {
    year: string;
    group_id: string;
    assessment_id: string;
    students: any;
    subjects: any;
    studentStats: any;

    private statsSubscription: Subscription;


    constructor(
	private assessmentsService: AssessmentsService,
	private route: ActivatedRoute,
	private router: Router
    ) {}

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

    private hasFailed(student_id: string): boolean {
	return this.studentStats[student_id].failed > 0;
    }

    private badgeClasses(student_id: string): any {
	let classes = {'badge': true,
		       'badge-pill': true};
    
	let failed = this.studentStats[student_id].failed;

	classes['badge-warning'] = failed > 0 && failed <= 2;
	classes['badge-danger'] = failed > 2;

	return classes;
    }
}

