import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { TripService } from '../trip.service';
import { SidebarService } from '../../sidebar.service';

@Component({
	selector: 'app-trip-detail',
	templateUrl: './trip-detail.component.html',
	styleUrls: ['./trip-detail.component.css']
})
export class TripDetailComponent implements OnInit, OnDestroy {
	private route$: Subscription;
	trip: any;
	outputdata: any;
	taxiArray: any;
	trips = {
		driverName: '',
		destination: '',
		source: '',
		price: '',
		base: '',
		rideStatus: '',
		totalPrice: '',
		travelTime: '',
	};

	constructor(private route: ActivatedRoute, private router: Router, private tripService: TripService, private sider: SidebarService) { }
		ngOnInit() {
		this.sider.show();
		let i;
		this.route$ = this.route.params.subscribe((params: Params) => {
			this.trip = this.tripService.getTripById(params['id']);
			this.tripService.getTrips().subscribe((res: any) => {
				this.outputdata = res.data;
				this.taxiArray = this.outputdata;
				console.log('TRIP ID --->', this.taxiArray);
				for (i = 0; i < this.taxiArray.length; i++) {
				let entry = this.taxiArray[i];
				console.log('Namessss --->', params['id']);
				// console.log('taxiArrayid value', this.taxiArray[i].id);
				if ( params['id'] == this.taxiArray[i].id) {
					console.log('Name --->', this.taxiArray[i].driverName);
					this.trips.driverName = this.taxiArray[i].driverName;
					this.trips.source = this.taxiArray[i].source;
					this.trips.destination = this.taxiArray[i].destination;
					this.trips.price = this.taxiArray[i].price;
					this.trips.base = this.taxiArray[i].base;
					this.trips.rideStatus = this.taxiArray[i].rideStatus;
					this.trips.totalPrice = this.taxiArray[i].totalPrice;
					this.trips.travelTime = this.taxiArray[i].travelTime;

				}

				}

			});
		});

}



	ngOnDestroy() {
		if (this.route$) {
			this.route$.unsubscribe();
		}
	}

}
