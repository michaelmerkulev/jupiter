import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../sidebar.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToasterService } from 'angular2-toaster';
import { DriverService } from '../driver.service';
import { SearchService } from '../search/search.service';
import { EventsService } from '../core/services/events.service';
@Component({
	selector: 'app-vechicle',
	templateUrl: './vechicle.component.html',
	styleUrls: ['./vechicle.component.css']
})
export class VechicleComponent implements OnInit {
	output: any;
	outputMessage: any;
	outputData: any;
	response: any;
	supplierId: string;
	taxiId: string;
	userId: string;
	myvechicle: any;
	name: any;

	vehicle = {
		basePrice: '',
		carType: '',
		peakPrice: '',
		price: '',
		seats: '',
		taxiNumber: '',
		transporttype: '',
		vehicleBrand: '',
		year: '',
	};

	constructor(
		public sidebar: SidebarService,
		private router: Router,
		private http: HttpClient,
		private toasterService: ToasterService,
		private driverService: DriverService,
private searchService: SearchService,
		private eventsService: EventsService
	) {
this.taxiId = localStorage.getItem('taxiId');
this.name = localStorage.getItem('name');
		this.getMyvechicle();
	}

	ngOnInit() {
		this.sidebar.show();
	}
	getMyvechicle() {
		this.eventsService.broadcast('loader:show');
		// this.searchService.getvechicle( this.userId, this.name).subscribe((res: any) => {
this.searchService.getvechicle( this.taxiId).subscribe((res: any) => {
this.myvechicle = res.data;
this.vehicle.basePrice = this.myvechicle.basePrice;
this.vehicle.carType = this.myvechicle.carType;
this.vehicle.peakPrice = this.myvechicle.peakPrice;
this.vehicle.price = this.myvechicle.price;
this.vehicle.seats = this.myvechicle.seats;
this.vehicle.taxiNumber = this.myvechicle.taxiNumber;
this.vehicle.vehicleBrand = this.myvechicle.vehicleBrand;
this.vehicle.year = this.myvechicle.year;

			this.eventsService.broadcast('loader:hide');
		}, err => {
			this.eventsService.broadcast('loader:hide');
		});
}
	vechicleDriver() {
		const param = {
			'active': true,
			'additionalInformation': 'string',
			'airPortprice': 0,
			'basePrice': parseInt(this.vehicle.basePrice, 10),
			'carType': this.vehicle.carType,
			'city': 'string',
			'cityDTO': {
				'code': 'string',
				'countryId': 0,
				'description': 'string',
				'id': 0,
				'lang': 'string',
				'name': 'string',
				'region': 'string',
				'zipCode': 'string'
			},
			'currency': 'string',
			'description': 'string',
			'destination': 'string',
			'driverPhonenumber': 'string',
			'drivername': 'string',
			'id': 0,
			'imageInfos': [
				{
					'blobkey': 'string',
					'fileName': 'string',
					'imageUrl': 'string'
				}
			],
			'latitude': 0,
			'longitude': 0,
			'name': 'string',
			'peakPrice': parseInt(this.vehicle.peakPrice, 10),
			'perDay': 0,
			'phoneNumber': 'string',
			'pickUpLocation': 'Any',
			'price': parseInt(this.vehicle.price, 10),
			'seats': parseInt(this.vehicle.seats, 10),
			'source': 'string',
			'status': 'string',
			'supplierDTO': {
				'id': 0,
				'licenseNumber': 'string',
				'name': 'string',
				'userId': 0
			},
			'supplierId': localStorage.getItem('supplierId'),
			'tags': [
				'string'
			],
			'taxiId': localStorage.getItem('taxiId'),
			'taxiNumber': this.vehicle.taxiNumber,
			'transporttype': 'airport',
			'updatedOn': 'string',
			'userId': localStorage.getItem('userId'),
			'vehicleBrand': this.vehicle.vehicleBrand,
			'vehicleTypeDTO': {
				'description': 'string',
				'id': 0,
				'lang': 'string',
				'code': 'string',
				'name': 'string'
			},
			'vehicleYear': 0,
			'waitingTime': 0,
			'weekEndOffer': 0,
			'year': parseInt(this.vehicle.year, 10)
		};
		this.driverService.updateVehicleInfo(param).subscribe((response: any) => {
			this.output = response;
			if (this.output.status === true) {
				this.toasterService.pop('success', 'Success', 'Updated Vehicle Info.');
				this.vehicle = {
					basePrice: '',
					carType: '',
					peakPrice: '',
					price: '',
					seats: '',
					taxiNumber: '',
					transporttype: '',
					vehicleBrand: '',
					year: '',
				};
			} else {
				this.toasterService.pop('error', 'Error', response.message);
			}
		}, err => {
			console.log(err);
		});
	}
}
