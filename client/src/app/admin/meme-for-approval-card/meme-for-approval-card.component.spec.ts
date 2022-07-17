import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemeForApprovalCardComponent } from './meme-for-approval-card.component';

describe('MemeForApprovalCardComponent', () => {
  let component: MemeForApprovalCardComponent;
  let fixture: ComponentFixture<MemeForApprovalCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MemeForApprovalCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MemeForApprovalCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
