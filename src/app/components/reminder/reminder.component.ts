import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {CalendarReminder} from '../../models/calendar-reminder';

@Component({
  selector: 'reminder',
  templateUrl: './reminder.component.html',
  styleUrls: ['./reminder.component.css']
})
export class ReminderComponent implements OnInit {

	@Input() reminder: CalendarReminder;
	@Output() delete: EventEmitter<CalendarReminder> = new EventEmitter();
	@Output() update: EventEmitter<CalendarReminder> = new EventEmitter();

	constructor() { }

	ngOnInit() {
	}

	updateReminder() {
		this.update.emit(this.reminder);
	}

	deleteReminder() {
		this.delete.emit(this.reminder);
	}

}
