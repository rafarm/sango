import { Component,
	 Input,
	 OnChanges,
	 SimpleChanges }    	from '@angular/core';

//import { GoogleChartDirective }	from '../../utils/google-chart.directive';
import { Student }		from '../../model/student';
import { Stats }		from '../../model/stats';

@Component({
    moduleId: module.id,
    selector: 'passedChart',
    template: `
	<div id="histogram_chart" chartType="Histogram" [chartData]="histogram_ChartData" [chartOptions]="histogram_ChartOptions" GoogleChart class="chart_300"></div>
    `
})
export class GroupPassedChartComponent implements OnChanges {
    @Input()
    students: any;
    @Input()
    studentStats: any;

    histogram_ChartData: any[];
    histogram_ChartOptions: {};

    constructor() {
	this.histogram_ChartOptions = {
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
        this.setHistogramData();
    }

    private setHistogramData() {
	let hist_data: any[] = [];
	
	if (this.students != undefined && this.studentStats != undefined) {
            hist_data.push( ['Student', 'Passed'] );

	    this.students.forEach((st: Student) => {
		let stats: Stats = this.studentStats[st._id];
		if (stats != undefined) {
		    hist_data.push( [st.last_name + ', ' + st.first_name, stats.passed] );
		}
	    });
	}

	this.histogram_ChartData = hist_data;
    }
}
