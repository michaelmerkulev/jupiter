import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SidebarService } from '../sidebar.service';
import { AppConfig } from '../config/app.config';
import { DriverService } from '../driver.service';
import { SearchService } from '../search/search.service';
import { EventsService } from '../core/services/events.service';
import { ToasterService } from 'angular2-toaster';

declare interface TableData {
	headerRow: string[];
	dataRows: string[][];
}
@Component({
  selector: 'app-driverdetail',
  templateUrl: './driverdetail.component.html',
  styleUrls: ['./driverdetail.component.css']
})
export class DriverdetailComponent implements OnInit {
	public tableData1: TableData;

	public edited = false;
	public driverData = true;
	// @ViewChild('address') ElementRef;

	user = {
		address: '',
		carType: '',
		code: '',
		deviceId: '',
		domain: '',
		email: '',
		lastname: '',
		hourly: 0,
		userId: '',
		isSocialUser: true,
		lang: '',
		drivername: '',
		latitude: 0,
		licenseNumber: '',
		loginStatus: '',
		longitude: '',
		notification: '',
		password: '',
		phoneNumber: '',
		phoneVerified: '',
		price: '',
		push: '',
		restKey: '',
		role: '',
		socialUser: '',
		status: '',
		website: ''

	};
	output: any;
	outputMessage: string;
	id: number;
	userId;
	supplierId;
	myTaxis = [];
	add: boolean = false;

	lat: number;
	lng: number;
	addressArray: google.maps.GeocoderAddressComponent[];
	country: any;
	zipcode: any;
	state: any;
	filename: any;
	imageBaseURL: string;
	geometryArray: any;
	photo: any;
	taxiArray: any[];
	city: string;

	constructor(
		public router: Router,
		private http: HttpClient,
		public sidebar: SidebarService,
		private Driver: DriverService,
		private searchService: SearchService,
		private eventsService: EventsService,
		public toasterService: ToasterService,
	) {
		this.userId = localStorage.getItem('userId');
		this.supplierId = localStorage.getItem('supplierId');
		// this.id = this.supplierId;
   		this.getMyTaxis();
	}

	ngOnInit() {
		this.sidebar.show();
	}
	getMyTaxis() {
		this.eventsService.broadcast('loader:show');
		this.searchService.taxiPositionData(this.supplierId, this.userId).subscribe((res: any) => {
			this.myTaxis = res.data;
			this.myTaxis = this.myTaxis;
			localStorage.setItem('myTaxis', JSON.stringify(this.myTaxis));
			this.eventsService.broadcast('loader:hide');
		}, err => {
			this.eventsService.broadcast('loader:hide');
		});
	}

	addDriver() {
		this.add = true;
		this.edited = true;
		this.driverData = false;
		// this.router.navigate(['/trip/detail', { id: id }]);
		this.router.navigate(['/driver', { }]);
	}

	cancel() {
		this.add = false;
		this.edited = false;
	}

	editDriver(taxiData) {
		this.Driver.getTaxiDetails(taxiData.id).subscribe((res: any) => {
			console.log('Driver >>> ', res);
			this.user = res.data;
			console.log('Driversss', this.user);
			console.log(this.user);
			this.edited = true;
			this.add = false;
		}, err => {
			console.log(err);
		});
	}


	removeTaxi(taxi) {
		if (confirm('Are you sure you want to remove this driver?')) {
			this.eventsService.broadcast('loader:show');
			this.Driver.deleteDriver(taxi.id).subscribe(res => {
				this.getMyTaxis();
				this.eventsService.broadcast('loader:hide');
				this.toasterService.pop('success', 'Success', 'Deleted Successfully.');
			}, err => {
				this.eventsService.broadcast('loader:hide');
				this.toasterService.pop('error', 'Error', 'Something went wrong.');
			});
		}
	}

	addUpdateDriver(type) {
		const parameters = {
		  	'address': this.user.address,
			'carType': this.user.carType,
			'code': this.state,
		  	'deviceId': 'string',
		  	'domain': 'string',
			'email': this.user.email,
			'firstName': this.user.drivername,
			'hourly': 0,
			'id': this.user.userId,
			'imageInfo': {
				'blobkey': 'string',
				'fileName': this.filename,
				'imageUrl': this.imageBaseURL
			},
			'isSocialUser': true,
			'lang': 'string',
			'lastName': this.user.lastname,
			'latitude': this.lat,
			'licenseNumber': 'string',
			'loginStatus': 'string',
			'longitude': this.lng,
			'notification': 'string',
		  	'password': this.user.password,
			'price' : this.user.price,
			'phoneNumber': this.user.phoneNumber + '',
			'phoneVerified': 'string',
			'push': 'string',
			'restKey': 'string',
			'role': 'ROLE_DRIVER',
			'socialUser': true,
	  		'status': 'string',
			'website': 'TAXIDEALS'
		};
		this.eventsService.broadcast('loader:show');
		if (type === 'add') {
			this.Driver.addDriver(parameters).subscribe(res => {
			// return this.http.post(AppConfig.base_url + 'supplier/user/v1/detail/type/signup', parameters).subscribe(res => {
				this.eventsService.broadcast('loader:hide');
				this.toasterService.pop('success', 'Success', 'Added Successfully.');
					this.getMyTaxis();
					//this.clearDriverForm();
					this.edited = false;
					},
				err => {
					this.eventsService.broadcast('loader:hide');
					this.toasterService.pop('error', 'Error', 'Something went wrong. We are looking into it.');
				}
			);
		} else {
			this.Driver.editDriver(parameters).subscribe(res => {

				this.toasterService.pop('success', 'Success', 'Driver Details Updated Successfully.');
				this.edited = false;
				this.getMyTaxis();
				this.eventsService.broadcast('loader:hide');
				//this.clearDriverForm();
			}, err => {
				this.eventsService.broadcast('loader:hide');
				this.toasterService.pop('error', 'Error', 'Something went wrong.');
			});
		}
	}
}
