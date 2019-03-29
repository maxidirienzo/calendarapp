import {CalendarReminder} from './calendar-reminder';
import * as moment from 'moment';

export interface CalendarDate {
	dateobj: moment.Moment;
	date: number;
	day: number;
	today: boolean;
	currmonth: boolean;
	expanded: boolean;
	reminders: CalendarReminder[];
}