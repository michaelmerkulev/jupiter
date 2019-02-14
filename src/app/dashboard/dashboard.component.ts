import { Component, OnInit, NgZone } from '@angular/core';
import { SidebarService } from '../sidebar.service';
import { SearchService } from '../search/search.service';
import { EventsService } from '../core/services/events.service';
import { AngularFirestoreCollection, AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { MapsAPILoader } from '@agm/core';
import { Observable } from '../../../node_modules/rxjs';
import { map } from '../../../node_modules/rxjs/operators';
import { Router } from '@angular/router';
import { element } from '@angular/core/src/render3/instructions';
import { Key } from 'protractor';
// import { } from 'googlemaps';

export interface Item { id: string; online: boolean; LOCATION:any;}

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

	myTaxis = [];
	userId;
	supplierId;
	showMyTaxisChart = false;
	onlineDatas = [];
	offlineDatas = [];
	mapDataMode = 'offline';
	lat : string;
	lng : string;
	source: string;
	zoom = 10;
	icon = '';
	liveSubscription;
	role;
	taxiArray: any[];
	Name: '';
	taxi = {
		id: '',
		name: '',
		driverStatus: '',
		phoneNumber: '',
		basePrice: '',
		cartype: '',
	};

	private itemsCollection: AngularFirestoreCollection<Item>;
	items: Observable<Item[]>;
	itemsDoc: AngularFirestoreDocument<Item>;

	/** Donut chart data */
	public doughnutChartLabels: string[] = [];
	public doughnutChartData: number[] = [];
	public doughnutChartType: string = 'doughnut';

	/** LINE CHART DATA */
	public lineChartData: Array<any> = [
		{ data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' }
	];
	public lineChartLabels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
	public lineChartOptions: any = {
		responsive: true
	};
	public lineChartColors: Array<any> = [
		{ // grey
			backgroundColor: 'rgba(148,159,177,0.2)',
			borderColor: 'rgba(148,159,177,1)',
			pointBackgroundColor: 'rgba(148,159,177,1)',
			pointBorderColor: '#fff',
			pointHoverBackgroundColor: '#fff',
			pointHoverBorderColor: 'rgba(148,159,177,0.8)'
		},
		{ // dark grey
			backgroundColor: 'rgba(77,83,96,0.2)',
			borderColor: 'rgba(77,83,96,1)',
			pointBackgroundColor: 'rgba(77,83,96,1)',
			pointBorderColor: '#fff',
			pointHoverBackgroundColor: '#fff',
			pointHoverBorderColor: 'rgba(77,83,96,1)'
		},
		{ // grey
			backgroundColor: 'rgba(148,159,177,0.2)',
			borderColor: 'rgba(148,159,177,1)',
			pointBackgroundColor: 'rgba(148,159,177,1)',
			pointBorderColor: '#fff',
			pointHoverBackgroundColor: '#fff',
			pointHoverBorderColor: 'rgba(148,159,177,0.8)'
		}
	];
	public lineChartLegend: boolean = true;
	public lineChartType: string = 'line';
	route: any;
	sub: any;
	edited: boolean;
	add: boolean;
	types: any;
	Taxi: any;
	driverStatus: any;
	offDutyDriver: any;
	states: any;
	online = {
		LOCATION: '',
		ID: ''
	}
	Onlinedata: {};
	
	constructor(
		private sidebar: SidebarService,
		private searchService: SearchService,
		private eventsService: EventsService,
		private mapsApiLoader: MapsAPILoader,
		private ngZone: NgZone,
		private fireStore: AngularFirestore,
		private router: Router,
	) {

		this.role = localStorage.getItem('role');
		this.userId = localStorage.getItem('userId');
		this.supplierId = localStorage.getItem('supplierId');
		this.getMyTaxis();

		this.icon = '../../assets/img/Taxi-Yellow-small.png';
	}

	ngOnInit() {
		console.log(this.role);
		if(this.role == null)
			this.router.navigate(['login']);
		this.sidebar.show();
	
			}

			

	subscribeLiveMode() {
		this.liveSubscription = Observable.interval(5000).subscribe(x => {
			this.onlineTaxi();
		});
	}

	unSubscribeLiveMode() {
		this.liveSubscription.unsubscribe();
	}

	setMapDataMode(type) {
		this.mapDataMode = type;
		if (this.mapDataMode === 'online') {
			this.onlineTaxi();
			this.subscribeLiveMode();
		} else {
			this.getMyTaxis();
			this.unSubscribeLiveMode();
		}
	}

	onlineTaxi(lat?, lng?) {
		let i;
	

		if (lat) {

			// this.item = this.itemDoc.valueChanges();
			this.itemsCollection = this.fireStore.collection<Item>('DRIVER_STATUS');
			// this.items = this.itemsCollection.valueChanges();
			this.items = this.itemsCollection.snapshotChanges().pipe(map(actions => actions.map(a => {
				const data = a.payload.doc.data() as Item;
				const id = a.payload.doc.id;
				for (i = 0; i < this.taxiArray.length; i++) {
                        
                    if (data.id !== this.taxiArray[i].driverId) {
						console.log('2.Unavailable', data.id);
   
                    } else  {
                        console.log('1.Unavailable', data.id);
                    }
                
                    }

				return { id, ...data };
			}))
		);

		this.items.subscribe((res: any) => {
				if (this.onlineDatas.length === 0) {
				this.onlineDatas = res;
			} else {
					this.onlineDatas.forEach((e, idx) => {
						if (e.LOCATION) {
							let arr = e.LOCATION.split(',');
							let latVal = parseFloat(arr[0]);
							e.lat = latVal + lat;
							if (idx === 0) {
								console.log(e.lat);
							}
							let lngVal = parseFloat(arr[1]);
							e.lng = lngVal + lng;
							e.LOCATION = e.lat + ',' + e.lng;
						}
					});
					this.onlineDatas = res;
				}
			});

		} else {
					this.itemsCollection = this.fireStore.collection<Item>('DRIVER_STATUS');
				this.items = this.itemsCollection.snapshotChanges().pipe(map(actions => actions.map(a => {
				const data = a.payload.doc.data() as Item;
				const id = a.payload.doc.id;
				return { id, ...data };
			}))
			);

			this.items.subscribe((res: any) => {
				res.forEach(e => {
					for (i = 0; i < this.taxiArray.length; i++) {
                        
						if (e.id == this.taxiArray[i].driverId) {
							console.log('Available id', e.id);
							if ( e.id = false ){
								console.log('Online data', this.taxiArray.length);
								e.lat = parseFloat(e.LOCATION.split(',')[0]);
						e.lng = parseFloat(e.LOCATION.split(',')[1]);
						
								console.log('latitude longitutde', e.LOCATION);
								console.log('Itemsres - lat', e.lat);
						console.log('Itemsres - lng', e.lng);
							} else {
								console.log('Offline data', this.taxiArray.length);
								console.log('latitude longitutde', e.LOCATION);
							}
	   
						} else  {
							console.log('1.Unavailable', e.id);
						}
					
						}
					if (e.LOCATION) {
						e.lat = parseFloat(e.LOCATION.split(',')[0]);
						e.lng = parseFloat(e.LOCATION.split(',')[1]);
						//console.log('Itemsres - lat', res);
						//console.log('Itemsres - lng', e.LOCATION);
											}
			});

				//this.onlineDatas = res;
			});
		}
	}
	adds(id) {
			// let item1 = taxiArray.find(i => i.id === 1);
		console.log('array value', this.taxiArray);
				 console.log('Taxiid Value...', id);
				 id = id;
				 let i;
				 for (i = 0; i < this.taxiArray.length; i++) {
					let entry = this.taxiArray[i];
					console.log('Entry value', entry);
					if ( id === this.taxiArray[i].id) {
						this.taxi.name = this.taxiArray[i].name;
						this.taxi.driverStatus = this.taxiArray[i].driverStatus;
						this.taxi.phoneNumber = this.taxiArray[i].phoneNumber;
						this.taxi.cartype = this.taxiArray[i].cartype;

						console.log('Objechhhht id', this.taxiArray[i].name);
						return true;
					}
					// Do something with entry
				  }
	}

	// Get My taxis for Donut Chart Data
	getMyTaxis() {
		if (this.supplierId > 0) {
			this.eventsService.broadcast('loader:show');
			this.searchService.taxiPositionData(this.supplierId, this.userId).subscribe((res: any) => {
				this.offlineDatas = res.data;
				this.taxiArray = this.offlineDatas;
				localStorage.setItem('taxiArray', JSON.stringify(this.taxiArray));
				

				 let obj = {};

				 let state = {};
				 
				 res.data.forEach(element => {
					state[element.driverStatus] = 0;
				 });

				 for (let d in state) {
					res.data.forEach(element => {
						if (d === element.driverStatus) {
							state[d] = state[d] + 1;
						} 
					});
				}
				 					
				res.data.forEach(element => {
					obj[element.cartype] = 0;
				});

				for (let k in obj) {
					res.data.forEach(element => {
						if (k === element.cartype) {
							obj[k] = obj[k] + 1;
						}
					});
				}

				console.log('Pie Object ==-', obj);
				this.types = obj;
				this.states = state;
				this.Taxi = this.types.Taxi;
				this.driverStatus = this.states.WAITING;
				this.offDutyDriver = this.states.STOP;
				 console.log('TAXIpp', this.types.Taxi);
				 console.log('WAITING :::::: ====', this.states.WAITING);
				
				 
				
				for (let k in obj) {
					this.doughnutChartLabels.push(k);
					this.doughnutChartData.push(obj[k]);
				}

				/*for (let d in obj) {
                    res.data.forEach(element => {
                        if (element.driverStatus == onwaiting) {
							console.log("Even", element.driverStatus);
                            
                        }
                        else {
                            console.log('DRIVERSFDF', element.driverStatus);
                        }
                    });
				} */

				this.showMyTaxisChart = true;
				this.eventsService.broadcast('loader:hide');
			}, err => {
				this.eventsService.broadcast('loader:hide');
			});
		}
	}
	cancel() {
		this.add = false;
		this.edited = false;
	}

}

