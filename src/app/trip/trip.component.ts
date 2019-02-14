import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../sidebar.service';
import { Router } from '@angular/router';
import { TripService } from './trip.service';
import { EventsService } from '../core/services/events.service';
import { ToasterService } from 'angular2-toaster';

declare var $: any;

@Component({
	selector: 'app-trip',
	templateUrl: './trip.component.html',
	styleUrls: ['./trip.component.css']
})
export class TripComponent implements OnInit {

	response: string;
	outputdata: any;
	outputMessage: any;
	taxiArray = [];

	constructor(
		public sidebar: SidebarService,
		private router: Router,
		private tripService: TripService,
		private eventService: EventsService,
		private toaster: ToasterService
	) {
	}

	ngOnInit() {
		this.eventService.broadcast('loader:show');
		this.tripService.getTrips().subscribe((res: any) => {
			this.outputdata = res.data;
			this.taxiArray = this.outputdata;
			this.tripService.setTrips(res.data);
			localStorage.setItem('taxiArray', JSON.stringify('this.taxiArray'));
			// console.log('TRIP ID --->', JSON.stringify(this.taxiArray));
			this.eventService.broadcast('loader:hide');
		}, err => {
			this.eventService.broadcast('loader:hide');
			this.toaster.pop('error', 'Error', 'Could not load trips. We are looking into it.');
		});
		this.sidebar.show();
	}
	onShow(id) {
		this.router.navigate(['/trip/detail', { id: id }]);
	}

	onEdit(id) { }

	onDelete(id) {
		this.outputdata = this.outputdata.filter(data => data.id !== id);
	}
}
