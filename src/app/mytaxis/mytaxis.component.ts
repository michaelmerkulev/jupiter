import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Router} from '@angular/router';
import { SidebarService } from '../sidebar.service';

declare interface TableData {
  headerRow: string[];
  dataRows: string[][];
}
@Component({
  selector: 'app-mytaxis',
  templateUrl: './mytaxis.component.html',
  styleUrls: ['./mytaxis.component.css']
})
export class MytaxisComponent implements OnInit {
  output: any;
  outputdata: any;
  response: any;
  userId: any;
  supplierId: any;
  public tableData1: TableData;
  outputMessage: string;

  constructor(private router: Router, private http: HttpClient, public sidebar: SidebarService) { }
   deleteDriver(driverid) {}

  ngOnInit() {

let userId = localStorage.userId;
let supplierId = localStorage.supplierId;
let name = localStorage.name;
this.http.get(`http://1-dot-taxi2deal.appspot.com/app/taxi/v1/mytaxies/${supplierId}/${userId}`)
.subscribe(response => {
console.log(response);
this.output = response;
this.outputdata = this.output.data;
if (this.output.status === true) {
this.router.navigate(['mytaxis']);
} else {
this.outputMessage = 'NO driver in under list Please add driver!!';
// alert("Invalid credentials.")
}
},
err => { console.log(err);
alert('Error'); }
   );

  this.sidebar.show();

  }

}
