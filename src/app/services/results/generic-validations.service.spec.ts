import { TestBed } from '@angular/core/testing';

import { GenericValidationsService } from './generic-validations.service';

describe('GenericValidationsService', () => {
  let service: GenericValidationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GenericValidationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
