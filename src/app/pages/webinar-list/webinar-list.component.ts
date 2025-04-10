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
  categories: any[] = [];
  webinars: any[] = [];
  filteredWebinars: any[] = [];
  isLoading = true;
  errorMessage = '';
  currentPageType: string = ''
  queryString: string = ''
  isLoggedIn: boolean = false; 
  activeTab: string = ''; // Default empty, set dynamically
// ✅ Dynamic Tabs Configuration
tabs: { id: string; label: string; show: boolean }[] = [];
  constructor(private webinarService: WebinarService, private route: Router,private router: ActivatedRoute,) {}

  ngOnInit(): void {
    this.isLoggedIn = !!sessionStorage.getItem('authToken');
     // ✅ Define Tabs Dynamically
     this.tabs = [
      { id: 'allCourses', label: 'All Courses', show: true },
      { id: 'myCourses', label: 'My Courses', show: this.isLoggedIn }
    ];
    this.router.params.subscribe((params:any) => {
      this.currentPageType = params?.stype || 'allCourses'; // Default to "allCourses"
      this.activeTab = this.tabs.find(tab => tab.id === this.currentPageType)?.id || 'allCourses';
      console.log(this.activeTab)
      this.fetchWebinars(params?.stype,'allCourses');
    });
    this.router.queryParams.subscribe((params:any) => {
      const type = params['type'];
      this.queryString = type
    });

   
  }

  fetchWebinars(stype:string,tabType:string) {
    console.log(this.queryString)
    this.isLoading = true;
    this.webinarService.getWebinars(stype,tabType).subscribe({
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
          author: (this.currentPageType === 'events')? 'Panel Members':`${webinar.trainer.user.first_name} ${webinar.trainer.user.last_name}`,
          start_time: webinar.start_time?new Date(webinar.start_time).toLocaleDateString():null,
          end_time: webinar.end_time?new Date(webinar.end_time).toLocaleTimeString():null,
          category: webinar.category.name,
          isNew: new Date(webinar.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Mark as new if created within the last 7 days
        }));

        // Extract unique categories
        this.categories = [...new Set(this.webinars.map(w => w.category))];
        if(this.queryString) {
          this.selectedCategory = this.categories[0]
        }
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
    this.route.navigate([`webinar/${this.currentPageType}/${webinar?.id}`])
  }

  setActiveTab(tabtype:string) {
    this.searchQuery = '';
    this.selectedCategory = '';
    this.fetchWebinars(this.currentPageType,tabtype)
  }
 }