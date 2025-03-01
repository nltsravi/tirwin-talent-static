import { Component, OnInit } from '@angular/core';
import { WebinarService } from './webinar-list.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-webinar-list',
  templateUrl: './webinar-list.component.html',
  styleUrls: ['./webinar-list.component.css']
})
export class WebinarListComponent implements OnInit {
  searchQuery = '';
  selectedCategory = '';
  categories: string[] = [];
  webinars: any[] = [];
  filteredWebinars: any[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(private webinarService: WebinarService, private route: Router,private router: ActivatedRoute,) {}

  ngOnInit(): void {
    const stype = this.router.snapshot.paramMap.get("stype");
    if(stype){
      this.fetchWebinars(stype);
    }else{
      this.fetchWebinars("masterclass");
    }
   
  }

  fetchWebinars(stype:string) {
    this.isLoading = true;
    this.webinarService.getWebinars(stype).subscribe({
      next: (data) => {
        console.log(data);
        this.webinars = data.map(webinar => ({
          id: webinar.id,
          title: webinar.title,
          description: webinar.description,
          session_type:webinar.session_type,
          session_description:webinar.session_description,
          trainer_ids:webinar.trainer_ids,
          image: webinar.media.find((m:any) => m.media_type === 'banner')?.media_url || 'https://via.placeholder.com/300',
          author: `${webinar.trainer.organization}`,
          date: new Date(webinar.start_time).toLocaleDateString(),
          time: new Date(webinar.start_time).toLocaleTimeString(),
          category: webinar.category.name,
          isNew: new Date(webinar.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Mark as new if created within the last 7 days
        }));

        // Extract unique categories
        this.categories = [...new Set(this.webinars.map(w => w.category))];

        this.filteredWebinars = [...this.webinars];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching webinars:', error);
        this.errorMessage = 'Failed to load webinars. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  filterWebinars() {
    this.filteredWebinars = this.webinars.filter(webinar => {
      const matchesSearch = webinar.title.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesCategory = this.selectedCategory ? webinar.category === this.selectedCategory : true;
      return matchesSearch && matchesCategory;
    });
  }

  viewDetails(webinar:any) {
    console.log("webinar",webinar)
    this.route.navigate([`webinar-details/${webinar?.id}`])
  }
}