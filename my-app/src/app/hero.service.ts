import { Injectable } from '@angular/core';
import { Hero } from './hero'
import { Observable, of } from 'rxjs'
import { MessageService } from './message.service'

import { HttpClient, HttpHeaders } from '@angular/common/http'
import { catchError, map, tap } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  private heroesUrl = 'api/heroes';  // URL to web api

  constructor(
      private messageService: MessageService,
      private http: HttpClient
    
    ) { }

  getHeroes(): Observable<Hero[]>{
    return this.http.get<Hero[]>(this.heroesUrl)
            .pipe(
                tap(data => {
                    this.log('HeroService: fetched');
                }),
                catchError(this.handleErrror<Hero[]>('getHeroes',[]))
            );
  }

  getHero(id: number): Observable<Hero>{
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url)
            .pipe(
                 tap( data =>{
                    this.log(`HeroService: fetched id:${id}`);
                 }),
                 catchError(this.handleErrror<Hero>(`getHero id: ${id}`))
            );
  }

  private log(message: string): void{ 
    this.messageService.add(message);

  }


  private handleErrror<T>(operation = 'operation', result?: T){
    return (error: any): Observable<T> =>{
      var message: string = `${operation} failed: ${error.statusText}`;
      console.log( message );
      this.log(message);
      return of(result as T);
    }
  }
}
