import { TestBed } from '@angular/core/testing';

import { PasswordConfirmationValidatorService } from './password-confirmation-validator.service';

describe('PasswordConfirmationValidatorService', () => {
  let service: PasswordConfirmationValidatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PasswordConfirmationValidatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
