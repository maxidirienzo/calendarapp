import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {Expo} from 'gsap/all';

declare var TweenLite: any;

/**
 npm install --save gsap
 npm install --save-dev @types/greensock

 add scripts in angular.json
 "node_modules/gsap/src/uncompressed/TweenLite.js"
 */

const ZOOM_LIST = [1, 2, 4, 8];

export interface IntGalleryPicture {
    image: string;
    thumb: string;
}

@Component({
    selector: 'app-gallery',
    templateUrl: './gallery.component.html',
    styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {

    @ViewChild('thumbs') thumbs: ElementRef;
    @ViewChild('thumbscont') thumbscont: ElementRef;

    @Output() close: EventEmitter<void> = new EventEmitter();

    pictures: IntGalleryPicture[] = [
        {
            image: '/tests/notesapp/code/dist/calendarapp/assets/1.jpg',
            thumb: '/tests/notesapp/code/dist/calendarapp/assets/t1.jpg',
        },
        {
            image: '/tests/notesapp/code/dist/calendarapp/assets/2.jpg',
            thumb: '/tests/notesapp/code/dist/calendarapp/assets/t2.jpg',
        },
        {
            image: '/tests/notesapp/code/dist/calendarapp/assets/3.jpg',
            thumb: '/tests/notesapp/code/dist/calendarapp/assets/t3.jpg',
        },
        {
            image: '/tests/notesapp/code/dist/calendarapp/assets/4.jpg',
            thumb: '/tests/notesapp/code/dist/calendarapp/assets/t4.jpg',
        },
        {
            image: '/tests/notesapp/code/dist/calendarapp/assets/5.jpg',
            thumb: '/tests/notesapp/code/dist/calendarapp/assets/t5.jpg',
        },
        {
            image: '/tests/notesapp/code/dist/calendarapp/assets/6.jpg',
            thumb: '/tests/notesapp/code/dist/calendarapp/assets/t6.jpg',
        },
        {
            image: '/tests/notesapp/code/dist/calendarapp/assets/7.jpg',
            thumb: '/tests/notesapp/code/dist/calendarapp/assets/t7.jpg',
        },
    ];

    currentIndex = 0;

    currentZoom = 0;


    constructor() {
    }

    ngOnInit() {
        this.setXThumbPosition();
    }

    doClose() {
        this.close.emit();
    }

    getIndexText() {
        const index = this.currentIndex;
        const length = this.pictures.length;
        const current = (index < 9) ? '0' + (index + 1) : (index + 1);
        const total = (length < 9) ? '0' + length : length;
        return current + ' de ' + total;
    }

    zoomOut() {
        if (this.currentZoom > 0) {
            this.currentZoom--;
        }
    }

    zoomIn() {
        if (this.currentZoom < ZOOM_LIST.length - 1) {
            this.currentZoom++;
        }
    }

    swipeevent(e) {
        if (this.currentZoom === 0) {
            console.debug(e);
        }
    }
    swipe(index: number) {
        if (index < 0) {
            index = 0;
        } else if (index > this.pictures.length - 1) {
            index = this.pictures.length - 1;
        }

        this.currentIndex = index;
        this.setXThumbPosition();
    }

    pan(e) {

    }

    tap(e) {
        // this.imageZoom.tap(e)
    }

    pinch(e) {
        // this.imageZoom.pich(e)
    }

    hasZoomOut() {
        return (this.currentZoom > 0);
    }

    hasZoomIn() {
        return (this.currentZoom < ZOOM_LIST.length - 1);
    }

    getCurrentXPosition() {
        return this.currentIndex * -100;
    }

    setXThumbPosition() {
        const h = this.thumbs.nativeElement.clientHeight;
        const w = (window.innerWidth - h) * 0.5;
        let x = (h * this.currentIndex) - w;
        x = (x > this.thumbs.nativeElement.scrollWidth) ? this.thumbs.nativeElement.scrollWidth : x;

        TweenLite.to(this.thumbscont.nativeElement, 0.5, {scrollLeft: x, ease: Expo.easeOut});
        // this.thumbscont.nativeElement.scrollLeft = x;
    }

    updateZoom($event: number) {
        this.currentZoom = $event;
    }
}
