<template>
  <div class="links">
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

// 图标映射
const siteIcon = {
  Blog, Cloud, CompactDisc, Compass, Book, Fire, LaptopCode, Home
};

// --- 子组件 ---
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

    return () => h('div', { class: 'item cards', onClick: () => jumpLink(props.item) }, [
      h('div', { class: 'main-content' }, [
        h(Icon, { size: 26 }, () => h(siteIcon[props.item.icon] || Link)),
        h('span', { class: 'name text-hidden' }, props.item.name)
      ]),
      h('div', { class: 'network-tags' }, [
        props.item.ipv6 ? h('a', { href: props.item.ipv6, target: '_blank', class: 'tag ipv6', onClick: (e) => e.stopPropagation() }, 'v6') : null,
        props.item.ipv4 ? h('a', { href: props.item.ipv4, target: '_blank', class: 'tag ipv4', onClick: (e) => e.stopPropagation() }, 'v4') : null,
        props.item.vlan ? h('a', { href: props.item.vlan, target: '_blank', class: 'tag vlan', onClick: (e) => e.stopPropagation() }, 'VLAN') : null,
        props.item.lan ? h('a', { href: props.item.lan, target: '_blank', class: 'tag lan', onClick: (e) => e.stopPropagation() }, '内网') : null,
      ])
    ]);
  }
});

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
  // 修改核心：强制最小高度为 80vh，确保有足够空间来居中
  min-height: 80vh;
  width: 100%; // 确保宽度占满
  display: flex;
  flex-direction: column;
  justify-content: center; // 垂直居中

  // 在移动端取消强制高度，避免布局溢出
  @media (max-width: 720px) {
    min-height: auto;
    padding-top: 20px; // 移动端给一点顶部间距
  }

  .section-wrapper {
    margin-bottom: 30px;
    width: 100%; // 确保内容宽度正常
  }

  .line {
    margin: 1rem 0.25rem 1rem;
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
    // 这里保持默认或根据内容自动撑开
    // height: 240px; // 如果内容较少，可以去掉固定高度，或者保留
    min-height: 240px; // 改为 min-height 防止内容被截断

    // 内容垂直居中
    display: flex;
    align-content: center;
    flex-wrap: wrap;

    :deep(.item) {
      height: 110px;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 6px 10px;
      animation: fade 0.5s;
      position: relative;
      margin-bottom: 20px;

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
        margin-bottom: 8px;

        .name {
          font-size: 1.1rem;
          margin-left: 8px;
        }
      }

      .network-tags {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 6px;
        width: 100%;

        .tag {
          font-size: 16px;
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

          // &.ipv6 {
          //   background-color: #67c23a;
          // }

          // &.ipv4 {
          //   background-color: #409eff;
          // }

          // &.vlan {
          //   background-color: #e6a23c;
          // }

          // &.lan {
          //   background-color: #909399;
          // }
        }
      }

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