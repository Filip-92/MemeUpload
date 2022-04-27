import { Component, Input, OnInit, Self } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

@Component({
  selector: 'app-meme-title-input',
  templateUrl: './meme-title-input.component.html',
  styleUrls: ['./meme-title-input.component.css']
})
export class MemeTitleInputComponent implements ControlValueAccessor {
  @Input() label: string;
  @Input() type = 'text';
  
    constructor(@Self() public ngControl: NgControl) { 
      this.ngControl.valueAccessor = this;
    }
  
    writeValue(obj: any): void {
    }
    registerOnChange(fn: any): void {
    }
    registerOnTouched(fn: any): void {
    }

}
