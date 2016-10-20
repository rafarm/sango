import { Component, Input, OnChanges, SimpleChange } from '@angular/core';
import { GoogleChartDirective } from './directives/google-chart.directive';

import { Student } from './student';

@Component({
	selector: 'student-detail',
	//directives: [GoogleChartDirective],
	templateUrl: 'app/student-detail.component.html',
})
export class StudentDetailComponent implements OnChanges {
	@Input()
	student: Student;

	@Input()
	subjects: string[];

	@Input()
	order: number;

	@Input()
	averages: number[];

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
		this.marks_ChartData = [];
		this.failed_ChartData = [];
		this.deltas_ChartData = [];

		let qualifications = this.student.qualifications;
		let failed = this.student.num_failed;
		let deltas = this.student.deltas;

		// Set marks data
		this.marks_ChartData.push( ['Assignatura', 'Av. '+this.order, 'Mitjana grup'] );
		for (var i = 0; i < qualifications.length; i++) {
			if (qualifications[i] != null) {
				this.marks_ChartData.push( [this.subjects[i], qualifications[i], this.averages[this.order][i]] );
			}
		}

		// Set number of subjects failed
		this.failed_ChartData.push( ['Avaluació', 'Suspeses'] );
		for (var i = 0; i < failed.length; i++) {
			this.failed_ChartData.push( ['Av. '+(i+1), failed[i]] );
		}

		// Set deltas data
		this.deltas_ChartData.push( ['Assignatura', 'Difència'] );
		for (var i = 0; i < deltas.length; i++) {
			if (deltas[i] != null) {
				this.deltas_ChartData.push( [this.subjects[i], deltas[i]] );
			}
		}
	}
}
