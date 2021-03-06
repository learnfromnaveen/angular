import { Component, OnInit } from '@angular/core';
import { Hero } from '../hero'
import { HeroService } from '../hero.service'
import { MessageService } from '../message.service'
@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css'],
})
export class HeroesComponent implements OnInit {
  heroes: Hero[];
  selectedHero: Hero;
  constructor(private heroService: HeroService
              , private messageService: MessageService) 
  {

  }

  ngOnInit() {
    this.getHeroes();
  }

  getHeroes(): void{
     this.messageService.add('HeroesComponent: HeroService.getHeroes() method call initiated');
     this.heroService.getHeroes()
     .subscribe( heroes => {
       this.heroes = heroes;
      });

  }

  addHero(name: string): void{
    name = name.trim(); 
    
    if(!name) { return; }

    var hero: Hero = { name} as Hero;
    this.heroService.addHero(hero)
    .subscribe( hero => {
      this.heroes.push(hero);
    });

  }

  deleteHero(hero: Hero): void{
    this.heroService.deleteHero(hero)
    .subscribe( hero => {
      this.getHeroes();
    });
  }

}
