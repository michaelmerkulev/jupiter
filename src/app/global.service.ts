import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  public isCollapsed: boolean = true;

  public componentLoaded = new Subject();

  public emit(){
    this.componentLoaded.next();
  }
  constructor() { }
}
