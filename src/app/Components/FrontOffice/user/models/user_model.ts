export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    roles: Role[]   // Accept both formats
    profileImageUrl?: string;
    bio?: string;  

  }
export interface Role {
  roleId: number;            
  name: string;              // Enum name: 'ADMIN', 'PET_OWNER', etc.
  permissions: string[];     // Enum set: ['admin:read', 'admin:write', ...]
}
export interface UserUpdateRequest {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    role?: string; 
    bio?: string;  // Add this line

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
    sub: string;      
    roles: string[];   
    userId: number;     
    iat: number;       
    exp: number;       
  }
  