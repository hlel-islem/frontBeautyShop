import { TestBed } from '@angular/core/testing';

import { MesCommandesService } from './mes-commandes-service';

describe('MesCommandesService', () => {
  let service: MesCommandesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MesCommandesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
