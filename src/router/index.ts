import MDetail from "@/pages/Music/MDetail.vue";
import MForm from "@/pages/Music/MForm.vue";
import TokenService from "@/services/service-token";
import { watch } from "vue";
import { createRouter, createWebHistory } from "vue-router";
const Artist = () => import("@/pages/Artists/Artist.vue");
const Home = () => import("@/pages/Dashboard/Home.vue");
const Music = () => import("@/pages/Music/Music.vue");
const User = () => import("@/pages/User/User.vue");
const UDetail = () => import("@/pages/User/UDetail.vue");
const UForm = () => import("@/pages/User/UForm.vue");
const Detail = () => import("@/pages/Artists/Detail.vue");
const Form = () => import("@/pages/Artists/Form.vue");
const Login = () => import("@/pages/Auth/Login.vue");

watch(
  () => TokenService.getToken(),
  (token) => {
    if (token) {
      console.log("Token is set");
    } else {
      console.log("Token is not set");
    }
  }
);
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
    },
    {
      path: "/users",
      name: "users",
      component: User,
    },
    {
      path: "/users/:id",
      name: "userdetail",
      component: UDetail,
    },
    {
      path: "/users/add",
      name: "adduser",
      component: UForm,
    },
    {
      path: "/artists",
      name: "artists",
      component: Artist,
    },
    {
      path: "/artists/add",
      name: "addartist",
      component: Form,
    },
    {
      path: "/artists/:id",
      name: "artistdetail",
      component: Detail,
    },
    {
      path: "/artists/:id/songs",
      name: "songs",
      component: Music,
    },
    {
      path: "/artists/:id/songs/add",
      name: "addsong",
      component: MForm,
    },
    {
      path: "/artists/:id/songs/:id",
      name: "songdetail",
      component: MDetail,
    },

    {
      path: "/login",
      name: "login",
      component: Login,
      meta: {
        public: true, // Allow access to even if not logged in
        onlyWhenLoggedOut: true,
      },
    },
    {
      path: "/register",
      name: "register",
      component: () => import("@/pages/Auth/Register.vue"),
      meta: {
        public: true,
        onlyWhenLoggedOut: true,
      },
    },
    {
      path: "/:catchAll(.*)*",
      name: "pagenotfound",
      component: () => import("@/pages/NotFound/PageNotFound.vue"),
    },
  ],
});
router.beforeEach((to, from, next) => {
  const isPublic = to.matched.some((record) => record.meta.public);
  const onlyWhenLoggedOut = to.matched.some(
    (record) => record.meta.onlyWhenLoggedOut
  );
  const loggedIn = TokenService.isAuthenticated();
  if (!loggedIn && !!TokenService.getToken()) {
    TokenService.clearToken();
    return next({
      path: "/login",
      query: { redirect: to.fullPath }, // Store the full path to redirect the user to after login
    });
  }
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
// router.beforeEach(loadLayoutMiddleware);
export default router;
