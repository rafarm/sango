import { Component, OnInit, OnDestroy }         from '@angular/core';
import { Router, ActivatedRoute, Params }       from '@angular/router';
import { Observable }                           from 'rxjs/Observable';
import { Subscription }                         from 'rxjs/Subscription';

import { AssessmentsService }                   from '../assessments.service';

import { Course }                               from '../../model/course';
import { Group }                                from '../../model/group';
import { Assessment }                           from '../../model/assessment';
import { Student } 				from '../../model/student';
import { Grades }                               from '../../model/grades';

@Component({
    moduleId: module.id,
    templateUrl: './student-detail.component.html',
})
export class StudentDetailComponent {
    /*course: Course;
    assessment: Assessment;
    assessmentOrder: number;
    prevAssessment: Assessment;
    studentIndex: number;*/
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

    private statsSubscription: Subscription;

    constructor(
	private assessmentsService: AssessmentsService,
        private route: ActivatedRoute,
        private router: Router
    ) {
	/*
	this.failed_ChartOptions = {
	    title: 'Assignatures suspeses',
	    titleTextStyle: {
		fontSize: 18
	    },
	    legend: {
		position: 'none'
	    },
	    chartArea: {
		width: '90%'
	    },
	    vAxis: {
		gridlines: {
		    count: 13
		},
		maxValue: 12,
		minValue: 0
	    }
	}
	this.marks_ChartOptions = {
	    title: 'Notes per assignatura',
	    titleTextStyle: {
		fontSize: 18
	    },
	    legend: {
		position: 'top',
		alignment: 'end'
	    },
	    chartArea: {
		width: '94%'
	    },
	    vAxis: {
		gridlines: {
		    count: 3
		},
		maxValue: 10,
		minValue: 0
	    },
	    seriesType: 'bars',
	    series: {
		1: {
		    type: 'line'
		}
	    }
	}
	this.deltas_ChartOptions = {
	    title: 'Diferència amb avaluació anterior',
	    titleTextStyle: {
		fontSize: 18
	    },
	    legend: {
		position: 'none'
	    },
	    chartArea: {
		width: '94%'
	    },
	    vAxis: {
		gridlines: {
		    count: 5
		},
		maxValue: 2,
		minValue: -2
	    }
	}
	*/
    }

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
			    return true;
			}

			return false;
		    });
                });
	    
            // Get students' stats...
            this.assessmentsService.getStudentStats(this.assessment_id, this.group_id).subscribe((stats: any) => this.studentStats = stats);
            
            // Get subjects' stats...
            this.assessmentsService.getSubjectStats(this.assessment_id, this.group_id).subscribe((stats: any) => this.subjectStats = stats);

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

    /*
    ngOnChanges(changes: {[propertyName: string]: SimpleChange}) {
	// Reset 			
	this.failed_ChartData = [];
	this.marks_ChartData = [];
	this.deltas_ChartData = [];

	this.setFailedData();
	this.setMarksData();
	this.setDeltasData();
    }
    
    private setFailedData() {
	let failed_data = this.failed_ChartData;
	
	failed_data.push( ['Avaluació', 'Suspeses'] );
        for (var i = 0; i <= this.assessmentOrder; i++) {
            let _a = this.course.assessments[i];
            let _s = this.studentStats[_a.assessment_id].stats[this.student._id];
            failed_data.push( [_a.name, _s.failed] );
        }
    }

    private setMarksData() {
	let marks_data = this.marks_ChartData;
	let student_marks = this.assessment.students[this.studentIndex].qualifications;
	let course_avgs = this.subjectStats[this.assessment._id].stats;

	this.marks_ChartData.push( ['Assignatura',
				    this.assessment.name,
				    'Mitjana grup'] );
	for (var i = 0; i < student_marks.length; i++) {
	    let mark = student_marks[i];
            if (mark.qualification != null) {
                marks_data.push( [mark.subject_id,
				  mark.qualification,
				  course_avgs[mark.subject_id].avg] );
            }
        }
    }

    private setDeltasData() {
	let deltas_data = this.deltas_ChartData;
	let marks = this.assessment.students[this.studentIndex].qualifications;
	let prev_marks = this.prevAssessment.students[this.studentIndex].qualifications;

        deltas_data.push( ['Assignatura', 'Difència'] );
        for (var i = 0; i < marks.length; i++) {
	    let mark = marks[i];
	    let prev_mark = prev_marks[i];
            if (mark.qualification != null && prev_mark.qualification != null) {
                deltas_data.push( [mark.subject_id,
                                  (mark.qualification-prev_mark.qualification)] );
            }
        }
    }
    */
}
