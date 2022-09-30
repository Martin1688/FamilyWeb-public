import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from './fclass/user';
import { AuthenticationService } from './fservice/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'FamilyWeb';
  paid4app=false;
  familyName='';
  IsAdmin=false;
  constructor(private router: Router,private authenticationService: AuthenticationService) { 
    this.familyName=this.authenticationService.getFamilyName();
    this.paid4app = this.authenticationService.isPaid();
  }

  ngOnInit() {
  }
  public doLogout(): void {
    this.authenticationService.logout();
    this.router.navigateByUrl('');

  }
  public isLoggedIn(): boolean {
    return this.authenticationService.isLoggedIn();
  }
  public getUsername(): string {
    const user: User = this.authenticationService.getCurrentUser();
    return user && user.name ? user.name : 'Guest';
  }//SystemAdmin
  isSystemAdmin(){
    const user=this.authenticationService.getCurrentUser();
    return user.role==="SystemAdmin";
  }
  isAdmin(){
    const user=this.authenticationService.getCurrentUser();
    const ret = (user.role==="admin" || user.role==="SystemAdmin")
    return ret;
  }}
