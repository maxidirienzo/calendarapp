import * as moment from 'moment';

export interface CalendarReminder {
	dateobj: moment.Moment;
	text:string;
	classname:string;
}