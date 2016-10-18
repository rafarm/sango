import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { GoogleChartDirective } from './directives/google-chart.directive';

import { Course } from './model/course';
import { Student } from './model/student';
import { AssessmentStats } from './model/assessment-stats';
    
@Component({
    selector: 'assessment-group',
    //directives: [GoogleChartDirective],
    templateUrl: 'app/assessment-group.component.html'
})
export class AssessmentGroupComponent implements OnChanges {
    @Input()
    course: Course;
    @Input()
    assessmentId: string;
    @Input()
    students: any;
    @Input()
    studentStats: any;
    @Input()
    subjectStats: any;
    @Input()
    levelStats: any;

    pie_ChartData = [];
    pie_ChartOptions: {};
    histogram_ChartData = [];
    histogram_ChartOptions: {};
    averages_ChartData = [];
    averages_ChartOptions: {};

    constructor() {
	this.pie_ChartOptions = {
	    title: 'Assignatures suspeses',
	    titleTextStyle: {
		fontSize: 18
	    },
	    fontSize: 22,
	    legend: {
		position: 'labeled'
	    },
	    pieSliceText: 'none',
	    chartArea: {
		width: '90%'
	    }
	}
	this.histogram_ChartOptions = {
	    title: 'Histograma d\'assignatures aprovades',
	    titleTextStyle: {
		fontSize: 18
	    },
	    legend: {
		position: 'none'
	    },
	    chartArea: {
		width: '90%'
	    },
	    histogram: {
		bucketSize: 1,
		minValue: 0
	    },
	    vAxis: {
		gridlines: {
		    count: 7
		},
		maxValue: 10,
		minValue: 0
	    }
	}	
	this.averages_ChartOptions = {
	    title: 'Mitjanes per assignatura',
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
		0: {
		    type: 'line'
		}
	    }
	}
    }

    ngOnChanges(changes: SimpleChanges) {
	// Reset
	this.pie_ChartData = [];
	this.histogram_ChartData = [];
	this.averages_ChartData = [];

	// Set pie data
	let pie_data = this.pie_ChartData;
	pie_data.push( ['#Suspeses', '#Alumnes'] );
	pie_data.push( ['Cap', 0] );
	pie_data.push( ['1', 0] );
	pie_data.push( ['2', 0] );
	pie_data.push( ['3', 0] );
	pie_data.push( ['4+', 0] );
	//for (var i = 0; i < studentsStats.length; i++) {
	for (let i in this.studentStats) {
	    let num_failed = this.studentStats[i].failed;
	    if (num_failed <= 3) {
		pie_data[num_failed+1][1]++;
	    }
	    else {
		pie_data[5][1]++;
	    }
	}

	// Set histogram data
	let hist_data = this.histogram_ChartData;
	hist_data.push( ['Alumne', 'Aprovades'] );
	//for (var i = 0; i < students.length; i++) {
	for (let i in this.studentStats) {
	    let student = this.students[i];
	    hist_data.push( [student.last_name + ', ' + student.first_name, this.studentStats[i].passed] );
	}
        
	// Set averages by subject data
	let averages_data = this.averages_ChartData;
	let stats = this.subjectStats;
	// Fins selected assessment order
	var order = 0;
	while (order<this.course.assessments.length && 
		this.course.assessments[order].assessment_id !== this.assessmentId) {
	    order++;
	}
	console.info('Setting stats charts data: ' + order);
	// ...Headers
	let headers = ['Assignatura', 'Mitjana nivell'];
	for (var i = 0; i <= order; i++) {
	    headers.push( this.course.assessments[i].name );
	}
	averages_data.push( headers );
	// ...Values
	for (let s in stats[this.course.assessments[0].assessment_id].stats) {
	    // Subject id
	    let values = [s];

	    // Level avg for subject
	    values.push( this.levelStats[s].avg );

	    // Assessment avg for subject
	    for (var i=0; i<=order; i++) {
		let a_id = this.course.assessments[i].assessment_id;
		values.push( this.subjectStats[a_id].stats[s].avg );
	    }

	    averages_data.push( values );
	}
    }
}

