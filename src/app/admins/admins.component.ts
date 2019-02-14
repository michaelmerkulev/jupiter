import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { SidebarService } from '../sidebar.service';
import { MapsAPILoader, LatLngLiteral } from '@agm/core';
import { } from 'googlemaps';
import { SearchService } from '../search/search.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EventsService } from '../core/services/events.service';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from '../../../node_modules/rxjs';
import { map } from '../../../node_modules/rxjs/operators';

export interface Item { id: string; online: boolean; }

@Component({
  selector: 'app-admins',
  templateUrl: './admins.component.html',
  styleUrls: ['./admins.component.css']
})
export class AdminsComponent implements OnInit {

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

  private itemsCollection: AngularFirestoreCollection<Item>;
  items: Observable<Item[]>;
  @ViewChild('search') public searchElement: ElementRef;
  @ViewChild('destinationsearch') public destinationElement: ElementRef;

  constructor(
public sidebar: SidebarService,
private searchService: SearchService,
private mapsApiLoader: MapsAPILoader,
private ngZone: NgZone,
public eventsService: EventsService,
private fireStore: AngularFirestore
  ) {
this.icon = '../../assets/img/Taxi-Yellow-small.png';
this.itemsCollection = fireStore.collection<Item>('drivers');
this.items = this.itemsCollection.snapshotChanges().pipe(map(actions => actions.map(a => {
const data = a.payload.doc.data() as Item;
const id = a.payload.doc.id;
return { id, ...data };
}))
);
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
