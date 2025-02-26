import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WebinarService } from './webinar-details.service';

@Component({
  selector: "app-webinar-details",
  templateUrl: "./webinar-details.component.html",
  styleUrls: ["./webinar-details.component.css"],
})
export class WebinarDetailsComponent implements OnInit {
  webinar: any = null;
  isLoading = true;
  errorMessage = "";
  showModal = false;
  userId: any = ""; // Assume this comes from localStorage/session
  trainers: any = [];
  currentIndex = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private webinarService: WebinarService
  ) {}

  ngOnInit(): void {
    this.userId = JSON.parse(localStorage.getItem("user") ?? "{}"); // Use '{}' if null
    const webinarId = this.route.snapshot.paramMap.get("id");
    if (webinarId) {
      this.fetchWebinarDetails(webinarId);
    } else {
      this.errorMessage = "Webinar ID is missing";
      this.isLoading = false;
    }
     setInterval(() => {
       this.nextSlide();
     }, 5000);
  }

  fetchWebinarDetails(id: string) {
    this.webinarService.getWebinarById(id).subscribe({
      next: (data) => {
        this.webinar = data;

        //Below if condition is only for demo.
        if (data.id == "fbde0931-bf80-4687-afa3-83d9a1694e26"){
          this.webinar = {
            id: "fbde0931-bf80-4687-afa3-83d9a1694e26",
            title: "Emotional Intelligence | Influence in Teamwork & Collaboration",
            description: "FFFAI - FEDERATION OF FREIGHT FORWARDERS' ASSOCIATIONS IN INDIA’s Exclusive hashtag#Webinar on hashtag#EmotionalIntelligence – Part II !",
            type: "Online",
            tags: ["EI"],
            start_time: "2025-02-21T10:00:00.000Z",
            end_time: "2025-02-21T12:00:00.000Z",
            is_paid: false,
            price: "0.00",
            is_active: true,
            created_at: "2025-02-22T12:41:39.714Z",
            updated_at: "2025-02-22T12:41:39.714Z",
            category: {
              id: "cadad5fc-3dc0-4ec7-85dc-07325147025b",
              name: "Supply Chain Management",
              description:
                "Webinars covering strategies and innovations in supply chain logistics",
              is_active: true,
              created_at: "2025-02-04T19:15:38.724Z",
              updated_at: "2025-02-04T19:15:38.724Z",
            },
            subcategory: {
              id: "ed4d6955-18eb-440b-808a-ccac9bf37a56",
              name: "Inventory Management",
              description: "Optimizing inventory flow in logistics",
              is_active: true,
              created_at: "2025-02-04T19:15:38.724Z",
              updated_at: "2025-02-04T19:15:38.724Z",
            },
            trainers: [
              {
                id: "2a8a8ca9-c7bd-44e9-b6cc-7c6e4dec4746",
                name: "Mr. Dushyant Mulani",
                user_id: "2b2f614d-940e-439d-9c75-70fa131a566f",
                bio: "Expert in global supply chain optimization, AI-driven\n                            logistics, and last-mile delivery strategies.",
                organization: "FFFAI",
                linkedin_profile: "dfdsfgsdfg345345sdfgdsfgdfsgdfg",
                experience: "5",
                total_webinars: null,
                followers: 200,
                profile_image: "https://randomuser.me/api/portraits/men/1.jpg",
                specialties: null,
                created_at: "2025-02-04T18:24:34.369Z",
                updated_at: "2025-02-04T18:24:34.369Z",
              },
              {
                id: "2a8a8ca9-c7bd-44e9-b6cc-7c6e4dec4746",
                name: "Mr. R.N Sekar",
                user_id: "2b2f614d-940e-439d-9c75-70fa131a566f",
                bio: "Expert in global supply chain optimization, AI-driven\n                            logistics, and last-mile delivery strategies.",
                organization: "FFFAI",
                linkedin_profile: "dfdsfgsdfg345345sdfgdsfgdfsgdfg",
                experience: "5",
                total_webinars: null,
                followers: 200,
                profile_image: "https://randomuser.me/api/portraits/men/13.jpg",
                specialties: null,
                created_at: "2025-02-04T18:24:34.369Z",
                updated_at: "2025-02-04T18:24:34.369Z",
              },
              {
                id: "2a8a8ca9-c7bd-44e9-b6cc-7c6e4dec4746",
                name: "Mr. Amit Kamat",
                user_id: "2b2f614d-940e-439d-9c75-70fa131a566f",
                bio: "Expert in global supply chain optimization, AI-driven\n                            logistics, and last-mile delivery strategies.",
                organization: "FFFAI",
                linkedin_profile: "dfdsfgsdfg345345sdfgdsfgdfsgdfg",
                experience: "5",
                total_webinars: null,
                followers: 200,
                profile_image: "https://randomuser.me/api/portraits/men/14.jpg",
                specialties: null,
                created_at: "2025-02-04T18:24:34.369Z",
                updated_at: "2025-02-04T18:24:34.369Z",
              },
              {
                id: "2a8a8ca9-c7bd-44e9-b6cc-7c6e4dec4746",
                name: "Mr. Sudip Dey",
                user_id: "2b2f614d-940e-439d-9c75-70fa131a566f",
                bio: "Expert in global supply chain optimization, AI-driven\n                            logistics, and last-mile delivery strategies.",
                organization: "FFFAI",
                linkedin_profile: "dfdsfgsdfg345345sdfgdsfgdfsgdfg",
                experience: "5",
                total_webinars: null,
                followers: 200,
                profile_image: "https://randomuser.me/api/portraits/men/4.jpg",
                specialties: null,
                created_at: "2025-02-04T18:24:34.369Z",
                updated_at: "2025-02-04T18:24:34.369Z",
              },
            ],
            media: [
              {
                id: "c5c68464-f618-4555-9a40-373565ef8897",
                media_url:
                  "https://as2.ftcdn.net/v2/jpg/00/82/51/67/1000_F_82516786_78Ru4V50ZHLf05gQm6tLEd0X03tCw6Kt.jpg",
                media_type: "banner",
                created_at: "2025-02-22T12:46:36.936Z",
              },
            ],
            attendees: [],
            subscriptions: [],
            subscribedUserIds: [],
            isUserRegistered: false,
          };
        }else{
          this.webinar = data;
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = "Failed to load webinar details.";
        this.isLoading = false;
      },
    });
  }

  /** Opens the confirmation modal */
  openConfirmationModal() {
    this.showModal = true;
  }

  /** Closes the confirmation modal */
  closeModal() {
    this.showModal = false;
  }

  /** Adds webinar to cart */
  addToCart() {
    this.showModal = false;

    const token = localStorage.getItem("authToken");

    if (!token) {
      // Get the return URL correctly
      const returnUrl = this.router.url;

      // Redirect user to login and save return URL
      this.router.navigate(["/auth/login"], { state: { returnUrl } });
      return;
    }

    if (!this.webinar || !this.userId) return;

    const requestBody = {
      webinarId: this.webinar?.id,
      userId: this.userId?.id,
    };

    this.webinarService.addToCart(requestBody).subscribe({
      next: () => {
        this.router.navigate(["/checkout"]); // Redirect to checkout page
      },
      error: () => {
        this.errorMessage = "Failed to add to cart. Try again.";
      },
    });
  }
  prevSlide() {
    this.currentIndex =
      this.currentIndex === 0
        ? this.webinar.trainers.length - 1
        : this.currentIndex - 1;
  }

  nextSlide() {
    this.currentIndex =
      (this.currentIndex + 1) % this.webinar.trainers.length;
  }
}