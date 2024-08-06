import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptVideoCallComponent } from './accept-video-call.component';

describe('AcceptVideoCallComponent', () => {
  let component: AcceptVideoCallComponent;
  let fixture: ComponentFixture<AcceptVideoCallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcceptVideoCallComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AcceptVideoCallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
