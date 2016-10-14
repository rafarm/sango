import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { GoogleChartDirective } from './directives/google-chart.directive';

import { Student } from './model/student';
import { AssessmentStudentStats } from './model/assessment-student-stats';
    
@Component({
    selector: 'assessment-group',
    //directives: [GoogleChartDirective],
    templateUrl: 'app/assessment-group.component.html'
})
export class AssessmentGroupComponent implements OnChanges {
    @Input()
    students: any;
    @Input()
    studentsStats: any;

    pie_ChartData = [];
    pie_ChartOptions: {};
    histogram_ChartData = [];
    histogram_ChartOptions: {};
    //averages_ChartData = [];
    //averages_ChartOptions: {};

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
	/*
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
	*/
    }

    ngOnChanges(changes: SimpleChanges) {
	// Reset
	this.pie_ChartData = [];
	this.histogram_ChartData = [];
	//this.averages_ChartData = [];

	// Set pie data
	let pie_data = this.pie_ChartData;
	pie_data.push( ['#Suspeses', '#Alumnes'] );
	pie_data.push( ['Cap', 0] );
	pie_data.push( ['1', 0] );
	pie_data.push( ['2', 0] );
	pie_data.push( ['3', 0] );
	pie_data.push( ['4+', 0] );
	//for (var i = 0; i < studentsStats.length; i++) {
	for (let i in this.studentsStats) {
	    let num_failed = this.studentsStats[i].failed;
	    console.info('AssessmentGroupComponent - OnChanges: failed('+num_failed+')');
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
	for (let i in this.studentsStats) {
	    let student = this.students[i];
	    hist_data.push( [student.last_name + ', ' + student.first_name, this.studentsStats[i].passed] );
	}

	/*
	// Set averages data
	let averages_data = this.averages_ChartData;
	let session_avg = this.session.averages;
	// ...Headers
	let headers = ['Assignatura', 'Mitjana nivell'];
	for (var i = 1; i < session_avg.length; i++) {
	    headers.push( 'Av. '+i );
	}
	averages_data.push( headers );
	// ...Values
	for (var i = 0; i < session_avg[0].length; i++) {
	    let values = [];
	    values.push( this.session.subjects[i] );
	    for (var j = 0; j < session_avg.length; j++) {
		values.push( this.session.averages[j][i] );
	    }
	    averages_data.push( values );
	}
	*/
    }
}

