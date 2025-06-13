export interface RegisterFormValues {
  email: string;
  password: string;
  address: string;
  birthdate: string;
  age: number;
}

export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  providers: string[];
}

export interface AppUserExtended extends AppUser {
  address?: string;
  birthdate?: string;
  age?: number;
}
