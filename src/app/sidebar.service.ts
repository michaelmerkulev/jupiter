import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  visible: boolean;

  constructor() { this.visible = false; }

  hide() { this.visible = false; }

  show() {
    let auth = localStorage.getItem('authorized');
    if (auth) this.visible = true;
  }

  toggle() { this.visible = !this.visible; } }
