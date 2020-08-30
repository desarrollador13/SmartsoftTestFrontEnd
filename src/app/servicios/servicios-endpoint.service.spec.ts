import { TestBed } from '@angular/core/testing';

import { ServiciosEndpointService } from './servicios-endpoint.service';

describe('ServiciosEndpointService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ServiciosEndpointService = TestBed.get(ServiciosEndpointService);
    expect(service).toBeTruthy();
  });
});
