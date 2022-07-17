import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMemeViewComponent } from './admin-meme-view.component';

describe('AdminMemeViewComponent', () => {
  let component: AdminMemeViewComponent;
  let fixture: ComponentFixture<AdminMemeViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminMemeViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminMemeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
