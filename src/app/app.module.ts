import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { DriverComponent } from './driverdetail/driver/driver.component';
import { DrivertopComponent } from './drivertopup/driver/drivertop.component';
import { MytaxisComponent } from './mytaxis/mytaxis.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SidebarComponent } from './sidebar/sidebar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RouterModule } from '@angular/router';
import { VechicleComponent } from './vechicle/vechicle.component';
import { VechgetComponent } from './vechget/vechget.component';
import { ApprovalComponent } from './approval/approval.component';
import { AgmCoreModule } from '@agm/core';
import { TripModule } from './trip/trip.module';
import { SearchModule } from './search/search.module';
import { AdminsComponent } from './admins/admins.component';
import { ToasterService, ToasterModule } from 'angular2-toaster';
import { LoaderComponent } from './core/services/loader/loader.component';
import { EventsService } from './core/services/events.service';
import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestore } from '../../node_modules/@angular/fire/firestore';
import { CompanynameComponent } from './companyname/companyname.component';
import { TokenInterceptor } from './core/services/token.interceptor';
import { ApiService } from './core/services/api.service';
import { DriverService } from './driver.service';
import { ChartsModule } from 'ng2-charts';
import { CollapseModule } from 'ngx-bootstrap';
import { TermsComponent } from './terms/terms.component';
import { ProfileComponent } from './profile/profile.component';
import { DriverdetailComponent } from './driverdetail/driverdetail.component';
import { DrivertopupComponent } from './drivertopup/drivertopup.component';
import { MapComponent } from './map/map.component';
import { AdminlistComponent } from './adminlist/adminlist.component';

export function createTranslateLoader(http: HttpClient) {
	return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({

	imports: [
		AngularFireModule.initializeApp(environment.firebase),
		BrowserModule,
		FormsModule,
		HttpModule,
		HttpClientModule,
		TranslateModule.forRoot({
			loader: {
				provide: TranslateLoader,
				useFactory: (createTranslateLoader),
				deps: [HttpClient]
			}
		}),
		ReactiveFormsModule,
		RouterModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		AgmCoreModule.forRoot({
			apiKey: 'AIzaSyDTCQc8JvRvCS5z-AZPv3UpX1HxesohbFs',
			libraries: ['places']
		}),
		TripModule,
		SearchModule,
		ToasterModule.forRoot(),
		ChartsModule,
		CollapseModule.forRoot()
	],
	declarations: [
		AppComponent,
		RegisterComponent,
		LoginComponent,
		DriverComponent,
		MytaxisComponent,
		SidebarComponent,
		DashboardComponent,
		VechicleComponent,
		VechgetComponent,
		ApprovalComponent,
		AdminsComponent,
		LoaderComponent,
		CompanynameComponent,
		TermsComponent,
		ProfileComponent,
		DriverdetailComponent,
		DrivertopupComponent,
		AdminlistComponent,
		MapComponent
	],

	providers: [
		{
			provide: HTTP_INTERCEPTORS,
			useClass: TokenInterceptor,
			multi: true
		},
		AppRoutingModule,
		ToasterService,
		EventsService,
		AngularFirestore,
		ApiService,
		DriverService
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
