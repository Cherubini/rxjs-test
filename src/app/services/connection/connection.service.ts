import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin, switchMap } from 'rxjs';
import { Ability, Pokemon } from 'src/app/models/pokemon';


@Injectable({
  providedIn: 'root'
})
export class ConnectionService {


  constructor(private http:HttpClient) {
    this.getDittoWithPromise();
    this.getDittoWithObservable()
   }

   readonly DITTO_URL= 'https://pokeapi.co/api/v2/pokemon/ditto';
   readonly ALL_POKEMON_URL= 'https://pokeapi.co/api/v2/pokemon';

  getDittoWithPromise():Promise<any>{
    return fetch(this.DITTO_URL).then(resp => resp.json());
  }

getDittoWithObservable(): Observable<Pokemon>{
    return this.http.get<Pokemon>(this.DITTO_URL) //si possono tipare le get con questa sintassi
    // .subscribe({
    //   next: ditto => console.log(ditto),
    //   error: error => console.log(error),

    // })
  }

  getFirst20PokemonWithPromise():Promise<Pokemon[]>{
    const fetchArray = [];

    for (let i = 0; i < 20; i++) {
      const url = this.ALL_POKEMON_URL;
      console.log(url);
      const request= fetch(url).then(resp => resp.json());
      fetchArray.push(request);
      }
      return Promise.all(fetchArray);
  }

  getFirst20PokemonWithObservable(): Observable<Pokemon[]>{
    const getArray=[];

    for (let i = 0; i < 20; i++) {
      const url = this.ALL_POKEMON_URL + '/' + i + '/';
      console.log(url);
      const request = this.http.get<Pokemon>(url);
      getArray.push(request);
    }
    return forkJoin(getArray);
  }

  getFirstAbilityPromise():Promise<Pokemon>{
    return fetch(this.DITTO_URL)
    .then(resp => resp.json())
    .then(ditto =>{
      const abilities = ditto.abilities;
      const firstAbilityInfo=abilities[0].ability;
      const abilityUrl= firstAbilityInfo.url;
      return fetch(abilityUrl).then(resp=>resp.json())
    })
  }

  getFirstAbilityObservable(): Observable<Ability>{
    return this.http.get<Pokemon>(this.DITTO_URL).pipe(
      switchMap((ditto)=>{
        const abilities = ditto.abilities;
        const firstAbilityInfo=abilities[0].ability;
        const abilityUrl= firstAbilityInfo.url;
        return this.http.get<Ability>(abilityUrl);
      })
    )
  }

  getAllPokemonsWithPromises(){
    return fetch(this.ALL_POKEMON_URL)
    .then(resp=>resp.json())
    .then(pokemon => {
      const result = pokemon.results;

      const fetchArray = [];
      for (let i = 0; i < 20; i++) {
        const request= fetch(result.url).then(resp => resp.json());
        fetchArray.push(request);
        }
        return Promise.all(fetchArray);
    })
  }

  getAllPokemonsWithObservable(): Observable<Pokemon[]>{
    return this.http.get<any>(this.ALL_POKEMON_URL).pipe(
      switchMap(pokemons =>{
        const results =pokemons.results;
        const getArray = [];
        for (const result of results) {
          const request = this.http.get<Pokemon>(result.url);
          getArray.push(request);
        }
        return forkJoin(getArray);
      })
    )
  }

}
