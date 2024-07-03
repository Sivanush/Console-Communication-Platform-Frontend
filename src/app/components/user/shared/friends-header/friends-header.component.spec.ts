import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendsHeaderComponent } from './friends-header.component';

describe('FriendsHeaderComponent', () => {
  let component: FriendsHeaderComponent;
  let fixture: ComponentFixture<FriendsHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FriendsHeaderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FriendsHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
