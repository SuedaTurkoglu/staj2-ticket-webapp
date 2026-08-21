import {Component, computed, inject, OnInit, Signal} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {Calendar} from '@primeicons/angular/calendar';
import {ButtonModule} from 'primeng/button';
import {Search} from '@primeicons/angular/search';
import {Ticket} from '@primeicons/angular/ticket';
import {SidebarModule} from 'primeng/sidebar';
import {User} from '@primeicons/angular/user';
import {SignOut} from '@primeicons/angular/sign-out';
import {SignIn} from '@primeicons/angular/sign-in';
import {AngleDoubleRight} from '@primeicons/angular/angle-double-right';
import {AuthService} from '../../../modules/user/service/auth.service';
import { Cog } from '@primeicons/angular/cog';

type Role = 'user' | 'driver' | 'admin';

interface NavItem {
  label: string;
  path: string;
  icon: string;
  roles?: Role[];
}

const USER_NAV: NavItem[] = [
  {label: 'My Tickets', path: '/ticket', icon: 'ticket'},
  // {label: 'Schedules', path: '/calendar', icon: 'calendar'},
  {label: 'My Profile', path: '/profile', icon: 'user'},
];

const DRIVER_NAV: NavItem[] = [
  {label: 'My Departures', path: '/driver/departures', icon: 'cog', roles: ['driver']},
];

const ADMIN_NAV: NavItem[] = [
  {label: 'Create Bus', path: '/bus-create', icon: 'cog', roles: ['admin']},
  {label: 'View Buses', path: '/bus-view', icon: 'cog', roles: ['admin']},
  {label: 'Create Station', path: '/station-create', icon: 'cog', roles: ['admin']},
  {label: 'View Stations', path: '/station-view', icon: 'cog', roles: ['admin']},
  {label: 'Create Station Combination', path: '/station-combination-create', icon: 'cog', roles: ['admin']},
  {label: 'View Station Combinations', path: '/station-combination-view', icon: 'cog', roles: ['admin']},
  {label: 'Create Departure', path: '/departure-create', icon: 'cog', roles: ['admin']},
  {label: 'View Departures', path: '/admin/departures', icon: 'cog', roles: ['admin']},
  {label: 'View Users', path: '/user-view', icon: 'cog', roles: ['admin']},
];

@Component({
  selector: 'app-side-menu',
  standalone: true,
  imports: [RouterLink, SidebarModule, ButtonModule, Cog, AngleDoubleRight, SignOut, SignIn, Calendar, Search, Ticket, User, RouterLinkActive, RouterOutlet],
  template: `
    <div style="overflow-x: hidden">
      <p-sidebar-layout>
        <p-sidebar [style]="{
          'background-color': '#f1f3f5',
          width: '13.5rem',
          position: 'fixed',
          bottom: '0',
          left: '0',
          height: '90vh'}">
          <div class="sidebar-inner">
            <nav class="flex flex-col gap-2">
              <a routerLink="/search" routerLinkActive="active" class="sidebar-nav-item">
                <svg data-p-icon="search"></svg>
                <span>Search Trips</span>
              </a>

              @for (item of visibleNavItems(); track item.path) {
                <a [routerLink]="item.path" routerLinkActive="active" class="sidebar-nav-item">
                  @switch (item.icon) {
                    @case ('ticket') { <svg data-p-icon="ticket"></svg> }
                    @case ('calendar') { <svg data-p-icon="calendar"></svg> }
                    @case ('user') { <svg data-p-icon="user"></svg> }
                    @case ('cog') { <svg data-p-icon="cog"></svg> }
                    @default { <svg data-p-icon="ticket"></svg> }
                  }
                  <span>{{ item.label }}</span>
                </a>
              }
            </nav>

            <div class="sidebar-auth">
              @if (isLoggedIn()) {
                <a routerLink="/log-out" routerLinkActive="active" class="sidebar-auth-item auth-logout">
                  <svg data-p-icon="sign-out"></svg>
                  <span>Log Out</span>
                </a>
              } @else {
                <a routerLink="/log-in" routerLinkActive="active" class="sidebar-auth-item auth-login">
                  <svg data-p-icon="sign-in"></svg>
                  <span>Log In</span>
                </a>
                <a routerLink="/sign-up" routerLinkActive="active" class="sidebar-auth-item auth-signup">
                  <svg data-p-icon="angle-double-right"></svg>
                  <span>Sign Up</span>
                </a>
              }
            </div>
          </div>

        </p-sidebar>

        <p-sidebar-main [style]="{'margin-top': '5rem', 'margin-left': '14rem'}">
          <router-outlet></router-outlet>
        </p-sidebar-main>
      </p-sidebar-layout>
    </div>
  `,
  styles: [`
    .sidebar-nav-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      color: var(--p-surface-800);
      font-weight: 600;
      border-radius: 6px;
      text-decoration: none;
      transition: background-color 0.2s ease, color 0.2s ease;
    }

    .sidebar-nav-item:hover,
    .sidebar-nav-item.active {
      background-color: var(--p-blue-50);
      color: var(--p-blue-600);
    }

    .sidebar-inner {
      display: flex;
      flex-direction: column;
      height: calc(89.7vh - 16px);
      margin: 8px;
      overflow-y: auto;
    }

    .sidebar-auth {
      margin-top: auto;
      padding-top: 0.75rem;
      border-top: 1px solid var(--p-surface-200, #e5e7eb);
    }

    .sidebar-auth-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      font-weight: 600;
      border-radius: 6px;
      text-decoration: none;
      transition: background-color 0.2s ease, color 0.2s ease;
    }

    .sidebar-auth-item svg {
      width: 16px;
      height: 16px;
    }

    .auth-login {
      color: #ffffff;
      background: linear-gradient(100deg, var(--p-blue-100) 0%, var(--p-blue-500) 100%);
      height: 2.5rem;
      margin-bottom: 1rem;
    }
    .auth-signup {
      color: #ffffff;
      background: linear-gradient(100deg, var(--p-primary-100) 0%, var(--p-primary-500) 100%);
      height: 2.5rem;
    }

    .auth-login:hover,
    .auth-signup:hover {
      opacity: 0.9;
    }

    .auth-logout {
      color: var(--p-surface-500, #6b7280);
    }

    .auth-logout:hover,
    .auth-logout.active {
      background-color: #fee2e2;
      color: #C23B22;
    }
  `]
})
export class SideBar implements OnInit {
  private authService = inject(AuthService);

  private user = toSignal(this.authService.loggedInUser$, {initialValue: null});

  isLoggedIn = computed(() => !!this.user());

  visibleNavItems: Signal<NavItem[]> = computed(() => {
    const user = this.user();
    if (!user) return [];

    const items = [...USER_NAV];
    if (user.driver) items.push(...DRIVER_NAV);
    if (user.admin) items.push(...ADMIN_NAV);
    return items;
  });

  ngOnInit(): void {
    // isLoggedIn & visibleNavItems now derive from AuthService's state directly,
    // so no manual refresh is needed on navigation, signal is used (refreshes itself)
    // whenever AuthService.loggedInUserSubject changes (login logout bootstrap etc.)
  }
}
