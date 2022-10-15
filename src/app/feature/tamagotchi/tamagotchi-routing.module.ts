import {NgModule} from '@angular/core';
import {Route, RouterModule, Routes} from '@angular/router';

const home: Route = {
  path: '',
  pathMatch: 'full',
  loadComponent: () =>
    import('./tamagotchi-page/tamagotchi-page.component')
      .then(m => m.TamagotchiPageComponent),
}

const routes: Routes = [
  home,
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TamagotchiRoutingModule {
}
