import CupertinoRouteBuilder from './cupertino-route.js';
import OpacityTransitionRouteBuilder from './opacity-route.js';
import ScaleTransitionRouteBuilder from './scale-route.js';
import HalfScreenDialogRouteBuilder from './hafl-screen-route.js';
import PopupTransitionRouteBuilder from './popup-route.js';
import PopupSTransitionRouteBuilder from './popup-s-route.js';

let hasInstalled = false;

export function installRouteBuilderJS() {
  console.log("[Debug] ===== installRouteBuilderJS 被执行了 =====");
  if (hasInstalled) return;
  
  if (typeof wx === 'undefined' || !wx.worklet) {
    console.warn('[RouteBuilder] wx.worklet不存在，跳过注册');
    return;
  }


    if (typeof wx.router?.addRouteBuilder === 'function') {
      wx.router.addRouteBuilder('Cupertino', CupertinoRouteBuilder);
      wx.router.addRouteBuilder('ScaleTransition', ScaleTransitionRouteBuilder);
      wx.router.addRouteBuilder('OpacityTransition', OpacityTransitionRouteBuilder);
      wx.router.addRouteBuilder('HalfScreenDialog', HalfScreenDialogRouteBuilder);
      wx.router.addRouteBuilder('PopupTransition', PopupTransitionRouteBuilder);
      wx.router.addRouteBuilder('PopupSTransition', PopupSTransitionRouteBuilder);
       
      hasInstalled = true;
      console.info('[RouteBuilder] routeBuilder全部注册成功！');
    }
}