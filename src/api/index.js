// import axios from "axios";
import fetchJsonp from "fetch-jsonp";

/**
 * 音乐播放器
 */

// 获取音乐播放列表
export const getPlayerList = async (server, type, id) => {
  const res = await fetch(
    `${import.meta.env.VITE_SONG_API}?server=${server}&type=${type}&id=${id}`,
  );
  const data = await res.json();

  if (data[0].url.startsWith("@")) {
    // eslint-disable-next-line no-unused-vars
    const [handle, jsonpCallback, jsonpCallbackFunction, url] = data[0].url.split("@").slice(1);
    const jsonpData = await fetchJsonp(url).then((res) => res.json());
    const domain = (
      jsonpData.req_0.data.sip.find((i) => !i.startsWith("http://ws")) ||
      jsonpData.req_0.data.sip[0]
    ).replace("http://", "https://");

    return data.map((v, i) => ({
      name: v.name || v.title,
      artist: v.artist || v.author,
      url: domain + jsonpData.req_0.data.midurlinfo[i].purl,
      cover: v.cover || v.pic,
      lrc: v.lrc,
    }));
  } else {
    return data.map((v) => ({
      name: v.name || v.title,
      artist: v.artist || v.author,
      url: v.url,
      cover: v.cover || v.pic,
      lrc: v.lrc,
    }));
  }
};

/**
 * 一言
 */

// 获取一言数据
export const getHitokoto = async () => {
  const res = await fetch("https://v1.hitokoto.cn?c=d&c=i");
  return await res.json();
};

/**
 * JSONP 请求模块
 */
// JSONP 请求函数，并返回 JSON 【关于为什么要有这个呢...请腾讯自觉扫一下（x）】
const loadJSONP = (url, callbackName) => {
  return new Promise((resolve, reject) => {
    // 1. 定义 script 标签（先不赋值 src，防止部分浏览器提前触发）
    const script = document.createElement('script');

    // 2. 定义清理函数：负责移除全局回调和 script 标签
    const cleanup = () => {
      if (window[callbackName]) delete window[callbackName];
      if (script.parentNode) script.parentNode.removeChild(script);
    };

    // 3. 挂载全局回调函数
    window[callbackName] = (data) => {
      cleanup(); // 拿到数据后立即清理
      resolve(data);
    };

    // 4. 异常处理
    script.onerror = () => {
      cleanup(); // 出错后也要清理
      reject(new Error(`JSONP 请求失败: ${url}`));
    };

    // 5. 正式发起请求
    script.src = url;
    document.body.appendChild(script);
  });
};

/**
 * 天气
 */
// 获取腾讯地理位置信息（JSONP 方式）
export const getTXAdcode = async (key) => {
  const callback = `jsonpCallback_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
  const url = `https://apis.map.qq.com/ws/location/v1/ip?key=${key}&output=jsonp&callback=${callback}`;
  return await loadJSONP(url, callback);
};

// 获取腾讯地理天气信息（JSONP 方式）
export const getTXWeather = async (key, adcode) => {
  const callback = `jsonpCallback_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
  const url = `https://apis.map.qq.com/ws/weather/v1/?key=${key}&adcode=${adcode}&type=now&output=jsonp&callback=${callback}`;
  return await loadJSONP(url, callback);
};

// 获取高德地理位置信息
export const getGDAdcode = async (key) => {
  const res = await fetch(`https://restapi.amap.com/v3/ip?key=${key}`);
  return await res.json();
};

// 获取高德地理位置信息（带IP）
export const getGDAdcodeI = async (ipv4, key) => {
  const res = await fetch(`https://restapi.amap.com/v3/ip?ip=${ipv4}&key=${key}`);
  return await res.json();
};

// 获取高德地理天气信息
export const getGDWeather = async (key, city) => {
  const res = await fetch(`https://restapi.amap.com/v3/weather/weatherInfo?key=${key}&city=${city}`);
  return await res.json();
};

// 补充的获取 IPV4 地址的 API
export const getIPV4Addr = async () => {
  const res = await fetch(`https://v4.yinghualuo.cn/bejson?format=json`);
  return await res.json();
};

// // 补充的获取 IPV6 地址的 API
// export const getIPV6Addr = async () => {
//   const res = await fetch(`https://v6.yinghualuo.cn/bejson?format=json`);
//   return await res.json();
// };

// // 获取 IPV4 地址的地理位置信息 API
// export const getIPV4AddrLocation = async (ipv4) => {
//   // const res = await fetch(`https://ip.taobao.com/outGetIpInfo?ip=${ipv4}&accessKey=alibaba-inc`);
//   const res = await fetch(`https://api.nanorocky.top/tbipinfo/?ip=${ipv4}`);
//   return await res.json();
// };