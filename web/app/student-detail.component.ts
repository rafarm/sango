import { Component, Input, OnChanges, SimpleChange } from '@angular/core';
import { GoogleChartDirective } from './directives/google-chart.directive';

import { DataService } from './data.service';
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
    studentIndex: number;
    @Input()
    student: Student;
    @Input()
    studentStats: {};
    @Input()
    subjectStats: {};

    failed_ChartData = [];
    failed_ChartOptions: {};
    marks_ChartData = [];
    marks_ChartOptions: {};
    deltas_ChartData = [];
    deltas_ChartOptions: {};

    constructor(private dataService: DataService) {
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

	let order = this.findAssessmentOrder();
        if (order > 0) {
            let prev_assessment_id = this.course.assessments[order-1].assessment_id;

            // Get previous assessment
            this.dataService.getAssessment(prev_assessment_id)
                .then(assessment => this.setDeltasData(assessment));
        }
    }
    
    private setFailedData() {
	let failed_data = this.failed_ChartData;
	let order = this.findAssessmentOrder();
	console.info( 'setFailedData: ' + order);
	failed_data.push( ['Avaluació', 'Suspeses'] );
        for (var i = 0; i <= order; i++) {
            let a = this.course.assessments[i];
            let s = this.studentStats[a.assessment_id].stats[this.student._id];
            failed_data.push( [a.name, s.failed] );
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

    private setDeltasData(prev_assessment: Assessment) {
	let deltas_data = this.marks_ChartData;
	let marks = this.assessment.students[this.studentIndex].qualifications;
	let prev_marks = prev_assessment.students[this.studentIndex].qualifications;

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

    private findAssessmentOrder(): number {
        var order = 0;

        while (order<this.course.assessments.length && 
                this.course.assessments[order].assessment_id !== this.assessment._id) {
            order++;
        }

        return order;
    }
}
