import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TouchableRipple, Text, useTheme } from 'react-native-paper';
import { AppTheme } from '@/theme';
import { FloatingAiButton } from '../components/ai/FloatingAiButton';

const iconMap: Record<string, keyof typeof MaterialCommunityIcons.glyphMap> = {
  home: 'home-variant-outline',
  learn: 'book-education-outline',
  answers: 'lightbulb-on-outline',
  quiz: 'clipboard-check-outline',
  papers: 'file-document-multiple-outline',
};

export const CustomTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const theme = useTheme<AppTheme>();

  return (
    <View>
      <FloatingAiButton />
      <View style={[styles.container, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outline }]}>
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const options = descriptors[route.key].options;
          const label = options.title ?? route.name;

          return (
            <TouchableRipple
              key={route.key}
              borderless
              style={[styles.item, focused && { backgroundColor: theme.colors.surfaceVariant }]}
              onPress={() => navigation.navigate(route.name)}
            >
              <View style={styles.itemInner}>
                <MaterialCommunityIcons
                  name={iconMap[route.name] ?? 'circle-outline'}
                  size={22}
                  color={focused ? theme.colors.primary : theme.colors.onSurfaceVariant}
                />
                <Text variant="labelSmall" style={{ color: focused ? theme.colors.primary : theme.colors.onSurfaceVariant, fontWeight: '800' }}>
                  {String(label)}
                </Text>
              </View>
            </TouchableRipple>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: 6,
    paddingBottom: 10,
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  item: {
    borderRadius: 14,
    flex: 1,
    overflow: 'hidden',
  },
  itemInner: {
    alignItems: 'center',
    gap: 4,
    minHeight: 54,
    justifyContent: 'center',
  },
});
