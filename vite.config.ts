import { defineConfig } from "vite";
//çimport react from '@vitejs/plugin-react';

export default defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  devServer: {
    proxy: "http://localhost:5815",
  },
});
