import { Component,
	 Input,
	 OnChanges,
	 SimpleChanges }    	from '@angular/core';

//import { GoogleChartDirective }	from '../../utils/google-chart.directive';

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
            title: 'Assignatures aprovades',
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
	let hist_data = [];
	
	if (this.students != undefined && this.studentStats != undefined) {
            hist_data.push( ['Alumne', 'Aprovades'] );
        
            for (let i in this.studentStats) {
                let student = this.students[i];
                hist_data.push( [student.last_name + ', ' + student.first_name,
                            this.studentStats[i].passed] );
            }
	}

	this.histogram_ChartData = hist_data;
    }
}
