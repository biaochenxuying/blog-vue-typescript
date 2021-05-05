// fn是我们需要包装的事件回调, delay是时间间隔的阈值
export function throttle(fn: Function, delay: number) {
  // last为上一次触发回调的时间, timer是定时器
  let last = 0,
    timer: any = null;
  // 将throttle处理结果当作函数返回
  return function () {
    const that: any = (this as any);
    // 保留调用时的this上下文
    let context = that;
    // 保留调用时传入的参数
    let args = arguments;
    // 记录本次触发回调的时间
    let now = +new Date();

    // 判断上次触发的时间和本次触发的时间差是否小于时间间隔的阈值
    if (now - last < delay) {
      // 如果时间间隔小于我们设定的时间间隔阈值，则为本次触发操作设立一个新的定时器
      clearTimeout(timer);
      timer = setTimeout(function () {
        last = now;
        fn.apply(context, args);
      }, delay);
    } else {
      // 如果时间间隔超出了我们设定的时间间隔阈值，那就不等了，无论如何要反馈给用户一次响应
      last = now;
      fn.apply(context, args);
    }
  };
}

export function setCookie(cName: string, value: any, expiredays: any) {
  if (expiredays > 0 && expiredays !== "100") {
    let exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie =
      cName +
      "=" +
      escape(value) +
      // (expiredays == null ? '' : ';expires=' + exdate.toGMTString());
      (expiredays == null ? "" : ";expires=" + exdate.toUTCString());
  }
  if (expiredays === "100") {
    let exdate = new Date("2118-01-01 00:00:00");
    document.cookie =
      cName +
      "=" +
      escape(value) +
      // (expiredays == null ? '' : ';expires=' + exdate.toGMTString());
      (expiredays == null ? "" : ";expires=" + exdate.toUTCString());
  }
}
export function getCookie(cName: string) {
  if (document.cookie.length > 0) {
    let cStart = document.cookie.indexOf(cName + "=");
    if (cStart !== -1) {
      cStart = cStart + cName.length + 1;
      let cEnd = document.cookie.indexOf(";", cStart);
      if (cEnd === -1) cEnd = document.cookie.length;
      return unescape(document.cookie.substring(cStart, cEnd));
    }
  }
  return "";
}

export function delCookie(name: string) {
  let exp = new Date();
  exp.setTime(exp.getTime() - 1);
  let cval = getCookie(name);
  if (cval != null)
    // document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString();
    document.cookie = name + "=" + cval + ";expires=" + exp.toUTCString();
}

//清除cookie
export function clearCookie(name: string) {
  setCookie(name, "", -1);
}

//获取QueryString的数组
export function getQueryString() {
  let result = window.location.search.match(
    new RegExp("[?&][^?&]+=[^?&]+", "g")
  );
  if (result == null) {
    return "";
  }
  for (let i = 0; i < result.length; i++) {
    result[i] = result[i].substring(1);
  }
  return result;
}
//根据 QueryString 参数名称获取值
export function getQueryStringByName(name: string) {
  let result = window.location.search.match(
    new RegExp("[?&]" + name + "=([^&]+)", "i")
  );
  if (result == null || result.length < 1) {
    return "";
  }
  return result[1];
}
//获取页面顶部被卷起来的高度
export function getScrollTop() {
  return Math.max(
    //chrome
    document.body.scrollTop,
    //firefox/IE
    document.documentElement.scrollTop
  );
}
//获取页面文档的总高度
export function getDocumentHeight() {
  //现代浏览器（IE9+和其他浏览器）和IE8的document.body.scrollHeight和document.documentElement.scrollHeight都可以
  return Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight
  );
}
//页面浏览器视口的高度
export function getWindowHeight() {
  return document.compatMode === "CSS1Compat"
    ? document.documentElement.clientHeight
    : document.body.clientHeight;
}
//// 时间 格式化成 2018-12-12 12:12:00
export function timestampToTime(timestamp: Date | any, dayMinSecFlag: boolean) {
  const date = new Date(timestamp);
  const Y = date.getFullYear() + "-";
  const M =
    (date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1) + "-";
  const D =
    date.getDate() < 10 ? "0" + date.getDate() + " " : date.getDate() + " ";
  const h =
    date.getHours() < 10 ? "0" + date.getHours() + ":" : date.getHours() + ":";
  const m =
    date.getMinutes() < 10
      ? "0" + date.getMinutes() + ":"
      : date.getMinutes() + ":";
  const s =
    date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
  if (!dayMinSecFlag) {
    return Y + M + D;
  }
  return Y + M + D + h + m + s;
}

//判断是移动端还是 pc 端 ，true 表示是移动端，false 表示是 pc 端
export function isMobileOrPc() {
  if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
    return true;
  } else {
    return false;
  }
}
