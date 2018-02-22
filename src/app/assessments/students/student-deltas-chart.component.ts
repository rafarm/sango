import { Component,
         Input,
	 OnChanges,
	 SimpleChanges }    	from '@angular/core';

import { Subject }		from '../../model/subject';
import { Stats }		from '../../model/stats';

@Component({
    selector: 'deltasChart',
    template: `
	<div *ngIf="grades && prev_grades && subjects" id="deltas_chart" chartType="ColumnChart" [chartData]="chartData" [chartOptions]="chartOptions" GoogleChart class="sg-chart-h300"></div>
    `
})
export class StudentDeltasChartComponent implements OnChanges {
    @Input()
    grades: any;
    @Input()
    prev_grades: any;
    @Input()
    subjects: any;

    chartData: any[];
    chartOptions: {};

    constructor() {
	this.chartOptions = {
	    title: "Diferència amb l'avaluació anterior",
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

    ngOnChanges(changes: SimpleChanges) {
        // Reset
        this.setData();
    }

    private setData() {
	let data: any[] = [];

	if (this.grades != undefined && this.prev_grades != undefined && this.subjects != undefined) {
	    // Headers...
	    data.push( ['Assignatura', 'Diferència'] );

	    // Values...
	    this.subjects.forEach((su: any) => {
		let su_id = su.subject_id;
		let grade = this.grades[su_id];
		let prev_grade = this.prev_grades[su_id];
		if (grade.enroled) {
		    let values: any[] = [];
		    
		    values.push(grade.value - prev_grade.value);

		    if (values.length == 1) {
			values.unshift(su_id.slice(0,4));
			data.push(values);
		    }
		}
	    });
	
            this.chartData = data;
        }
    }
}
