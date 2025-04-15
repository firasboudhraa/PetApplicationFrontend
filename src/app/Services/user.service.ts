import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
 
private currentUsers = [
  { id: 1, name: 'Rayen Trabelsi' },
  { id: 2, name: 'Mokhtar Snoussi' },
  { id: 3, name: 'Yassine Drira' },
  { id: 4, name: 'Roronoa Zoro' }
];

private currentUser = this.currentUsers[2]; 

getCurrentUser() {
  return this.currentUser;
}

getCurrentUserId(): number {
  return this.currentUser.id;
}

// Nouvelle méthode pour obtenir tous les utilisateurs
getAllUsers() {
  return this.currentUsers;
}

// Nouvelle méthode pour récupérer un utilisateur par son ID
getUserById(id: number): Observable<{id: number, name: string}> {
  const user = this.currentUsers.find(u => u.id === id);
  return of(user || {id, name: `User ${id}`});
}

// Nouvelle méthode pour récupérer plusieurs utilisateurs
getUsersByIds(ids: number[]): Observable<{id: number, name: string}[]> {
  const users = this.currentUsers.filter(user => ids.includes(user.id));
  // Compléter avec des utilisateurs par défaut si certains ne sont pas trouvés
  const result = ids.map(id => {
    const found = users.find(u => u.id === id);
    return found || {id, name: `User ${id}`};
  });
  return of(result);
}

}