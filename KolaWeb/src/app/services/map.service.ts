import { Injectable, SkipSelf } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { environment } from '../../environments/environment';
import * as MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import * as mapboxpl from '@mapbox/polyline';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of, from, Observer } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import *  as io from 'socket.io-client';


@Injectable({
  providedIn: 'root'
})
export class MapService {

  private s_map: mapboxgl.Map;
  private s_origin: any;
  private s_destination: any;
  private coords_origin = { "lng": 77.621057, "lat": 12.914597 };
  private coords_destination = { "lng": 77.61030405550855, "lat": 12.894129541400005 };
  private routeDirs: any;
  private s_post_coords: [];
  private s_ride_details;
  private s_base_url: string = "http://localhost:9000/api/v1";
  private s_http_options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  s_socket:any;
  geoCoderResult: any;
  mapboxAutoCompUrl:string="https://api.mapbox.com/geocoding/v5/mapbox.places/";
  autoCompleteUrl:string;
  s_route_details:any;
  s_curr_trip_details:any;


  constructor(private httpcli: HttpClient) {
    (mapboxgl as any).accessToken = environment.mapbox.accessToken;
  }

  setOrigin(p_origin) {
    this.s_origin = p_origin;
  }

  setDestination(p_destination) {
    this.s_destination = p_destination;
  }

  setOriginCoords(p_origin_coords) {
    this.coords_origin.lng = p_origin_coords[0];
    this.coords_origin.lat = p_origin_coords[1];
  }

  setDestinationCoords(p_destination_coords) {
    this.coords_destination.lng = p_destination_coords[0];
    this.coords_destination.lat = p_destination_coords[1];
  }

  getOriginCoords(){
    return this.coords_origin
  }

  getDestinationCoords(){
    return this.coords_destination
  }

  getTrip(p_trip_id:string) {
    console.log("GetTrip Called");
    console.log(this.s_base_url + "/getTripDets/"+p_trip_id);
    return this.httpcli.get(this.s_base_url + "/getTripDets/"+p_trip_id)
  }

  getAllTrips(){
    console.log("GetAllTrip Called");
    return this.httpcli.get(this.s_base_url + "/getAllTrips")
  }


  startRideSimu() {
    console.log("In startRideSimu");
    console.log(this.s_ride_details['DriverId']);
    console.log(this.s_ride_details['Riders']);
    console.log(this.s_ride_details['TripId']);
    console.log(this.s_ride_details['avg_speed']);
    console.log(this.s_ride_details['destination']);
    console.log(this.s_ride_details['origin']);
    console.log(this.s_ride_details['duration']);
    console.log(this.s_ride_details['distance']);
    console.log(this.s_ride_details['coords']);
    return this.s_ride_details;
  }

  getRoute<Observable>() {
    var self=this;
    return new Observable((observer)=>{
        this._getRoute().subscribe(
            res => {
              // console.log("aaaaaaaaaaaa---->"+JSON.stringify(res));
              this.httpcli.post(this.s_base_url + "/createTrip", JSON.stringify(res), this.s_http_options)
                .pipe(
                  catchError(this.handleError)
                ).subscribe(
                  resp=>{
                    // console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
                    // console.log(JSON.stringify(resp));
                    this.s_route_details=resp['response'][0]['fields'];
                    this.s_curr_trip_details=resp['response'][0]['tags'];
                    // console.log(this.s_route_details.coords);
                    // console.log(JSON.stringify(this.s_route_details));
                    // console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
                    observer.next(this.s_route_details);
                  }
                );
                // console.log("#@#@##@#  "+JSON.stringify(this.s_route_details));
                // console.log(this.s_route_details.coords);
              },
              )
        })
    }

  get_route_details(){
    return this.s_route_details
  }

  _getRoute() {
    return new Observable((observer) => {
      let l_route: any;
      let l_geometry: any;
      let l_coords = {};
      let l_coords1: any;
      let post_ret: any;
      let l_post_resp = {};

      console.log(`MapService Origin:${this.s_origin}  Destination:${this.s_destination}`);
      this.routeDirs = new MapboxDirections(
        {
          accessToken: environment.mapbox.accessToken,
          unit: 'metric',
          profile: 'mapbox/driving-traffic',
          interactive: false,
          controls: {
            inputs: false,
            instructions: false
          }
        });

      // console.log(this.routeDirs);
      console.log("--------------routeDirs--------------");
      console.log(this.s_origin);
      console.log(this.s_destination);
      console.log("************Coords*************");
      console.log(this.coords_origin);
      console.log(this.coords_destination);
      this.routeDirs.setOrigin([this.coords_origin.lng, this.coords_origin.lat]);
      this.routeDirs.setDestination([this.coords_destination.lng, this.coords_destination.lat]);
      l_post_resp['origin'] = this.s_origin;
      l_post_resp['destination'] = this.s_destination;

      this.routeDirs.on('route', (event, l_coords) => {
        console.log('MapService Routedirs');
        l_route = event.route[0];
        console.log(l_route);
        l_geometry = l_route.geometry;
        // l_coords = mapboxpl.decode(l_geometry);
        // console.log("Before=======");
        // l_coords1=Array.of(mapboxpl.decode(l_geometry));
        // console.log(coords[0].length);
        // for (var i=0;i<coords[0].length;i++){
          //   console.log('Array Ele=>'+i+':'+coords[0][i]);
          //   console.log(coords[0].shift());
          // }
          // console.log(l_coords1[0]);
          // while(l_coords1[0].length>0){
            //   console.log('Array Ele=>:'+l_coords1[0].length);
            //   l_coords1[0].shift();
            // }
        l_post_resp['duration'] = l_route['duration']; //seconds
        l_post_resp['distance'] = l_route['distance']; //meters
        l_post_resp['avg_speed'] = Math.round((l_post_resp['distance'] / l_post_resp['duration'])*100)/100; //mts/sec
        
        l_coords=[];
        for (var i=0;i<mapboxpl.decode(l_geometry).length;i++){
          l_coords.push([mapboxpl.decode(l_geometry)[i][1],mapboxpl.decode(l_geometry)[i][0]])
        }
            
        // console.log(l_coords);
        l_post_resp['coords'] = l_coords;

        observer.next(l_post_resp);
        observer.complete();
        // console.log(` s_post_coords ${JSON.stringify(this.s_post_coords)}`);
      });//routeDirs
      console.log(this.routeDirs);
      // console.log(l_coords)
      // console.log(mapboxpl);
      console.log(` INSIDE ${JSON.stringify(l_post_resp)}`);
    })//Observable
  }


  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  }

  testSock(event) {
    if (event) {
     this.startSock();
    }
    else {
      this.stopSock();
    }

  }
  startSock(){
    console.log('Start Sock');
    this.s_socket = io('http://localhost:8001/coords');
    // console.log('Test Sock Mapservice :' + event);
    if (this.s_socket) {
      this.s_socket.emit('get_coords', {});
      this.s_socket.on('currDate', (ret_val) => {
        console.log('testsock :' + ret_val.hour + ':' + ret_val.minutes + ':' + ret_val.seconds);
      });
    }
  }
  stopSock(){
    console.log('Disconnecting Socket :'+this.s_socket);
    this.s_socket.disconnect();
  }

  getAutoCompPlace(inp:string){
    this.autoCompleteUrl=this.mapboxAutoCompUrl+inp+".json?limit=5&language=en-GB"
    this.autoCompleteUrl=this.autoCompleteUrl+"&proximity=77.61%2C12.89";
    this.autoCompleteUrl=this.autoCompleteUrl+"&access_token="+environment.mapbox.accessToken;
    console.log(this.autoCompleteUrl);
    return this.httpcli.get(this.autoCompleteUrl)
  }

}//Mapservice 
