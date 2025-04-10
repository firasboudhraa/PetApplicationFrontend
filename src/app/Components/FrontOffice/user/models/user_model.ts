export interface User {
  id: number;                      
  firstName: string;
  lastName: string;
  email: string;
  roles: Role[];                  
  profilePictureUrl?: string;     
}
export interface Role {
  roleId: number;            
  name: string;              // Enum name: 'ADMIN', 'PET_OWNER', etc.
  permissions: string[];     // Enum set: ['admin:read', 'admin:write', ...]
}

export interface RegisterRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role?: string;
  }
  
  export interface LoginRequest {
    email: string;
    password: string;
  }
  
  export interface AuthResponse {
    token: string;
    success: boolean;
    message: string;
  }
  
  export  interface DecodedToken {
    sub: string;        // Email
    roles: string[];    // Array of roles and permissions
    userId: number;     // User ID
    iat: number;        // Issued at
    exp: number;        // Expiration
  }
  