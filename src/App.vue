<template>
  <Loading />
  <Background @loadComplete="loadComplete" />
  <Transition name="fade" mode="out-in">
    <main id="main" v-if="store.imgLoadStatus">
      <div class="container" v-show="!store.backgroundShow">
        <section class="all" v-show="!store.setOpenState">

          <div class="layout-box">

            <div class="left-col">
              <div class="content-top">
                <div class="logo-wrapper">
                  <img src="/images/icon/logo.png" class="logo-img" alt="logo" />
                  <div class="logo-text">
                    <span class="title">Imsyy</span>
                    <span class="subtitle">.top</span>
                  </div>
                </div>

                <div class="card-wrapper">
                  <Hitokoto />
                </div>

                <div class="card-wrapper">
                  <Weather />
                </div>
              </div>

              <div class="social-wrapper">
                <SocialLinks />
              </div>
            </div>

            <div class="right-col">
              <div class="links-container" v-show="!store.boxOpenState">
                <Links />
              </div>

              <Box v-show="store.boxOpenState" />
            </div>

          </div>

        </section>

        <section class="more" v-show="store.setOpenState" @click="store.setOpenState = false">
          <MoreSet />
        </section>
      </div>

      <Icon class="menu" size="24" v-show="!store.backgroundShow"
        @click="store.mobileOpenState = !store.mobileOpenState">
        <component :is="store.mobileOpenState ? CloseSmall : HamburgerButton" />
      </Icon>

      <Transition name="fade" mode="out-in">
        <Footer class="f-ter" v-show="!store.backgroundShow && !store.setOpenState" />
      </Transition>
    </main>
  </Transition>
</template>

<script setup>
// 注意这里的 @ 符号和包名
import { helloInit, checkDays } from "@/utils/getTime.js";
import { HamburgerButton, CloseSmall } from "@icon-park/vue-next";
import { mainStore } from "@/store";
import { Icon } from "@vicons/utils";
import { onMounted, onBeforeUnmount, watch, nextTick } from "vue";
import Loading from "@/components/Loading.vue";
import Background from "@/components/Background.vue";
import Footer from "@/components/Footer.vue";
import Box from "@/views/Box/index.vue";
import MoreSet from "@/views/MoreSet/index.vue";
import cursorInit from "@/utils/cursor.js";

// 引入拆分出来的组件
import Hitokoto from "@/components/Hitokoto/index.vue";
import Weather from "@/components/Weather/index.vue";
import SocialLinks from "@/components/SocialLinks/index.vue";
import Links from "@/components/Links/index.vue";

const store = mainStore();

// 页面宽度
const getWidth = () => {
  store.setInnerWidth(window.innerWidth);
};

// 加载完成事件
const loadComplete = () => {
  nextTick(() => {
    helloInit();
    checkDays();
  });
};

// 监听宽度变化
watch(
  () => store.innerWidth,
  (value) => {
    if (value < 990) {
      store.boxOpenState = false;
      store.setOpenState = false;
    }
  },
);

onMounted(() => {
  cursorInit();

  document.oncontextmenu = () => {
    ElMessage({
      message: "为了浏览体验，本站禁用右键",
      grouping: true,
      duration: 2000,
    });
    return false;
  };

  window.addEventListener("mousedown", (event) => {
    if (event.button == 1) {
      store.backgroundShow = !store.backgroundShow;
      ElMessage({
        message: `已${store.backgroundShow ? "开启" : "退出"}壁纸展示状态`,
        grouping: true,
      });
    }
  });

  getWidth();
  window.addEventListener("resize", getWidth);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", getWidth);
});
</script>

<style lang="scss" scoped>
#main {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform: scale(1.2);
  transition: transform 0.3s;
  animation: fade-blur-main-in 0.65s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  animation-delay: 0.5s;

  .container {
    width: 100%;
    height: 100vh;
    margin: 0 auto;
    padding: 0 0.5vw;

    .all {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;

      // === 核心布局样式 ===
      .layout-box {
        width: 100%;
        max-width: 1200px;
        height: 70vh; // 限制高度区域
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center; // 垂直居中对齐
        gap: 40px;
        padding: 0 20px;

        // --- 左侧列 ---
        .left-col {
          flex: 1;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between; // 内容上下分布
          align-items: flex-start;
          color: #fff;

          .content-top {
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 20px;

            // Logo 样式
            .logo-wrapper {
              display: flex;
              align-items: center;
              margin-bottom: 10px;

              .logo-img {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                margin-right: 15px;
                transition: transform 0.3s;

                &:hover {
                  transform: rotate(360deg);
                }
              }

              .logo-text {
                .title {
                  font-size: 2.5rem;
                  font-family: "Pacifico-Regular", sans-serif;
                }

                .subtitle {
                  font-size: 1.2rem;
                  margin-left: 5px;
                }
              }
            }

            // 卡片容器限制宽度
            .card-wrapper {
              width: 100%;
              max-width: 460px; // 限制左侧卡片最大宽度
            }
          }

          // 社交链接
          .social-wrapper {
            width: 100%;
            margin-top: 20px;

            :deep(.social) {
              justify-content: flex-start; // 图标靠左
            }
          }
        }

        // --- 右侧列 ---
        .right-col {
          flex: 1;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;

          .links-container {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center; // 确保 Links 垂直居中
          }

          // 确保 Box (菜单) 也能占满并居中
          :deep(.box) {
            height: auto;
            max-height: 100%;
          }
        }
      }

      // --- 移动端适配 ---
      @media (max-width: 990px) {
        .layout-box {
          flex-direction: column;
          height: auto;
          gap: 30px;
          margin-top: 80px;
          padding-bottom: 100px;

          .left-col {
            align-items: center;
            width: 100%;
            height: auto;

            .content-top {
              align-items: center;

              .logo-wrapper {
                justify-content: center;
              }
            }

            .social-wrapper {
              :deep(.social) {
                justify-content: center;
              }
            }
          }

          .right-col {
            width: 100%;
            height: auto;
          }
        }
      }
    }

    .more {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: #00000080;
      backdrop-filter: blur(20px);
      z-index: 2;
      animation: fade 0.5s;
    }
  }

  // 菜单按钮 & 页脚 & 滚动条样式保持不变
  .menu {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 84%;
    left: calc(50% - 28px);
    width: 56px;
    height: 34px;
    background: rgb(0 0 0 / 20%);
    backdrop-filter: blur(10px);
    border-radius: 6px;
    transition: transform 0.3s;
    animation: fade 0.5s;

    &:active {
      transform: scale(0.95);
    }

    @media (min-width: 991px) {
      display: none;
    }
  }

  .f-ter {
    position: fixed;
    bottom: 20px;
    left: 0;
    width: 100%;
    z-index: 1;
  }
}
</style>