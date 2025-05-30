<script setup lang="ts">
import { onMounted } from 'vue'
import { Tooltip } from 'bootstrap'
import { ColorType } from '../constants/colors.constants.ts'
import { formatDateFull } from '../utils/date.utils.ts'

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  summary: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  user_display_name: {
    type: String,
    required: true,
  },
  user_color: {
    type: Object,
    required: true,
  },
  user_username: {
    type: String,
    required: true,
  },
  user_is_verified: {
    type: Boolean,
    required: true,
  },
  topic_topic: {
    type: String,
    required: true,
  },
  topic_text_color: {
    type: Object,
    required: true,
  },
  topic_background_color: {
    type: Object,
    required: true,
  },
  updated_at: {
    type: Date,
    required: true,
  },
})

const getBackgroundStyle = () => {
  const colorType = props.topic_background_color?.type || ColorType.COLOR_BASIC
  switch (colorType) {
    case ColorType.COLOR_BASIC:
      return { backgroundColor: props.topic_background_color?.color?.color || 'transparent' }
    case ColorType.COLOR_GRADIENT_2:
      return {
        background: `linear-gradient(to right, ${props.topic_background_color?.color?.color1 || '#fff'}, ${props.topic_background_color?.color?.color2 || '#fff'})`,
      }
    case ColorType.COLOR_GRADIENT_3:
      return {
        background: `linear-gradient(to right, ${props.topic_background_color?.color?.color1 || '#fff'}, ${props.topic_background_color?.color?.color2 || '#fff'}, ${props.topic_background_color?.color?.color3 || '#fff'})`,
      }
    case ColorType.COLOR_RAMBOW:
      return {
        background: 'linear-gradient(90deg, red, orange, yellow, green, blue, indigo, violet, red)',
        backgroundSize: '800%',
        animation: 'rainbowAnimation 30s linear infinite',
      }
    default:
      return { backgroundColor: 'transparent' }
  }
}

const getTextColorStyle = () => {
  const textColorType = props.topic_text_color?.type || ColorType.COLOR_BASIC
  switch (textColorType) {
    case ColorType.COLOR_BASIC:
      return { color: props.topic_text_color?.color?.color || '#000' }
    case ColorType.COLOR_GRADIENT_2:
      return {
        background: `linear-gradient(to right, ${props.topic_text_color?.color?.color1 || '#000'}, ${props.topic_text_color?.color?.color2 || '#000'})`,
        backgroundClip: 'text',
        color: 'transparent',
      }
    case ColorType.COLOR_GRADIENT_3:
      return {
        background: `linear-gradient(to right, ${props.topic_text_color?.color?.color1 || '#000'}, ${props.topic_text_color?.color?.color2 || '#000'}, ${props.topic_text_color?.color?.color3 || '#000'})`,
        backgroundClip: 'text',
        color: 'transparent',
      }
    case ColorType.COLOR_RAMBOW:
      return {
        background: 'linear-gradient(90deg, red, orange, yellow, green, blue, indigo, violet, red)',
        backgroundSize: '800%',
        animation: 'rainbowAnimation 30s linear infinite',
        backgroundClip: 'text',
        color: 'transparent',
      }
    default:
      return { color: '#000' }
  }
}

onMounted(() => {
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
  tooltipTriggerList.forEach((tooltipTriggerEl) => {
    new Tooltip(tooltipTriggerEl)
  })
})
</script>

<template>
  <div class="col">
    <div class="card">
      <router-link :to="`/posts/${props.url}`" class="text-decoration-none text-black">
        <h3 class="h3 px-2 pt-2 text-truncate" style="max-width: 100%">
          <div class="px-2 rounded-3" style="display: inline-block" :style="getBackgroundStyle()">
            <span style="font-size: 0.8em" :style="getTextColorStyle()">{{
              props.topic_topic
            }}</span>
          </div>
          {{ props.title }}
        </h3>
        <p
          class="px-2 mb-0"
          style="
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;
            line-clamp: 3;
          "
        >
          {{ props.summary }}
        </p>
      </router-link>
      <hr class="mt-3 mb-1" />
      <div class="row px-2">
        <p class="col mb-1">
          <router-link
            :to="`/profile/${props.user_username}`"
            class="text-decoration-none text-black d-inline"
            style="cursor: pointer"
            >{{ props.user_display_name }}
            <i
              v-if="props.user_is_verified"
              class="bi bi-check-circle-fill"
              style="color: rgb(51, 153, 255)"
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              data-bs-title="Đã xác minh"
            ></i
          ></router-link>
        </p>
        <p class="col mb-1 text-end">{{ formatDateFull(new Date(props.updated_at)) }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes rainbowAnimation {
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 800% 50%;
  }
}
</style>
