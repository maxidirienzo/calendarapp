import {RemindersService} from './reminders.service';
import {CalendarReminder} from '../models/calendar-reminder';
import {CalendarResponse} from '../models/calendar-response';
import * as moment from 'moment';

describe('RemindersService', () => {
	let service: RemindersService;

	beforeEach(() => {
		service = new RemindersService();
	});	
	
	it('should exist', () => {
		const service: RemindersService = new RemindersService();
		expect(service).toBeTruthy();
	});
	
	it('should return a list of reminders', (done: DoneFn) => {
	  service.getReminders(moment('2019-01-01')).subscribe({
		next: (reminders: CalendarReminder[]) => {
			expect(reminders).toBeTruthy();
			done();
		}});
	});	

	it('should add a red reminder of 30 chars long to 2019-01-01 15:35 and return a success message', (done: DoneFn) => {
		const newRem: CalendarReminder = {
			dateobj: moment('2019-01-01 15:35'),
			text: '012345678901234567890123456789',
			classname: 'red'
		};
		const ret:CalendarResponse = service.addReminder(newRem, false);
		expect(ret.success).toBeTruthy();
		
		service.getReminders(moment('2019-01-01')).subscribe({
		next: (reminders: CalendarReminder[]) => {
			expect(reminders.length).toBe(1);
			expect(reminders[0].text).toBe('012345678901234567890123456789');
			expect(reminders[0].classname).toBe('red');
			expect(reminders[0].dateobj.isSame(moment('2019-01-01 15:35'))).toBeTruthy();
			done();
		}});
	});	

	it('should add an invalid class reminder to 2019-01-01 15:35 and return an error message', (done: DoneFn) => {
		const newRem: CalendarReminder = {
			dateobj: moment('2019-01-01 15:35'),
			text: 'Test reminder',
			classname: 'invalidclass'
		};
		const ret:CalendarResponse = service.addReminder(newRem, false);
		expect(ret.success).toBeFalsy();
		expect(ret.message).toBe('Invalid style selected for the reminder');
		done();
	});	

	it('should not add a reminder due to max chars and return an error message', (done: DoneFn) => {
		const newRem: CalendarReminder = {
			dateobj: moment('2019-01-01 15:35'),
			text: '0123456789012345678901234567891',
			classname: 'red'
		};
		const ret:CalendarResponse = service.addReminder(newRem, false);
		expect(ret.success).toBeFalsy();
		expect(ret.message).toBe('Description can have maximum 30 characters');
		done();
	});	
	
	
	it('should add a red reminder on 2019-01-01 and return a success message then delete the reminder and get an empty reminder list for the month 2019-01', (done: DoneFn) => {
		const newRem: CalendarReminder = {
			dateobj: moment('2019-01-01 15:35'),
			text: '012345678901234567890123456789',
			classname: 'red'
		};
		const ret:CalendarResponse = service.addReminder(newRem, false);
		expect(ret.success).toBeTruthy();
		
		service.getReminders(moment('2019-01-01')).subscribe({
		next: (reminders: CalendarReminder[]) => {
			expect(reminders.length).toBe(1);
			expect(reminders[0].text).toBe('012345678901234567890123456789');
			expect(reminders[0].classname).toBe('red');
			expect(reminders[0].dateobj.isSame(moment('2019-01-01 15:35'))).toBeTruthy();
			
			service.deleteReminder(reminders[0]);
			
			service.getReminders(moment('2019-01-01')).subscribe({
			next: (reminders: CalendarReminder[]) => {
				expect(reminders.length).toBe(0);
				done();
			}});
		}});
	});	
	
});