import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SidebarService } from '../sidebar.service';
import { AppConfig } from '../config/app.config';
import { DriverService } from '../driver.service';
import { SearchService } from '../search/search.service';
import { EventsService } from '../core/services/events.service';
import { ToasterService } from 'angular2-toaster';
import { ValidationErrors } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

declare interface TableData {
	headerRow: string[];
	dataRows: string[][];
}
@Component({
  selector: 'app-drivertopup',
  templateUrl: './drivertopup.component.html',
  styleUrls: ['./drivertopup.component.css']
})
export class DrivertopupComponent implements OnInit {
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
	amount: '';
	wallet_type:any;
	topupForm: FormGroup;
	
	constructor(
		public router: Router,
		private http: HttpClient,
		public sidebar: SidebarService,
		private Driver: DriverService,
		private searchService: SearchService,
		private eventsService: EventsService,
		public toasterService: ToasterService,
		private formBuilder: FormBuilder
	) {
		this.userId = localStorage.getItem('userId');
		this.supplierId = localStorage.getItem('supplierId');
		this.wallet_type = "CASH";
   		this.getMyTaxis();
	}

	get f() { return this.topupForm.controls; }

	ngOnInit() {
		this.topupForm = this.formBuilder.group({
			amount: ['', Validators.required],
			wallet_type: ['', Validators.required],
		});	
		this.topupForm.setValue({
			"amount": "0",
			"wallet_type": "CASH"
		});
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

	addUpdateDriverTopup() {
		const parameters = {
		  	'adminId': 0,
			'amount': this.topupForm.controls['amount'].value,
			'debit': 0,
		  	'driverId': this.user.userId,
		  	'id': 0,
			'paymentType': this.topupForm.controls['wallet_type'].value,
			'supplierId': this.supplierId,
			'total': 0,
		};
		console.log(parameters);
		this.eventsService.broadcast('loader:show');
		this.Driver.topup(parameters).subscribe(res => {
		
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
	}
}
