import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemeUploadBase64Component } from './meme-upload-base64.component';

describe('MemeUploadBase64Component', () => {
  let component: MemeUploadBase64Component;
  let fixture: ComponentFixture<MemeUploadBase64Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MemeUploadBase64Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MemeUploadBase64Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
