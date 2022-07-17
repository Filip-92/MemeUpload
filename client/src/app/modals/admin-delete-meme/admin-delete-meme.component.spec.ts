import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDeleteMemeComponent } from './admin-delete-meme.component';

describe('AdminDeleteMemeComponent', () => {
  let component: AdminDeleteMemeComponent;
  let fixture: ComponentFixture<AdminDeleteMemeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminDeleteMemeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminDeleteMemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
