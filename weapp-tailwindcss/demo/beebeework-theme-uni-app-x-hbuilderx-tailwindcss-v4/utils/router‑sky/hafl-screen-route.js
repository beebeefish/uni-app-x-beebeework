/* eslint-disable @typescript-eslint/naming-convention */
import { CurveAnimation, Curves } from './common';
import { themeState } from '@/stores/theme.uts'; // 根据你实际的 store 路径调整

const HalfScreenDialogRouteBuilder = ({
  primaryAnimation,
  primaryAnimationStatus,
  userGestureInProgress,
  secondaryAnimation, // 1. 接收底层页面的动画对象
  secondaryAnimationStatus,
}) => {
  // 从全局统一获取屏幕及窗口高度
  const screenHeight = themeState.layout.screenHeight || 812;

  // 主页面（半屏页）的曲线动画
  const _curvePrimaryAnimation = CurveAnimation({
    animation: primaryAnimation,
    animationStatus: primaryAnimationStatus,
    curve: Curves.linearToEaseOut,
    reverseCurve: Curves.easeInToLinear,
  });

  // 底层页面（首页）的曲线动画（控制下沉和缩放）
  const _curveSecondaryAnimation = CurveAnimation({
    animation: secondaryAnimation,
    animationStatus: secondaryAnimationStatus,
    curve: Curves.linearToEaseOut,
    reverseCurve: Curves.easeInToLinear,
  });

  // 1. 半屏页自身的动画：自底向上弹出
  const handlePrimaryAnimation = () => {
    'worklet';
    let t = primaryAnimation.value;
    if (!userGestureInProgress.value) {
      t = _curvePrimaryAnimation.value;
    }
    const top = 0.12;
    const selfHeight = (1 - top) * screenHeight;

    const marginTop = top * screenHeight;
    const translateY = selfHeight * (1 - t);
    return {
      marginTop: `${marginTop}px`,
      borderRadius: '10px',
      height: `${selfHeight}px`,
      transform: `translateY(${translateY}px)`,
    };
  };

  // 2. 底层页面（首页）的动画：随着半屏弹出而产生下沉、缩放或圆角效果
  const handleSecondaryAnimation = () => {
    'worklet';
    // t 的范围是 0 -> 1，表示半屏弹出的进度
    const t = _curveSecondaryAnimation.value;
    
    // 效果可以根据喜好调整：
    // 例如：底部页面稍微缩小一点 (比如从 1 缩放到 0.95)，并往下沉一点
    const scale = 1 - 0.05 * t;       // 缩放比例：1 缩小到 0.95
    const translateY = -20 * t;       // 向上或向下位移，制造立体感
    const borderRadius = 10 * t;      // 边缘圆角，模拟卡片下沉

    return {
      transform: `scale(${scale}) translateY(${translateY}px)`,
      borderRadius: `${borderRadius}px`,
      overflow: 'hidden', // 确保圆角生效
    };
  };

  return {
    handlePrimaryAnimation,
    handleSecondaryAnimation, // 3. 注册底层页面的动画函数
    opaque: false,            // 半屏推入时栈顶透明，露出下层页面
    transitionDuration: 300,
    reverseTransitionDuration: 300,
    canTransitionTo: true,    // 必须为 true，才能让底层页面参与联动
    canTransitionFrom: true,
  };
};

export default HalfScreenDialogRouteBuilder;