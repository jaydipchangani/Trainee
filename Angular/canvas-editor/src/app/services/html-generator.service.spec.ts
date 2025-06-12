import { TestBed } from '@angular/core/testing';

import { HtmlGeneratorService } from './html-generator.service';

describe('HtmlGeneratorService', () => {
  let service: HtmlGeneratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HtmlGeneratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
