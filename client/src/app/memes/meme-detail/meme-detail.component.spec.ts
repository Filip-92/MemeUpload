import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemeDetailComponent } from './meme-detail.component';

describe('MemeDetailComponent', () => {
  let component: MemeDetailComponent;
  let fixture: ComponentFixture<MemeDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MemeDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MemeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
