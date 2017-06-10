import { Component,
	 Input,
	 OnChanges,
	 SimpleChanges }    	from '@angular/core';

//import { GoogleChartDirective }	from '../../utils/google-chart.directive';

@Component({
    moduleId: module.id,
    selector: 'failedChart',
    template: `
	<div *ngIf="studentStats" id="pie_chart" chartType="PieChart" [chartData]="chartData" [chartOptions]="chartOptions" GoogleChart class="chart_300"></div>
    `
})
export class GroupFailedChartComponent implements OnChanges {
    @Input()
    studentStats: any;

    chartData: any[];
    chartOptions: {};

    constructor() {
        this.chartOptions = {
            title: 'Failed Subjects',
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
    }

    ngOnChanges(changes: SimpleChanges) {
        // Reset
        this.setData();
    }

    private setData() {
        let data = [];
        data.push( ['#Failed', '#Students'] );
        data.push( ['None', 0] );
        data.push( ['1', 0] );
        data.push( ['2', 0] );
        data.push( ['3', 0] );
        data.push( ['4+', 0] );
	
        for (let i in this.studentStats) {
            let num_failed = this.studentStats[i].failed;
            if (num_failed <= 3) {
		let value = +data[num_failed+1][1];
		data[num_failed+1][1] = ++value;
            }
            else {
		let value = +data[5][1];
		data[5][1] = ++value;
            }
        }
	
        this.chartData = data;
    }
}
