import { NgModule } 			from '@angular/core';

import { UtilsModule }			from '../../utils/utils.module';
import { CoreModule }			from '../../core/core.module';

import { GroupRoutingModule }		from './group-routing.module';

import { GroupComponent }		from './group.component';
import { GroupChartsComponent }		from './group-charts.component';
import { GroupFailedChartComponent }	from './group-failed-chart.component';
import { GroupPassedChartComponent }	from './group-passed-chart.component';
import { GroupAveragesChartComponent }	from './group-averages-chart.component';
import { GroupRatiosChartComponent }	from './group-ratios-chart.component';

@NgModule({
    imports: [
	UtilsModule,
	GroupRoutingModule
    ],
    declarations: [
	GroupComponent,
	GroupChartsComponent,
	GroupFailedChartComponent,
	GroupPassedChartComponent,
	GroupAveragesChartComponent,
	GroupRatiosChartComponent
    ]
})

export class GroupModule {}
