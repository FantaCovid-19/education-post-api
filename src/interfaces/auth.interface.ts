export interface SignUpInput {
  name: string;
  email: string;
  password: string;
}

export interface SignUpResponse {
  email: string;
  role: string;
}

export interface SignInInput {
  email: string;
  password: string;
}

export interface SignInResponse {
  signInData: {
    id: string;
    email: string;
    role: string;
  };
  accessToken: {
    expiresIn: number;
    token: string;
  };
  refreshToken: {
    expiresIn: number;
    token: string;
  };
  cookie: string;
}

export interface SignOutInput {
  id: string;
  email: string;
  password: string;
  role: string;
}

export interface SignOutResponse {
  email: string;
  role: string;
}

export interface AccessTokenInput {
  id: string;
}

export interface AccessTokenPayload {
  expiresIn: number;
  token: string;
}

export interface RefreshTokenInput {
  id: string;
}

export interface RefreshTokenPayload {
  expiresIn: number;
  token: string;
}

export interface GenerateTokenInput {
  id: string;
}

export interface GenerateTokenPayload {
  accessToken: {
    expiresIn: number;
    token: string;
  };
  refreshToken: {
    expiresIn: number;
    token: string;
  };
  cookie: string;
}

export interface PublicaDataInput {
  id?: string;
  email: string;
  password?: string;
  role: string;
}

export interface PublicaDataPayload {
  email: string | undefined;
  role: string | undefined;
}
