export class UserDTO {
    id: number;
    name: string;
    email: string;
    profilePictureUrl: string;
  
    constructor(id: number, name: string, email: string, profilePictureUrl: string) {
      this.id = id;
      this.name = name;
      this.email = email;
      this.profilePictureUrl = profilePictureUrl;
    }
  }
  