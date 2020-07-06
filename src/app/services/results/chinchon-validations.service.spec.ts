import { TestBed } from '@angular/core/testing';

import { ChinchonValidationsService } from './chinchon-validations.service';

describe('ChinchonValidationsService', () => {
  let service: ChinchonValidationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChinchonValidationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
