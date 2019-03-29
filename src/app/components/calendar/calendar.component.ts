import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import {RemindersService} from '../../services/reminders.service';
import {OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NewreminderComponent} from '../newreminder/newreminder.component';
import {DialogsService} from '../../services/dialog.service';
import {CalendarDate} from '../../models/calendar-date';
import {CalendarReminder} from '../../models/calendar-reminder';


@Component({
  selector: 'calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})

export class CalendarComponent implements OnInit, OnDestroy {

	currentDate = moment().startOf('day');
	dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];	
	weeks: CalendarDate[][] = [];
	changeEvent: Subscription;
	
	constructor(
		public modalService: NgbModal,
		public dialogsService: DialogsService,
		public remindersService: RemindersService
	) {
	
	}
		
	ngOnDestroy() {
		this.changeEvent.unsubscribe();
	}
	
	ngOnInit(): void {
		this.generateCalendar();
		this.changeEvent = this.remindersService.getDateChangeEvent().subscribe((d: moment.Moment) => {
			//re fetch events if reminder has change in the current month view
			if (this.currentDate.month() == d.month())
				this.generateCalendar();
		});
	}
  	
	prevMonth(): void {
	  this.currentDate = moment(this.currentDate).subtract(1, 'months');
	  this.generateCalendar();
	}
	nextMonth(): void {
	  this.currentDate = moment(this.currentDate).add(1, 'months');
	  this.generateCalendar();
	}
	currMonth(): void {
	  this.currentDate = moment().startOf('day');
	  this.generateCalendar();
	}

	addReminder(date: moment.Moment) {
		const modalRef = this.modalService.open(NewreminderComponent, { size: 'sm', centered: true, backdrop : 'static' });
		modalRef.componentInstance.setDate(date);
		modalRef.result.then((ret: CalendarReminder) => {
			if (ret)
				this.remindersService.addReminder(ret, true);
		},
		() => { false; })		
	}
	deleteReminder(r: CalendarReminder) {
		this.dialogsService.confirm('Confirm to delete the reminder?', () => {
			this.remindersService.deleteReminder(r);
		});
	}
	updateReminder(oldReminder: CalendarReminder) {
		const modalRef = this.modalService.open(NewreminderComponent, { size: 'sm', centered: true, backdrop : 'static' });
		modalRef.componentInstance.setReminder(oldReminder);
		modalRef.result.then((newReminder: CalendarReminder) => {
			if (newReminder) 
				this.remindersService.updateReminder(oldReminder, newReminder);
		},
		() => { false; })		
	}

	getCurrentMonth():string {
		return this.currentDate.format("MMMM YYYY");
	}

	clearDay(d: moment.Moment) {
		this.dialogsService.confirm('Confirm to clear the day?', () => {
			this.remindersService.clearDay(d);
		});
	}

	generateCalendar():void {
		const firstOfMonth = moment(this.currentDate).startOf('month').day();
		const endOfMonth = moment(this.currentDate).endOf('month').day();
		const firstDayOfGrid = moment(this.currentDate).startOf('month').subtract(firstOfMonth, 'days');
		const endDayOfGrid = endOfMonth==6 ? moment(this.currentDate).endOf('month') : moment(this.currentDate).endOf('month').add(6-endOfMonth, 'days');
		const today = moment().startOf('day');
		var evalDate = firstDayOfGrid.clone();

		var ret_buf = [];
		var week_buf: CalendarDate[] = []; 
		while( evalDate.isBefore(endDayOfGrid) || evalDate.isSame(endDayOfGrid) ) {
			
			let newrem:CalendarDate = {
				dateobj: evalDate.clone(),
				date: evalDate.date(),
				day: evalDate.day(),
				today: evalDate.isSame(today),
				currmonth: evalDate.month() == this.currentDate.month(),
				reminders: [],
				expanded: false
			};
			
			this.remindersService.getReminders(evalDate).subscribe(r => {
				newrem.reminders = r;				
			})
			week_buf.push(newrem);
			
			if (evalDate.day() == 6) {
				ret_buf.push(week_buf);
				week_buf = [];
			}
			evalDate = evalDate.add(1,'days');
		}
		if (week_buf.length) ret_buf.push(week_buf);
		
		this.weeks = ret_buf;
	}	
}
