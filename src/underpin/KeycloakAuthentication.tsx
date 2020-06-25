import React, { ReactElement } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { makeRedirectUri } from 'expo-auth-session';
import { Alert, Platform } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import jwtDecode from 'jwt-decode';
import formUrlEncode from './utils/formUrlEncode';
import { setIdentity, clearIdentity, LoginState, setLoginState } from '../store/identity';
import { RootState } from '../store';

export interface AccessToken {
  acr: string;
  'allowed-origins': string[];
  aud: string;
  auth_time: number;
  azp: string;
  email: string;
  exp: number;
  family_name: string;
  given_name: string;
  iat: number;
  iss: string;
  jti: string;
  name: string;
  nbf: number;
  nonce: string;
  preferred_username: string;
  realm_access: {
    roles: string[];
  };
  resource_access: {
    account: {
      roles: string[];
    };
  };
  scope: string;
  session_state: string;
  sub: string;
  typ: string;
}

export interface IdToken {
  acr: string;
  aud: string;
  auth_time: number;
  azp: string;
  email: string;
  exp: number;
  family_name: string;
  given_name: string;
  iat: number;
  iss: string;
  jti: string;
  name: string;
  nbf: number;
  nonce: string;
  preferred_username: string;
  session_state: string;
  sub: string;
  typ: string;
}

export interface AuthCodeResponse {
  access_token: string | null;
  expires_in: number;
  id_token: string | null;
  'not-before-policy': number;
  refresh_expires_in: number;
  refresh_token: string | null;
  scope: string;
  session_state: string;
  token_type: string;
}

export type KeycloakAuthenticationType = {
  getAccessToken: () => Promise<string | null | undefined>;
  login: () => void;
  logout: () => void;
  working: boolean;
  loginState: LoginState;
  authCodeResponse: AuthCodeResponse | null;
  tokenExpiry: number;
};

const defaultKeycloakAuthentication = {
  getAccessToken: (): Promise<string | null | undefined> =>
    new Promise(() => {
      return undefined;
    }),
};

export const KeycloakAuthenticationContext = React.createContext(defaultKeycloakAuthentication);

WebBrowser.maybeCompleteAuthSession();

type Props = {
  children: ReactElement;
  urlDiscovery: string;
  clientId: string;
};

const KeycloakAuthentication = ({ children, urlDiscovery, clientId }: Props): ReactElement => {
  const dispatch = useDispatch();
  const identity = useSelector((state: RootState) => state.identity);
  const [working, setWorking] = React.useState<boolean>(false);
  const [authCodeResponse, setAuthCodeResponse] = React.useState<AuthCodeResponse | null>(null);
  const [code, setCode] = React.useState<string>('');
  const [codeVerifier, setCodeVerifier] = React.useState<string>('');
  const [tokenExpiry, setTokenExpiry] = React.useState<number>(Math.round(new Date().getTime() / 1000));
  const discovery = AuthSession.useAutoDiscovery(urlDiscovery);
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId,
      extraParams: { nonce: 'skjDgeF5sG' },
      scopes: ['openid'],
      redirectUri: AuthSession.makeRedirectUri({
        native: 'underpin://redirect',
      }),
    },
    discovery,
  );

  React.useEffect(() => {
    if (response) {
      switch (response.type) {
        case 'cancel': //  the user cancelled the authentication session by closing the browser,
          setWorking(false);
          dispatch(clearIdentity());
          break;
        case 'dismiss': // If the authentication is dismissed manually with AuthSession.dismiss()
          setWorking(false);
          dispatch(clearIdentity());
          break;
        case 'locked': // AuthSession.startAsync called more than once before the first call has returned
          // do nothing, already working on logging in
          break;
        case 'error': //  the authentication flow returns an error
          if (Platform.OS === 'web') {
            // eslint-disable-next-line no-alert
            alert(`Authentication error: ${response.params.error_description}`);
          } else {
            Alert.alert('Authentication error', response.params.error_description);
          }
          setWorking(false);
          dispatch(clearIdentity());
          break;
        case 'success': // authentication flow is successful
          setCode(response.params.code);
          setCodeVerifier(request?.codeVerifier || '');
          setWorking(true);
          dispatch(setLoginState('gettoken'));
          break;
        default:
          break;
      }
    }
  }, [response]);

  const getToken = async (): Promise<string | null> => {
    try {
      const resp = await fetch(discovery?.tokenEndpoint || 'http://localhost', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formUrlEncode({
          /* eslint-disable @typescript-eslint/camelcase */
          client_id: clientId,
          redirect_uri: makeRedirectUri({
            native: 'underpin://redirect',
          }),
          code,
          grant_type: 'authorization_code',
          code_verifier: codeVerifier,
        }),
      });
      const authCode = (await resp.json()) as AuthCodeResponse;
      setAuthCodeResponse(authCode);

      const accessToken = jwtDecode(authCode.access_token || '') as AccessToken;
      const idToken = jwtDecode(authCode.id_token || '') as IdToken;
      setTokenExpiry(accessToken.exp);
      setWorking(false);
      setCode('');
      setCodeVerifier('');
      dispatch(setIdentity(idToken));
      dispatch(setLoginState('loggedin'));
      return authCode.access_token;
    } catch (e) {
      if (Platform.OS === 'web') {
        // eslint-disable-next-line no-alert
        alert(`Authentication error: ${e || 'something went wrong'}`);
      } else {
        Alert.alert('AuthCode Authentication error', e || 'something went wrong');
      }
      setWorking(false);
      setAuthCodeResponse(null);
      setCode('');
      setCodeVerifier('');
      dispatch(clearIdentity());
    }
    return null;
  };

  React.useEffect(() => {
    if (identity.loginState === 'gettoken') {
      getToken().then();
    }
  }, [identity.loginState]);

  const context: KeycloakAuthenticationType = {
    loginState: identity.loginState,
    working,
    authCodeResponse,
    tokenExpiry,
    getAccessToken: async (): Promise<string | null | undefined> => {
      if (identity.loginState === 'loggedin') {
        if (Math.round(new Date().getTime() / 1000) > tokenExpiry) {
          return getToken();
        }
        return authCodeResponse?.access_token;
      }
      return undefined;
    },
    login: () => {
      setWorking(true);
      dispatch(setLoginState('weblogin'));
      promptAsync().then();
    },
    logout: () => {
      setAuthCodeResponse(null);
      setCode('');
      setCodeVerifier('');
      setWorking(false);
      dispatch(clearIdentity());
    },
  };
  if (__DEV__) {
    // eslint-disable-next-line no-console
    console.log(context);
  }
  return <KeycloakAuthenticationContext.Provider value={context}>{children}</KeycloakAuthenticationContext.Provider>;
};

export default KeycloakAuthentication;

export function useKeycloakAuthentication(): KeycloakAuthenticationType {
  const context = React.useContext(KeycloakAuthenticationContext);
  return context as KeycloakAuthenticationType;
}
