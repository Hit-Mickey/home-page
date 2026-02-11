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
  // 修改1：使用 calc 计算高度，减去顶部和底部预留高度(约160px)
  // 这样能确保 .links 容器真的位于屏幕中间区域
  height: calc(100vh - 160px);
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center; // 垂直居中
  align-items: center; // 水平居中

  // 移动端适配
  @media (max-width: 720px) {
    height: auto;
    margin-top: 20px;
    display: block;
  }

  // 新增：包裹层宽度控制
  .content-wrapper {
    width: 100%;
  }

  .section-wrapper {
    margin-bottom: 20px; // 版块间距
    width: 100%;

    // 如果是最后一个版块，去掉底部间距，让居中更精确
    &:last-child {
      margin-bottom: 0;
    }
  }

  .line {
    margin: 0 0.25rem 0.5rem; // 减小标题的上下间距
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
    padding: 0 10px; // 稍微给点内边距
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

  // 修改2：彻底移除固定高度，改为自适应
  .link-all {
    height: auto !important; // 强制高度自适应
    min-height: 0; // 清除最小高度

    // 内容垂直居中
    display: flex;
    flex-wrap: wrap;
    justify-content: center; // 图标水平居中

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
      margin-bottom: 15px; // 适度调整卡片下方的间距

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
          font-size: 12px; // 推荐 12px，如果一定要大字体再改成 14px 或 16px
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

          &.ipv6 {
            background-color: #67c23a;
          }

          &.ipv4 {
            background-color: #409eff;
          }

          &.vlan {
            background-color: #e6a23c;
          }

          &.lan {
            background-color: #909399;
          }
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