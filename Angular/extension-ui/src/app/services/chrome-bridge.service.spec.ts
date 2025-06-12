import { TestBed } from '@angular/core/testing';

import { ChromeBridgeService } from './chrome-bridge.service';

describe('ChromeBridgeService', () => {
  let service: ChromeBridgeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChromeBridgeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
