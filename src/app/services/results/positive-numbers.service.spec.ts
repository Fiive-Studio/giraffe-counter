import { TestBed } from '@angular/core/testing';

import { PositiveNumbersService } from './positive-numbers.service';

describe('PositiveNumbersService', () => {
  let service: PositiveNumbersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PositiveNumbersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
