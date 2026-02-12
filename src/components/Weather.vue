<template>
  <div class="weather" v-if="weatherData.adCode.city && weatherData.weather.weather">
    <span>{{ weatherData.adCode.city }}&nbsp;</span>
    <span>{{ weatherData.weather.weather }}&nbsp;</span>
    <span>{{ weatherData.weather.temperature }}℃</span>
    <span class="sm-hidden">
      &nbsp;{{
        weatherData.weather.winddirection?.endsWith("风")
          ? weatherData.weather.winddirection
          : weatherData.weather.winddirection + "风"
      }}&nbsp;
    </span>
    <span class="sm-hidden">{{ weatherData.weather.windpower }}&nbsp;级</span>
  </div>
  <div class="weather" v-else>
    <span>天气数据获取失败</span>
  </div>
</template>

<script setup>
import { getTXAdcode, getTXWeather, getGDAdcode, getGDAdcodeI, getGDWeather, getIPV4Addr } from "@/api";
import { Error } from "@icon-park/vue-next";

//高德key，腾讯key
const txkey = import.meta.env.VITE_TX_WEATHER_KEY;
const gdkey = import.meta.env.VITE_GD_WEATHER_KEY;

// 天气数据
const weatherData = reactive({
  adCode: {
    city: null, // 城市
    adcode: null, // 城市编码
  },
  weather: {
    weather: null, // 天气现象
    temperature: null, // 实时气温
    winddirection: null, // 风向描述
    windpower: null, // 风力级别
  },
});

// 取出天气平均值
const getTemperature = (min, max) => {
  try {
    // 计算平均值并四舍五入
    const average = (Number(min) + Number(max)) / 2;
    return Math.round(average);
  } catch (error) {
    console.error("计算温度出现错误：", error);
    return "NaN";
  }
};

const getTXW = async () => {
  const adCode = (await getTXAdcode(txkey));
  if (String(adCode.status) !== "0") {
    throw "1天气信息获取失败";
  };
  weatherData.adCode = {
    city: adCode.result.ad_info.district || adCode.result.ad_info.city || adCode.result.ad_info.province || "未知地区",
    adcode: adCode.result.ad_info.adcode,
  };
  // 获取天气信息
  if (weatherData.adCode.adcode == null) {
    throw "2天气信息获取失败";
  };
  const txWeather = (await getTXWeather(txkey, weatherData.adCode.adcode));
  if (String(txWeather.status) !== "0") {
    throw "3天气信息获取失败";
  };
  const realtimeData = txWeather.result.realtime?.[0];
  if (!realtimeData?.infos) {
    throw "4天气信息获取失败";
  };
  weatherData.weather = {
    weather: realtimeData.infos.weather,
    temperature: realtimeData.infos.temperature,
    winddirection: realtimeData.infos.wind_direction,
    windpower: realtimeData.infos.wind_power,
  };
};

const getGDW = async () => {
  const adCode = (await getGDAdcode(gdkey));
  let adCodei = null;
  if (String(adCode?.infocode) !== "10000" || String(adCode?.status) !== "1") {
    console.log("检测到高德接口 IP 获取失败，调用额外接口获取 IPV4 地址...");
    const ipV4addr = await getIPV4Addr();
    adCodei = (await getGDAdcodeI(ipV4addr.ip, gdkey));
    if (String(adCodei?.infocode) !== "10000" || String(adCodei?.status) !== "1") {
      throw "天气信息获取失败";
    };
  };
  if (!adCodei) {
    weatherData.adCode = {
      city: adCode.city || adCode.province || "未知地区",
      adcode: adCode.adcode || null,
    };
  } else {
    weatherData.adCode = {
      city: adCodei.city || adCodei.province || "未知地区",
      adcode: adCodei.adcode || null,
    };
  };
  // 获取天气信息
  if (weatherData.adCode.adcode == null) {
    throw "天气信息获取失败";
  };
  const result = (await getGDWeather(gdkey, weatherData.adCode.adcode));
  if (String(result?.status) !== "1" || String(result?.infocode) !== "10000") {
    throw "天气信息获取失败";
  };
  weatherData.weather = {
    weather: result.lives[0].weather,
    temperature: result.lives[0].temperature,
    winddirection: result.lives[0].winddirection,
    windpower: result.lives[0].windpower,
  };
};

// 获取天气数据
const getWeatherData = async () => {
  try {
    // 获取地理位置信息
    if (!gdkey && !txkey) {
      console.log("未配置天气接口密钥，使用备用天气接口");
    } else if (!txkey) {
      // 调用高德天气 API
      console.log("正在使用高德天气接口");
      try {
        await getGDW();
      } catch (error) {
        console.error("高德天气接口获取失败，尝试调用备用接口");
      };
    } else {
      // 调用腾讯天气 API
      try {
        await getTXW();
      } catch (error) {
        console.error("腾讯天气接口获取失败，尝试使用高德天气接口");
        try {
          await getGDW();
        } catch (error) {
          console.error("高德天气接口获取失败，尝试调用备用接口");
        };
      };
    };
  } catch (error) {
    console.error("天气信息获取失败：" + error);
    onError("天气信息获取失败");
  };
};

// 报错信息
const onError = (message) => {
  ElMessage({
    message,
    icon: h(Error, {
      theme: "filled",
      fill: "#efefef",
    }),
  });
  console.error(message);
};

onMounted(() => {
  // 调用获取天气
  getWeatherData();
});
</script>