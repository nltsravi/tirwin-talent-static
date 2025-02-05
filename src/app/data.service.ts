import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class DataService {
  private userData: any = null;

  setUserData(data: any) {
    this.userData = data;
  }

  getUserData() {
    return this.userData;
  }
}
