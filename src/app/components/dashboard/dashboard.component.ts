import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ApiService } from 'src/app/services/api.service';
import { UserStoreService } from 'src/app/services/user-store.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  someObject$: Observable<any>;
  items: any[] = [1, 2, 3, 4, 5, 6, 7, 8];
  users: any = []
  fullName: string | undefined = '';
  role: string | undefined = '';

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private userStoreService: UserStoreService
  ) {
    this.someObject$ = this.callFuncTest();
  }
  ngOnInit(): void {
    // this.someObject$  = this.callFuncTest().subscribe()
    this.apiService.getUsers().subscribe(users => {
      this.users = users;
    })

    this.userStoreService.getFullNameFromStore().subscribe(fullName => {
      const fullNameFromToken = this.authService.getFullNameFromToken();
      this.fullName = fullName || fullNameFromToken;
    })

    this.userStoreService.getRoleFromStore().subscribe(role => {
      const roleFromToken = this.authService.getRoleFromToken();
      this.role = role || roleFromToken;
    })

  }

  logout() {
    this.authService.signOut();
  }

  callFuncTest(): Observable<any> {
    const someObject = {
      name: 'some name',
      age: 26
    }
    return of(someObject);
  }
}


