import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InputComponent  } from './input/input.component';
import { HomeComponent  } from './home/home.component';
import { TripsComponent  } from './trips/trips.component';

const routes: Routes = [
  {'path':'',component:HomeComponent},
  {'path':'home',component:HomeComponent},
  {'path':'trips',component:TripsComponent},
  {'path':'getTripDetails/:trip_id',component:HomeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
