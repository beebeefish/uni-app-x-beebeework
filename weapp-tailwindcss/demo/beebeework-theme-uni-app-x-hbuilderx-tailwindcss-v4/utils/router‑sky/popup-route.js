/* eslint-disable @typescript-eslint/naming-convention */

import { CurveAnimation, Curves } from './common';
import { themeState } from '@/stores/theme.uts'
const PopupTransitionRouteBuilder = ({
  primaryAnimation,
  primaryAnimationStatus,
  userGestureInProgress,
}) => {
  const { windowWidth, windowHeight, screenHeight } = themeState.layout

  const _curvePrimaryAnimation = CurveAnimation({
    animation: primaryAnimation,
    animationStatus: primaryAnimationStatus,
    curve: Curves.linearToEaseOut,
    reverseCurve: Curves.easeInToLinear,
  });

  const handlePrimaryAnimation = () => {
    'worklet';
    /**
     * 1. 手势拖动时采用原始值
     * 2. 页面进入时采用 curve 曲线生成的值
     * 3. 页面返回时采用 reverseCurve 生成的值
     */
    let t = primaryAnimation.value;
    if (!userGestureInProgress.value) {
      t = _curvePrimaryAnimation.value;
    }
    const top = 0.12;
		const marginBottom = 34;
    const selfHeight = (1 - 3*top) * screenHeight - marginBottom;
  
    const marginTop = 3*top * screenHeight;
    const translateY = selfHeight * (1 - t);
    return {
      marginTop: `${marginTop}px`,
			marginBottom: `${marginBottom}px`,
			marginLeft: `20px`,
      borderRadius: '20px',
      height: `${selfHeight}px`,
			width: `${windowWidth-40}px`,
      transform: `translateY(${translateY}px)`,
    };
  };

  return {
    opaque: false,
		maintainState: true,
    handlePrimaryAnimation,
    transitionDuration: 300,
    reverseTransitionDuration: 300,
    canTransitionTo: true,
    canTransitionFrom: false,
		barrierColor: 'rgba(0,0,0,.4)',
		barrierDismissible: true
  };
};

export default PopupTransitionRouteBuilder;
