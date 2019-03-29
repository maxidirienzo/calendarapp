import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CalendarComponent } from './components/calendar/calendar.component';
import { AppComponent } from './app.component';
import { NewreminderComponent } from './components/newreminder/newreminder.component';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateENParserFormatter } from './ngdatepicker.formatter';
import { DialogsService, _DialogsServiceModalContent } from './services/dialog.service';
import { ReminderComponent } from './components/reminder/reminder.component';

@NgModule({
  declarations: [
    AppComponent,
    CalendarComponent,
    NewreminderComponent,
	_DialogsServiceModalContent,
	ReminderComponent,
  ],
  imports: [
    BrowserModule,
	FormsModule,
	NgbModule,
  ],
  providers: [
    DialogsService,
	{provide: NgbDateParserFormatter, useClass: NgbDateENParserFormatter},
  ],
  bootstrap: [AppComponent],
  entryComponents: [
	NewreminderComponent,
	_DialogsServiceModalContent
  ]
})
export class AppModule { }
