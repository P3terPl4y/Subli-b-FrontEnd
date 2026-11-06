import { forwardRef, Children } from 'react';
import { View } from 'react-native';
import type { ViewStyle } from 'react-native';

// En web no hay pager nativo. Mostramos solo la página activa.
// El cambio de página se hace desde el BottomNav con setPage(noop).
type Props = {
  style?: ViewStyle;
  initialPage?: number;
  onPageSelected?: (e: { nativeEvent: { position: number } }) => void;
  children: React.ReactNode;
};

const Pager = forwardRef<any, Props>(({ style, initialPage = 0, children }, _ref) => {
  const pages = Children.toArray(children);
  return (
    <View style={[{ flex: 1 }, style]}>
      {pages[initialPage] ?? null}
    </View>
  );
});

Pager.displayName = 'Pager';
export default Pager;
