import { definePreset } from '@primeuix/themes';
import Lara from '@primeuix/themes/lara';
import { providePrimeNG } from 'primeng/config';
import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import {routes} from './app.routes';
import {MessageService} from 'primeng/api';

export const AppPreset = definePreset(Lara, {

  /* --------------------------------------------------------------------------
     1. SEMANTIC TOKENS & DESIGN SYSTEM
     -------------------------------------------------------------------------- */
  primitive: {
    blue: {
      50: '#e8e9fb', // --brand-blue-light
      100: '#c5c8f5',
      200: '#9fa3ef',
      300: '#797ee9',
      400: '#5358e3',
      500: '#1e22aa', // Main Pantone 2736C
      600: '#171a88', // Hover Blue
      700: '#101266',
      800: '#0a0b44',
      900: '#030422'
    }
  },

  semantic: {
    primary: {
      50: '#fff0e6',
      100: '#ffd6cc',
      200: '#ffad99',
      300: '#ff8566',
      400: '#ff5c33',
      500: '#f76902', // Main Brand Orange
      600: '#e05e02', // Hover Orange
      700: '#b84a00',
      800: '#8f3700',
      900: '#662500',
      950: '#3d1400',
      color: 'light-dark(#f76902, #ff8566)',
      contrastColor: 'light-dark(#ffffff, #1f2937)',
      hoverColor: 'light-dark(#e05e02, #ffad99)',
      activeColor: 'light-dark(#b84a00, #ff8566)'
    },

    // Neutral / Surface System -> Neutral Light & Dark mapping
    surface: {
      0: '#ffffff',
      50: '#f8f9fa',  // --bg-main
      100: '#f1f3f5', // --bg-subtle
      200: '#e5e7eb', // --border-color
      300: '#d1d5db',
      400: '#9ca3af', // --text-light / seat border
      500: '#6b7280', // --text-secondary
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937', // --text-primary
      900: '#111827',
      950: '#030712'
    },

    // Global Highlights & Focus Ring
    highlight: {
      background: 'light-dark({primary.50}, {primary.950})',
      focusBackground: 'light-dark({primary.100}, {primary.900})',
      color: 'light-dark({primary.600}, {primary.300})',
      focusColor: 'light-dark({primary.700}, {primary.200})'
    },
    focusRing: {
      width: '3px',
      style: 'solid',
      color: 'light-dark({brandBlue.50}, {primary.950})',
      offset: '0px'
    },

    // Typography Setup
    typography: {
      lineHeight: '1.5',
      fontFamily: "'Segoe UI', Roboto, -apple-system, BlinkMacSystemFont, sans-serif",
      fontWeight: '400',
      fontSize: '1rem',
    },

    // Global Form Inputs Behavior
    formField: {
      paddingX: '0.875rem',
      paddingY: '0.625rem',
      borderRadius: '6px',
      focusRing: {
        width: '3px',
        style: 'solid',
        color: '{blue.50}',
        offset: '0px'
      },
      borderColor: '{surface.200}',
      hoverBorderColor: '{brandBlue.500}',
      focusBorderColor: '{blue.500}',
      invalidBorderColor: '#ef4444',
      fontWeight: '{typography.fontWeight}',
      fontSize: '{typography.fontSize}'
    }
  },

  /* --------------------------------------------------------------------------
     2. COMPONENT OVERRIDES & EXTENSIONS
     -------------------------------------------------------------------------- */
  components: {
    // Card Customizations
    card: {
      root: {
        background: 'light-dark({surface.0}, {surface.900})',
        color: 'light-dark({surface.800}, {surface.0})',
        borderRadius: '10px',
        shadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
      },
      subtitle: {
        color: 'light-dark({brandBlue.500}, {primary.400})',
        fontWeight: '700'
      }
    },

    drawer: {
      root: {
        background: 'light-dark({surface.100}, {surface.900})',
        color: 'light-dark({surface.800}, {surface.0})',
        borderColor: 'light-dark({surface.200}, {surface.800})'
      }
    },

    toolbar: {
      root: {
        //border: 'none',
        borderRadius: '0px'
      }
    },

    avatar: {
      root: {
        borderRadius: '6px'
      }
    },

    // PrimeNG Select / Dropdown Tokens
    select: {
      root: {
        background: 'light-dark({surface.0}, {surface.900})',
        borderColor: 'light-dark({surface.200}, {surface.700})',
        hoverBorderColor: 'light-dark({blue.500}, {blue.400})',
        focusBorderColor: 'light-dark({blue.500}, {blue.400})',
        borderRadius: '6px'
      }
    },

    // Button Overrides & Custom Variants
    button: {
      root: {
        borderRadius: '6px',
        fontSize: "0.75rem",
        //fontWeight: '600'
      },
      extend: {
        // Custom secondary blue & brand gradient variants
        blue: {
          background: '#1e22aa',
          hoverBackground: '#171a88',
          color: '#ffffff'
        },
        brand: {
          background: 'linear-gradient(135deg, #1e22aa 0%, #f76902 100%)',
          color: '#ffffff'
        }
      },
      // Global CSS rules for custom utility buttons and seat styling
      css: ({ dt }: any) => `
        /* Secondary Blue Variant */
        .p-button-secondary-blue {
          background: ${dt('button.extend.blue.background')};
          color: ${dt('button.extend.blue.color')};
          border: none;
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          transition: background 0.2s ease, box-shadow 0.2s ease;
        }
        .p-button-secondary-blue:hover {
          background: ${dt('button.extend.blue.hoverBackground')};
          color: ${dt('button.extend.blue.color')};
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.15);
        }

        /* Combined Brand Gradient Variant */
        .p-button-brand {
          background: ${dt('button.extend.blue.background')};
          color: ${dt('button.extend.brand.color')};
          border: none;
          transition: all 0.2s ease, box-shadow 0.2s ease;
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
        }
        .p-button-brand:hover {
          opacity: 0.92;
          transform: translateY(-1px);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.15);
        }

        .p-button-brand-search {
          background: ${dt('button.extend.blue.background')};
          color: ${dt('button.extend.brand.color')};
          border: none;
          transition: all 0.2s ease;
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
        }

        .p-button-search {
          transition: all 0.2s ease;
          font-size: 0.875rem;
          font-weight: 600;
          margin-right: 1rem;
          color: var(--p-blue-400)
        }

        .p-button-search:hover {
          opacity: 0.7;
          background-color: rgba(255, 255, 255, 0.25);
        }

        /* Custom Ticket Card Accent Class */
        .ticket-card {
          border-left: 5px solid #f76902 !important;
          position: relative;
          overflow: hidden;
        }
        .ticket-card::after {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 4px;
          height: 100%;
          background-color: #1e22aa;
        }

        /* Gradient Text Helper */
        .brand-text-gradient {
          background: linear-gradient(135deg, #1e22aa 0%, #f76902 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }


        /* Bus Utilities */
        .bus-layout {
          display: flex;
          flex-direction: row;
          flex-wrap: nowrap;
          overflow-x: auto;
          overflow-y: hidden;
          align-items: center;
          justify-content: flex-start;
          gap: 0.5rem;
          padding: 1rem;
          background: var(--p-surface-50);
          border-radius: 10px;
          margin-bottom: 1.25rem;
        }

        .bus-front {
          flex-shrink: 0;
          align-self: center;
          font-size: 0.7rem;
          font-weight: 700;
          writing-mode: vertical-rl;
          text-orientation: upright;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--p-surface-400);
          border-right: 2px solid var(--p-surface-300);
        }

        .bus-row {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.625rem;
        }

        .bus-seat-group {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
          margin-left: 0.6rem;
        }

        .bus-aisle {
          width: 1.5rem;
        }

        /* Bus Seat Utilities */
        .seat-panel {
          max-height: 0;
          opacity: 0;
          overflow: hidden;
          transition: max-height 0.4s ease, opacity 0.3s ease;
        }

        .seat-panel.expanded {
          max-height: 900px;
          opacity: 1;
        }

        .bus-seat {
          width: 2rem;
          height: 2rem;
          border-radius: 4px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: bold;
          cursor: pointer;
          border: 2px solid #9ca3af;
          background-color: #ffffff;
          color: #1f2937;
          transition: all 0.2s ease;
        }
        .bus-seat:hover:not(.occupied) {
          border-color: #f76902;
          color: #b84a00;
        }
        .bus-seat.selected {
          background-color: #f76902;
          border-color: #b84a00;
          color: #ffffff;
        }
        .bus-seat.occupied {
          background-color: #d1d5db;
          border-color: #d1d5db;
          color: #6b7280;
          cursor: not-allowed;
        }


        .seat-summary {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.75rem;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--p-surface-700);
        }

        @media (prefers-reduced-motion: reduce) {
          .seat-panel {
            transition: none;
          }
        }

        /* Brand Gradient Utility Class */
        .brand-gradient-bg {
          background: linear-gradient(165deg, ${dt('blue.500')} 20%, ${dt('primary.300')} 85%);
        }

        /* Brand Gradient Header Background */
        .app-header-bg {
          background: linear-gradient(135deg, ${dt('blue.500')} 10%, ${dt('primary.500')} 90%);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        /* Brand Avatar Token Variant */
        .brand-avatar {
          background-color: ${dt('primary.500')} !important;
          color: #ffffff !important;
          font-weight: 700;
        }

        .header-brand-title {
          color: #ffffff;
          font-size: 1.35rem;
          font-weight: 700;
          letter-spacing: 0.5px;
          padding: 0.3rem;

        }

        /* Header Navigation Links */
        .header-nav-link {
          color: #ffffff;
          font-weight: 600;
          padding: 0.5rem 0.875rem;
          border-radius: 6px;
          text-decoration: none;
          transition: background-color 0.2s ease;
        }

        .header-nav-link:hover {
          background-color: rgba(255, 255, 255, 0.55);
        }

        /* Input focus outline with Brand Blue Light halo */
        .p-inputtext:focus,
        .p-select:focus-within,
        .p-textarea:focus {
          border-color: ${dt('blue.500')} !important;
          box-shadow: 0 0 0 3px ${dt('blue.50')} !important;
          outline: none;
        }

        /* Input hover transition */
        .p-inputtext:hover,
        .p-select:hover,
        .p-textarea:hover {
          border-color: ${dt('blue.500')}
        }

        /* Input placeholder styling */
        .p-inputtext::placeholder,
        .p-textarea::placeholder {
          color: ${dt('surface.400')}
        }

        /* Form label helper class */
        .app-form-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: ${dt('surface.800')};
          margin-bottom: 1.5rem;
          display: inline-block;
          margin-right: 0.875rem;
        }

      `
    }
  },

  css: ({ dt }: any) => `
    .view-page-header {
      display: flex;
      flex-wrap: nowrap;
      justify-content: space-between;
      align-items: center;
      font-family: var(--p-font-family, 'Segoe UI');
      gap: 1rem;
      margin-bottom: 1.5rem;
    }
    .view-page-title {
      display: block;
      font-family: var(--p-font-family, 'Segoe UI');
      font-weight: 700;
      font-size: 1.35rem;
      color: var(--p-surface-800);
    }
    .view-page-subtitle {
      font-family: var(--p-font-family, 'Segoe UI');
      color: var(--p-surface-500);
      font-size: 0.875rem;
      margin: 0.25rem 0 0;
    }

    .view-grid {
      display: flex;
      flex-direction: column;
      // display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 1.25rem;
    }

    .view-card-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .view-card {
      position: relative;
      display: block;
      border-left: 5px solid var(--p-primary-500);
      border-radius: 10px;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    .view-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 16px -4px rgba(0, 0, 0, 0.52);
    }
    .view-card .p-card-body {
      padding: 1.25rem;
    }

    .view-card-edit-body {
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
      padding: 0.75rem;
      margin: 0.5rem 0;
      background: var(--p-surface-50);
      border: 1px dashed var(--p-primary-200);
      border-radius: 8px;
    }

    .view-card-header {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
      gap: 0.375rem;
      padding-bottom: 0.5rem;
      margin-top: -0.5rem;
      border-bottom: 1px solid var(--p-surface-200);
      flex-basis: 100%;
      width: 100%;
    }

    .view-card-details {
      display: flex;
      align-items: center;
      gap: 1.25rem;
      flex-wrap: wrap;
    }

    .p-button-view-card-edit {
      position: absolute !important;
      top: 1rem;
      right: 5rem;
      font-weight: 600;
      border-radius: 6px;
      border-color: var(--p-surface-200) !important;
      background-color: var(--p-primary-400) !important;
      height: 1.8rem;
      width: 2.5rem;
      cursor: pointer;
      transition: background 0.2s ease, box-shadow 0.2s ease !important;
    }
    .p-button-view-card-delete {
      position: absolute !important;
      top: 1rem;
      right: 1.5rem;
      font-weight: 600;
      border-radius: 6px;
      border-color: var(--p-surface-200) !important;
      background-color: #ffffff !important;
      height: 1.8rem;
      width: 2.5rem;
      cursor: pointer;
      transition: background 0.2s ease, box-shadow 0.2s ease !important;
    }
    .p-button-view-card-cancel {
      margin-top: 1rem;
      font-weight: 600;
      border-radius: 6px;
      border-color: var(--p-surface-200) !important;
      background-color: #C23B22 !important;
      cursor: pointer;
      transition: background 0.2s ease, box-shadow 0.2s ease !important;
    }
    .p-button-view-card-save {
      margin-top: 1rem ;
      margin-left: 1rem;
      border-radius: 6px;
      border-color: var(--p-surface-200) !important;
      background-color: #93C572 !important;
      cursor: pointer;
      transition: background 0.2s ease, box-shadow 0.2s ease !important;
    }

    .view-edit-field {
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
    }

    .view-edit-field label {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--p-text-muted-color);
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }

    .view-edit-field input {
      width: 100%;
    }

    .view-avatar-icon {
      width: 40px;
      height: 40px;
      min-width: 40px;
      border-radius: 8px;
      background: var(--p-primary-50);
      color: var(--p-primary-500);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.125rem;
    }
    .view-avatar-icon svg {
      width: 18px;
      height: 18px;
    }
    .view-card-title {
      font-family: var(--p-font-family, 'Segoe UI');
      font-weight: 700;
      color: var(--p-surface-800);
      font-size: 1rem;
    }
    .view-card-date {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      font-family: var(--p-font-family, 'Segoe UI');
      color: var(--p-surface-500);
      font-size: 0.8125rem;
      margin-top: 0.125rem;
    }
    .view-card-date i {
      font-size: 0.75rem;
    }

    .view-card-body {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .view-stat {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-family: var(--p-font-family, 'Segoe UI');
      color: var(--p-surface-900);
      font-weight: 600;
      font-size: 0.9375rem;
      margin-right: 1rem !important;
    }
    .view-tag {
      font-family: 'Courier New', monospace;
      letter-spacing: 0.5px;
      font-weight: 700;
      font-size: 0.85rem !important;
      background-color: var(--p-blue-100) !important;
      color: var(--p-blue-900) !important;
      margin-top: 0.4rem;
      margin-left: -1rem;
    }

    .view-coordinate {
      font-family: 'Courier New', monospace;
      font-size: 0.8125rem;
      color: var(--p-surface-500);
      letter-spacing: 0.25px;
      margin-right: 1rem;
    }

    .view-empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
      padding: 3rem 1rem;
      color: var(--p-surface-400);
    }
    .view-empty i {
      font-size: 2rem;
    }
    .view-empty p {
      font-family: var(--p-font-family, 'Segoe UI');
      margin: 0;
    }
    .view-empty svg {
      width: 32px;
      height: 32px;
    }

    .view-search input {
      min-width: 240px;
    }

    .form-invalid {
      display: flex;
      font-size: 0.75rem;
      font-weight: 600;
      color: #c30010;
      margin-top: 0rem;
    }

    .p-inputtext.ng-invalid.ng-touched,
    .p-select.ng-invalid.ng-touched,
    .p-textarea.ng-invalid.ng-touched {
      border-color: #c30010 !important;
    }

    .p-inputtext.ng-invalid.ng-touched:focus,
    .p-select.ng-invalid.ng-touched:focus-within,
    .p-textarea.ng-invalid.ng-touched:focus {
      border-color: #c30010 !important;
      box-shadow: 0 0 0 3px #ffcbd1 !important;
      outline: none;
    }

    .p-button-card-search {
      font-weight: 600;
      border-radius: 6px;
      border-color: var(--p-surface-200) !important;
      background: linear-gradient(135deg, #9ca3af 0%, #ff5c33 100%) !important;
      height: 2rem;
      width: 7rem;
      cursor: pointer;
      margin-bottom: -1rem;
      margin-right: 1rem;
      transition: background 0.2s ease, box-shadow 0.2s ease !important;
    }

    //login logout signup
    .auth-switch {
      text-align: center;
      margin: 0.25rem 0 0;
      font-size: 0.7rem !important;
      color: var(--p-surface-500, #6b7280);
    }

    .auth-switch a {
      color: var(--p-blue-500, #1e22aa);
      font-weight: 600;
      text-decoration: none;
    }

    .auth-switch a:hover {
      text-decoration: underline;
    }

    .auth-page {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 80vh;
      padding: 2rem 1rem;
    }

    .auth-card-wrap {
      position: relative;
      width: 100%;
      max-width: 400px;
      animation: authFadeUp 0.5s ease both;
    }

    .auth-badge {
      position: absolute;
      top: -26px;
      left: 50%;
      transform: translateX(-50%);
      width: 52px;
      height: 52px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, var(--p-blue-500, #1e22aa) 0%, var(--p-primary-500, #f76902) 100%);
      box-shadow: 0 6px 14px -4px rgba(30, 34, 170, 0.45);
      z-index: 2;
    }

    .auth-badge svg {
      width: 24px;
      height: 24px;
    }


    :host ::ng-deep .auth-card {
      border-radius: 14px;
      padding-top: 2rem;
      position: relative;
      overflow: hidden;
      box-shadow: 0 10px 24px -10px rgba(30, 34, 170, 0.25);
    }

    :host ::ng-deep .auth-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, var(--p-blue-500, #1e22aa) 0%, var(--p-primary-500, #f76902) 100%);
    }

    .auth-card-head {
      text-align: center;
      margin-bottom: 1.5rem;
    }

    .auth-title {
      margin: 0 0 0.25rem;
      font-size: 1.375rem;
      font-weight: 700;
      color: var(--p-surface-900, #111827);
    }

    .auth-subtitle {
      margin: 0;
      font-size: 0.875rem;
      color: var(--p-surface-500, #6b7280);
    }

    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .auth-form input {
      width: 100%;
    }

    .auth-submit {
      width: 100%;
      justify-content: center;
      margin-bottom: 0 !important;
      margin-top: 0.25rem;
    }

    @keyframes authFadeUp {
      from { opacity: 0; transform: translateY(14px); }
      to   { opacity: 1; transform: translateY(0); }
    }

  `
});
