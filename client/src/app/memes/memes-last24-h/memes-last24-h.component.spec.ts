import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemesLast24HComponent } from './memes-last24-h.component';

describe('MemesLast24HComponent', () => {
  let component: MemesLast24HComponent;
  let fixture: ComponentFixture<MemesLast24HComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MemesLast24HComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MemesLast24HComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
