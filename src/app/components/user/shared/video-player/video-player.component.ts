import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, Input, ViewChild } from '@angular/core';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import { VgCoreModule } from '@videogular/ngx-videogular/core';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
import { AutoPlayPostDirective } from '../../../../directive/auto-play-post/auto-play-post.directive';

@Component({
  selector: 'app-video-player',
  standalone: true,
  imports: [VgCoreModule,VgControlsModule,VgOverlayPlayModule,VgBufferingModule,AutoPlayPostDirective],
  templateUrl: './video-player.component.html',
  styleUrl: './video-player.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class VideoPlayerComponent {
  @ViewChild('media', { static: true }) mediaElement!: ElementRef<HTMLVideoElement>;
  @Input() videoUrl!:string
}
