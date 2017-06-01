import { Component,
	 Input,
	 OnChanges,
	 SimpleChanges }    	from '@angular/core';

//import { GoogleChartDirective }	from '../../utils/google-chart.directive';
import { Subject }		from '../../model/subject';
import { Stats }		from '../../model/stats';

@Component({
    moduleId: module.id,
    selector: 'ratiosChart',
    template: `
	<div id="ratios_chart" chartType="ComboChart" [chartData]="chartData" [chartOptions]="chartOptions" GoogleChart class="chart_300"></div>
    `
})
export class GroupRatiosChartComponent implements OnChanges {
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
            title: 'Ratios by Subject',
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
                maxValue: 1,
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
        this.setData();
    }

    private setData() {
	let data: any[] = [];

	if (this.subjects != undefined && this.subjectStats != undefined && this.levelStats != undefined) {

	    // Headers...
	    data.push( ['Subject', 'Level Ratio', 'Group Ratio'] );

	    // Values...
	    this.subjects.forEach((su: Subject) => {
		let values: any[] = [];

		let l_stats: Stats = this.levelStats[su._id];
		if (l_stats != undefined) {
                    values.push( l_stats.ratio );
                }

		let s_stats: Stats = this.subjectStats[su._id];
		if (s_stats != undefined) {
                    values.push( s_stats.ratio );
                }

		if (values.length == 2) {
		    values.unshift(su._id.slice(0,4));
		    data.push(values);
		}
	    });
	    console.log(data);
	
            this.chartData = data;
        }
    }
}
