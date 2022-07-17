<template>
  <div class="wrap">
    <Index />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Index from './components/index.vue';

export default defineComponent({
  components: { Index },
});
</script>

<style lang="less">
@import "./index.less";

.wrap {
  padding: 8px;
}
</style>