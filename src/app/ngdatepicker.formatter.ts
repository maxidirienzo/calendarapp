import { Injectable } from '@angular/core';
import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class NgbDateENParserFormatter extends NgbDateParserFormatter {
	padNumber(value: number) {
		if (this.isNumber(value)) {
			return `0${value}`.slice(-2);
		} else {
			return "";
		}
	}

	isNumber(value: any): boolean {
		return !isNaN(this.toInteger(value));
	}

	toInteger(value: any): number {
		return parseInt(`${value}`, 10);
	}	
	
    parse(value: string): NgbDateStruct { //parse receive your string mm/dd/yyyy
		let dateParts = value.trim().split('/');
		if (dateParts.length === 3) {
			return {year:this.toInteger(dateParts[2]),month:this.toInteger(dateParts[0]),day:this.toInteger(dateParts[1])}
		}
		else {
			return null;
		}
    }

    format(date: NgbDateStruct): string { //receive a NgbDateStruct
		if (date == null)
			return '';
		else
		    return ''+this.padNumber(date.month)+'/'+this.padNumber(date.day)+'/'+date.year;
    }
}