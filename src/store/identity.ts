import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import jwtDecode from 'jwt-decode';
import { AuthCodeResponse, IdToken } from '../underpin/utils/oidc.types';

export type LoginState = 'loggedin' | 'loggedout' | 'gettoken' | 'weblogin';

export interface IdentityState extends IdToken {
  loginState: LoginState;
  anonymous: string;
  accessToken: string | null;
  accessExpiry: number;
  refreshToken: string | null;
  refreshExpiry: number;
}

const initialState: IdentityState = {
  /* eslint-disable @typescript-eslint/camelcase */
  loginState: 'loggedout',
  anonymous: '',
  accessToken: null,
  accessExpiry: 0,
  refreshToken: null,
  refreshExpiry: 0,
  acr: '',
  aud: '',
  auth_time: 0,
  azp: '',
  email: '',
  exp: 0,
  family_name: '',
  given_name: '',
  iat: 0,
  iss: '',
  jti: '',
  name: '',
  nbf: 0,
  nonce: '',
  preferred_username: '',
  session_state: '',
  sub: '',
  typ: '',
};

// noinspection JSUnusedLocalSymbols
const identitySlice = createSlice({
  name: 'identity',
  initialState,
  reducers: {
    // example of a plain PayLoad action creator. Could just as well have been
    // setIdentity(state, action: PayloadAction<Identity>) but then you would
    // invoke the action creator as setIdentity({ true }).
    setIdentityFromAuthCode: (state, action: PayloadAction<AuthCodeResponse>): IdentityState => {
      const idToken = jwtDecode(action.payload.id_token || '') as IdToken;
      return {
        ...state,
        accessToken: action.payload.access_token,
        accessExpiry: Math.round(new Date().getTime() / 1000) + action.payload.expires_in,
        refreshToken: action.payload.refresh_token,
        refreshExpiry: Math.round(new Date().getTime() / 1000) + action.payload.refresh_expires_in,
        ...idToken,
      };
    },
    clearIdentity: (state): IdentityState => ({
      ...initialState,
      anonymous: state.anonymous,
    }),
    setAnonymousId: (state): IdentityState => {
      if (state.anonymous === '') {
        return {
          ...state,
          anonymous: uuidv4().toUpperCase(),
        };
      }
      return state;
    },
    setLoginState: (state, action: PayloadAction<LoginState>): IdentityState => ({
      ...state,
      loginState: action.payload,
    }),
  },
});

export const { setIdentityFromAuthCode, clearIdentity, setAnonymousId, setLoginState } = identitySlice.actions;

export default identitySlice.reducer;
