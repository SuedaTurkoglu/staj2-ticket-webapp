import { Routes } from '@angular/router';
import { Home } from './modules/home/home-page';
import { About } from './modules/about/about-page';
import { BusCreate } from './modules/bus/components/bus-create/bus-create';
import { BusView } from './modules/bus/components/bus-view/bus-view';
import { DepartureSearch } from './modules/departure/components/search/departure-search';
import { DepartureCreate } from './modules/departure/components/departure-create/departure-create';
import { DepartureView } from './modules/departure/components/departure-view/departure-view';
import { StationCreate } from './modules/station/components/station-create/station-create';
import { StationView } from './modules/station/components/station-view/station-view';
import { StationCombinationCreate } from './modules/station-combination/component/station-combination-create/station-combination-create';
import { StationCombinationView } from './modules/station-combination/component/station-combination-view/station-combination-view';
import { TicketView } from './modules/ticket/components/ticket-view/ticket-view';
import { Checkout } from './modules/ticket/components/checkout/checkout';
import { BookingSuccess } from './modules/ticket/components/booking-success/booking-success';
import { UserView } from './modules/user/components/user-view/user-view';
import { Profile } from './modules/user/components/profile/profile';
import { SignUp } from './modules/user/components/sign-up/sign-up';
import { LogIn } from './modules/user/components/log-in/log-in';
import { LogOut } from './modules/user/components/log-out/log-out';

import { adminGuard } from './modules/user/service/admin-guard';
import { driverGuard } from './modules/user/service/driver-guard';
import { authGuard } from './modules/user/service/auth-guard';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'about', component: About },
  { path: 'bus-create', component: BusCreate, canActivate: [adminGuard], data: {viewMode: 'admin'} },
  { path: 'bus-view', component: BusView, canActivate: [adminGuard], data: {viewMode: 'admin'} },
  { path: 'search', component: DepartureSearch },
  { path: 'departure-create', component: DepartureCreate, canActivate: [adminGuard], data: {viewMode: 'admin'} },
  { path: 'admin/departures', component: DepartureView, canActivate: [adminGuard], data: {viewMode: 'admin'} },
  { path: 'driver/departures', component: DepartureView, canActivate: [driverGuard], data: {viewMode: 'driver'} },
  { path: 'station-create', component: StationCreate, canActivate: [adminGuard], data: {viewMode: 'admin'} },
  { path: 'station-view', component: StationView, canActivate: [adminGuard], data: {viewMode: 'admin'} },
  { path: 'station-combination-create', component: StationCombinationCreate, canActivate: [adminGuard], data: {viewMode: 'admin'} },
  { path: 'station-combination-view', component: StationCombinationView, canActivate: [adminGuard], data: {viewMode: 'admin'} },
  { path: 'ticket', component: TicketView, canActivate: [authGuard] },
  { path: 'checkout', component: Checkout },
  { path: 'booking-success', component: BookingSuccess },
  { path: 'user-view', component: UserView, canActivate: [adminGuard], data: {viewMode: 'admin'} },
  { path: 'profile', component: Profile, canActivate: [authGuard] },
  { path: 'sign-up', component: SignUp },
  { path: 'log-in', component: LogIn },
  { path: 'log-out', component: LogOut, canActivate: [authGuard] }
];
