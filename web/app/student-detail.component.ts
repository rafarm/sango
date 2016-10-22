import { Component, Input, OnChanges, SimpleChange } from '@angular/core';
import { GoogleChartDirective } from './directives/google-chart.directive';

import { Course } from './model/course';
import { Assessment } from './model/assessment';
import { Student } from './model/student';

@Component({
    selector: 'student-detail',
    //directives: [GoogleChartDirective],
    templateUrl: 'app/student-detail.component.html',
})
export class StudentDetailComponent implements OnChanges {
    @Input()
    course: Course;
    @Input()
    assessment: Assessment;
    @Input()
    assessmentOrder: number;
    @Input()
    prevAssessment: Assessment;
    @Input()
    studentIndex: number;
    @Input()
    student: Student;
    @Input()
    studentStats: any;
    @Input()
    subjectStats: any;

    failed_ChartData = [];
    failed_ChartOptions: {};
    marks_ChartData = [];
    marks_ChartOptions: {};
    deltas_ChartData = [];
    deltas_ChartOptions: {};

    constructor() {
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
    }

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
}
