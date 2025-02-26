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
      "https://media.istockphoto.com/id/1443305526/photo/young-smiling-man-in-headphones-typing-on-laptop-keyboard.jpg?s=612x612&w=0&k=20&c=-JzAS5fjTvxyNRkYoaIlpoLfmt5AEIOcwpt6lk0D4TA=",
  };

  ngOnInit() {
    this.checkAuthentication();
  }

  checkAuthentication() {
    this.isAuthenticated = !!localStorage.getItem("authToken"); // Check if user is logged in
  }
}