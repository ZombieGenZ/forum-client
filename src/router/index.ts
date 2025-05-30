import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import PostListComponent from '../components/PostListComponent.vue'
import PostDetailComponent from '../components/PostDetailComponent.vue'
import ProfileComponent from '../components/ProfileComponent.vue'
import ManagementComponent from '../components/ManagementComponent.vue'
import TopicManagementComponent from '../components/TopicManagementComponent.vue'
import PostManagementComponent from '../components/PostManagementComponent.vue'

const routes: RouteRecordRaw[] = [
  { path: '/', component: PostListComponent },
  { path: '/posts/:id', component: PostDetailComponent, props: true },
  { path: '/profile/:id', component: ProfileComponent, props: true },
  {
    path: '/management',
    component: ManagementComponent,
    children: [
      { path: '', component: PostManagementComponent },
      { path: 'topics', component: TopicManagementComponent },
      { path: 'posts', component: PostManagementComponent },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
