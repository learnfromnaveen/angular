import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HeroService } from '../hero.service';
import { Hero } from '../hero'
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.css']
})
export class HeroSearchComponent implements OnInit {

  heroes$:Observable<Hero[]>;
  searchTerms = new Subject<string>();  

  constructor(private heroService: HeroService) { }

  ngOnInit(): void{
   
    this.heroes$ = this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => this.heroService.searchHeroes(term))
    ); // end pipe
  }

  search(term: string):void{
      this.searchTerms.next(term);
  }
}
