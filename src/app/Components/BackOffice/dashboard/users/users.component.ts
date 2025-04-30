import { Component, OnInit } from '@angular/core';
import { User } from "../../../FrontOffice/user/models/user_model";
import { adminService } from 'src/app/Components/FrontOffice/user/service_user/admin.Service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  selectedRole: string = 'all';
  noUsersForRole: boolean = false;

  constructor(private adminService: adminService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.adminService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.filteredUsers = [...users];
      },
      error: (err) => {
        console.error('Error fetching users:', err);
      }
    });
  }

  filterUsers(): void {
    if (this.selectedRole === 'all') {
      this.filteredUsers = [...this.users];
      this.noUsersForRole = false;
    } else {
      const filtered = this.users.filter(user =>
        user.roles.some(role =>
          role.name.toLowerCase() === this.selectedRole.toLowerCase()
        )
      );

      this.filteredUsers = filtered;
      this.noUsersForRole = filtered.length === 0;
    }
  }

  deleteUser(userId: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.adminService.deleteUser(userId).subscribe({
        next: () => {
          this.users = this.users.filter(user => user.id !== userId);
          this.filteredUsers = this.filteredUsers.filter(user => user.id !== userId);
        },
        error: (err) => {
          console.error('Error deleting user:', err);
          // Handle error (show message to user)
        }
      });
    }
  }

  createNewUser(): void {
    console.log('Creating new user...');
  }


  editUser(userId: number): void {
    console.log('Editing user with ID:', userId);
    // Implement the logic to navigate to the edit user page or open a modal  

}

}