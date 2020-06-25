import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { IdToken } from '../underpin/KeycloakAuthentication';

export type LoginState = 'loggedin' | 'loggedout' | 'gettoken' | 'weblogin';

export interface IdentityState extends IdToken {
  loginState: LoginState;
  anonymous: string;
}

const initialState: IdentityState = {
  /* eslint-disable @typescript-eslint/camelcase */
  loginState: 'loggedout',
  anonymous: '',
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
    setIdentity: (state, action: PayloadAction<IdToken>): IdentityState => ({
      ...state,
      ...action.payload,
    }),
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

export const { setIdentity, clearIdentity, setAnonymousId, setLoginState } = identitySlice.actions;

export default identitySlice.reducer;
