import { NgModule, ViewChild } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DriverComponent } from './driverdetail/driver/driver.component';
import { MytaxisComponent } from './mytaxis/mytaxis.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { VechicleComponent } from './vechicle/vechicle.component';
import { VechgetComponent } from './vechget/vechget.component';
import { SearchComponent } from './search/search.component';
import { ApprovalComponent } from './approval/approval.component';
import { TripComponent } from './trip/trip.component';
import { TripDetailComponent } from './trip/trip-detail/trip-detail.component';
import { SearchDetailComponent } from './search/search-detail/search-detail.component';
import { AdminsComponent } from './admins/admins.component';
import { CompanynameComponent } from './companyname/companyname.component';
import { TermsComponent } from './terms/terms.component';
import { ProfileComponent } from './profile/profile.component';
import { DriverdetailComponent } from './driverdetail/driverdetail.component';
import { DrivertopupComponent } from './drivertopup/drivertopup.component';
import { MapComponent } from './map/map.component';
import { AdminlistComponent } from './adminlist/adminlist.component';

const routes: Routes = [
	{
		path: '',           // default route
		component: SearchComponent
	},
	{
		path: 'adminlist',
		component: AdminlistComponent
	},
	{
		path: 'driverdetail',
		component: DriverdetailComponent
	},
	{
		path: 'drivertopup',
		component: DrivertopupComponent
	},
	{
		path: 'search',
		component: SearchComponent
	},
	{
		path: 'profile',
		component: ProfileComponent
	},
	{
		path: 'terms-and-conditions',
		component: TermsComponent
	},
	{
		path: 'approval',
		component: ApprovalComponent
	},
	{ path: 'companyname', component: CompanynameComponent },
	{
		path: 'login',
		component: LoginComponent
	},
	{
		path: 'register',
		component: RegisterComponent
	},
	{
		path: 'dashboard',
		component: DashboardComponent
	},
	{
		path: 'admins',
		component: AdminsComponent
	},
	{
		path: 'driver',
		component: DriverComponent
	},
	{
		path: 'map',
		component: MapComponent
	},
	{
		path: 'trip',
		component: TripComponent,
	},
	{
		path: 'trip/detail',
		component: TripDetailComponent
	},
	{
		path: 'mytaxis',
		component: MytaxisComponent
	},

	{
		path: 'sidebarNav',
		component: SidebarComponent
	}
	,
	{
		path: 'vechicle',
		component: VechicleComponent
	},
	{
		path: 'vechget',
		component: VechgetComponent
	},
	{
		path: 'search/detail',
		component: SearchDetailComponent
	},
	{
		path: '**', redirectTo: 'search'
	}
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule { }
export const routingComponents = [CompanynameComponent, ApprovalComponent, SearchComponent, VechgetComponent,
	MytaxisComponent, DriverComponent, RegisterComponent, DashboardComponent, LoginComponent];
