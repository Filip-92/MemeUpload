import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemeTitleInputComponent } from './meme-title-input.component';

describe('MemeTitleInputComponent', () => {
  let component: MemeTitleInputComponent;
  let fixture: ComponentFixture<MemeTitleInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MemeTitleInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MemeTitleInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
