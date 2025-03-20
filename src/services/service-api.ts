const auth = {
  login: "/auth/login",
  register: "/users/register",
  initData: "/users/init",
};

const users = {
  index: "/users",
  byId: "/users/:id",
  delete: "/users/:id",
  changePassword: "/users/change-password",
};

const artists = {
  index: "/artists",
  byId: "/artists/:id",
  create: "/artists",
  delete: "/artists/:id",
  update: "/artists/:id",
  bulkUpload: "/artists/upload",
  export: "/artists/export",
};
const music = {
  index: "music/show_by_artist/:id",
  byId: "/music/:id",
  create: "/music",
  delete: "/music/:id",
  update: "/music/:id",
};
const dashboard = {
  index: "/dashboard",
};

export const api = {
  auth,
  users,
  artists,
  music,
  dashboard,
};
