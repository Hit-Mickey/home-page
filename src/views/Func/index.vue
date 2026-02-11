<template>
  <div :class="store.mobileFuncState ? 'function mobile' : 'function'">
    <el-row :gutter="20">
      <el-col :span="12">
        <div class="left">
          <Hitokoto />
          <Music v-if="playerHasId" />
        </div>
      </el-col>
      <el-col :span="12">
        <div class="right cards">
          <div class="time">
            <div class="date">
              <span>{{ currentTime.year }}&nbsp;年&nbsp;</span>
              <span>{{ currentTime.month }}&nbsp;月&nbsp;</span>
              <span>{{ currentTime.day }}&nbsp;日&nbsp;</span>
              <span class="sm-hidden">{{ currentTime.weekday }}</span>
            </div>
            <div class="text">
              <span> {{ currentTime.hour }}:{{ currentTime.minute }}:{{ currentTime.second }}</span>
            </div>
          </div>
          <Weather />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { getCurrentTime } from "@/utils/getTime";
import { mainStore } from "@/store";
import Music from "@/components/Music.vue";
import Hitokoto from "@/components/Hitokoto.vue";
import Weather from "@/components/Weather.vue";
import { ref, onMounted, onBeforeUnmount } from "vue";

const store = mainStore();

// 当前时间
const currentTime = ref({});
const timeInterval = ref(null);

// 播放器 id
const playerHasId = import.meta.env.VITE_SONG_ID;

// 更新时间
const updateTimeData = () => {
  currentTime.value = getCurrentTime();
};

onMounted(() => {
  updateTimeData();
  timeInterval.value = setInterval(updateTimeData, 1000);
});

onBeforeUnmount(() => {
  clearInterval(timeInterval.value);
});
</script>

<style lang="scss" scoped>
.function {
  // --- 修改 1: 移除固定高度 165px，改为自适应 ---
  height: auto;

  // --- 修改 2: 使用 margin-top 让模块整体下移 (数值可根据需要调整) ---
  margin-top: 50px;

  // --- 修改 3: 压缩模块底部的外边距，缩短与下方服务器模块的间隔 ---
  margin-bottom: 0px;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  &.mobile {
    .el-row {
      .el-col {
        &:nth-of-type(1) {
          display: contents;
        }

        &:nth-of-type(2) {
          display: none;
        }
      }
    }
  }

  .el-row {
    width: 100%;
    margin: 0 !important;

    .el-col {
      &:nth-of-type(1) {
        padding-left: 0 !important;
      }

      &:nth-of-type(2) {
        padding-right: 0 !important;
      }

      @media (max-width: 910px) {
        &:nth-of-type(1) {
          display: none;
        }

        &:nth-of-type(2) {
          padding: 0 !important;
          flex: none;
          max-width: none;
          width: 100%;
        }
      }
    }

    .left,
    .right {
      width: 100%;
      height: 100%;
    }

    .right {
      // --- 修改 4: 缩小内边距，让卡片更紧凑 ---
      padding: 15px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      // --- 修改 5: 进一步缩小时钟和天气文字之间的间距 ---
      gap: 10px;

      animation: fade 0.5s;

      .time {
        font-size: 1.1rem;
        text-align: center;

        .date {
          text-overflow: ellipsis;
          overflow-x: hidden;
          white-space: nowrap;
        }

        .text {
          // --- 修改 6: 稍微减小数字字体的间距 ---
          margin-top: 5px;
          font-size: 3.25rem;
          letter-spacing: 2px;
          font-family: "UnidreamLED";
        }

        @media (min-width: 1201px) and (max-width: 1280px) {
          font-size: 1rem;
        }

        @media (min-width: 911px) and (max-width: 992px) {
          font-size: 1rem;

          .text {
            font-size: 2.75rem;
          }
        }
      }

      .weather {
        text-align: center;
        width: 100%;
        text-overflow: ellipsis;
        overflow-x: hidden;
        white-space: nowrap;
      }
    }
  }
}
</style>