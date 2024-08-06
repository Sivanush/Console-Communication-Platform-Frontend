import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectVideoCallComponent } from './direct-video-call.component';

describe('DirectVideoCallComponent', () => {
  let component: DirectVideoCallComponent;
  let fixture: ComponentFixture<DirectVideoCallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DirectVideoCallComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DirectVideoCallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
