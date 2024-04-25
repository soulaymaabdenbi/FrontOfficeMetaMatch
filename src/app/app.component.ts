import { Component, AfterViewInit } from '@angular/core';
declare var $: any; // Assure TypeScript that $ is available globally
import { filter } from 'rxjs/operators';
import {NavigationEnd, Router} from "@angular/router";
import {ProfileImageService} from "./profile-image.service";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent implements AfterViewInit {
  title = 'METAMATCH';
  showHeaderFooter = false; // Default to false assuming you generally want it hidden

  constructor(private router: Router,private profileImageService: ProfileImageService) {
    // Listen to router events and toggle header/footer visibility based on route
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      // Set showHeaderFooter to true only for the '/login' route
      this.showHeaderFooter = event.urlAfterRedirects === '/login';
    });
  }



   ngAfterViewInit(): void {
     // Use arrow function to keep 'this' context and add explicit type for event parameter
     $(document).on('click', '.panel-heading span.clickable', (e: Event) => {
       const $this = $(e.currentTarget); // Use currentTarget instead of 'this'
       if (!$this.hasClass('panel-collapsed')) {
         $this.parents('.panel').find('.panel-body').slideUp();
         $this.addClass('panel-collapsed');
         $this
           .find('i')
           .removeClass('glyphicon-minus')
           .addClass('glyphicon-plus');
       } else {
         $this.parents('.panel').find('.panel-body').slideDown();
         $this.removeClass('panel-collapsed');
         $this
           .find('i')
           .removeClass('glyphicon-plus')
           .addClass('glyphicon-minus');
       }
     });

     // Correct 'e' type annotation and use arrow functions
     $('#menu-close').click((e: Event) => {
       e.preventDefault();
       $('#sidebar-wrapper').toggleClass('active');
     });

     $('#menu-toggle').click((e: Event) => {
       e.preventDefault();
       $('#sidebar-wrapper').toggleClass('active');
     });
   }
}
