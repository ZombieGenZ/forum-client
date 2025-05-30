<script setup lang="ts">
import PostContentComponent from './PostContentComponent.vue'
import InfomationBarComponent from './InfomationBarComponent.vue'

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <div class="container-fluid">
    <div class="row p-3">
      <div class="row g-3">
        <div class="col-12 col-md-9">
          <PostContentComponent :url="props.id"></PostContentComponent>
        </div>
        <div class="col-12 col-md-3">
          <InfomationBarComponent></InfomationBarComponent>
        </div>
      </div>
    </div>
  </div>
</template>
