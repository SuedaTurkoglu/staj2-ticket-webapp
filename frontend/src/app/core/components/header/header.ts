import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import {Toolbar} from 'primeng/toolbar';
import { Search } from '@primeicons/angular/search';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, AvatarModule, ButtonModule, Toolbar, Search],
  template: `
    <p-toolbar class="app-header-bg px-6 py-3" [style]="{
          position: 'fixed',
          top: '0',
          right: '0',
          left: 0,
          'z-index': 999,
          padding: '1rem 1rem 1rem 1.5rem',
          border: 'none'}">
      <ng-template #start>
        <div class="flex items-center gap-2">
          <a routerLink="/" class="flex items-center gap-2 no-underline">
            <p-avatar
              label="B"
              shape="square"
              [style]="{ padding: '0.5rem 1rem 0.5rem 1rem', fontSize: '1.25rem'}"
              class="brand-avatar w-8 h-8"
            />
            <span class="header-brand-title">BusTicket</span>
          </a>
        </div>
      </ng-template>

      <ng-template #end>
        <button pButton variant="text" routerLink="/search" size="large" class="p-button-search" aria-label="Search">
          <svg data-p-icon="search" />
        </button>
        <a routerLink="/about" type="text" class="header-nav-link">
          <span class="nav-link">About</span>
        </a>
      </ng-template>
    </p-toolbar>
  `
})
export class Header {}
