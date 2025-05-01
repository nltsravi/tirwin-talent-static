import { Component, OnInit } from '@angular/core';

@Component({
  selector: "app-slider",
  templateUrl: "./slider.component.html",
  styleUrls: ["./slider.component.css"],
})
export class SliderComponent implements OnInit {
  isAuthenticated: boolean = false;

  //Tirwin Talent™: Empowering Growth Through Skill-Based Talent Strategies

  slide = {
    title:
      "Empowering Growth Through Skill-Based Talent Strategies",
    description:
      "A transformative approach to talent management for the Supply Chain, Logistics, and Cargo industries.",
    buttonText: "Try Now →",
    buttonLink: "#",
    image:
      "https://tirwin-media-storage.s3.us-east-1.amazonaws.com/static-images/banner-image-slider.png",
  };

  ngOnInit() {
    this.checkAuthentication();
  }

  checkAuthentication() {
    this.isAuthenticated = !!sessionStorage.getItem("authToken"); // Check if user is logged in
  }
}