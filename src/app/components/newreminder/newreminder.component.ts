import { Component } from '@angular/core';
import * as moment from 'moment';
import {RemindersService} from '../../services/reminders.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {ClassAvailable} from '../../models/class-available';
import {CalendarReminder} from '../../models/calendar-reminder';



@Component({
  selector: 'app-newreminder',
  templateUrl: './newreminder.component.html',
  styleUrls: ['./newreminder.component.css']
})
export class NewreminderComponent {

	public opTitle = '';
	public tmpdate: NgbDateStruct = {
		year:null,
		month:null,
		day:null,
	};
	public tmphour = 0;
	public tmpminute = 0;
	
	public hours = [
		{id: 0, l:'12 am'},
		{id: 1, l:'1 am'},
		{id: 2, l:'2 am'},
		{id: 3, l:'3 am'},
		{id: 4, l:'4 am'},
		{id: 5, l:'5 am'},
		{id: 6, l:'6 am'},
		{id: 7, l:'7 am'},
		{id: 8, l:'8 am'},
		{id: 9, l:'9 am'},
		{id: 10, l:'10 am'},
		{id: 11, l:'11 am'},
		{id: 12, l:'12 pm'},
		{id: 13, l:'1 pm'},
		{id: 14, l:'2 pm'},
		{id: 15, l:'3 pm'},
		{id: 16, l:'4 pm'},
		{id: 17, l:'5 pm'},
		{id: 18, l:'6 pm'},
		{id: 19, l:'7 pm'},
		{id: 20, l:'8 pm'},
		{id: 21, l:'9 pm'},
		{id: 22, l:'10 pm'},
		{id: 23, l:'11 pm'}
	];
	public minutes = [
		{id: 0, l:'00'},{id: 1, l:'01'},{id: 2, l:'02'},{id: 3, l:'03'},{id: 4, l:'04'},{id: 5, l:'05'},{id: 6, l:'06'},{id: 7, l:'07'},{id: 8, l:'08'},{id: 9, l:'09'},{id: 10, l:'10'},
		{id: 11, l:'11'},{id: 12, l:'12'},{id: 13, l:'13'},{id: 14, l:'14'},{id: 15, l:'15'},{id: 16, l:'16'},{id: 17, l:'17'},{id: 18, l:'18'},{id: 19, l:'19'},{id: 20, l:'20'},
		{id: 21, l:'21'},{id: 22, l:'22'},{id: 23, l:'23'},{id: 24, l:'24'},{id: 25, l:'25'},{id: 26, l:'26'},{id: 27, l:'27'},{id: 28, l:'28'},{id: 29, l:'29'},{id: 30, l:'30'},
		{id: 31, l:'31'},{id: 32, l:'32'},{id: 33, l:'33'},{id: 34, l:'34'},{id: 35, l:'35'},{id: 36, l:'36'},{id: 37, l:'37'},{id: 38, l:'38'},{id: 39, l:'39'},{id: 40, l:'40'},
		{id: 41, l:'41'},{id: 42, l:'42'},{id: 43, l:'43'},{id: 44, l:'44'},{id: 45, l:'45'},{id: 46, l:'46'},{id: 47, l:'47'},{id: 48, l:'48'},{id: 49, l:'49'},{id: 50, l:'50'},
		{id: 51, l:'51'},{id: 52, l:'52'},{id: 53, l:'53'},{id: 54, l:'54'},{id: 55, l:'55'},{id: 56, l:'56'},{id: 57, l:'57'},{id: 58, l:'58'},{id: 59, l:'59'}
	];
	
	public classesAvail: ClassAvailable[];
	
	constructor(
		public remindersService: RemindersService,
		public activeModal: NgbActiveModal
		) { 
		
		this.classesAvail = remindersService.getClassesAvailables();
			
	}

	showError:boolean = false;
	errorMessage:string = '';
	
	reminder: CalendarReminder = {
		dateobj: null,
		text: '',
		classname: ''
	};

	public setDate(d: moment.Moment) {
		this.reminder.dateobj = d.clone();
		this.tmpdate.year = d.year();
		this.tmpdate.month = d.month()+1;
		this.tmpdate.day = d.date();
	
		this.opTitle = 'Add new reminder';
	}
	public setReminder(r: CalendarReminder) {
		Object.assign(this.reminder, r);
		
		this.tmpdate.year = r.dateobj.year();
		this.tmpdate.month = r.dateobj.month()+1;
		this.tmpdate.day = r.dateobj.date();
		this.tmphour = r.dateobj.hour();
		this.tmpminute = r.dateobj.minute();
		
		this.opTitle = 'Update reminder';
	}
	public confirm() {
		if ((this.tmpdate === null) || isNaN(this.tmphour) || isNaN(this.tmpminute))
			this.reminder.dateobj = null;
		else
			this.reminder.dateobj = moment().date(this.tmpdate.day).month(this.tmpdate.month-1).year(this.tmpdate.year).hours(this.tmphour).minutes(this.tmpminute);

					
		const valid = this.remindersService.validateReminder(this.reminder);
		if (!valid.success) {
			this.showError = true;
			this.errorMessage = valid.message;
			return;
		}
		else
			this.activeModal.close(this.reminder);
	}
}
