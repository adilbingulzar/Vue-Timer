import { defineCustomElement } from "vue";
import countDownTimer from "./components/countDown-Timer.ce.vue";
export const Timer = defineCustomElement(countDownTimer);

// Optional: Provide an easy way to register the custom element.
export function register(tagName = "count-down") {
  customElements.define(tagName, Timer);
}
