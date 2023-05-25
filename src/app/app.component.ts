import { Component } from '@angular/core';
import { ConnectionService } from './services/connection/connection.service';
import { Ability } from './models/pokemon';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'rxjs-test';

  constructor(private connService: ConnectionService){
    connService.getDittoWithPromise().then(ditto =>console.log('fetch ditto in component with promise',ditto))

    connService.getDittoWithObservable().subscribe({
      next: ditto=> console.log('fetch ditto in component with observable', ditto),
      error: err=> console.log(err),
    })

    connService.getFirst20PokemonWithPromise().then(pokemon => console.log('20 pokemon promise  ',pokemon))

    connService.getDittoWithObservable().subscribe({
      next: pokemons => console.log('20 pokemon observable ', pokemons),
      error: err=> console.log(err),

    })

    connService.getFirstAbilityPromise()
    .then(ability => console.log( 'first ability with fetch', ability))


    connService.getFirstAbilityObservable().subscribe({
      next: ability => console.log('limber ability ', ability),
      error: error=> console.log(error),

    })
  }
}
