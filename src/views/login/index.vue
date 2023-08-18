<template>
  <div class="container">
    <a-col :span="12">
      <div class="logo">
        <div class="logo-view">
          <img class="logo-size" src="@/assets/images/Logo.png" alt="myy-admin-vue3" />
        </div>
        <span class="welcome">Welcome</span>
        <span class="name">myy-admin-vue3</span>
      </div>
    </a-col>
    <a-col :span="12">
      <div class="content">
        <div class="content-inner">
          <LoginForm />
        </div>
      </div>
    </a-col>
    <div class="footer">
      <Footer />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, onBeforeUnmount } from "vue";
  import Footer from "@/components/footer/index.vue";
  // import LoginBanner from './components/banner.vue';
  import LoginForm from "./components/login-form.vue";

  function computedTransform(num: number, doc: number) {
    return ((num / doc) * 40 - 20).toFixed(1);
  }
  const handleMouseMove = (event: MouseEvent) => {
    const container = document.querySelector(".container") as HTMLElement;
    const logoSize = document.querySelector(".logo-size") as HTMLElement;
    const rect = container.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const angle = Math.atan2(mouseY, mouseX) * (720 / Math.PI);
    container.style.background = `linear-gradient(${angle}deg, #fbda61, #ff5acd)`;
    logoSize.style.transform = `
    rotateX(${computedTransform(event.clientX, window.innerWidth)}deg)
    rotateY(${computedTransform(event.clientY, window.innerHeight)}deg)`;
  };

  onMounted(() => {
    document.addEventListener("mousemove", handleMouseMove);
  });

  onBeforeUnmount(() => {
    document.removeEventListener("mousemove", handleMouseMove);
  });
</script>

<style lang="less" scoped>
  .container {
    display: flex;
    height: 100%;
    background: linear-gradient(45deg, #fbda61, #ff5acd);
    background-size: cover;
    background-repeat: no-repeat;

    .content {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-width: 300px;

      .content-inner {
        width: 366px;
        height: 500px;
        background-color: #fff;
        box-shadow: 1px 1px 15px rgba(0, 0, 0, 0.3);
        border-radius: 30px;
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
      }

      .content-inner::before {
        content: "";
        position: absolute;
        background-image: url("@/assets/images/robot.png");
        background-size: 205px 321px;
        right: -96px;
        top: -22px;
        width: 205px;
        height: 321px;
        z-index: 50;
        animation: floating 3s ease-in-out infinite;
      }

      @keyframes floating {
        0% {
          transform: translateY(0);
        }

        50% {
          transform: translateY(-50px);
        }

        100% {
          transform: translateY(0);
        }
      }
    }

    .footer {
      position: absolute;
      right: 0;
      bottom: 0;
      width: 100%;
    }
  }

  .logo {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-width: 500px;

    .logo-size {
      width: 208px;
      height: 208px;
      border-radius: 50%;
      // background-color: #fff;
      box-shadow: 0px 10px 20px 20px rgba(0, 0, 0, 0.17);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .welcome {
      font-size: 70px;
      font-family: inpinheiti;
      font-weight: 400;
      color: #ffffff;
      margin-top: 62px;
    }

    .name {
      color: #ffffff;
      font-size: 40px;
      font-family: Adobe Heiti Std;
      margin-top: 44px;
    }

    &-text {
      margin-right: 4px;
      margin-left: 4px;
      color: var(--color-fill-1);
      font-size: 20px;
    }
  }
</style>

<style lang="less" scoped>
  // responsive
  @media (max-width: @screen-lg) {
    .container {
      .banner {
        width: 25%;
      }
    }
  }
</style>
