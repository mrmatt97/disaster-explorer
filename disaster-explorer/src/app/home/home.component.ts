import {Component} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import GeocoderResponse = google.maps.GeocoderResponse;

/// <reference types="@types/google.maps" />

interface MarkerProperties {
  position: {
    lat: number;
    lng: number;
  }
};

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  options: google.maps.MapOptions = {
    mapTypeId: 'roadmap',
    maxZoom: 15,
    minZoom: 2,
    zoom: 4
  };
  center = {
    lat: 44.2107675,
    lng: 20.9224158
  };
  markers: any = [];
  loading = false;
  searchQuery: any;
  currentDisaster: any;
  user: any;
  type: any;
  firstDate: any;
  startDate: any;
  endDate: any;
  favoritesModal = false;
  favorites: any[] = []
  error: any;
  success: any;

  constructor(private http: HttpClient) {
    // @ts-ignore
    this.user = JSON.parse(sessionStorage.getItem("user"));
    console.log(this.user)
  }

  searchLocation(value: any) {
    this.loading = true;
    const url = "https://nominatim.openstreetmap.org/search?q=" + value + "&format=json";
    this.http.get<any>(url).subscribe(
      response => {
        this.center = {
          lat: parseFloat(response[0].lat),
          lng: parseFloat(response[0].lon)
        }
        this.http.get<any>("http://localhost:8000/api/disasters?country=" + value).subscribe(
          responses => {
            this.markers = [];
            for (let i = 0; i < responses.length; i++) {
              if(this.type !== "all"){
                console.log(this.type);
                if (this.type && !responses[i].type.includes(this.type)) continue;
              }
              let data = {
                position: {lat: parseFloat(responses[i].location[0]), lng: parseFloat(responses[i].location[1])},
                icon: "",
              }
              if (responses[i].type.includes("earthquake") || responses[i].type.includes("landslide")) {
                data.icon = "assets/img_7.png"
              } else if (responses[i].type.includes("fire")) {
                data.icon = "assets/img_2.png"
              } else if (responses[i].type.includes("hurricane") || responses[i].type.includes("tornado")) {
                data.icon = "assets/img_3.png"
              } else if (responses[i].type.includes("volcano")) {
                data.icon = "assets/img_5.png";
              } else if (responses[i].type.includes("drought")) {
                data.icon = "assets/img_9.png";
              } else data.icon = "assets/img_8.png"
              let entity = {
                position: {lat: parseFloat(responses[i].location[1]), lng: parseFloat(responses[i].location[0])},
                label: {
                  color: 'white',
                  text: responses[i].title,
                },
                icon: {
                  url: data.icon,
                  scaledSize: new google.maps.Size(50, 50),
                },
                title: responses[i].title,
                options: {animation: google.maps.Animation.DROP},
                description: responses[i].description,
                start_date: responses[i].start_date,
                end_date: responses[i].end_date,
                first_seen_date: responses[i].first_seen_date,
                timezone: responses[i].timezone,
                location: responses[i].location
              };
              if (this.firstDate && this.firstDate > new Date(entity.first_seen_date)) continue;
              if (this.startDate && this.startDate > new Date(entity.start_date)) continue;
              if (this.endDate && this.endDate < new Date(entity.end_date)) continue;
              this.markers.push(entity)
            }
            if (this.markers.length == 0) {
              this.loading = false;
              this.error = "No data found for " + value
              return;
            }
            this.loading = false;
          }, error => {
            this.loading = false;
            if (error.status >= 500) {
              this.error = "Unexpected error occurred, please try again later";
            } else this.error = "No data found for " + value;
          }
        )
      },
      error => {
        this.loading = false;
        this.error = "Unexpected error occurred, please try again later";
      }
    )
  }

  logout() {
    sessionStorage.removeItem("user");
    window.location.href = "/";
  }

  showDetails(marker: any) {
    this.currentDisaster = marker;
  }

  onFirstSeenChange(event: any) {
    this.firstDate = new Date(event.target.value)
  }

  onStartDateChange(event: any) {
    this.startDate = new Date(event.target.value)
  }

  onEndDateChange(event: any) {
    this.endDate = new Date(event.target.value)
  }

  addFavorite() {
    if (!this.searchQuery) return;
    this.http.post("http://localhost:8000/api/favorites", {
      user_id: this.user.id,
      country_name: this.searchQuery
    }).subscribe(
      response => {
        this.success = this.searchQuery + " added successfully to your favorites list";
      }
    );
  }

  displayFavorites() {
    this.loading = true;
    this.favoritesModal = true;
    this.favorites = []
    this.loadFavoritesData();
  }

  loadFavoritesData() {
    this.http.get<any[]>("http://localhost:8000/api/favorites/user/" + this.user.id).subscribe(
      response => {
        for (let i = 0; i < response.length; i++) {
          // @ts-ignore
          this.favorites.push(response[i].country_name);
        }
        this.loading = false;
      },
      error => {
        if (error.status >= 500) {
          this.error = "Unexpected error occurred, please try again later";
        } else this.error = "No data found";
        this.loading = false;
      }
    )
  }

  loadFavorites() {
    this.favorites = []
    this.loading = true;
    this.http.get<any[]>("http://localhost:8000/api/favorites/user/" + this.user.id).subscribe(
      response => {
        this.markers = [];
        if (response.length == 0) {
          this.loading = false;
          this.error = "Empty Favorites List"
        }
        for (let i = 0; i < response.length; i++) {
          // @ts-ignore
          let query = response[i].country_name;
          this.http.get<any>("http://localhost:8000/api/disasters?country=" + query).subscribe(
            responses => {
              if (responses.length == 0) {
                this.loading = false;
                this.error = "No data found for " + query
                return;
              }
              for (let i = 0; i < responses.length; i++) {
                if (this.type && !responses[i].type.includes(this.type)) continue;
                let data = {
                  position: {lat: parseFloat(responses[i].location[0]), lng: parseFloat(responses[i].location[1])},
                  icon: "",
                }
                if (responses[i].type.includes("earthquake") || responses[i].type.includes("landslide")) {
                  data.icon = "assets/img_7.png"
                } else if (responses[i].type.includes("fire")) {
                  data.icon = "assets/img_2.png"
                } else if (responses[i].type.includes("hurricane") || responses[i].type.includes("tornado")) {
                  data.icon = "assets/img_3.png"
                } else if (responses[i].type.includes("volcano")) {
                  data.icon = "assets/img_5.png";
                } else if (responses[i].type.includes("drought")) {
                  data.icon = "assets/img_9.png";
                } else data.icon = "assets/img_8.png"
                let entity = {
                  position: {lat: parseFloat(responses[i].location[1]), lng: parseFloat(responses[i].location[0])},
                  label: {
                    color: 'white',
                    text: responses[i].title,
                  },
                  icon: {
                    url: data.icon,
                    scaledSize: new google.maps.Size(50, 50),
                  },
                  title: responses[i].title,
                  options: {animation: google.maps.Animation.DROP},
                  description: responses[i].description,
                  start_date: responses[i].start_date,
                  end_date: responses[i].end_date,
                  first_seen_date: responses[i].first_seen_date,
                  timezone: responses[i].timezone,
                  location: responses[i].location
                };
                if (this.firstDate && this.firstDate > new Date(entity.first_seen_date)) continue;
                if (this.startDate && this.startDate > new Date(entity.start_date)) continue;
                if (this.endDate && this.endDate < new Date(entity.end_date)) continue;
                this.markers.push(entity)
              }
              if(this.markers.length == 0){
                this.loading = false;
                this.error = "No data found for " + query
                return;
              }
              this.loading = false;
            }, error => {
              this.error = "Error loading " + query + " data";
              this.loading = false;
            }
          )
        }
      },
      error => {
        this.error = "Unexpected error occurred";
        this.loading = false;
      }
    )
  }

  deleteFavorties() {
    this.loading = true;
    this.http.delete("http://localhost:8000/api/favorites/user/" + this.user.id).subscribe(
      response => {
        this.success = "Empty list reset successfully";
        this.favorites = []
        this.loading = false;
      }
    )
  }
}
