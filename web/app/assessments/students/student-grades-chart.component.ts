import { Component,
	 Input,
	 OnChanges,
	 SimpleChanges }    	from '@angular/core';

import { Subject }		from '../../model/subject';
import { Stats }		from '../../model/stats';

@Component({
    moduleId: module.id,
    selector: 'gradesChart',
    template: `
	<div *ngIf="grades && subjects && subjectStats" id="grades_chart" chartType="ComboChart" [chartData]="chartData" [chartOptions]="chartOptions" GoogleChart class="chart_300"></div>
    `
})
export class StudentGradesChartComponent implements OnChanges {
    @Input()
    grades: any;
    @Input()
    subjects: any;
    @Input()
    subjectStats: any;

    chartData: any[];
    chartOptions: {};

    constructor() {
	this.chartOptions = {
            title: "Grades",
            titleTextStyle: {
                fontSize: 18
            },
            legend: {
                position: 'top',
                alignment: 'end'
            },
            chartArea: {
                width: '94%'
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

	if (this.grades != undefined && this.subjects != undefined && this.subjectStats != undefined) {
	    // Headers...
	    data.push( ['Subject', 'Grade', 'Group Average'] );

	    // Values...
	    this.subjects.forEach((su: any) => {
		let su_id = su.subject_id;
		let grade = this.grades[su_id];
		if (grade.enroled) {
		    let values: any[] = [];
		    
		    values.push(grade.value);

		    let s_stats: Stats = this.subjectStats[su_id];
		    if (s_stats != undefined) {
			values.push( s_stats.avg );
		    }

		    if (values.length == 2) {
			values.unshift(su_id.slice(0,4));
			data.push(values);
		    }
		}
	    });
	
            this.chartData = data;
        }
    }
}
