<template>
  <div  class="timer-wrapper text-center">
    <div
      v-if="!isExpired"
      class="box-timer-wrapper "
      v-for="count in counter"
      :key="count.title"
    >
      <div class="box-timer">
        <div
          class="time "
        >
          <span >{{
            count.value
          }}</span>
        </div>
        <div
          class="days "
        >
          {{ count.title }}
        </div>
      </div>
      <h1 v-if="count.title !== 'seconds'" class="time-space " >:</h1>
    </div>
      <h1  v-if="isExpired">Congratulations!</h1>
      <canvas style="display: none;" ref="canvas"></canvas>
  </div>
</template>
<script setup>
import { useTimer } from 'vue-timer-hook';
import { onMounted, ref,computed,watch } from "vue";
const props = defineProps({
  time: String
});
const time =  new Date(props.time);
const timer = useTimer(time);
const counter = ref([
  { title: 'days', value: timer.days },
  { title: 'hours', value: timer.hours },
  { title: 'minutes', value: timer.minutes },
  { title: 'seconds', value: timer.seconds },
]);

const isExpired = computed(() => {
  return counter.value[0].value === 0 && counter.value[1].value === 0 && counter.value[2].value === 0 && counter.value[3].value === 0;
});

const canvas = ref(null);
let W = window.innerWidth;
let H = window.innerHeight;
const maxConfettis = 150;
const particles = [];
const possibleColors = [
  "DodgerBlue",
  "OliveDrab",
  "Gold",
  "Pink",
  "SlateBlue",
  "LightBlue",
  "Gold",
  "Violet",
  "PaleGreen",
  "SteelBlue",
  "SandyBrown",
  "Chocolate",
  "Crimson"
];

function randomFromTo(from, to) {
  return Math.floor(Math.random() * (to - from + 1) + from);
}

function confettiParticle() {
  this.x = Math.random() * W;
  this.y = Math.random() * H - H;
  this.r = randomFromTo(11, 33);
  this.d = Math.random() * maxConfettis + 11;
  this.color =
    possibleColors[Math.floor(Math.random() * possibleColors.length)];
  this.tilt = Math.floor(Math.random() * 33) - 11;
  this.tiltAngleIncremental = Math.random() * 0.03 + 0.03;
  this.tiltAngle = 0;

  this.draw = function() {
    const ctx = canvas.value.getContext("2d");
    ctx.beginPath();
    ctx.lineWidth = this.r / 2;
    ctx.strokeStyle = this.color;
    ctx.moveTo(this.x + this.tilt + this.r / 3, this.y);
    ctx.lineTo(this.x + this.tilt, this.y + this.tilt + this.r / 5);
    return ctx.stroke();
  };
}

function Draw() {
  const results = [];

  requestAnimationFrame(Draw);

  const ctx = canvas.value.getContext("2d");
  ctx.clearRect(0, 0, W, H);

  for (let i = 0; i < maxConfettis; i++) {
    results.push(particles[i].draw());
  }

  let particle = {};
  let remainingFlakes = 0;
  for (let i = 0; i < maxConfettis; i++) {
    particle = particles[i];

    particle.tiltAngle += particle.tiltAngleIncremental;
    particle.y += (Math.cos(particle.d) + 3 + particle.r / 2) / 2;
    particle.tilt = Math.sin(particle.tiltAngle - i / 3) * 15;

    if (particle.y <= H) remainingFlakes++;

    if (particle.x > W + 30 || particle.x < -30 || particle.y > H) {
      particle.x = Math.random() * W;
      particle.y = -30;
      particle.tilt = Math.floor(Math.random() * 10) - 20;
    }
  }

  return results;
}

onMounted(() => {
  if(isExpired.value){
    canvas.value.width = W;
    canvas.value.height = H;

    for (let i = 0; i < maxConfettis; i++) {
      particles.push(new confettiParticle());
    }

    Draw();
    canvas.value.style.display = 'block';
  }
});

watch(isExpired, () => {
      if (isExpired.value) {
          canvas.value.width = W;
          canvas.value.height = H;

          for (let i = 0; i < maxConfettis; i++) {
            particles.push(new confettiParticle());
          }

          Draw();

          canvas.value.style.display = 'block';
      }
    }, { deep: true });
</script>
<style scoped>
.timer-wrapper {
  display: flex;
  flex-wrap: wrap; 
  .box-timer-wrapper {
    @media screen and (max-width: 645px) {
      width: 46%;
      &:nth-child(even) {
        justify-content: flex-start;
        width: 46%;
        .time-space {
          display: none;
        }
      }
      &:nth-child(3),
      &:nth-child(4) {
        margin-top: 20px;
        width: 46%; 
      }
    }
  }
  .box-timer {
    width: 98px;
    height: 130px;
    border-radius: 10px;
    text-align: center;
    color: white;
    min-width: 90px;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2);
    @media screen and (min-width: 778px) {
      width: 130px;
    }
    @media screen and (max-width: 645px) {
      width: 70%;
    }
  }
  .time {
    background: var(
      --gradient,
      linear-gradient(251deg, #002646,0%, #000 100%)
    );
    /* 1b6ad5 */
    padding:  0 10px;
    border-radius: 10px 10px 0 0;
    height: 90px;
    span {
      font-size: 50px;
      @media screen and (min-width: 778px) {
        font-size: 60px;
      }
    }
  }
  .time-space {
    color: #a7a7a7;
    margin-right: 20px;
    @media screen and (max-width: 645px) {
      margin-right: 14%

    }
  }
}
.text-center {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2px !important;
  margin: 10px ;
}
.days{
  margin-top: 12px;
  color:black;
  display: flex;
  justify-content: center;
  align-items: center;
}
.box-timer-wrapper {
  display: flex; 
  justify-content: center; 
  align-items: center;
   gap: 30px;
}

</style>
