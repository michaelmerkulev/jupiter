import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { EventsService } from '../../core/services/events.service';
import { MapsAPILoader, LatLngLiteral } from '@agm/core';
import { SidebarService } from '../../sidebar.service';
import { DriverService } from '../../driver.service';
import { ToasterService } from '../../../../node_modules/angular2-toaster';
import { SearchService } from '../../search/search.service';
import { AppConfig } from '../../config/app.config';

import { jsonpCallbackContext } from '@angular/common/http/src/module';


declare interface TableData {
	headerRow: string[];
	dataRows: string[][];
}

@Component({
  selector: 'app-drivertop',
  templateUrl: './drivertop.component.html',
  styleUrls: ['./drivertop.component.css']
})
export class DrivertopComponent implements OnInit {
	public tableData1: TableData;

	public edited = false;
	public driverData = true;

	public email: '';
	public password: '';
	public firstName: '';
	public carType: '';
	public lastName: '';
	public licenseNumber: '';
	public phoneNumber: '';
	public address: string;
	public cityCode: '';
	public basePrice: '';
	public price: '';
	public peakPrice: '';
	public seats: '';
	public vehicleYear: '';
	public taxiNumber: '';
	public vehicleBrand: '';
	public website: '';
	public userId:string;


 	photo: any;
	filename: any;
	hide: boolean = true;
	imageBaseURL: string;
	agreeTerms = false;
	latitude: string;
	longitude: string;

	output: any;
	outputMessage: string;
	myTaxis = [];
	@ViewChild('search') public searchElement: ElementRef;
	lat: number;
	lng: number;
	addressArray: google.maps.GeocoderAddressComponent[];
	city: any;
	country: any;
	zipcode: any;
	state: any;
	geometryArray: any;
 	//userId: string;
  	supplierId: string;
	add: boolean;

	submitted = false;

	

	constructor(
		private router: Router,
		private http: HttpClient,
		public toasterService: ToasterService,
		private mapsAPILoader: MapsAPILoader,
	 	private ngZone: NgZone,
		public sidebar: SidebarService,
		private Driver: DriverService,
		private searchService: SearchService,
		public eventsService: EventsService,
		p) {
		this.userId = localStorage.getItem('userId');
		this.supplierId = localStorage.getItem('supplierId');
		//this.getMyTaxis();
		}
	// registerUSerData={}

	// convenience getter for easy access to form fields
	

	ngOnInit() {
		console.log(this.userId);
		
		this.sidebar.show();
		this.mapsAPILoader.load().then(
			() => {
				let autocomplete = new google.maps.places.Autocomplete(this.searchElement.nativeElement, {types: ['address']});
				autocomplete.addListener('place_changed', () => {
					this.ngZone.run(() => {
						let place: google.maps.places.PlaceResult = autocomplete.getPlace();
						if (place.geometry === undefined || place.geometry === null) {
							this.address = place.formatted_address;
							this.lat = place.geometry.location.lat();
							this.lng = place.geometry.location.lng();
							//this.user.address = this.user.address;
							return;
						}
						this.lat = place.geometry.location.lat();
						this.lng = place.geometry.location.lng();
						this.addressArray = place.address_components;
						this.address = place.formatted_address;
						//this.city = this.retriveAddressComponents('locality');
						//this.country = this.retriveAddressComponents('country');
						//this.zipcode = this.retriveAddressComponents('postal_code');
						this.state = this.retriveAddressComponents('administrative_area_level_1');
						
						console.log(this.state);
					});
				});
			}
		);
	}
	retriveAddressComponents(type: any) {
		let res =  this.addressArray.find(address_components => address_components.types[0] === type);
		let state = this.addressArray.find(geometry => geometry.types[0] === type);
		localStorage.setItem('address', JSON.stringify( res));
		localStorage.setItem('lat', JSON.stringify(this.lat));
		localStorage.setItem('lng', JSON.stringify(this.lng));
		localStorage.setItem('state', JSON.stringify(this.state));
		//console.log(res);
		// tslint:disable-next-line:no-unused-expression
		return res.long_name, state.short_name;

	}

	onChange(value) {
		if (value === 'ROLE_USER') {
			this.hide = false;
		} else {
			this.hide = true;
		}
	}

	// registerUser(){
	//   console.log(this.registerUSerData)
	// }

	// public _url1: string = 'http://1-dot-taxi2deals.appspot.com/app/supplier/user/v1/type/signup';
	// public _url2: string = 'http://1-dot-taxi2deals.appspot.com/app/taxi/uploadurl';

	loadImageFileAsURL(event) {
		// get the file name
		this.filename = this.photo.replace(/^.*[\\\/]/, '');

		// converting to base64url
		if (this.photo.length > 0) {
			const fileToLoad = event.srcElement.files[0];
			const fileReader = new FileReader();
			fileReader.onload = (fileLoadedEvent: any) => {
				console.log('>>>>>>>ed', fileLoadedEvent);
				// Base64Url
				this.imageBaseURL = fileLoadedEvent.target.result;

			};
			fileReader.readAsDataURL(fileToLoad);
		}
	}

	uploadImage() {

		const params = {
			'blobkey': 'string',
			'fileName': this.filename,
			'imageUrl': this.imageBaseURL
		};

		this.http.post(AppConfig.base_url + 'taxi/uploadurl', params).subscribe(res => {
			console.log('>>', res);
			this.toasterService.pop('success', 'Success', 'Image uploaded successfully.');
		}, err => {
			console.log('>>Err', err);
			this.toasterService.pop('error', 'Error', 'Something went wrong. We are looking into it.');
		});
	}

	getMyTaxis() {
		this.eventsService.broadcast('loader:show');
		this.searchService.taxiPositionData(this.supplierId, this.userId).subscribe((res: any) => {
			this.myTaxis = res.data;
			this.eventsService.broadcast('loader:hide');
		}, err => {
			this.eventsService.broadcast('loader:hide');
		});
	}

	editDriver(taxiData) {
		// this.Driver.getTaxiDetails(taxiData.id).subscribe((res: any) => {
		// 	console.log('Driver >>> ', res);
		// 	this.user = res.data;
		// 	console.log('Driversss', this.user);
		// 	this.edited = true;
		// 	this.add = false;
		// }, err => {
		// 	console.log(err);
		// });
	}

	addDriver() {
		this.add = false;
		this.edited = true;
		this.driverData = false;

	}

	cancel() {
		this.add = false;
		this.edited = false;
		this.router.navigate(['/driverdetail', { }]);
	}


	clearDriverForm() {
		this.firstName = '';
		this.lastName = '';
		this.email = '';
		this.password = '';
		this.phoneNumber = '';
		this.address = '';
		this.state = '';
		this.carType = '';
		this.basePrice = '';
		this.price = '';
		this.peakPrice = '';
		this.seats = '';
		this.taxiNumber = '';
		this.vehicleBrand = '';
		this.vehicleYear = '';
		this.website = '';
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

}

