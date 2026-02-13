<template>
  <div class="links">
    <div class="content-wrapper">

      <div v-if="homeLinksList.length > 0" class="section-wrapper">
        <div class="line">
          <Icon size="20">
            <Home />
          </Icon>
          <span class="title">家庭服务器</span>
        </div>

        <Swiper :modules="[Pagination, Mousewheel]" :slides-per-view="1" :space-between="40"
          :pagination="{ clickable: true, bulletElement: 'div' }" :mousewheel="true" class="my-swiper">
          <SwiperSlide v-for="(page, index) in homeLinksList" :key="'home-' + index">
            <el-row class="link-all" :gutter="20" justify="center">
              <el-col v-for="item in page" :span="8" :key="item.name">
                <LinkItem :item="item" />
              </el-col>
            </el-row>
          </SwiperSlide>
        </Swiper>
      </div>

      <div v-if="cloudLinksList.length > 0" class="section-wrapper">
        <div class="line">
          <Icon size="20">
            <Cloud />
          </Icon>
          <span class="title">雨云服务器</span>
        </div>

        <Swiper :modules="[Pagination, Mousewheel]" :slides-per-view="1" :space-between="40"
          :pagination="{ clickable: true, bulletElement: 'div' }" :mousewheel="true" class="my-swiper">
          <SwiperSlide v-for="(page, index) in cloudLinksList" :key="'cloud-' + index">
            <el-row class="link-all" :gutter="20" justify="center">
              <el-col v-for="item in page" :span="8" :key="item.name">
                <LinkItem :item="item" />
              </el-col>
            </el-row>
          </SwiperSlide>
        </Swiper>
      </div>

    </div>
  </div>
</template>

<script setup>
import { computed, defineComponent, h } from "vue";
import { Icon } from "@vicons/utils";
import {
  Link, Blog, CompactDisc, Cloud, Compass, Book, Fire, LaptopCode, Home
} from "@vicons/fa";
import { mainStore } from "@/store";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Pagination, Mousewheel } from "swiper/modules";
import siteLinksData from "@/assets/siteLinks.json";

const store = mainStore();

const siteIcon = {
  Blog, Cloud, CompactDisc, Compass, Book, Fire, LaptopCode, Home
};

// --- 子组件 LinkItem 修改开始 ---
const LinkItem = defineComponent({
  props: ['item'],
  setup(props) {
    const jumpLink = (data) => {
      if (data.name === "音乐" && store.musicClick) {
        if (typeof $openList === "function") $openList();
      } else {
        window.open(data.link, "_blank");
      }
    };

    // return () => h('div', { class: 'item cards', onClick: () => jumpLink(props.item) }, [
    return () => h('div', { class: 'item cards' }, [
      // 上半部分：图标和名称
      h('div', { class: 'main-content' }, [
        h(Icon, { size: 26 }, () => h(siteIcon[props.item.icon] || Link)),
        h('span', { class: 'name text-hidden' }, props.item.name)
      ]),

      // 下半部分：网络标签（所有标签平铺在一行）
      h('div', { class: 'network-tags' }, [
        props.item.ipv6 ? h('a', { href: props.item.ipv6, target: '_blank', class: 'tag ipv6', onClick: (e) => e.stopPropagation() }, 'v6') : null,
        props.item.ipv4 ? h('a', { href: props.item.ipv4, target: '_blank', class: 'tag ipv4', onClick: (e) => e.stopPropagation() }, 'v4') : null,
        props.item.vlan ? h('a', { href: props.item.vlan, target: '_blank', class: 'tag vlan', onClick: (e) => e.stopPropagation() }, 'VLAN') : null,
        props.item.lan ? h('a', { href: props.item.lan, target: '_blank', class: 'tag lan', onClick: (e) => e.stopPropagation() }, 'LAN') : null,
      ])
    ]);
  }
});
// --- 子组件 LinkItem 修改结束 ---

const chunkData = (arr) => {
  const result = [];
  if (!arr) return result;
  for (let i = 0; i < arr.length; i += 6) {
    result.push(arr.slice(i, i + 6));
  }
  return result;
};

const homeLinksList = computed(() => chunkData(siteLinksData.home));
const cloudLinksList = computed(() => chunkData(siteLinksData.cloud));
</script>

<style lang="scss" scoped>
.links {
  height: calc(100vh - 160px);
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  @media (max-width: 720px) {
    height: auto;
    margin-top: 20px;
    display: block;
  }

  .content-wrapper {
    width: 100%;
  }

  .section-wrapper {
    margin-bottom: 20px;
    width: 100%;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .line {
    margin: 0 0.25rem 0.5rem;
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
    width: 100%;
    padding: 0 10px;
    z-index: 0;

    .swiper-pagination {
      position: relative;
      margin-top: 10px;
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
    height: auto !important;
    min-height: 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;

    :deep(.item) {
      height: 110px;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 6px 10px 6px 10px; //含义：上6px，右10px，下15px，左10px
      animation: fade 0.5s;
      position: relative;
      margin-bottom: 15px;

      &:hover {
        transform: scale(1.02);
        background: rgb(0 0 0 / 40%);
        transition: 0.3s;
      }

      .main-content {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        cursor: pointer;
        margin-bottom: 16px; //控制Nginxui和底部链接的间距

        .name {
          font-size: 1.1rem;
          margin-left: 8px;
          font-family: inherit;
        }
      }

      // --- 样式修改开始 ---
      .network-tags {
        display: flex;
        flex-direction: row; // 改为水平排列
        align-items: center;
        justify-content: center;
        width: 100%;
        gap: 10px; // 标签之间的间距

        .tag {
          font-size: 12px; // 保持原有字体大小
          padding: 2px 4px; // 减小左右内边距 (原为8px)，确保一行能放下4个
          border-radius: 6px;
          text-decoration: none;
          line-height: 1.2;
          transition: all 0.3s;
          font-family: inherit;
          font-weight: normal;
          color: inherit;
          white-space: nowrap; // 防止文字换行

          // 统一的磨砂风格样式
          background-color: rgba(255, 255, 255, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(4px);

          &:hover {
            background-color: rgba(255, 255, 255, 0.3);
            border-color: rgba(255, 255, 255, 0.4);
            transform: translateY(-1px);
          }
        }
      }

      // --- 样式修改结束 ---

      @media (min-width: 720px) and (max-width: 820px) {
        .name {
          display: none;
        }
      }

      @media (max-width: 720px) {
        height: 100px;

        .main-content {
          margin-bottom: 4px;
        }
      }

      @media (max-width: 460px) {
        .main-content {
          flex-direction: column;

          .name {
            font-size: 1rem;
            margin-left: 0;
            margin-top: 4px;
          }
        }
      }
    }
  }
}
</style>