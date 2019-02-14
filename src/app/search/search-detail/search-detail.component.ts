import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { SearchService } from '../search.service';
import { DomSanitizer } from '@angular/platform-browser';
import * as moment from 'moment';
import { ToasterService } from 'angular2-toaster';
import { EventsService } from 'src/app/core/services/events.service';

@Component({
	selector: 'app-search-detail,app-ngStyle,app-ngif',
	templateUrl: './search-detail.component.html',
	styleUrls: ['./search-detail.component.css']
})

export class SearchDetailComponent implements OnInit {
	authorized;
	imagePath: any;
	taxiInfo: any;
	driverId;
	taxiId;
	data = {
		comment: '',
		rate: ''
	};
	obj = {
		email: '',
		senderEmail: '',
		subjectName: '',
		phone: '',
		name: '',
		remarks: ''
	};
	isLoggedIn: any;
	localData: any;
	reviews: any;
	max = 5;
	isReadonly = false;
	senderEmail: string;

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private searchService: SearchService,
		private _sanitizer: DomSanitizer,
		public toasterService: ToasterService,
		private eventService: EventsService
	) {
		this.authorized = localStorage.getItem('authorized');
		this.localData = localStorage.getItem('userId');
	}

	ngOnInit() {
		this.route.params.subscribe((params: Params) => {
			this.taxiId = params['id'];
			this.driverId = params['driver_id'];

			this.getTaxiInfo();
			function getLocation() {
				this.taxiInfo = localStorage.getItem('taxiInfo');
			}
		});
	}


	// get taxi info from server
	getTaxiInfo() {
		this.eventService.broadcast('loader:show');
		this.searchService.getTaxiDetails(this.taxiId, this.driverId).subscribe((r: any) => {
			this.eventService.broadcast('loader:hide');
			this.taxiInfo = r.data;
			this.getComment(this.taxiInfo.id);
			localStorage.setItem('taxiInfo', JSON.stringify(this.taxiInfo));
			this.imagePath = this._sanitizer.bypassSecurityTrustResourceUrl(this.taxiInfo.imageUrl);
		}, err => {
			this.eventService.broadcast('loader:hide');
		});
	}

	goHome() {
		this.router.navigate(['/search']);
	}
	resolveImageBgSearch() {
		/*(image) => {
			if (image) {
				if (image.indexOf(':') == -1) {
					return { 'background-image': 'url("../assets/img/topuser.jpg")' };
				} else {
					return { 'background-image': `url("${image}")` };
				}
			} else {
				return { 'background-image': 'url("../assets/img/topuser.jpg")' };
			}
		}*/
	}

	getComment(taxiDetailId) {
		this.searchService.getReview(taxiDetailId).subscribe((res: any) => {
			res.data.forEach(element => {
				element.formattedDate = moment().format('MM-DD-YYYY h:mm');
			});
			this.reviews = res.data;
		}, err => {
			console.log(err);
		});
	}

	submitContactForm(e, v) {
		this.senderEmail = 'taxideals.ch@gmail.com';
		let data = {
			email: v.email,
			senderMail: this.senderEmail,
			subject: v.subject,
			phonenumber: v.phone,
			name: v.name,
			message: v.remarks
		};

		this.searchService.postContactForm(data).subscribe((res: any) => {
			this.obj.email = '',
				this.obj.senderEmail = '',
				this.obj.subjectName = '',
				this.obj.phone = '',
				this.obj.name = '',
				this.obj.remarks = '';
			this.toasterService.pop('success', 'Success', 'Contact form submitted successfully.');
		}, err => {
			console.log(err);
			this.toasterService.pop('error', 'Error', 'Something went wrong.');
		});
	}

	submitComment(e, v) {
		this.eventService.broadcast('loader:show');
		let data = {
			comment: v.comment,
			driverId: this.taxiInfo.driverId,
			formattedDate: 'string',
			id: 0,
			imageInfo: {
				blobkey: 'string',
				fileName: 'string',
				imageUrl: 'string'
			},
			postedBy: 'string',
			rating: v.rating,
			rideId: 3000,
			taxiDetailId: this.taxiInfo.id,
			updatedOn: moment().format(),
			userFullName: this.taxiInfo.name,
			userId: this.localData
		};

		// {
		// 	"comment": "Nice.",
		// 	"driverId": 5634263223369728,
		// 	"formattedDate": "string",
		// 	"id": 0,
		// 	"imageInfo": {
		// 	  "blobkey": "string",
		// 	  "fileName": "string",
		// 	  "imageUrl": "string"
		// 	},
		// 	"postedBy": "string",
		// 	"rating": 5,
		// 	"rideId": 3000,
		// 	"taxiDetailId": 5067171210199040,
		// 	"updatedOn": "2018-10-16T08:05:10.004Z",
		// 	"userFullName": "string",
		// 	"userId": 5692367319334912
		//   }

		this.searchService.postReview(data).subscribe((res: any) => {
			this.data.comment = '';
			this.data.rate = '';
			this.eventService.broadcast('loader:hide');

			this.toasterService.pop('success', 'Success', 'Comment submitted successfully.');
			this.getComment(this.taxiInfo.id);
		}, err => {
			console.log(err);
			this.eventService.broadcast('loader:hide');
			this.toasterService.pop('error', 'Error', 'Something went wrong.');
		});
	}
}
