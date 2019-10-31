import { Component, OnInit } from '@angular/core';
import { MapService  } from '../services/map.service';
import { HttpClient  } from '@angular/common/http';
import {map} from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-trips',
  templateUrl: './trips.component.html',
  styleUrls: ['./trips.component.scss']
})
export class TripsComponent implements OnInit {
  columnDefs = [
    {headerName: 'Make', field: 'make' , sortable:true , filter:true , checkboxSelection: true },
    {headerName: 'Model', field: 'model', sortable:true , filter:true},
    {headerName: 'Price', field: 'price', sortable:true , filter:true}
    ];
  tripsColDefs=[
    {headerName: 'Trip ID', field: 'TripId' , sortable:true , filter:true , resizable:true ,cellRenderer:this.tripFormatter},
    {headerName: 'Origin', field: 'origin' , sortable:true , filter:true , resizable:true },
    {headerName: 'Destination', field: 'destination' , sortable:true , filter:true , resizable:true },
    {headerName: 'Driver ID', field: 'DriverId' , sortable:true , filter:true , resizable:true },
    {headerName: 'Avg. Speed (m/s)', field: 'avg_speed' , sortable:true , filter:true , resizable:true ,valueFormatter:this.avgSpeedFormatter},
    {headerName: 'Distance (KMs)', field: 'distance' , sortable:true , filter:true , resizable:true ,valueFormatter:this.distanceFormatter},
    {headerName: 'Duration', field: 'duration' , sortable:true , filter:true , resizable:true,valueFormatter:this.durationFormatter }
    ]; 

  rowData1 = [
      { make: 'Toyota', model: 'Celica', price: 35000 },
      { make: 'Ford', model: 'Mondeo', price: 32000 },
      { make: 'Porsche', model: 'Boxter', price: 72000 }
    ];

  tripData:any;
  rowData:any;
  constructor(private mapSer:MapService,private http:HttpClient) { }
  obse:Observable<any>;
  ngOnInit() {

    this.rowData = this.http.get('https://api.myjson.com/bins/15psn9');
    this.tripData=this.mapSer.getAllTrips();
  }

  durationFormatter(p_dur){
    let t_dur=p_dur.value;
    let t_var:Number;
    let hrs;
    let mins;
    let secs;
    if (t_dur >=3600){
      hrs=Math.round(t_dur/3600);
      mins=Math.round((t_dur%3600)/60)
      // secs=Math.round((t_dur%3600)%60)
    }
    else{
      hrs=0;
      mins=Math.round(t_dur/60);
      // secs=Math.round((t_dur%60)/60)
    }

    // return hrs>0 ? hrs+" hr: "+mins+" mins : "+secs+" secs" : mins+" mins : "+secs+" sec"
    return hrs>0 ? hrs+" hrs "+mins+" min(s)" : mins+" min(s)"
  }

  distanceFormatter(p_dist){
    return (p_dist.value/1000).toFixed(2)
  }

  avgSpeedFormatter(p_avg_speed){
    return p_avg_speed.value.toFixed(2)
  }
  
  tripFormatter(p_trip_id){
    return  `<a  href="/getTripDetails/${p_trip_id.value}" >${p_trip_id.value}</a>` 
  }

  anchorClicked(p_trip_id){
    alert(p_trip_id)
  }
}
