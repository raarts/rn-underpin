import React, { ReactElement } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { makeRedirectUri } from 'expo-auth-session';
import { Alert, Platform } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import formUrlEncode from './utils/formUrlEncode';
import { setIdentityFromAuthCode, clearIdentity, LoginState, setLoginState } from '../store/identity';
import { RootState } from '../store';
import { AuthCodeResponse } from './utils/oidc.types';

export const keycloak = {
  context: null as KeycloakAuthenticationType | null,
};

export type KeycloakAuthenticationType = {
  loginState: LoginState;
  getAccessToken: () => Promise<string | null | undefined>;
  login: () => void;
  logout: () => void;
  working: boolean;
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
  const [code, setCode] = React.useState<string>('');
  const [codeVerifier, setCodeVerifier] = React.useState<string>('');
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

  const getTokenFromCode = async (): Promise<string | null> => {
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
      setWorking(false);
      setCode('');
      setCodeVerifier('');
      dispatch(setIdentityFromAuthCode(authCode));
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
      setCode('');
      setCodeVerifier('');
      dispatch(clearIdentity());
    }
    return null;
  };

  const getTokenFromRefresh = async (): Promise<string | null> => {
    try {
      const resp = await fetch(discovery?.tokenEndpoint || 'http://localhost', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formUrlEncode({
          client_id: clientId,
          refresh_token: identity.refreshToken,
          grant_type: 'refresh_token',
        }),
      });
      const authCode = (await resp.json()) as AuthCodeResponse;
      setWorking(false);
      setCode('');
      setCodeVerifier('');
      dispatch(setIdentityFromAuthCode(authCode));
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
      setCode('');
      setCodeVerifier('');
      dispatch(clearIdentity());
    }
    return null;
  };

  React.useEffect(() => {
    if (identity.loginState === 'gettoken') {
      getTokenFromCode().then();
    }
  }, [identity.loginState]);

  keycloak.context = {
    loginState: identity.loginState,
    working,
    getAccessToken: async (): Promise<string | null | undefined> => {
      if (identity.loginState === 'loggedin') {
        const now = Math.round(new Date().getTime() / 1000);
        if (now > identity.accessExpiry) {
          if (__DEV__) {
            // eslint-disable-next-line no-console
            console.log('accessToken expired');
          }
          if (now < identity.refreshExpiry) {
            if (__DEV__) {
              // eslint-disable-next-line no-console
              console.log('get new accesstoken');
            }
            return getTokenFromRefresh();
          }
          if (__DEV__) {
            // eslint-disable-next-line no-console
            console.log('refreshToken expired too: forcing login');
          }
          dispatch(clearIdentity());
          return undefined;
        }
        if (__DEV__) {
          // eslint-disable-next-line no-console
          console.log('returning access token', identity.accessToken);
        }
        return identity.accessToken;
      }
      return undefined;
    },
    login: (): void => {
      setWorking(true);
      dispatch(setLoginState('weblogin'));
      promptAsync().then();
    },
    logout: (): void => {
      setCode('');
      setCodeVerifier('');
      setWorking(false);
      dispatch(clearIdentity());
    },
  };
  if (__DEV__) {
    // eslint-disable-next-line no-console
    console.log(keycloak.context);
  }
  return (
    <KeycloakAuthenticationContext.Provider value={keycloak.context}>{children}</KeycloakAuthenticationContext.Provider>
  );
};

export default KeycloakAuthentication;

export function useKeycloakAuthentication(): KeycloakAuthenticationType {
  const context = React.useContext(KeycloakAuthenticationContext);
  return context as KeycloakAuthenticationType;
}
