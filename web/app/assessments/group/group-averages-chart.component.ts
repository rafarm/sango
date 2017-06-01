import { Component,
	 Input,
	 OnChanges,
	 SimpleChanges }    	from '@angular/core';

//import { GoogleChartDirective }	from '../../utils/google-chart.directive';
//import { Stats }		from '../../model/stats';

@Component({
    moduleId: module.id,
    selector: 'averagesChart',
    template: `
	<div id="averages_chart" chartType="ComboChart" [chartData]="chartData" [chartOptions]="chartOptions" GoogleChart class="chart_300"></div>
    `
})
export class GroupAveragesChartComponent implements OnChanges {
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
       //TODO...
    }
}
