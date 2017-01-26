import { Directive, ElementRef, Input, OnChanges, SimpleChange, HostListener } from '@angular/core';

declare var google:any;
declare var googleChartsLoaded:any;

@Directive({
  selector: '[GoogleChart]'
})
export class GoogleChartDirective implements OnChanges {
	_element:any;
	@Input() chartType:string;
	@Input() chartOptions: Object;
	@Input() chartData: Object;
  
	constructor(private element: ElementRef) {
		this._element = this.element.nativeElement;
	}
  
	ngOnChanges(changes: {[propertyName: string]: SimpleChange}) {
		this.drawChart();
	}

	drawChart() {
		if(!googleChartsLoaded) {
			googleChartsLoaded = true;
			google.charts.load('current', {'packages':['corechart']});
		}

		let chartType = this.chartType;
		let chartData = this.chartData;
		let chartOptions = this.chartOptions;
		let element = this._element;

		google.charts.setOnLoadCallback(function () {
			let wrapper = new google.visualization.ChartWrapper({
				chartType: chartType,
				dataTable: chartData,
				options: chartOptions || {},
				containerId: element.id
			});
			wrapper.draw();
		});
	}

	@HostListener('window:resize', ['$event'])
	onResize(event: any) {
  		this.drawChart();
	}
}

