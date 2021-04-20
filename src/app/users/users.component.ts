import { Component, OnInit } from '@angular/core';
import { User, UserList, UserService } from '../service/user.service';

interface Pagination {
  selected: number;
  page: number;
  totalPage: number;
  total: number;
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  users: any[];
  page: Pagination;
  q: string;
  selectedUser?: User;

  constructor(private userService: UserService) { 
    this.users = [];
    this.page = {
      selected: 1,
      page: 5,
      totalPage: 0,
      total: 0
    }
    this.q = '';
  }

  ngOnInit(): void {
    this.showUsers();
  }

  showUsers() {
    let params: any = {
      par_page: this.page.page,
      page: this.page.selected
    };
    if (this.q) {
      params.q = this.q;
    }

    this.userService.getAll(params)
      .subscribe((data: UserList) => {
        this.users = data.users;
        this.page.totalPage = Math.floor(data.total / this.page.page) + (data.total % this.page.page == 0 ? 0 : 1);
        this.page.total = data.total;
      });
  }

  getPages(): number[] {
    let pages: number[] = [];
    let afterSelected = Math.min(this.page.totalPage - this.page.selected, 2);
    let start = Math.max(this.page.selected - 5 + afterSelected, 0);
    let end = Math.min(start + 5, this.page.totalPage);
    for (let i = start; i < end; i++) {
      pages.push(i + 1);
    }
    return pages;
  }

  onSaveForm(event: any) {
    if (event.user) {
      this.updateUser(event.user.id, event.form);
    } else {
      this.createUser(event.form);
    }
  }

  createUser(user: any) {
    this.userService.create(user)
      .subscribe((data: User) => {
        this.showUsers();
      })
  }
  updateUser(id: any, user: any) {
    this.userService.update(id, user)
      .subscribe((data: User) => {
        this.showUsers();
      })
  }

  setSelectedUser(user: User) {
    this.selectedUser = user;
  }

  goToPage(page: number): void {
    this.showSelectedPage(page);
  }

  goToNextPage(): void {
    this.showSelectedPage(Math.min(this.page.selected + 1, this.page.totalPage));
  }

  goToPrevPage(): void {
    this.showSelectedPage(Math.max(this.page.selected - 1, 1));
  }

  showSelectedPage(page: number) {
    this.page.selected = page;
    this.showUsers();
  }
}
