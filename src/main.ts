import { createApp } from "vue";
import App from "./App.vue";
import ElementPlus from "element-plus";
import Vue3DraggableResizable from "vue3-draggable-resizable";

// styles
import "./styles/element/index.scss";
import "vue3-draggable-resizable/dist/Vue3DraggableResizable.css";

const app = createApp(App);
app.use(ElementPlus);
app.use(Vue3DraggableResizable);
app.mount("#app");
