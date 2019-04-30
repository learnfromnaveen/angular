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
  private httpOptions: any = { 
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
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

  updateHero(hero: Hero): Observable<any>{
    return this.http.put(this.heroesUrl, hero, this.httpOptions)
           .pipe(
              tap( data => this.log(`updated hero id = ${hero.id}`)),
              catchError(this.handleErrror<any>('updateHero'))
           );
  }

  addHero(hero: Hero): Observable<Hero>{
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions)
          .pipe(
            //tap( (newHero:Hero) => this.log(`added hero id = ${newHero.id}`)),
            catchError(this.handleErrror<any>('addedHero'))
          );
  }

  deleteHero(hero: Hero | number): Observable<Hero>{
    const id  =  typeof hero === 'number' ? hero : hero.id;
    const url  = `${this.heroesUrl}/${id}`;

    return this.http.delete<Hero>(url, this.httpOptions)
    .pipe(
      tap( response => this.log(`deeted hero id = ${id}`)),
      catchError(this.handleErrror<any>('deleteHero'))
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


  searchHeroes(term: string): Observable<Hero[]>{
    this.log(`Search Team: ${term}`);
    if(!term && !term.trim()){
      return of([]);
    }

    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`)
           .pipe(
              tap( _ => this.log(`found heros matching "${term}"`)),
              catchError(this.handleErrror<Hero[]>('searchHeroes',[]))
           ); 
  }
}
