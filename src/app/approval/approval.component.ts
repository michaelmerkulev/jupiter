import { Component, OnInit, NgZone, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SidebarService } from '../sidebar.service';
import { TaxiService } from '../shared/taxi.service';
import { MapsAPILoader, LatLngLiteral, MarkerManager } from '@agm/core';
// import { } from 'googlemaps';
import { SearchService } from '../search/search.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EventsService } from '../core/services/events.service';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from '../../../node_modules/rxjs';
import { map } from '../../../node_modules/rxjs/operators';
import { ToasterService } from 'angular2-toaster';

export interface Item { id: string; online: boolean; }

@Component({
	selector: 'app-approval',
	templateUrl: './approval.component.html',
	styleUrls: ['./approval.component.css']
})
export class ApprovalComponent implements OnInit {

	outputdata: any;
	response: any;
	userId: any;
	supplierId: any;
	loginUser: string;
	lat = 51.673858;
	lng = 7.815982;
	source: string;
	zoom = 10;
	show_data: Boolean = false;
	output: any;
	outputMessage: any;
	outputData: any = [];
	destination: string;
	id: string;
	searchForm: FormGroup;
	icon: string;
	offlineDatas: any;
	data: any;
	show = true;
	hide = false;
	status = 'online';
	onlineDatas = [];
	cars = [];

	private itemsCollection: AngularFirestoreCollection<Item>;
	items: Observable<Item[]>;

	// @ViewChild('search') public searchElement: ElementRef;
	// @ViewChild('destinationsearch') public destinationElement: ElementRef;

	constructor(
		private router: Router,
		private http: HttpClient,
		public sidebar: SidebarService,
		public taxiService: TaxiService,
		private searchService: SearchService,
		private mapsApiLoader: MapsAPILoader,
		private ngZone: NgZone,
		public eventsService: EventsService,
		private fireStore: AngularFirestore,
		private toaster: ToasterService) {
			this.userId = localStorage.getItem('userId');
			this.supplierId = localStorage.getItem('supplierId');
	}

	onSelete(id) {
		if (confirm('Are you sure you want to approve?')) {
			this.eventsService.broadcast('loader:show');
			this.taxiService.getApproved(id, this.userId).subscribe(response => {
				this.eventsService.broadcast('loader:hide');
				this.output = response;
				this.outputdata = this.output.data;

				if (this.output.status === true) {
					this.toaster.pop('success', 'Success', 'Approved.');
					this.getNonApprovedTaxis();
				} else {
					this.toaster.pop('error', 'Error', 'Something went wrong.');
				}
			},
				err => {
					this.eventsService.broadcast('loader:hide');
					console.log(err);
					alert('Error');
				}
			);
		}
	}

	ngOnInit() {
		this.sidebar.show();

		this.getNonApprovedTaxis();

		// this.placeAutoComplete();
	}

	getNonApprovedTaxis() {
		this.eventsService.broadcast('loader:show');
		this.searchService.taxiApproves(this.supplierId, this.userId).subscribe(response => {
			this.eventsService.broadcast('loader:hide');
			console.log(response);

			this.output = response;
			this.outputdata = this.output.data;

			if (this.output.status === true) {
				this.router.navigate(['approval']);
			} else {
				this.outputMessage = 'NO driver in under list Please add driver!!';
				// alert('Invalid credentials.')
			}

		},
			err => {
				this.eventsService.broadcast('loader:hide');
				console.log(err);
				alert('Error');
			}
		);
	}

	// placeAutoComplete() {
	// 	this.mapsApiLoader.load().then(
	// 		() => {
	// 			let autocomplete = new google.maps.places.Autocomplete(this.searchElement.nativeElement, { types: ['geocode'] });
	// 			let destinationautocomplete = new google.maps.places.Autocomplete(this.destinationElement.nativeElement, { types: ['geocode'] });

	// 			autocomplete.addListener('place_changed', () => {
	// 				this.ngZone.run(() => {
	// 					let place: google.maps.places.PlaceResult = autocomplete.getPlace();
	// 					this.source = place.formatted_address;
	// 					if (place.geometry === undefined || place.geometry === null) {
	// 						return;
	// 					}

	// 					this.lat = place.geometry.location.lat();
	// 					this.lng = place.geometry.location.lng();
	// 					this.zoom = 12;
	// 				});
	// 			});

	// 			destinationautocomplete.addListener('place_changed', () => {
	// 				this.ngZone.run(() => {
	// 					let place: google.maps.places.PlaceResult = destinationautocomplete.getPlace();
	// 					this.destination = place.formatted_address;
	// 					if (place.geometry === undefined || place.geometry === null) {

	// 						return;
	// 					}
	// 				});
	// 			});
	// 		});
	// 	this.outputData = this.searchService.getResultData();

	// 	if (this.outputData.length !== 0) {
	// 		this.show_data = true;
	// 	} else {
	// 		this.show_data = false;
	// 	}
	// 	this.initForm();
	// }

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

	onSubmit() {
		this.show_data = false;
		this.outputData = [];
		console.log('coming herfgdfgdfgde ...');

		this.eventsService.broadcast('loader:show');
		this.searchService.search(this.destination, this.id, this.lat, this.lng, this.source, this.searchForm.value['cartype'])
			.subscribe(res => {
				this.eventsService.broadcast('loader:hide');
				this.outputData = [];

				let addData = {
					sourceAddress: this.source,
					lat: this.lat,
					destinationAddress: this.destination,
					lng: this.lng
				};

				localStorage.setItem('searchAddress', JSON.stringify(addData));

				this.output = res;

				this.searchService.setResultData(this.outputData);
				this.show_data = true;
			}, err => {
				console.log(err);
				this.eventsService.broadcast('loader:hide');
			});
	}
}
