import {Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild} from '@angular/core';
import {IntGalleryPicture} from './gallery.component';
import {Expo} from 'gsap/all';

declare var TweenLite: any;

const ZOOM_LIST = [1, 2, 4, 8];

@Component({
    selector: 'app-gallery-image',
    templateUrl: './image.component.html',
    styleUrls: ['./image.component.scss']
})
export class ImageComponent implements OnInit {

    @ViewChild('img') img: ElementRef;

    @Input() image: IntGalleryPicture;

    _currentZoom = 0;
    @Input('currentZoom')
    set currentZoom(value: number) {
        this._currentZoom = value;
        this.setZoom(ZOOM_LIST[value]);
    }

    @Output() zoomChange: EventEmitter<number> = new EventEmitter();

    scaleMIN = ZOOM_LIST[0];
    scaleMAX = ZOOM_LIST[ZOOM_LIST.length - 1];
    scaleFrom = 0;
    scaleTo = 0;
    status = false;

    x = 0;
    xFrom = 0;
    xTo = 0;

    y = 0;
    yFrom = 0;
    yTo = 0;
    time = 0;

    constructor() {
        this.scaleFrom = this.scaleMIN;
        this.scaleTo = this.scaleFrom;
    }

    ngOnInit() {
    }

    onload() {
        this.setImageInitPosition();
    }

    setImageInitPosition() {
        // Init GSAP Matrix
        const w = window.innerWidth;
        const h = window.innerHeight;
        TweenLite.set(this.img.nativeElement, {
            x: (w - this.img.nativeElement.clientWidth) * 0.5,
            y: (h - this.img.nativeElement.clientHeight) * 0.5,
            scale: this.scaleMIN
        });
    }

    /**
     * Set Position
     * @param e
     */
    setPosition(e) {
        this.x = this.xFrom + e.deltaX;
        this.y = this.yFrom + e.deltaY;
        this.setHalfPosition();

        TweenLite.set(this.img.nativeElement, {x: this.xTo, y: this.yTo});
    }

    /**
     * Set Half Position
     */
    setHalfPosition() {
        const a = this.checkImageAxis();
        const x = (a.x === true) ? this.x : 0;
        const y = (a.y === true) ? this.y : 0;
        this.xTo = ((window.innerWidth - this.img.nativeElement.clientWidth) * 0.5) + x;
        this.yTo = ((window.innerHeight - this.img.nativeElement.clientHeight) * 0.5) + y;
    }

    /**
     * Check Image Axis
     * @returns {{x: boolean, y: boolean}}
     */
    checkImageAxis() {
        return {
            x: this.img.nativeElement.clientWidth * this.scaleFrom > window.innerWidth,
            y: this.img.nativeElement.clientHeight * this.scaleFrom > window.innerHeight
        };
    }

    @HostListener('pan', ['$event'])
    pan(e) {
        if (this.status === false) {
            this.setPosition(e);
        }
    }

    /**
     * Pan End
     * @param e
     */
    @HostListener('panend', ['$event'])
    panEnd(e) {
        this.xFrom = this.x;
        this.yFrom = this.y;
        this.checkImagePosition();
    }

    @HostListener('tap', ['$event'])
    tap(e) {
        const time = new Date().getTime();
        if (time - this.time < 250 && this.status === false) {
            this.zoomTap();
        }
        this.time = time;
    }

    /**
     * Zoom Tap
     */
    zoomTap() {
        let next = ZOOM_LIST.filter((zoom) => zoom > this.scaleFrom)[0];
        if (!next) {
            next = ZOOM_LIST[0];
        }
        this.setZoom(next);
    }

    /**
     * Zoom In
     */
    zoomIn() {
        const next = ZOOM_LIST.filter((zoom) => zoom > this.scaleFrom)[0];
        if (next) {
            this.setZoom(next);
        }
    }

    /**
     * Zoom Out
     */
    zoomOut() {
        const next = ZOOM_LIST.filter((zoom) => zoom < this.scaleFrom);
        if (next.length !== 0) {
            this.setZoom(next[next.length - 1]);
        }
    }

    /**
     * Set Zoom
     * @param zoom
     */
    setZoom(zoom) {
        const tmp = ZOOM_LIST.indexOf(zoom);
        if (this._currentZoom !== tmp) {
            this._currentZoom = tmp;
            this.zoomChange.emit(this._currentZoom);
        }

        this.xFrom = this.x = 0;
        this.yFrom = this.y = 0;
        this.setHalfPosition();

        this.scaleFrom = this.scaleTo = zoom;

        this.status = true;

        TweenLite.to(this.img.nativeElement, 0.5, {
            scale: this.scaleTo,
            x: this.xTo,
            y: this.yTo,
            ease: Expo.easeOut,
            onComplete: () => {
                this.status = false;
            }
        });
    }

    /**
     * Set Scale
     * @param scale
     */
    setScale(scale) {
        const s = this.scaleFrom * scale;
        this.scaleTo = Math.min(this.scaleMAX, Math.max(this.scaleMIN, s));
        TweenLite.set(this.img.nativeElement, {scale: this.scaleTo});
    }

    /**
     * Get Status
     * @returns {boolean}
     */
    getStatus() {
        if (
            this.img.nativeElement.clientWidth * this.scaleFrom > window.innerWidth ||
            this.img.nativeElement.clientHeight * this.scaleFrom > window.innerHeight
        ) {
            return true;
        } else {
            return this.status;
        }
    }


    /**
     * Check Image Position
     */
    checkImagePosition() {
        const a = this.checkImageAxis();
        const b = this.img.nativeElement.getBoundingClientRect();

        const left = b.left;
        const right = window.innerWidth - b.right;
        const top = b.top;
        const bottom = window.innerHeight - b.bottom;

        let x = this.x;
        let y = this.y;

        // Left
        if (left > 0) {
            x = x - left;
        }

        // Right
        if (right > 0) {
            x = x + right;
        }

        // top
        if (top > 0) {
            y = y - top;
        }

        // bottom
        if (bottom > 0) {
            y = y + bottom;
        }

        const xs = (a.x === true && x !== this.x);
        const ys = (a.y === true && y !== this.y);

        if (xs === true || ys === true) {
            this.xFrom = this.x = x;
            this.yFrom = this.y = y;
            this.setHalfPosition();

            TweenLite.to(this.img.nativeElement, 0.5, {
                x: this.xTo,
                y: this.yTo,
                ease: Expo.easeOut,
                delay: 0.1
            });
        }
    }


    //
    // /**
    //  * Pich
    //  * @param e
    //  */
    // pich (e) {
    //     switch (e.type) {
    //         // Start
    //         case 'pinchstart':
    //             this.status = true
    //             this.scaleTo = this.scaleFrom
    //             break
    //
    //         // End
    //         case 'pinchend':
    //             this.scaleFrom = this.scaleTo
    //
    //             this.xFrom = this.x = 0
    //             this.yFrom = this.y = 0
    //             this.setHalfPosition()
    //
    //             TweenLite.to(this.img.nativeElement, 0.5, {
    //                 x: this.xTo,
    //                 y: this.yTo,
    //                 ease: Expo.easeOut,
    //                 onComplete: () => {
    //                     this.status = false
    //                 }
    //             })
    //             break
    //
    //         // Pich
    //         case 'pinch':
    //             this.setScale(e.scale)
    //             break
    //     }
    // }

    /**
     * Update Index
     * @param index
     */
    // updateIndex (index) {
    //     let image = this.container.querySelector('img[data-index=\'' + index + '\']')
    //
    //     if (this.img.nativeElement !== null && this.image !== image) {
    //         this.setImageInitPosition(this.img.nativeElement)
    //         this.scaleFrom = this.scaleMIN
    //     }
    //
    //     this.image = image
    // }
}
