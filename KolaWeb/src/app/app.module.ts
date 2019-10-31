import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule  } from '@angular/forms';
import { ReactiveFormsModule  } from '@angular/forms';
import { HttpClientModule  } from '@angular/common/http';

import { Ng2CompleterModule } from 'ng2-completer';
import { AgGridModule  } from 'ag-grid-angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AutocompleteModule } from 'ng2-input-autocomplete';

import { InputComponent } from './input/input.component';
import { MapComponent } from './map/map.component';
import { InputService  } from './services/input.service';
import { MapService  } from './services/map.service';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { TripsComponent } from './trips/trips.component';

@NgModule({
  declarations: [
    AppComponent,
    InputComponent,
    MapComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    TripsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    Ng2CompleterModule,
    AutocompleteModule,
    AgGridModule.withComponents([])
  ],
  providers: [InputService,MapService],
  bootstrap: [AppComponent]
})
export class AppModule { }
