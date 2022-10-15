import {NgModule} from '@angular/core';
import {Route, RouterModule, Routes} from '@angular/router';

const tamagotchi: Route = {
  path: '',
  pathMatch: 'full',
  loadChildren: () =>
    import('./feature/tamagotchi/tamagotchi.module')
      .then(m => m.TamagotchiModule),
}

const routes: Routes = [
  tamagotchi,
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
