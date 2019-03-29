import { Component, Injectable, Input, SecurityContext, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'dialogs_service-modal-content',
  template: `
    <div class="modal-header">
      <h4 class="modal-title">{{title()}}</h4>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.close(false)">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <p *ngIf="!prompt" [innerHTML]="getcaption()"></p>
	  <input *ngIf="prompt" #inputprompt type="text" class="form-control" [(ngModel)]="current_val" maxlength="255" />
    </div>
    <div class="modal-footer text-center">
	  &nbsp;
      <button *ngIf="!confirm && !prompt" type="button" class="btn btn-primary" (click)="activeModal.close(false)">Close</button>
	  
      <button *ngIf="confirm" type="button" class="btn btn-success" (click)="activeModal.close(true)">Confirm</button>
	  &nbsp;
      <button *ngIf="confirm" type="button" class="btn btn-danger" (click)="activeModal.close(false)">Cancel</button>
	  
      <button *ngIf="prompt" type="button" class="btn btn-success" (click)="activeModal.close(current_val)">Confirm</button>
	  &nbsp;
      <button *ngIf="prompt" type="button" class="btn btn-danger" (click)="activeModal.close(false)">Cancel</button>
    </div>
  `
})
export class _DialogsServiceModalContent implements AfterViewInit {
	@ViewChild("inputprompt") inputEl: ElementRef;
	@Input() caption;
	@Input() current_val;
	@Input() confirm:boolean;
	@Input() prompt:boolean;

	constructor(public activeModal: NgbActiveModal, public sanitizer: DomSanitizer) {}

	ngAfterViewInit() {
		if (this.prompt)
			this.inputEl.nativeElement.focus();
	}

	title() {
		return this.confirm ? 'Confirm' : (this.prompt ? this.caption : 'Alert');
	}

	getcaption() {
		return this.sanitizer.sanitize(SecurityContext.HTML, this.caption);
	}
}


@Injectable()
export class DialogsService {
	
	constructor(public modalService: NgbModal) {}
	
	public confirm( s:string, cb:Function ) {
		const modalRef = this.modalService.open(_DialogsServiceModalContent, { size: 'sm', centered: true, backdrop : 'static' });
		modalRef.componentInstance.caption = s;
		modalRef.componentInstance.confirm = true;
		modalRef.componentInstance.prompt = false;
		modalRef.result.then((ret) => {
			if (ret) cb.call(cb);
		},
		() => { false; })		
	}
	
	public prompt( s:string, current_val:any, cb:Function ) {
		const modalRef = this.modalService.open(_DialogsServiceModalContent, { size: 'sm', centered: true, backdrop : 'static' });
		modalRef.componentInstance.caption = s;
		modalRef.componentInstance.current_val = current_val;
		modalRef.componentInstance.confirm = false;
		modalRef.componentInstance.prompt = true;
		modalRef.result.then((ret) => {
			if (ret !== false) cb.call(cb, ret);
		},
		() => { false; })		
	}
	
	public alert( s:string ) {
		const modalRef = this.modalService.open(_DialogsServiceModalContent, { size: 'sm', centered: true, backdrop : 'static' });
		modalRef.componentInstance.caption = s;
		modalRef.componentInstance.confirm = false;
		modalRef.componentInstance.prompt = false;
	}
}
