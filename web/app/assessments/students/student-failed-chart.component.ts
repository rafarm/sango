import { Component,
         Input,
	 OnChanges,
	 SimpleChanges }    	from '@angular/core';

//import { Subject }		from '../../model/subject';
import { Stats }		from '../../model/stats';

@Component({
    moduleId: module.id,
    selector: 'failedChart',
    template: `
	<div *ngIf="stats" id="failed_chart" chartType="ColumnChart" [chartData]="chartData" [chartOptions]="chartOptions" GoogleChart class="chart_200"></div>
    `
})
export class StudentFailedChartComponent implements OnChanges {
    @Input()
    stats: any;

    chartData: any[];
    chartOptions: {};

    constructor() {
	this.chartOptions = {
	    title: 'Failed Subjects',
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
    }

    ngOnChanges(changes: SimpleChanges) {
        // Reset
        this.setData();
    }

    private setData() {
	let data: any[] = [];
	
	if (this.stats != undefined) {
	    // Headers...
	    data.push( ['Assessment', 'Failed'] );

	    // Values...
	    this.stats.forEach((st: any) => {
		data.push([st._id, st.stats.failed]);
	    });
	
            this.chartData = data;
        }
    }
}
