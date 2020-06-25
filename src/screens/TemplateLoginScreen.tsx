import * as React from 'react';
import { Button, SafeAreaView, View, Text, ActivityIndicator } from 'react-native';
import { ReactElement } from 'react';
import Constants from 'expo-constants';
import ThemeProvider, { applyTheme } from '../underpin/ThemeProvider';
import { useKeycloakAuthentication } from '../underpin/KeycloakAuthentication';

const TemplateLoginScreen = (): ReactElement => {
  const keycloak = useKeycloakAuthentication();
  const styles = applyTheme(baseStyles);

  return (
    <SafeAreaView style={styles.safearea}>
      <View style={styles.container}>
        <View style={styles.container}>
          <View style={styles.flex3} />
          {keycloak.working && <ActivityIndicator color="blue" />}
          {!keycloak.working && <Button title="login" onPress={(): void => keycloak.login()} />}
          <View style={styles.flex1} />
          <Text>{keycloak.loginState}</Text>
          <Button
            disabled={keycloak.loginState !== 'loggedin'}
            title="logout"
            onPress={(): void => keycloak.logout()}
          />
          <View style={styles.flex3} />
          <Button
            disabled={keycloak.loginState !== 'loggedin'}
            title="Test Token Expiry"
            onPress={async (): Promise<string | null | undefined> => keycloak.getAccessToken()}
          />
          <View style={styles.flex3} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = ThemeProvider.create({
  safearea: {
    flex: 1,
    backgroundColor: '$backgroundColor',
    marginTop: Constants.statusBarHeight,
  },
  container: {
    flex: 1,
    backgroundColor: '$backgroundColor',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
const baseStyles = styles;

export default TemplateLoginScreen;
