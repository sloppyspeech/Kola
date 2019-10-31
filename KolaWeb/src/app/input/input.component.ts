import { Component, OnInit,Output,EventEmitter,ViewChild,ElementRef, Input } from '@angular/core';
import { MapService } from '../services/map.service';
import { InputService } from '../services/input.service';
import { MapComponent  } from '../map/map.component';
import { FormControl } from '@angular/forms';
import { Subject }  from 'rxjs';
import { debounceTime,distinctUntilChanged,switchMap } from 'rxjs/operators';
import { CompleterService,CompleterData, RemoteData } from 'ng2-completer';
import { environment } from '../../environments/environment';
import { Router,ActivatedRoute  } from '@angular/router';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent implements OnInit {

  @Output() mapSearchBtnClick:EventEmitter<any> = new EventEmitter<string>();
  @Output() mapGetTripDetsClick:EventEmitter<any> = new EventEmitter<string>();
  @Output() originClicked:EventEmitter<any> = new EventEmitter<string>();
  @Output() destinationClicked:EventEmitter<any> = new EventEmitter<string>();
  @Output() mapSimuBtnClick:EventEmitter<any> = new EventEmitter<string>();
  
  @Input() location:string;

  @ViewChild("origin", {static: false}) originField:ElementRef;

  wc_origin:string='Bannerghatta Road,Bangalore';
  wc_destination:string='Bilekehalli,Bangalore';
  wc_ac_places:any;
  simu_btn:boolean=true;
  simulateBtnName:string="Simulate Route";
  wc_place=new Subject<string>();
  show_dest_place_search_box:boolean=false;
  show_orig_place_search_box:boolean=false;
  place_data:RemoteData;
  mapboxAutoCompUrl:string="https://api.mapbox.com/geocoding/v5/mapbox.places/";
  autoCompleteUrl:string;
  searchPlcStr:string;
  selectedDestination:string;
  selectedOrigin:string;
  wc_dest_coords:any;
  wc_orig_coords:any;
  routeSubs:any;
  trip_id:any;

  constructor(private inpSer:InputService,
              private mapSer:MapService, 
              private completerService:CompleterService,
              private activatedRoute:ActivatedRoute,
              private router:Router) {

      this.place_data=this.completerService.remote(null)
      this.place_data.urlFormater(term =>{
        console.log(` The term is ${term}`);
        return `https://api.mapbox.com/geocoding/v5/mapbox.places/${term}.json?limit=5&proximity=77.61%2C12.89&language=en-GB&access_token=${environment.mapbox.accessToken}`;

      });
      console.log("In the constuctor");
      console.log(this.place_data);
      this.place_data.dataField("features");

     
   }

  ngOnInit() {

    //-- Get Trip Details 
    this.routeSubs=this.activatedRoute.paramMap.subscribe(params=>{
      console.log(`Params : ${JSON.stringify(params)}`);
      this.trip_id=params.get('trip_id');
      if (this.trip_id){
        console.log(`In Params Get ${this.trip_id}`);
        this.mapSer.getTrip(this.trip_id).subscribe(res=>{
          console.log(JSON.stringify(res));
          this.wc_origin=res['response']['origin'];
          this.wc_destination=res['response']['destination'];
          this.mapSer.s_route_details=res['response'];
          console.log("$$$$$$:"+JSON.parse(this.mapSer.s_route_details.coords)[0][0]);
          var coordsarr=JSON.parse(this.mapSer.s_route_details.coords)
          this.mapSer.setOriginCoords(coordsarr[0]);
          this.mapSer.setDestinationCoords(coordsarr[coordsarr.length-1]);
          // this.mapSer.s_route_details.coords=String(this.mapSer.s_route_details.coords);
          this.mapGetTripDetsClick.emit('Show Route Clicked');
        });
      }
    });
    //---

  }

  originInFocus(event:any){
    console.log("Origin Clicked");
    console.log(this.wc_origin);
    this.originClicked.emit(event);
    this.show_orig_place_search_box=true;

  }

  destinationInFocus(event:any){
    console.log("Destination Clicked");
    this.destinationClicked.emit(event);
    this.show_dest_place_search_box=true;
  }

  simuMovement(){
    console.log('Simulation Button Clicked');
    this.mapSimuBtnClick.emit(this.simulateBtnName);
    this.simu_btn=!this.simu_btn;
    this.simulateBtnName= this.simulateBtnName==="Simulate Route"?"Stop Simulation":"Simulate Route";
  }

  searchRoute(){
    console.log('InputComponent:searchRoute()');
    console.log(`InputComponent Origin:${this.wc_origin} Destination:${this.wc_destination}`);
    if(this.wc_origin === ""){
      this.wc_origin='Origin Not Provided';
    }
    if(this.wc_destination === ""){
      this.wc_destination='Destination Not Provided';
    }
    this.inpSer.setOrigin(this.wc_origin);
    this.inpSer.setDestination(this.wc_destination);
    // this.inpSer.searchRoute();
    // this.mapComp.showRoute();
    this.mapSearchBtnClick.emit('Clicked');
  }

  getPlaces(placeName:any){
    // console.log("getPlaces");
    // console.log("getPlaces: "+placeName.target.value);
    // this.selectedDestination=placeName.target.value;
    if(placeName.target.value.length>=3){
      this.mapSer.getAutoCompPlace(placeName.target.value)
          .pipe(
            debounceTime(500),
            distinctUntilChanged()
          )
          .subscribe((data)=>{
            console.log(data);
            console.log(data["features"]);
            this.wc_ac_places=data["features"];
          });
         
      // this.mapSer.getAutoCompPlace(placeName.target.value)
      //     .subscribe((data)=>{
      //           console.log(data);
      //           console.log(data["features"]);
      //           this.wc_ac_places=data["features"];
      //     });
    }
  }

  onSelectDestPlace(place:string){
    console.log("onSelectDestPlace Called");
    this.wc_destination=place;
    this.show_dest_place_search_box=false;
    this.wc_ac_places=null;
  }

  onSelectOrigPlace(place:string){
    console.log("onSelectOrigPlace Called");
    this.wc_origin=place;
    this.show_orig_place_search_box=false;
    this.wc_ac_places=null;
  }

  destiDL(selected:string){//desti dynamic list
    // console.log("Destination Selected:"+this.selectedDestination);
    console.log(selected);
    console.log(this.wc_ac_places);
    for(var i=0;i<this.wc_ac_places.length;i++){
      console.log(selected+":"+i+":*****>>>:"+JSON.stringify(this.wc_ac_places[i]));
      console.log(selected+":@@@@@@>>>>>:"+this.wc_ac_places[i]["place_name"]);
      if (selected ===this.wc_ac_places[i]["place_name"] ){
        // this.wc_destination=this.wc_ac_places[i]["place_name"];
        this.wc_dest_coords=this.wc_ac_places[i]["center"];
        console.log("$$$$$$$$$$$>>>>>:"+this.wc_ac_places[i]["text"]);
        console.log("$$$$$$$$$$$>>>>>:"+this.wc_ac_places[i]["place_name"]);
        break;
      }
    }
    console.log("=========>>:"+this.wc_dest_coords);
    console.log(this.wc_dest_coords[0]+"=========>>:"+this.wc_dest_coords[1]);
    this.mapSer.setDestinationCoords(this.wc_dest_coords);
  }

  originDL(selected:string){
    // console.log("Origin Selected:"+this.se);
    console.log(selected);
    console.log(this.wc_ac_places);
    for(var i=0;i<this.wc_ac_places.length;i++){
      console.log(selected+":"+i+":*****>>>:"+JSON.stringify(this.wc_ac_places[i]));
      console.log(selected+":@@@@@@>>>>>:"+this.wc_ac_places[i]["place_name"]);
      if (selected ===this.wc_ac_places[i]["place_name"] ){
        // this.wc_destination=this.wc_ac_places[i]["place_name"];
        this.wc_orig_coords=this.wc_ac_places[i]["center"];
        console.log("$$$$$$$$$$$>>>>>:"+this.wc_ac_places[i]["text"]);
        console.log("$$$$$$$$$$$>>>>>:"+this.wc_ac_places[i]["place_name"]);
        break;
      }
    }
    console.log("=========>>:"+this.wc_orig_coords);
    console.log(this.wc_orig_coords[0]+"=========>>:"+this.wc_orig_coords[1]);
    this.mapSer.setOriginCoords(this.wc_orig_coords);
  }

  ngOnDestroy(): void {
    this.routeSubs.unsubscribe();
    this.mapSer.s_route_details=null;
  }
}//Class Close
