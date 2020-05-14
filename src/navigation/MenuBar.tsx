// @ts-nocheck
import { MaterialTopTabBarProps } from '@react-navigation/material-top-tabs/src/types';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated from 'react-native-reanimated';
import * as React from 'react';
import { ReactElement } from 'react';
import ThemesProvider, { useWithTheme } from '../underpin/ThemesProvider';

export default function MenuBar({ state, descriptors, navigation }: MaterialTopTabBarProps): ReactElement {
  const styles = useWithTheme(baseStyles);

  // console.log('MenuBar: state: ', state);
  // console.log('MenuBar: descriptors: ', descriptors);
  // console.log(state.index);
  return (
    <View style={styles.menuBarContainer}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const textRef = React.useRef(null);
        const label = options.title !== undefined ? options.title : route.name;
        const isSelected = state.index === index;

        const onPress = (): void => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isSelected && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const textStyle = [styles.textStyle];
        let hoverTextStyle = [...textStyle];
        hoverTextStyle.push(styles.textStyleHover);
        if (isSelected) {
          textStyle.push(styles.textStyleSelected);
          hoverTextStyle = [...textStyle];
          hoverTextStyle.push(styles.textStyleHoverSelected);
        }
        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityStates={isSelected ? ['selected'] : []}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            style={styles.touchableOpacity}
            onMouseEnter={(): void => textRef.current.setNativeProps({ style: StyleSheet.flatten(hoverTextStyle) })}
            onMouseLeave={(): void => textRef.current.setNativeProps({ style: StyleSheet.flatten(textStyle) })}
          >
            <Animated.Text
              ref={(ref): void => {
                textRef.current = ref;
              }}
              numberOfLines={1}
              style={textStyle}
            >
              {label}
            </Animated.Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = ThemesProvider.create({
  menuBarContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 32,
    backgroundColor: '$backgroundColor',
  },
  touchableOpacity: {
    flex: 1,
    maxWidth: 100,
    marginLeft: 12,
    marginRight: 2,
  },
  textStyle: {
    textAlign: 'center',
    color: '$textColor',
    padding: 6,
    borderRadius: 2,
  },
  textStyleSelected: {
    color: '$textColor',
    backgroundColor: '$backgroundColor',
  },
  textStyleHover: {
    color: '$textColor',
  },
  textStyleHoverSelected: {
    color: '$textColor',
  },
});
const baseStyles = styles;
