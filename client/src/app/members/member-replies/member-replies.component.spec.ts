import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberRepliesComponent } from './member-replies.component';

describe('MemberRepliesComponent', () => {
  let component: MemberRepliesComponent;
  let fixture: ComponentFixture<MemberRepliesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MemberRepliesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberRepliesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
