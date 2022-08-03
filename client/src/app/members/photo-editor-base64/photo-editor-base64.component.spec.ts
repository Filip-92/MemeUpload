import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoEditorBase64Component } from './photo-editor-base64.component';

describe('PhotoEditorBase64Component', () => {
  let component: PhotoEditorBase64Component;
  let fixture: ComponentFixture<PhotoEditorBase64Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhotoEditorBase64Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhotoEditorBase64Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
