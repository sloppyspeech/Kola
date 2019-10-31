import { Component, OnInit, Renderer2, EventEmitter, Output, Input } from '@angular/core';
import { MapService } from '../services/map.service';
import { InputService } from '../services/input.service';
import * as mapboxgl from 'mapbox-gl';
import { environment } from '../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';

// Keyboard Shortcuts 
// = / +: Increase the zoom level by 1.
// Shift-= / Shift-+: Increase the zoom level by 2.
// -: Decrease the zoom level by 1.
// Shift--: Decrease the zoom level by 2.
// Arrow keys: Pan by 100 pixels.
// Shift+⇢: Increase the rotation by 15 degrees.
// Shift+⇠: Decrease the rotation by 15 degrees.
// Shift+⇡: Increase the pitch by 10 degrees.
// Shift+⇣: Decrease the pitch by 10 degrees.

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  private s_origin: any;
  private s_destination: any;
  s_map: mapboxgl.Map;
  private s_map_view_cords: any = { "lng": 77.622, "lat": 12.905 };
  private coordis:any;

  private intv: any;
  private c_map_markers = [];

  constructor(private mapSer: MapService, private inpSer: InputService, private renderer: Renderer2) {
    this.s_origin = this.inpSer.setOrigin;
    this.s_destination = this.inpSer.setDestination;
  }

  ngOnInit() {
    (mapboxgl as any).accessToken = environment.mapbox.accessToken;
    this.s_map = new mapboxgl.Map({
      container: 'kolaMap',
      style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
      interactive: true,
      center: [this.s_map_view_cords.lng, this.s_map_view_cords.lat],
      zoom: 13
    });
    var nav = new mapboxgl.NavigationControl({showCompass:true,showZoom:true});
    this.s_map.addControl(nav, 'top-left');
    this.s_map.dragPan.enable();
    this.s_map.dragRotate.enable();
    this.s_map.keyboard.enable();
    this.setMousePointer();

  }

  addOriginPopulator(event: string) {
    console.log("Origin Event Populator called");
    
  }


  addDestinationPopulator(event: any) {
    console.log("Destination Event Populator called");
    // console.log(event.target.value);
    if (this.s_map.isSourceLoaded('single-point')) {
      console.log('Single Point loaded');

    }



  }

  setMousePointer() {
    console.log(`MapService Origin is:${this.s_origin}  Destination:${this.s_destination}`);
    this.s_map.on('mousedown', (event) => {
      console.log(event.point);
      console.log(event.lngLat);
    });
  }


  showMap(){
    console.log('Show Route Called');
          if (this.s_map.getLayer("route")) {
            console.log("Removing route Layer");
            console.log(`this.c_map_markers ${this.c_map_markers}`);
            this.s_map.removeLayer("route");
            this.s_map.removeSource("route");
            if (this.c_map_markers !== null) {
              for (var i = this.c_map_markers.length - 1; i >= 0; i--) {
                this.c_map_markers[i].remove();
              }
            }
          }
          this.placeMarker(this.mapSer.getOriginCoords(),"car");
          this.placeMarker(this.mapSer.getDestinationCoords(),"body");
          console.log("#########################################");
          console.log(JSON.stringify(this.mapSer.s_route_details));
          console.log(JSON.stringify(this.mapSer.s_route_details.coords));
          // console.log(JSON.stringify(this.mapSer.s_curr_trip_details));
          console.log("#########################################");
          // console.log(JSON.stringify(res));
          // console.log("#########################################");

          //---------------

      this.s_map.on("styledata",()=>{
        

          this.s_map.addSource("route", {
            type: "geojson",
            data: {
              "type": "Feature",
              "properties": {},
              "geometry": {
                "type": "LineString",
                "coordinates": JSON.parse(this.mapSer.s_route_details.coords)
              }
            }
          }
          );

          this.s_map.addLayer({
            "id": "route",
            "type": "line",
            "source": "route",
            "layout": {
              "line-join": "round",
              "line-cap": "round"
            },
            "paint": {
              "line-color": "black",
              "line-width": 3
            }
          });

          this.s_map.fitBounds([this.mapSer.getOriginCoords(),this.mapSer.getDestinationCoords()]);
          this.s_map.jumpTo({'center':this.mapSer.getDestinationCoords(),'zoom':14});
          this.s_map.panTo(this.mapSer.getOriginCoords());
          this.s_map.setPitch(50);
          this.s_map.setBearing(100);

        });//this.s_map.on
  }//show Map


  displayRoute(value: string) {
    console.log(`MapComponent:showRoute() Called value is ${value}`);
    var self = this
    this.mapSer.getRoute().subscribe({
      next(res) {
        self.showMap();
      }
    });
  }
  

  
  placeMarker(coords: any,marker:string) {
    console.log(`placeMarker coords are ${JSON.stringify(coords)}`);

    let markerEl = this.renderer.createElement('i');
    // let textDiv = this.renderer.createElement('div');
    // textDiv.innerHTML="<p>Testing the Markers</p>";
    // this.renderer.addClass(textDiv,'markerText');
    
    switch(marker){
      case "car":
      this.renderer.addClass(markerEl, "ion-md-car");
      this.renderer.addClass(markerEl, "ion-2x");
      // this.renderer.appendChild(markerEl,textDiv);
        break;
      case "body":
      this.renderer.addClass(markerEl, "ion-md-body");
      this.renderer.addClass(markerEl, "ion-2x");
        break;
      default:
        this.renderer.addClass(markerEl, "ion-md-square");
        break;
    }

    var location = new mapboxgl.Marker(markerEl);
    location.setLngLat([coords.lng, coords.lat])
            .addTo(this.s_map);

    this.c_map_markers.push(location);
    return location
  }

  setOrigin(p_origin: any) {
    this.s_origin = p_origin;

  }

  setDestination(p_destination: any) {
    this.s_destination = p_destination;
  }

  testSock(event: string) {
    console.log("In Map Component calling testSock ():" + event);
    console.log(JSON.stringify(this.mapSer.s_route_details));
    // this.mapSer.testSock(event);

    if (this.s_map.getLayer("route")) {
      console.log("Removing route Layer");
      console.log(`this.c_map_markers ${this.c_map_markers}`);
      this.s_map.removeLayer("route");
      this.s_map.removeSource("route");
      if (this.c_map_markers !== null) {
        for (var i = this.c_map_markers.length - 1; i >= 0; i--) {
          this.c_map_markers[i].remove();
        }
      }
    }

    var origin_marker = this.placeMarker(this.mapSer.getOriginCoords(),"car");
    this.placeMarker(this.mapSer.getDestinationCoords(),"body");
    console.log("#########################################");
    console.log(JSON.stringify(this.mapSer.s_route_details));
    console.log(JSON.stringify(this.mapSer.s_curr_trip_details));
    console.log("#########################################");
    // console.log(JSON.stringify(res));
    // console.log("#########################################");

    this.s_map.addSource("route", {
      type: "geojson",
      data: {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "LineString",
          "coordinates": JSON.parse(this.mapSer.s_route_details.coords)
        }
      }
    }
    );
    this.s_map.addLayer({
      "id": "route",
      "type": "line",
      "source": "route",
      "layout": {
        "line-join": "round",
        "line-cap": "round"
      },
      "paint": {
        "line-color": "#c634eb",
        "line-width": 4
      }
    });

    this.coordis = JSON.parse(this.mapSer.s_route_details.coords);
    var route_source = this.s_map.getSource("route") as mapboxgl.GeoJSONSource;
    if (!this.intv){
        console.log('Setting Interval the first time ');
        this.intv = setInterval(() => {
            console.log('In Else coordis length' + this.coordis.length);
            console.log('Coordis :' + this.coordis[0]);
            if (this.coordis.length<1){
              clearInterval(this.intv);
              this.intv=null;
            }
            else{
              origin_marker.remove();
              origin_marker = this.placeMarker({ "lng": this.coordis[0][0], "lat": this.coordis[0][1]},"car");
              route_source.setData({
                "type": "Feature",
                "properties": {},
                "geometry": {
                  "type": "LineString",
                  "coordinates": this.coordis
                }
              });
              this.coordis.shift();
            }
        }, 2000);
    }

    console.log('In Window Interval Function coordis length ' + this.coordis.length);
    console.log('In Window Interval event :' + event);
    if (this.coordis.length < 1 || event === "Stop Simulation") {
      clearInterval(this.intv);
      this.intv=null;
    }


  }//testSock
}
