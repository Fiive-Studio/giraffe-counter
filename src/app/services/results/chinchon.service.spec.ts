import { TestBed } from '@angular/core/testing';

import { ChinchonService } from './chinchon.service';

describe('ChinchonService', () => {
  let service: ChinchonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChinchonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
