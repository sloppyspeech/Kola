import { Injectable } from '@angular/core';
import { MapService } from './map.service';

@Injectable({
  providedIn: 'root'
})
export class InputService {

  private s_origin:string;
  private s_destination:string;

  constructor(private mapSer:MapService) { }

  searchRoute(){
    this.mapSer.getRoute();
  }
  setOrigin(p_origin:string){
    console.log(`InputService Origin:${p_origin}`);
    this.s_origin=p_origin;
    this.mapSer.setOrigin(this.s_origin);
  }

  setDestination(p_destination:string){
    console.log(`InputService Destination:${p_destination}`);
    this.s_destination=p_destination;
    this.mapSer.setDestination(this.s_destination);
  }

}
