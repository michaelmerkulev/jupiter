import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToasterService } from '../../../node_modules/angular2-toaster';
import { AppConfig } from '../config/app.config';
import { EventsService } from '../core/services/events.service';
import { MapsAPILoader, LatLngLiteral } from '@agm/core';
import { jsonpCallbackContext } from '@angular/common/http/src/module';
import { ValidationErrors } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {

	registerForm: FormGroup;
	address: string;
	carType: string;
	code: string;
	email: string;
	firstName: string;
	id: string;
	lastName: string;
	password: string;
	phoneNumber: string;
	role: string;
	website: string;
	photo: any;
	filename: any;
	hide: boolean = true;
	imageBaseURL: string;
	agreeTerms = false;
	latitude: string;
	longitude: string;

	output: any;
	outputMessage: string;
	@ViewChild('search') public searchElement: ElementRef;
	lat: number;
	lng: number;
	addressArray: google.maps.GeocoderAddressComponent[];
	city: any;
	country: any;
	zipcode: any;
	state: any;
	geometryArray: any;

	submitted = false;

	constructor(
		private router: Router,
		private http: HttpClient,
		public toasterService: ToasterService,
		private mapsAPILoader: MapsAPILoader,
		private ngZone: NgZone,
		public eventsService: EventsService,
		private formBuilder: FormBuilder) { }
	// registerUSerData={}

	ngOnInit() {
		this.registerForm = this.formBuilder.group({
			firstName: ['', Validators.required],
			lastName: ['', Validators.required],
			email: ['', [Validators.required, Validators.email]],
			password: ['', [Validators.required, Validators.minLength]],
			phonenumber: ['', Validators.required],
        });
		
	}
	// convenience getter for easy access to form fields
	get f() { return this.registerForm.controls; }
	
	ngAfterViewInit() {
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
							this.address = this.address;
							return;
						}
						this.lat = place.geometry.location.lat();
						this.lng = place.geometry.location.lng();
						this.addressArray = place.address_components;
						this.address = place.formatted_address;
						this.city = this.retriveAddressComponents('locality');
						this.country = this.retriveAddressComponents('country');
						this.zipcode = this.retriveAddressComponents('postal_code');
						this.state = this.retriveAddressComponents('administrative_area_level_1');
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

	addUpdatesupplier() {
		this.submitted = true;

        // stop here if form is invalid
        if (this.registerForm.invalid) {
            return;
        }
		const parameters = {
			'address': this.address,
			'carType': this.carType,
			'code': this.state,
			'deviceId': 'string',
			'email': this.email,
			'firstName': this.firstName,
			'hourly': 0,
			'id': 0,
			'imageInfo': {
				'blobkey': 'string',
				'fileName': this.filename,
				'imageUrl': this.imageBaseURL
			},
			'isSocialUser': true,
			'lang': 'string',
			'lastName': this.lastName,
			'latitude': this.lat,
			'licenseNumber': 'string',
			'loginStatus': 'string',
			'longitude': this.lng,
			'notification': 'string',
			'password': this.password,
			'phoneNumber': this.phoneNumber + '',
			'phoneVerified': 'string',
			'push': 'string',
			'restKey': 'string',
			'role': this.role,
			'socialUser': true,
			'status': 'string',
			'website': this.website
		};

		//this.eventsService.broadcast('loader:show');
		return this.http.post(AppConfig.base_url + 'supplier/user/v1/type/signup', parameters).subscribe((response: any) => {
			this.output = response;
			this.eventsService.broadcast('loader:hide');
			if (this.output.status) {
				this.toasterService.pop('success', 'Success', this.output.message);
				this.router.navigate(['login']);
			} else {
				this.toasterService.pop('error', 'Error', this.output.message);
			}
		},
			err => {
				this.eventsService.broadcast('loader:hide');
				this.toasterService.pop('error', 'Error', 'Something went wrong. We are looking into it.');
			}
		);
	}
}
