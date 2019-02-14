import { Component, OnInit } from '@angular/core';
import { EventsService } from '../events.service';

@Component({
	selector: 'app-loader',
	templateUrl: './loader.component.html',
	styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {

	constructor(public eventsService: EventsService) { }
	shown = false;

	ngOnInit() {
		this.eventsService.on('loader:show', () => {
			this.show();
		});

		this.eventsService.on('loader:hide', () => {
			this.hide();
		});
	}

	show() {
		this.shown = true;
	}

	hide() {
		this.shown = false;
	}

}
