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
    <span class="sm-hidden">
      {{
        weatherData.weather.windpower?.endsWith("级")
          ? weatherData.weather.windpower
          : weatherData.weather.windpower + "级"
      }}&nbsp;
    </span>
  </div>
  <div class="weather" v-else>
    <span>天气数据获取失败</span>
  </div>
</template>

<script setup>
import {
  getTXAdcode,
  getTXWeather,
  getGDAdcode,
  getGDAdcodeI,
  getGDWeather,
  getIPV4Addr,
} from "@/api";
import { Error } from "@icon-park/vue-next";
import { mainStore } from "@/store";

const store = mainStore();

// 加载环境变量
// 请确保 .env 文件中配置了以下 Key
const txKey = import.meta.env.VITE_TX_WEATHER_KEY; // 腾讯 Key
const gdKey = import.meta.env.VITE_GD_WEATHER_KEY; // 高德 Key

// 天气数据结构
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

/**
 * 1. 腾讯天气获取逻辑 (优先级最高)
 */
const getTXW = async () => {
  if (!txKey) throw "未配置腾讯 Key";

  // 获取位置
  const adCodeRes = await getTXAdcode(txKey);
  if (adCodeRes.status !== 0) throw "腾讯定位失败";

  const adInfo = adCodeRes.result.ad_info;
  weatherData.adCode = {
    city: adInfo.district || adInfo.city || "未知城市",
    adcode: adInfo.adcode,
  };

  // 获取天气
  const weatherRes = await getTXWeather(txKey, weatherData.adCode.adcode);
  if (weatherRes.status !== 0) throw "腾讯天气获取失败";

  const now = weatherRes.result.now;
  weatherData.weather = {
    weather: now.text,
    temperature: now.temp,
    winddirection: now.wind_dir,
    windpower: now.wind_power,
  };
};

/**
 * 2. 高德天气获取逻辑 (优先级次之)
 * 包含 IPv4 补救措施，解决 IPv6 环境下定位失败的问题
 */
const getGDW = async () => {
  if (!gdKey) throw "未配置高德 Key";

  // 尝试直接获取位置
  let adCodeRes = await getGDAdcode(gdKey);

  // 如果直接定位失败（常见于 IPv6 环境），尝试通过 IPv4 辅助定位
  if (adCodeRes.infocode !== "10000") {
    console.warn("高德直接定位失败，尝试 IPv4 辅助定位...");
    try {
      const ipData = await getIPV4Addr();
      if (ipData && ipData.ip) {
        adCodeRes = await getGDAdcodeI(ipData.ip, gdKey);
      }
    } catch (e) {
      console.warn("IPv4 获取失败");
    }
  }

  // 二次校验位置信息
  if (adCodeRes.infocode !== "10000") throw "高德定位失败";

  weatherData.adCode = {
    city: adCodeRes.city || adCodeRes.province || "未知城市",
    adcode: adCodeRes.adcode,
  };

  // 获取天气
  const weatherRes = await getGDWeather(gdKey, weatherData.adCode.adcode);
  if (weatherRes.infocode !== "10000" || !weatherRes.lives?.length) {
    throw "高德天气获取失败";
  }

  const live = weatherRes.lives[0];
  weatherData.weather = {
    weather: live.weather,
    temperature: live.temperature,
    winddirection: live.winddirection,
    windpower: live.windpower,
  };
};

// 主逻辑控制器
const getWeatherData = async () => {
  try {
    // 第一步：尝试腾讯
    try {
      await getTXW();
      return; // 成功则退出
    } catch (e) {
      console.warn("腾讯接口不可用，切换高德:", e);
    }

    // 第二步：尝试高德
    try {
      await getGDW();
      return; // 成功则退出
    } catch (e) {
      console.warn("高德接口不可用:", e);
    }

    // 如果都失败了，抛出最终错误，触发 onError
    throw "所有天气接口均获取失败";

  } catch (error) {
    console.error(error);
    onError("天气信息获取失败");
  }
};

// 错误提示
const onError = (message) => {
  ElMessage({
    message,
    icon: h(Error, {
      theme: "filled",
      fill: "#efefef",
    }),
  });
};

onMounted(() => {
  getWeatherData();
});
</script>