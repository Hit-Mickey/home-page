<template>
  <div v-if="siteLinks[0]" class="links">
    <div class="line">
      <Icon size="20">
        <Link />
      </Icon>
      <span class="title">网站列表</span>
    </div>
    <Swiper v-if="siteLinks[0]" :modules="[Pagination, Mousewheel]" :slides-per-view="1" :space-between="40"
      :pagination="{
        el: '.swiper-pagination',
        clickable: true,
        bulletElement: 'div',
      }" :mousewheel="true">
      <SwiperSlide v-for="(site, index) in siteLinksList" :key="index">
        <el-row class="link-all" :gutter="20">
          <el-col v-for="item in site" :span="8" :key="item.name">
            <div class="item cards" :style="index < 3 ? 'margin-bottom: 20px' : null">
              <div class="main-content" @click="jumpLink(item)">
                <Icon size="26">
                  <component :is="siteIcon[item.icon]" />
                </Icon>
                <span class="name text-hidden">{{ item.name }}</span>
              </div>

              <div class="network-tags">
                <a v-if="item.ipv6" :href="item.ipv6" target="_blank" class="tag ipv6" @click.stop>v6</a>
                <a v-if="item.ipv4" :href="item.ipv4" target="_blank" class="tag ipv4" @click.stop>v4</a>
                <a v-if="item.vlan" :href="item.vlan" target="_blank" class="tag vlan" @click.stop>VLAN</a>
                <a v-if="item.intranet" :href="item.intranet" target="_blank" class="tag intra" @click.stop>内网</a>
              </div>
            </div>
          </el-col>
        </el-row>
      </SwiperSlide>
      <div class="swiper-pagination" />
    </Swiper>
  </div>
</template>

<script setup>
import { Icon } from "@vicons/utils";
// 可前往 https://www.xicons.org 自行挑选并在此处引入
import {
  Link,
  Blog,
  CompactDisc,
  Cloud,
  Compass,
  Book,
  Fire,
  LaptopCode,
} from "@vicons/fa"; // 注意使用正确的类别
import { mainStore } from "@/store";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Pagination, Mousewheel } from "swiper/modules";
import { computed, onMounted } from "vue"; // 补充引入 computed 和 onMounted
import siteLinks from "@/assets/siteLinks.json";

const store = mainStore();

// 计算网站链接
const siteLinksList = computed(() => {
  const result = [];
  for (let i = 0; i < siteLinks.length; i += 6) {
    const subArr = siteLinks.slice(i, i + 6);
    result.push(subArr);
  }
  return result;
});

// 网站链接图标
const siteIcon = {
  Blog,
  Cloud,
  CompactDisc,
  Compass,
  Book,
  Fire,
  LaptopCode,
};

// 链接跳转
const jumpLink = (data) => {
  if (data.name === "音乐" && store.musicClick) {
    if (typeof $openList === "function") $openList();
  } else {
    window.open(data.link, "_blank");
  }
};

onMounted(() => {
  console.log(siteLinks);
});
</script>

<style lang="scss" scoped>
.links {
  .line {
    margin: 2rem 0.25rem 1rem;
    font-size: 1.1rem;
    display: flex;
    align-items: center;
    animation: fade 0.5s;

    .title {
      margin-left: 8px;
      font-size: 1.15rem;
      text-shadow: 0 0 5px #00000050;
    }
  }

  .swiper {
    left: -10px;
    width: calc(100% + 20px);
    padding: 5px 10px 0;
    z-index: 0;

    .swiper-slide {
      height: 100%;
    }

    .swiper-pagination {
      margin-top: 12px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;

      :deep(.swiper-pagination-bullet) {
        background-color: #fff;
        width: 20px;
        height: 4px;
        margin: 0 4px;
        border-radius: 4px;
        opacity: 0.2;
        transition: opacity 0.3s;

        &.swiper-pagination-bullet-active {
          opacity: 1;
        }

        &:hover {
          opacity: 1;
        }
      }
    }
  }

  .link-all {
    height: 240px; // 稍微增加高度以容纳按钮

    .item {
      height: 110px; // 增加卡片高度
      width: 100%;
      display: flex;
      flex-direction: column; // 改为纵向排列
      align-items: center;
      justify-content: center;
      padding: 6px 10px;
      animation: fade 0.5s;
      position: relative;

      &:hover {
        transform: scale(1.02);
        background: rgb(0 0 0 / 40%);
        transition: 0.3s;
      }

      &:active {
        transform: scale(1);
      }

      // 主体内容样式
      .main-content {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        cursor: pointer;
        margin-bottom: 8px; // 与下方按钮的间距

        .name {
          font-size: 1.1rem;
          margin-left: 8px;
        }
      }

      // 网络标签组样式
      .network-tags {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 6px; // 按钮之间的间距
        width: 100%;

        .tag {
          font-size: 0.7rem; // 字体改小
          padding: 2px 6px;
          border-radius: 4px;
          text-decoration: none;
          color: #fff;
          font-weight: bold;
          transition: opacity 0.2s;
          line-height: 1.2;

          &:hover {
            opacity: 0.8;
          }

          // 定义不同类型的颜色
          &.ipv6 {
            background-color: #67c23a; // 绿色
          }

          &.ipv4 {
            background-color: #409eff; // 蓝色
          }

          &.vlan {
            background-color: #e6a23c; // 橙色
          }

          &.intra {
            background-color: #909399; // 灰色
          }
        }
      }

      // 媒体查询适配
      @media (min-width: 720px) and (max-width: 820px) {
        .name {
          display: none;
        }
      }

      @media (max-width: 720px) {
        height: 100px; // 移动端稍微小一点

        .main-content {
          margin-bottom: 4px;
        }
      }

      @media (max-width: 460px) {
        .main-content {
          flex-direction: column; // 极小屏幕图标和文字竖排

          .name {
            font-size: 1rem;
            margin-left: 0;
            margin-top: 4px;
          }
        }
      }
    }

    @media (max-width: 720px) {
      height: 200px;
    }
  }
}
</style>