import AppLayout from "@/layouts/AppLayout.vue";
import AuthLayout from "@/layouts/AuthLayout.vue";
import TokenService from "@/services/service-token";
import { createRouter, createWebHistory } from "vue-router";
import { loadLayoutMiddleware } from "./layoutMiddleware";
const Artist = () => import("@/pages/Artists/Artist.vue");
const Home = () => import("@/pages/Dashboard/Home.vue");
const Music = () => import("@/pages/Music/Music.vue");
const User = () => import("@/pages/User/User.vue");

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
      meta: {
        layout: AppLayout,
      },
    },
    {
      path: "/users",
      name: "users",
      component: User,
      meta: {
        layout: AppLayout,
      },
    },
    {
      path: "/artists",
      name: "artists",
      component: Artist,
      meta: {
        layout: AppLayout,
      },
    },
    {
      path: "/songs",
      name: "songs",
      component: Music,
      meta: {
        layout: AppLayout,
      },
    },
    {
      path: "/login",
      name: "login",
      component: () => import("@/pages/Auth/Login.vue"),
      meta: {
        layout: AuthLayout,
        public: true, // Allow access to even if not logged in
        onlyWhenLoggedOut: true,
      },
    },
  ],
});
router.beforeEach((to, from, next) => {
  const isPublic = to.matched.some((record) => record.meta.public);
  const onlyWhenLoggedOut = to.matched.some(
    (record) => record.meta.onlyWhenLoggedOut
  );
  const loggedIn = !!TokenService.getToken();

  if (!isPublic && !loggedIn) {
    return next({
      path: "/login",
      query: { redirect: to.fullPath }, // Store the full path to redirect the user to after login
    });
  }

  // Do not allow user to visit login page or register page if they are logged in
  if (loggedIn && onlyWhenLoggedOut) {
    return next("/");
  }

  next();
});
router.beforeEach(loadLayoutMiddleware);
export default router;
