import { Component, OnInit, OnDestroy, ElementRef }         from '@angular/core';
import { Router, ActivatedRoute, Params }       from '@angular/router';
import { Observable }                           from 'rxjs/Observable';
import { Subscription }                         from 'rxjs/Subscription';

import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/toArray';

import { AssessmentsService }                   from '../assessments.service';

import { Course }                               from '../../model/course';
import { Group }                                from '../../model/group';
import { Assessment }                           from '../../model/assessment';
import { Student } 				from '../../model/student';
import { Grades }                               from '../../model/grades';

@Component({
    templateUrl: './student-detail.component.html',
    styleUrls: ['./student-detail.component.css']
})
export class StudentDetailComponent {
    year: string;
    course_id: string;
    group_id: string;
    assessment_id: string;
    student_id: string;
    student: Student;
    studentStats: any;
    subjectStats: any;
    studentGrades: any;
    studentPrevGrades: any;
    assessmentNames: string[];

    private statsSubscription: Subscription;

    constructor(
	private el: ElementRef,
	private assessmentsService: AssessmentsService,
        private route: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit() {
        this.year = this.route.parent.parent.parent.parent.snapshot.params['year'];
        this.course_id = this.route.parent.parent.parent.parent.snapshot.params['course_id'];
        this.group_id = this.route.parent.parent.parent.parent.snapshot.params['group_id'];
        this.assessment_id = this.route.parent.snapshot.params['assessment_id'];
        this.statsSubscription = this.route.params.subscribe((params: Params) => {
            this.student_id = params['student_id'];

            // Get student and subjects...
            this.assessmentsService.getGroup(this.group_id)
                .subscribe((group: Group) => {
		    group.students.some((st: Student) => {
			if (st._id == this.student_id) {
			    this.student = st;
			    this.el.nativeElement.parentElement.scrollTop = 0;
			    return true;
			}

			return false;
		    });
                });
	    
            // Get students' stats...
            this.assessmentsService.getCourse(this.course_id, this.year)
                .switchMap((course: Course) => {
		    let ids = course.assessments.map((ass: Assessment) => ass._id);
		    this.assessmentNames = course.assessments.map((ass: Assessment) => ass.name);
                    let index = ids.indexOf(this.assessment_id);

		    let obs = this.assessmentsService.getStudentStats(ids[0], this.group_id);
		    for (let i = 1; i <= index; i++) {
			obs = obs.merge(this.assessmentsService.getStudentStats(ids[i], this.group_id));
		    }

		    return obs;
		})
		.toArray().subscribe((stats) => {
		    stats.sort((a,b) => a._id.localeCompare(b._id));
		    this.studentStats = [];
		    stats.forEach((_st: any, i: number) => {
			let _s = {};
			_s['_id'] = this.assessmentNames[i];
			_s['stats'] = _st.stats[this.student_id];
			this.studentStats.push(_s);
		    });
		});

            // Get subjects' stats...
            this.assessmentsService.getSubjectStats(this.assessment_id, this.group_id).subscribe((stats: any) => this.subjectStats = stats.stats);

	    // Get grades...
	    this.assessmentsService.getGrades(this.assessment_id, this.group_id).subscribe((grades: Grades) => this.studentGrades = grades.students[this.student_id].grades);
            
            // Get previuos grades...
	    this.assessmentsService.getCourse(this.course_id, this.year)
		.switchMap((course: Course) => {
		    let ids = course.assessments.map((ass: Assessment) => ass._id);
		    let index = ids.indexOf(this.assessment_id);

		    let observable = Observable.empty();
		    if (index > 0) {
			observable = this.assessmentsService.getGrades(ids[index-1], this.group_id);
		    }

		    return observable;
		})
		.subscribe((grades: Grades) => this.studentPrevGrades = grades.students[this.student_id].grades);
        });
    }

    ngOnDestroy() {
        this.statsSubscription.unsubscribe();
    }

    private ageInYears(): string {
	let ageInYears = '??';
	let stBirthdate = this.student.birthdate;
	
	if (stBirthdate != null) {
	    let birthTime = (new Date(stBirthdate)).getTime();
	    if (birthTime != 0) {
		ageInYears = ((new Date(Date.now() - birthTime)).getFullYear() - 1970).toString();
	    }
	}

	return ageInYears;
    }
}
