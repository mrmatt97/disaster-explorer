import { Component } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {


  public email : string = "";
  public password : string = "";
  public name : string = "";
  public error : string = "";
  public httpClient : HttpClient;
  constructor(private _httpClient : HttpClient) {
    this.httpClient = _httpClient;
  }
  signup(){
    if(this.email == "" || this.password == "" || this.name == ""){
      this.error = "Please fill in all the fields."
      return;
    }
    this.error = "";
    this.httpClient.post<any>("http://localhost:8000/api/users", {
      email : this.email,
      password : this.password,
      name : this.name
    }).subscribe(
      response => {
        if(response.status == false){
          this.error = response.message;
          console.log(this.error);
        }else{
          let user = {id: response.user.id, name : response.user.name, email : response.user.email, password : response.user.password};
          sessionStorage.setItem("user", JSON.stringify(user));
          window.location.href = "/";
        }
      },
      error1 => {
        this.error = "An error occurred, please try again later"
      }
    )
  }

}
