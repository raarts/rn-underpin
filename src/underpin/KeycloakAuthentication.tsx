import React, { ReactElement } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { makeRedirectUri } from 'expo-auth-session';
import { Alert, Platform } from 'react-native';
import jwtDecode from 'jwt-decode';
import formUrlEncode from './utils/formUrlEncode';

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

type LoginState = 'loggedin' | 'loggedout' | 'gettoken' | 'weblogin';

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
  onChange?: (newState: string) => void;
};

const KeycloakAuthentication = ({ children, urlDiscovery, clientId, onChange }: Props): ReactElement => {
  const [loginState, setLoginState] = React.useState<LoginState>('loggedout');
  const [working, setWorking] = React.useState<boolean>(false);
  const [code, setCode] = React.useState<string>('');
  const [authCodeResponse, setAuthCodeResponse] = React.useState<AuthCodeResponse | null>(null);
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

  const changeLoginState = (newState: LoginState): void => {
    setLoginState(newState);
    setWorking(newState !== 'loggedout' && newState !== 'loggedin');
    if (onChange) onChange(newState);
  };

  React.useEffect(() => {
    if (response) {
      switch (response.type) {
        case 'cancel': //  the user cancelled the authentication session by closing the browser,
          changeLoginState('loggedout');
          break;
        case 'dismiss': // If the authentication is dismissed manually with AuthSession.dismiss()
          changeLoginState('loggedout');
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
          changeLoginState('loggedout');
          break;
        case 'success': // authentication flow is successful
          setCode(response.params.code);
          setCodeVerifier(request?.codeVerifier || '');
          changeLoginState('gettoken');
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
      setTokenExpiry(accessToken.exp);

      changeLoginState('loggedin');
      return authCode.access_token;
    } catch (e) {
      if (Platform.OS === 'web') {
        // eslint-disable-next-line no-alert
        alert(`Authentication error: ${e || 'something went wrong'}`);
      } else {
        Alert.alert('AuthCode Authentication error', e || 'something went wrong');
      }
    }
    return null;
  };

  React.useEffect(() => {
    if (loginState === 'gettoken') {
      getToken().then();
    }
  }, [loginState]);

  const context: KeycloakAuthenticationType = {
    loginState,
    working,
    authCodeResponse,
    tokenExpiry,
    getAccessToken: async (): Promise<string | null | undefined> => {
      if (loginState === 'loggedin') {
        if (Math.round(new Date().getTime() / 1000) > tokenExpiry) {
          return getToken();
        }
        return new Promise(() => authCodeResponse?.access_token);
      }
      return new Promise(() => undefined);
    },
    login: () => {
      changeLoginState('weblogin');
      promptAsync().then();
    },
    logout: () => {
      setAuthCodeResponse(null);
      changeLoginState('loggedout');
      setCode('');
      setCodeVerifier('');
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
