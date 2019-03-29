import { Injectable } from '@angular/core';
import * as moment from 'moment';
import {Subject, Observable, of} from 'rxjs';
import {CalendarReminder} from '../models/calendar-reminder';
import {ClassAvailable} from '../models/class-available';
import {CalendarResponse} from '../models/calendar-response';


@Injectable({
  providedIn: 'root'
})
export class RemindersService {

	private reminderStorage:Map<string, CalendarReminder[]>;
	private dateChange: Subject<moment.Moment> = new Subject();
	private classesAvail: ClassAvailable[] = [
		{
			classname: 'green',
			description: 'Green reminder'
		},
		{
			classname: 'red',
			description: 'Red reminder'
		},
		{
			classname: 'yellow',
			description: 'Yellow reminder'
		},
		{
			classname: 'gradient',
			description: 'Gradient reminder'
		},
	];


	private dateToMapKey(date: moment.Moment) {
		return date.format('YYYY-MM-DD');
	}

	public constructor() { 
		this.reminderStorage = new Map();
	}
  
	public getDateChangeEvent():Observable<moment.Moment> {
		return this.dateChange.asObservable();
	}
	
	public getClassesAvailables():ClassAvailable[] {
		return this.classesAvail;
	};
	
	
	
	/**
	 * This function returns an Observable for the day, in a real world app would check if the month has been pulled and return the events in cache, 
	 * otherwise would request the month's reminders from the server and return the cached data
	 */
	public getReminders(date: moment.Moment): Observable<CalendarReminder[]> {
		return of(this.reminderStorage.get(this.dateToMapKey(date)) || []);
	}
	
	public clearDay(date: moment.Moment):void {
		this.reminderStorage.delete(this.dateToMapKey(date));
		this.dateChange.next(date);
	}
	
	public validateReminder(reminder: CalendarReminder):CalendarResponse {
		if (typeof reminder.dateobj === 'undefined' || reminder.dateobj === null)
			return {
				success: false,
				message: 'Select a date for the reminder'
			};
			
		if (typeof reminder.text === 'undefined' || reminder.text === null || reminder.text.trim() === '')
			return {
				success: false,
				message: 'Provide a description for the reminder'
			};

		reminder.text = reminder.text.trim();
						
		if (reminder.text.length > 30)
			return {
				success: false,
				message: 'Description can have maximum 30 characters'
			};
		
		if (typeof reminder.classname === 'undefined' || reminder.classname === null || reminder.classname.trim() === '')
			return {
				success: false,
				message: 'Select a style for the reminder'
			};
			
			
		var validClass = false;
		this.classesAvail.forEach((v:ClassAvailable) => {
			if (v.classname == reminder.classname) validClass = true;
		});
		if (!validClass)
			return {
				success: false,
				message: 'Invalid style selected for the reminder'
			};

						
		return {
			success: true
		};
	}
	
	public deleteReminder(reminder: CalendarReminder):void {
		let reminders = this.reminderStorage.get(this.dateToMapKey(reminder.dateobj)) || [];
		const ix = reminders.indexOf(reminder);
		if (ix >= 0) {
			reminders.splice(ix,1);
			this.reminderStorage.set(this.dateToMapKey(reminder.dateobj), reminders);
			this.dateChange.next(reminder.dateobj);
		}
	}
	
	public addReminder(reminder: CalendarReminder, triggerEvent:boolean):CalendarResponse {
		const valid = this.validateReminder(reminder);
		if (!valid.success) return valid;
		
		let reminders = this.reminderStorage.get(this.dateToMapKey(reminder.dateobj)) || [];
		reminders.push(reminder);
		reminders = reminders.sort((a,b) => { return a.dateobj.isBefore( b.dateobj ) ? -1 : 1; });
		
		this.reminderStorage.set(this.dateToMapKey(reminder.dateobj), reminders);
	
		if (triggerEvent)	
			this.dateChange.next(reminder.dateobj);
			
		return valid;
	}

	public updateReminder(oldReminder: CalendarReminder, newReminder: CalendarReminder):CalendarResponse {
		const valid = this.validateReminder(newReminder);
		if (!valid.success) return valid;
		
		let reminders = this.reminderStorage.get(this.dateToMapKey(oldReminder.dateobj)) || [];
		const ix = reminders.indexOf(oldReminder);
		if (ix >= 0) {
			reminders.splice(ix,1);
			this.reminderStorage.set(this.dateToMapKey(oldReminder.dateobj), reminders);
		}
		
		return this.addReminder(newReminder, true);
	}
}
