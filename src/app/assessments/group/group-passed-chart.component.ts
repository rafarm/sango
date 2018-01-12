import { Component,
	 Input,
	 OnChanges,
	 SimpleChanges }    	from '@angular/core';

import { Student }		from '../../model/student';
import { Stats }		from '../../model/stats';

@Component({
    selector: 'passedChart',
    template: `
	<div *ngIf="students && studentStats" id="histogram_chart" chartType="Histogram" [chartData]="chartData" [chartOptions]="chartOptions" GoogleChart class="chart_300"></div>
    `
})
export class GroupPassedChartComponent implements OnChanges {
    @Input()
    students: any;
    @Input()
    studentStats: any;

    chartData: any[];
    chartOptions: {};

    constructor() {
	this.chartOptions = {
            title: 'Passed Subjects',
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
    }

    ngOnChanges(changes: SimpleChanges) {
        // Reset
        this.setData();
    }

    private setData() {
	let data: any[] = [];
	
	if (this.students != undefined && this.studentStats != undefined) {
            data.push( ['Student', 'Passed'] );

	    this.students.forEach((st: Student) => {
		let stats: Stats = this.studentStats[st._id];
		if (stats != undefined) {
		    data.push( [st.last_name + ', ' + st.first_name, stats.passed] );
		}
	    });
	}
	
	this.chartData = data;
    }
}
