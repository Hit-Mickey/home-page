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
 * 天气
 */
// 获取腾讯地理位置信息（JSONP 方式）
export const getTXAdcode = async (key) => {
  // const callback = `jsonpCallback_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
  // const url = `https://apis.map.qq.com/ws/location/v1/ip?key=${key}`;
  // return await loadJSONP(url, callback);
  const url = await fetch(`https://apis.map.qq.com/ws/location/v1/ip?key=${key}`);
  return await url.json();
};

// 获取腾讯地理天气信息（JSONP 方式）
export const getTXWeather = async (key, adcode) => {
  // const callback = `jsonpCallback_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
  // const url = `https://apis.map.qq.com/ws/weather/v1/?key=${key}&adcode=${adcode}&type=now`;
  // return await loadJSONP(url, callback);
  const url = await fetch(`https://apis.map.qq.com/ws/weather/v1/?key=${key}&adcode=${adcode}&type=now`);
  return await url.json();
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