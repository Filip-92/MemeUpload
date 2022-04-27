import { TestBed } from '@angular/core/testing';

import { MemeDetailedResolver } from './meme-detailed.resolver';

describe('MemeDetailedResolver', () => {
  let resolver: MemeDetailedResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(MemeDetailedResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
