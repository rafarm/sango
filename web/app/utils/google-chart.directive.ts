import { Directive,
	 ElementRef,
	 Input,
	 OnInit,
	 OnChanges,
	 OnDestroy,
	 SimpleChange,
	 HostListener } from '@angular/core';

declare var google:any;
declare var googleChartsLoaded:any;

@Directive({
  selector: '[GoogleChart]'
})
export class GoogleChartDirective implements OnInit, OnChanges, OnDestroy {
	@Input() chartType: string;
	@Input() chartOptions: Object;
	@Input() chartData: Object;

	private _element: any;
	private _wrapper: any = null;
  
	constructor(private element: ElementRef) {
	    this._element = this.element.nativeElement;
	}

	ngOnInit() {
	    if(!googleChartsLoaded) {
		google.charts.load('45', {packages:['corechart'], callback: this.loadCharts.bind(this) });
	    }
	}
  
	ngOnChanges(changes: {[propertyName: string]: SimpleChange}) {
	    this.drawChart();
	}

	ngOnDestroy() {
	    this.clearChart();
	}

	private loadCharts() {
	    googleChartsLoaded = true;
	    this.drawChart();
	}

	private drawChart() {
	    if (googleChartsLoaded) {
	    	if (this._wrapper == null) {
                    this._wrapper = new google.visualization.ChartWrapper();
                }

		this.clearChart();

                this._wrapper.setChartType(this.chartType);
	        this._wrapper.setDataTable(this.chartData);
	        this._wrapper.setOptions(this.chartOptions);
	        this._wrapper.setContainerId(this._element.id);
                this._wrapper.draw();
            }
	}

        private clearChart() {
		if (this._wrapper != null && this._wrapper.getChart() != undefined) {
                this._wrapper.getChart().clearChart();
            }
	}

	@HostListener('window:resize', ['$event'])
	onResize(event: any) {
  	    this.drawChart();
	}
}

