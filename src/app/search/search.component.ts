import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { SidebarService } from '../sidebar.service';
import { MapsAPILoader, LatLngLiteral } from '@agm/core';
//import { } from 'googlemaps';
import { resolve, reject } from 'q';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../shared/auth/auth.service';
import { AppConfig } from '../config/app.config';
import { SearchService } from './search.service';
import { DomSanitizer } from '@angular/platform-browser';
import { EventsService } from '../core/services/events.service';

@Component({
	selector: 'app-search',
	templateUrl: './search.component.html',
	styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
	show_data: Boolean = false;
	output: any;
	outputMessage: any;
	outputData: any = [];
	temp_data: any = [];
	response: any;
	destination: string;
	distance: string;
	id: string;
	km: string;
	latitude: string;
	longitude: string;
	radius: string;
	source: string;
	type: string;
	lat = 51.673858;
	lng = 7.815982;
	zoom = 10;
	searchForm: FormGroup;
	myImageUrl: any;
	allData: any = [];
	pagination = {
		limit: 20,
		currentPage: 1
	};
	path = '../assets/img/type/';
//  imagePath = '../assets/img/type/Auto.png';

	@ViewChild('search') public searchElement: ElementRef;
	@ViewChild('destinationsearch') public destinationElement: ElementRef;
	cartype: string;
	imagePath: string;

	constructor(
		private router: Router,
		private http: HttpClient,
		private searchService: SearchService,
		private mapsApiLoader: MapsAPILoader,
		private ngZone: NgZone,
		public sidebar: SidebarService,
		private _sanitizer: DomSanitizer,
		public eventsService: EventsService) {
	}

	ngOnInit() {
		this.sidebar.show();
		this.mapsApiLoader.load().then(
			() => {
				let autocomplete = new google.maps.places.Autocomplete(this.searchElement.nativeElement, { types: ['geocode'] });
				let destinationautocomplete = new google.maps.places.Autocomplete(this.destinationElement.nativeElement, { types: ['geocode'] });
				autocomplete.addListener('place_changed', () => {
					this.ngZone.run(() => {
						let place: google.maps.places.PlaceResult = autocomplete.getPlace();
						this.source = place.formatted_address;
						if (place.geometry === undefined || place.geometry === null) {
							return;
						}

						this.lat = place.geometry.location.lat();
						this.lng = place.geometry.location.lng();
						this.zoom = 12;
					});
				});

				destinationautocomplete.addListener('place_changed', () => {
					this.ngZone.run(() => {
						let place: google.maps.places.PlaceResult = destinationautocomplete.getPlace();
						this.destination = place.formatted_address;
						if (place.geometry === undefined || place.geometry === null) {
							return;
						}
					});
				});
			});
		this.outputData = this.searchService.getResultData();

		if (this.outputData.length !== 0) {
			this.show_data = true;
		} else {
			this.show_data = false;
		}
		this.initForm();
	}

	GetAddress(lat: number, lng: number) {
		return new Promise((resolve, reject) => {
			let geocoder = new google.maps.Geocoder();
			const latlng: LatLngLiteral = {
				lat: lat,
				lng: lng
			};
			latlng.lat = this.lat;
			latlng.lng = this.lng;

			let request = { 'location': latlng };
			geocoder.geocode(request, (results, status) => {
				if (status === google.maps.GeocoderStatus.OK) {
					if (results[0]) {
						resolve(results[0].formatted_address);
					}
				}
				resolve('Cannot find location');
			});
		});
	}

	onSubmit() {
		this.show_data = false;
		this.output = this.response;
		this.outputData = [];
		console.log('coming herfgdfgdfgde ...');
		this.eventsService.broadcast('loader:show');
		this.searchService.search(this.destination, this.id, this.lat, this.lng, this.source, this.searchForm.value['cartype'])
			.subscribe(res => {
				this.eventsService.broadcast('loader:hide');
				this.outputData = [];
				this.pagination.currentPage = 1;
				let filter_result = [];
				res.forEach(element => {
					if (element.imageUrl) {
						element.imageUrl = this._sanitizer.bypassSecurityTrustResourceUrl(element.output.data.imageInfo.imageUrl);
					}

					// console.log('Images', element);
					if((this.searchForm.value['cartype'] == "All") || (this.searchForm.value['cartype'] == "")){
						filter_result.push(element);
					} else {
						if(this.searchForm.value['cartype'] == element.cartype){
							filter_result.push(element);
							switch (element.cartype) {
								case 'Auto': this.imagePath = `${this.path}Auto.png`; break;
								case 'Taxi': this.imagePath = `${this.path}Taxi.png`; break;
								case 'Taxi4': this.imagePath = `${this.path}Taxi4.png`; break;
								case 'Taxi6': this.imagePath = `${this.path}Taxi6.png`; break;
								case 'Transport': this.imagePath = `${this.path}Volvo`; break;
								default: break;
							}
						}
					}
					
				});
				let addData = {
					sourceAddress: this.source,
					lat: this.lat,
					destinationAddress: this.destination,
					lng: this.lng
				};

				localStorage.setItem('searchAddress', JSON.stringify(addData));
				// const initialData = res.slice(((this.pagination.currentPage - 1) * this.pagination.limit),
				// 	this.pagination.currentPage * this.pagination.limit);
				// 	console.log(initialData);
				this.allData = res;
				this.output = res;
				this.outputData = filter_result;
				//   this.output.forEach(ele => {
				//     this.GetAddress(ele.latitude, ele.longitude).then(dd => this.outputData.push({name: ele.name, position: dd,
				//       status: ele.driverStatus, taxiname: ele.cartype, phone: ele.phoneNumber, price: ele.price, waiting: ele.waitingTime
				//   }));
				// });

				this.searchService.setResultData(this.outputData);
				if (this.outputData.length !== 0) {
				  this.show_data = true;
        }
			}, err => {
				console.log(err);
				this.eventsService.broadcast('loader:hide');
			});
	}

	loadMoreData() {
		this.pagination.currentPage++;
		console.log(this.pagination.currentPage);
		this.outputData = this.outputData.concat(this.allData.slice(((this.pagination.currentPage - 1) * this.pagination.limit),
			this.pagination.currentPage * this.pagination.limit));
	}

	initForm() {
		let source = '';
		let destination = '';
		let cartype = '';

		this.searchForm = new FormGroup({
			'source': new FormControl(source, Validators.required),
			'destination': new FormControl(destination, Validators.required),
			'cartype': new FormControl(cartype)
		});
		let val = JSON.parse(localStorage.getItem('searchAddress'));
		if (val == null) {

		} else {
			this.lat = val.lat;
			this.searchForm.get('source').setValue(val.sourceAddress);
			this.lng = val.lng;
			this.searchForm.get('destination').setValue(val.destinationAddress);
		}
	}

	onSelete(id, driverId) {
		console.log('id===>', id);
		this.router.navigate(['/search/detail', { id: id, driver_id: driverId }]);
	}
}

