import { Component,
	 Input,
	 OnChanges,
	 SimpleChanges }    	from '@angular/core';

//import { GoogleChartDirective }	from '../../utils/google-chart.directive';

@Component({
    moduleId: module.id,
    selector: 'failedChart',
    template: `
	<div id="pie_chart" chartType="PieChart" [chartData]="pie_ChartData" [chartOptions]="pie_ChartOptions" GoogleChart class="col-sm-6 chart_300"></div>
    `
})
export class GroupFailedChartComponent implements OnChanges {
    @Input()
    studentStats: any;

    pie_ChartData: any[];
    pie_ChartOptions: {};

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
    }

    ngOnChanges(changes: SimpleChanges) {
        // Reset
        this.setPieData();
	//console.log(this.studentStats);
    }

    private setPieData() {
        let pie_data = [];
        pie_data.push( ['#Suspeses', '#Alumnes'] );
        pie_data.push( ['Cap', 0] );
        pie_data.push( ['1', 0] );
        pie_data.push( ['2', 0] );
        pie_data.push( ['3', 0] );
        pie_data.push( ['4+', 0] );
	
        for (let i in this.studentStats) {
            let num_failed = this.studentStats[i].failed;
            if (num_failed <= 3) {
		let value = +pie_data[num_failed+1][1];
		pie_data[num_failed+1][1] = ++value;
            }
            else {
		let value = +pie_data[5][1];
		pie_data[5][1] = ++value;
            }
        }
	
        this.pie_ChartData = pie_data;
    }
}
