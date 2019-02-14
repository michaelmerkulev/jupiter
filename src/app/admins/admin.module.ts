import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { environment } from '../../environments/environment';
import { AngularFireModule } from '../../../node_modules/@angular/fire';
import { AngularFirestoreModule, AngularFirestore } from '@angular/fire/firestore';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		AngularFireModule.initializeApp(environment.firebase),
		AngularFirestoreModule 
	],
	declarations: [
	],
	providers: [AngularFirestore],
	exports: [
		RouterModule
	]
})
export class ScanReportsModule { }
