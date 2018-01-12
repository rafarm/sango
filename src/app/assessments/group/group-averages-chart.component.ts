import { Component,
	 Input,
	 OnChanges,
	 SimpleChanges }    	from '@angular/core';

import { Subject }		from '../../model/subject';
import { Stats }		from '../../model/stats';

@Component({
    moduleId: module.id,
    selector: 'averagesChart',
    template: `
	<div *ngIf="subjects && subjectStats && levelStats" id="averages_chart" chartType="ComboChart" [chartData]="chartData" [chartOptions]="chartOptions" GoogleChart class="chart_300"></div>
    `
})
export class GroupAveragesChartComponent implements OnChanges {
    @Input()
    subjects: any;
    @Input()
    subjectStats: any;
    @Input()
    levelStats: any;

    chartData: any[];
    chartOptions: {};

    constructor() {
	this.chartOptions = {
            title: 'Averages by Subject',
            titleTextStyle: {
                fontSize: 18
            },
            legend: {
                position: 'top',
                alignment: 'end'
            },
            chartArea: {
                width: '90%'
            },
            vAxis: {
                gridlines: {
                    count: 3
                },
                maxValue: 10,
                minValue: 0
            },
            seriesType: 'line',
            series: {
                0: {
                    type: 'bars'
                }
            }
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        // Reset
        this.setData();
    }

    private setData() {
	let data: any[] = [];

	if (this.subjects != undefined && this.subjectStats != undefined && this.levelStats != undefined) {

	    // Headers...
	    data.push( ['Subject', 'Group Average', 'Level Average'] );

	    // Values...
	    this.subjects.forEach((su: Subject) => {
		let values: any[] = [];

		let s_stats: Stats = this.subjectStats[su._id];
		if (s_stats != undefined) {
                    values.push( s_stats.avg );
                }

		let l_stats: Stats = this.levelStats[su._id];
                if (l_stats != undefined) {
                    values.push( l_stats.avg );
                }

		if (values.length == 2) {
		    values.unshift(su._id.slice(0,4));
		    data.push(values);
		}
	    });
	
            this.chartData = data;
        }
    }
}
