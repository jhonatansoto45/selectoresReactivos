import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, combineLatest } from 'rxjs';
import { Pais, PaisSmall } from '../interfaces/paises.interface';

@Injectable({
  providedIn: 'root',
})
export class PaisesService {
  private baseUrl: string = 'https://restcountries.com/v3';

  private _regiones: string[] = [
    'Africa',
    'Americas',
    'Asia',
    'Europe',
    'Oceania',
  ];

  constructor(private http: HttpClient) {}

  get regiones(): string[] {
    return [...this._regiones];
  }

  getPaisesPorRegion(region: string): Observable<PaisSmall[]> {
    if (!region) {
      return of([]);
    }

    const url: string = `${this.baseUrl}/region/${region}?fields=cca3,name`;
    return this.http.get<PaisSmall[]>(url);
  }

  getPaisesPorFrontera(codigo: string): Observable<Pais[]> {
    if (!codigo) {
      return of([]);
    }

    const url: string = `${this.baseUrl}/alpha/${codigo}`;
    return this.http.get<Pais[]>(url);
  }

  getPaisPorCodigoSmall(codigo: string): Observable<PaisSmall> {
    const url: string = `${this.baseUrl}/alpha/${codigo}?fields=cca3,name`;
    return this.http.get<PaisSmall>(url);
  }

  getPaisesPorCodigos( borders: string[] ): Observable<PaisSmall[]> {

    if ( !borders ) {
      return of([]);
    }

    const peticiones: Observable<PaisSmall>[] = [];

    borders.forEach( codigo => {
      const peticion = this.getPaisPorCodigoSmall(codigo);
      peticiones.push( peticion );
    });

    return combineLatest( peticiones );

  }
}
