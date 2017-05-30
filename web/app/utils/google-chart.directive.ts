import { Directive,
	 ElementRef,
	 Input,
	 OnChanges,
	 SimpleChange,
	 HostListener,
	 NgZone } from '@angular/core';

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

	private _wrapper: any = null;
  
	constructor(private element: ElementRef, private zone: NgZone) {
	    this._element = this.element.nativeElement;
	}
  
	ngOnChanges(changes: {[propertyName: string]: SimpleChange}) {
	    this.drawChart();
	}

	drawChart() {
	    let chartType = this.chartType;
	    let chartData = this.chartData;
	    let chartOptions = this.chartOptions;
	    let element = this._element;
	    let wrapper = this._wrapper;
		
	    this.zone.runOutsideAngular(() => {
		if(!googleChartsLoaded) {
		    googleChartsLoaded = true;
		    google.charts.load('current', {'packages':['corechart']});
		}
		    
	        google.charts.setOnLoadCallback(() => {
		    wrapper = new google.visualization.ChartWrapper({
			chartType: chartType,
			dataTable: chartData,
			options: chartOptions || {},
			containerId: element.id
		    });
		    wrapper.draw();
		});
	    });
	}

	@HostListener('window:resize', ['$event'])
	onResize(event: any) {
  		this.drawChart();
	}
}

