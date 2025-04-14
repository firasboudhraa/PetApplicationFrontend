import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
 
private currentUsers = [
  { id: 1, name: 'Rayen Trabelsi' },
  { id: 2, name: 'Mokhtar Snoussi' },
  { id: 3, name: 'Yassine Drira' }
];

private currentUser = this.currentUsers[0]; 

getCurrentUser() {
  return this.currentUser;
}

getCurrentUserId(): number {
  return this.currentUser.id;
}

// Nouvelle méthode pour changer d'utilisateur
switchUser(userId: number): void {
  const user = this.currentUsers.find(u => u.id === userId);
  if (user) {
    this.currentUser = user;
    console.log('Switched to user:', user);
  }
}

// Nouvelle méthode pour obtenir tous les utilisateurs
getAllUsers() {
  return this.currentUsers;
}

}