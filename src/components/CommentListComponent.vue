<script setup lang="ts">
import CommentCardComponent from './CommentCardComponent.vue'

const props = defineProps({
  commentList: {
    type: Object,
    required: true,
  },
})
console.log(props)
</script>

<template>
  <div>
    <div class="row row-cols-1 g-3 mt-2">
      <CommentCardComponent
        v-for="comment in props.commentList"
        :key="comment._id"
        :_id="comment._id"
        :content="comment.content"
        :user_display_name="comment.user.display_name"
        :user_color="comment.user.color"
        :user_username="comment.user.username"
        :user_is_verified="comment.user.is_verified"
        :can_edit="comment.can_edit"
        :updated_at="comment.updated_at"
      ></CommentCardComponent>
    </div>
  </div>
</template>
