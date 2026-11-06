import { forwardRef } from 'react';
import PagerView from 'react-native-pager-view';
import type { ViewStyle } from 'react-native';

// Envoltorio de react-native-pager-view para que main.tsx no lo importe directo
type Props = {
  style?: ViewStyle;
  initialPage?: number;
  onPageSelected?: (e: { nativeEvent: { position: number } }) => void;
  children: React.ReactNode;
};

const Pager = forwardRef<PagerView, Props>(
  ({ style, initialPage = 0, onPageSelected, children }, ref) => {
    return (
      <PagerView
        ref={ref}
        style={style}
        initialPage={initialPage}
        onPageSelected={onPageSelected}
      >
        {children}
      </PagerView>
    );
  }
);

Pager.displayName = 'Pager';
export default Pager;
