import { TestBed } from '@angular/core/testing';

import { GenericResultsService } from './generic-results.service';

describe('ChinchonService', () => {
  let service: GenericResultsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GenericResultsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
