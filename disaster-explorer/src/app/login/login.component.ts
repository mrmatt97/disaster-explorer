import { Component } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  public email : string = "";
  public password : string = "";
  public error : string = "";
  public httpClient : HttpClient;
  constructor(private _httpClient : HttpClient) {
    this.httpClient = _httpClient;
  }

  login(){
    if(this.email == "" || this.password == ""){
      this.error = "Please fill in all the fields."
      return;
    }
    this.error = "";
    this.httpClient.post<any>("http://localhost:8000/api/users/login", {
      email : this.email,
      password : this.password
    }).subscribe(
      response => {
        if(response.status == false){
          this.error = response.message;
        }else{
          let user = {id: response.user.id, name : response.user.name, email : response.user.email, password : response.user.password};
          sessionStorage.setItem("user", JSON.stringify(user));
          alert(JSON.stringify(user));
          window.location.href = "/";
        }
      },
      error1 => {
        this.error = "An error occurred, please try again later"
      }
    )
  }

}
