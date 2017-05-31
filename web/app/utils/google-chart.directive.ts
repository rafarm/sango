import { Directive,
	 ElementRef,
	 Input,
	 OnChanges,
	 OnDestroy,
	 SimpleChange,
	 HostListener,
	 NgZone } from '@angular/core';

declare var google:any;
declare var googleChartsLoaded:any;

@Directive({
  selector: '[GoogleChart]'
})
export class GoogleChartDirective implements OnChanges, OnDestroy {
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

	ngOnDestroy() {
	    this._wrapper.getChart().clearChart();
	}

	drawChart() {
	    /*
	    let chartType = this.chartType;
	    let chartData = this.chartData;
	    let chartOptions = this.chartOptions;
	    let element = this._element;
	    let wrapper = this._wrapper;
	    */	
	    this.zone.runOutsideAngular(() => {
		if (!googleChartsLoaded) {
		    googleChartsLoaded = true;
		    google.charts.load('current', {'packages':['corechart']});
		}
		   
	        google.charts.setOnLoadCallback(this.draw.bind(this));
	    });
	}

	private draw() {
	    if (this._wrapper == null) {
                this._wrapper = new google.visualization.ChartWrapper();
            }

            this._wrapper.setChartType(this.chartType);
	    this._wrapper.setDataTable(this.chartData);
	    this._wrapper.setOptions(this.chartOptions);
	    this._wrapper.setContainerId(this._element.id);
            this._wrapper.draw();
	}

	@HostListener('window:resize', ['$event'])
	onResize(event: any) {
  		this.drawChart();
	}
}

