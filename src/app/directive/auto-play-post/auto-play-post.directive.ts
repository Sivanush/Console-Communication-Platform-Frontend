import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appAutoPlayPost]',
  standalone: true
})
export class AutoPlayPostDirective {

  private observer: IntersectionObserver | null = null;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (this.el.nativeElement as HTMLVideoElement).play();
          } else {
            (this.el.nativeElement as HTMLVideoElement).pause();
          }
        });
      },
      { threshold: 0.5 } // Adjust this value to change when the video starts/stops playing
    );

    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

}
