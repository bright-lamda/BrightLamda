import { Searchbar } from 'react-native-paper';

interface AppSearchBarProps {
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
}

export const AppSearchBar = ({ value, onChangeText, placeholder = 'Search' }: AppSearchBarProps) => (
  <Searchbar value={value} onChangeText={onChangeText} placeholder={placeholder} elevation={0} />
);
