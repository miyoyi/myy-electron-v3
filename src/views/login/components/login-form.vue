<template>
  <div class="login-form-wrapper">
    <div class="login-form-title">用户登录</div>
    <div class="login-form-error-msg">{{ errorMessage }}</div>
    <a-form
      ref="loginForm"
      :model="userInfo"
      class="login-form"
      layout="vertical"
      @submit="handleSubmit">
      <a-form-item
        field="username"
        :rules="[{ required: true, message: '帐号不能为空' }]"
        :validate-trigger="['change', 'blur']"
        label="账户">
        <a-input v-model="userInfo.username" placeholder="请输入登录帐号">
          <template #prefix>
            <icon-user />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item
        field="password"
        :rules="[{ required: true, message: '密码不能为空' }]"
        :validate-trigger="['change', 'blur']"
        label="密码">
        <a-input-password v-model="userInfo.password" placeholder="请输入登录密码" allow-clear>
          <template #prefix>
            <icon-lock />
          </template>
        </a-input-password>
      </a-form-item>
      <a-space :size="16" direction="vertical">
        <a-button type="primary" html-type="submit" class="btn" long :loading="loading">
          登录
        </a-button>
      </a-space>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive } from "vue";
  import { useRouter } from "vue-router";
  import { Message } from "@arco-design/web-vue";
  import { ValidatedError } from "@arco-design/web-vue/es/form/interface";
  import { useStorage } from "@vueuse/core";
  import { useAppStore, useUserStore } from "@/store";
  import useLoading from "@/hooks/loading";
  import { DEFAULT_ROUTE_NAME } from "@/router/constants";
  import type { LoginData } from "@/api/modules/accountApi";

  const router = useRouter();
  const errorMessage = ref("");
  const { loading, setLoading } = useLoading();
  const userStore = useUserStore();

  const loginConfig = useStorage("login-config", {
    rememberPassword: true,
    username: "admin", // 演示默认值
    password: "admin" // demo default value
  });
  const userInfo = reactive({
    username: loginConfig.value.username,
    password: loginConfig.value.password
  });

  const handleSubmit = async ({
    errors,
    values
  }: {
    errors: Record<string, ValidatedError> | undefined;
    values: Record<string, any>;
  }) => {
    window.ipc.send("flash", true);
    if (loading.value) return;
    if (!errors) {
      setLoading(true);
      try {
        await userStore.login(values as LoginData);
        const appStore = useAppStore();
        await appStore.resetRouter(router);
        const { redirect, ...othersQuery } = router.currentRoute.value.query;
        await router.push({
          name: (redirect as string) || DEFAULT_ROUTE_NAME,
          query: {
            ...othersQuery
          }
        });
        window.ipc.send("navBar", "big");
        Message.success("登录成功!");
      } catch (err) {
        errorMessage.value = (err as Error).message;
      } finally {
        setLoading(false);
      }
    }
  };
</script>

<style lang="less" scoped>
  .login-form {
    margin-top: 40px;
    &-wrapper {
      width: 320px;
    }

    &-title {
      color: var(--color-text-1);
      font-weight: 500;
      font-size: 24px;
      line-height: 32px;
    }

    &-sub-title {
      color: var(--color-text-3);
      font-size: 16px;
      line-height: 24px;
    }

    &-error-msg {
      height: 32px;
      color: rgb(var(--red-6));
      line-height: 32px;
    }

    &-password-actions {
      display: flex;
      justify-content: space-between;
    }

    &-register-btn {
      color: var(--color-text-3) !important;
    }
  }
  .login-form-title {
    color: #ffc0cb;
    font-family: PingFang SC;
    font-size: 24px;
    margin-top: 97px;
    position: relative;
  }
  .login-form-title::before {
    content: "";
    width: 42px;
    height: 4px;
    background: #ffc0cb;
    position: absolute;
    border-radius: 3px;
    left: 0px;
    bottom: -6px;
  }
  ::v-deep(.arco-input-wrapper) {
    background: #fff;
    color: #ffc0cb;
    border-top: 0 none;
    border-left: 0 none;
    border-right: 0 none;
    border-bottom: 1px solid #ffc0cb;
  }
  ::v-deep(.arco-input-wrapper:focus) {
    border-top: 0 none;
    border-bottom: 1px solid #ffc0cb;
  }
  ::v-deep(.arco-form-item-label-required-symbol) {
    visibility: hidden;
  }
  ::v-deep(.arco-form-item-label),
  ::v-deep(.arco-input-prefix) {
    color: #ffc0cb;
  }
  .btn {
    width: 100%;
    height: 44px;
    background: #ffc0cb;
    border-radius: 22px;
    margin-top: 60px;
  }
</style>
