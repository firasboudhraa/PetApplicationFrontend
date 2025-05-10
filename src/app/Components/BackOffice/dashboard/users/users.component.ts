import { Component, OnInit } from '@angular/core';
import { RegisterRequest, User } from "../../../FrontOffice/user/models/user_model";
import { adminService } from 'src/app/Components/FrontOffice/user/service_user/admin.Service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/Components/FrontOffice/user/auth/auth.service';

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
  showAddUserModal: boolean = false;
  addUserForm: FormGroup;
  isSubmitting: boolean = false;
  editingUserId: number | null = null;
isEditMode: boolean = false;


  constructor(
    private adminService: adminService,
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.addUserForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['USER', Validators.required]
    });
  }

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
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error loading users.',
        });
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

      if (this.noUsersForRole) {
        Swal.fire({
          icon: 'info',
          title: 'No Users',
          text: `No users with the role "${this.selectedRole}".`,
        });
      }
    }
  }

  deleteUser(userId: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This user will be permanently deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.adminService.deleteUser(userId).subscribe({
          next: () => {
            this.users = this.users.filter(user => user.id !== userId);
            this.filteredUsers = this.filteredUsers.filter(user => user.id !== userId);
            Swal.fire({
              icon: 'success',
              title: 'Deleted',
              text: 'User successfully deleted.',
            });
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Unable to delete user.',
            });
            console.error('Error deleting user:', err);
          }
        });
      }
    });
  }



  viewUserDetails(userId: number): void {
    this.adminService.getUserById(userId).subscribe({
      next: (user) => {
        Swal.fire({
          title: `${user.firstName} ${user.lastName}`,
          html: `
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Roles:</strong> ${user.roles.map(r => r.name).join(', ')}</p>
          `,
          icon: 'info'
        });
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Unable to load user details.',
        });
      }
    });
  }

openAddUserModal(): void {
  this.showAddUserModal = true;
  this.isEditMode = false;
  this.editingUserId = null;
  this.addUserForm.reset({
    role: 'USER'
  });
}

  closeAddUserModal(): void {
    this.showAddUserModal = false;
    this.addUserForm.reset({
      role: 'USER'
    });
    this.isSubmitting = false;
  }
openEditUserModal(userId: number): void {
  this.adminService.getUserById(userId).subscribe({
    next: (user) => {
      this.addUserForm.setValue({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: '', // Optional: leave empty or add a placeholder
        role: user.roles[0]?.name || 'USER'
      });
      this.editingUserId = user.id;
      this.isEditMode = true;
      this.showAddUserModal = true;
    },
    error: (err) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Unable to load user data for editing.',
      });
      console.error(err);
    }
  });
}
  addUser(): void {
    if (this.addUserForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      const userData: RegisterRequest = {
        firstName: this.addUserForm.value.firstName,
        lastName: this.addUserForm.value.lastName,
        email: this.addUserForm.value.email,
        password: this.addUserForm.value.password,
        role: this.addUserForm.value.role
      };

      this.authService.register(userData).subscribe({
        next: (response: any) => {
          this.isSubmitting = false;
          this.closeAddUserModal();

          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'User created successfully!',
          });

          this.loadUsers();
        },
        error: (err: any) => {
          this.isSubmitting = false;

          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: err.error?.message || 'Error while creating user.',
          });

          console.error('Error registering user:', err);
        }
      });
    } else if (!this.isSubmitting) {
      Object.keys(this.addUserForm.controls).forEach(key => {
        this.addUserForm.get(key)?.markAsTouched();
      });
    }
  }

    editUser(userId: number): void {
    Swal.fire({
      icon: 'info',
      title: 'Redirecting',
      text: `Redirecting to the edit page for user ID ${userId}`,
      showConfirmButton: false,
      timer: 1200
    });
    this.router.navigate(['/edit-user', userId]);
    
  }
}
