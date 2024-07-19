<template>
  <div id="prize-mark" ref="prizeMark" v-if="currentPrize">
    <div class="next-prize" :class="enterAnimate">
      <div class="prize-text">
        <h5 class="prize-title">{{ currentPrize.name }}</h5> 
        <h5 class="prize-title">{{currentPrize.otherName}}</h5>
      </div>  
      <div class="prize-img">
        <img :src="currentPrize.img" :alt="currentPrize.otherName">
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import bus from '../libs/bus'
import { lotteryDataStore } from '../store'
const basicData = lotteryDataStore();

// console.log(lotteryData, 'lotteryDatalotteryData')
const currentPrize = computed(() => {
  return basicData.prizes[basicData.currentPrizeIndex];
});
const prizeMark = ref();
const enterAnimate = ref("")
// 显示中奖全部大名单
// const showAllPrizes = () => {
//   let prizeListBox = '';
//   prizeMark.value.style.zIndex = "6";
//   $.confetti.restart(); 
//   var companyContainerHTML = createImageAndTextContainer("http://172.90.0.10/_nuxt/img/logo.acb8f74.png");
//   console.log(basicData.luckyUsers, '展示全部数据')
//   Object.keys(basicData.luckyUsers).forEach((key, index) => {
//       // let luckyDoms = luckyUsersCard[key];
//       let prizeTypeObject = basicData.prizes.find(item => item.type === Number(key));
      
//       let prizeItemsHtml = ''

//       basicData.luckyUsers[key].forEach((luckyItem, luckysIndex) => {
//         prizeItemsHtml += `
//           <div class="prize-list-item">
//             ${companyContainerHTML}
//             <div class="name">${luckyItem[2]}</div>
//             <div class="card-info">
//               <div class="id-card">${luckyItem[1]}</div>
//             </div>
//           </div>
//         `
//       });
//       prizeListBox += `
//         <div class="prize-box">
//           <div class="prize-type-title">${prizeTypeObject['text']}, ${prizeTypeObject['title']}</div>
//           <div class="prize-list">
//             ${prizeItemsHtml}
//           </div> 
//         </div>
//       `;
//   });
//   prizeMark.value.innerHTML = `
//     <div class="prize-list-box slide-in-right">
//       <div class="prize-list-box-title">
//         抽奖已结束，谢谢参与<br />
//         undian telah selesai,terima kasih telah bergabung
//       </div>
//       ${prizeListBox}
//     </div>`
//   setTimeout(() => {
//     autoScrollFn()
//   }, 700)
//   setTimeout(() => {
//     // $.confetti.stop(); 
//   }, 5000)
// }
const showPrize = () => {
  basicData.isShowPrizeMark = true
  let prizeMarkRef = prizeMark.value
  // if (!prizeMark.value) {
  //   prizeMarkRef = document.querySelector('#prize-mark')
  // }
  prizeMarkRef.style.zIndex = "6";
  enterAnimate.value = basicData.currentPrizeIndex < 1 ? "bounce-in-top" : "slide-in-elliptic-top-fwd"
  setTimeout(() => {
    basicData.isNextPrize = false
    // btns.lottery.innerHTML = "开始抽奖 <br/> mulai undian"
    basicData.isLottery = false
    // bus.emit('showPrizeEnd')
  }, 500)
}
const hidePrizeMark = () => {
  enterAnimate.value = '';
  prizeMark.value && (prizeMark.value.style.zIndex = '-2');
  basicData.isShowPrizeMark = false;
}
bus.on('showPrize', showPrize);
// bus.on('showAllPrizes', showAllPrizes);
bus.on('hidePrizeMark', hidePrizeMark);
</script>

<style lang="scss" scoped>
#prize-mark {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.9);
  z-index: -2;
  transition: all .2s;
  display: flex;
  justify-content: center;
  align-items: center;
  /* display: none; */
}
.next-prize {
  display: flex;
  justify-content: center;
  align-items: center;
}
.next-prize .prize-img {
  height: 20vh;
  width: 20vw;
  margin-left: 1vw;
}
.next-prize .prize-img img{
  object-fit: contain;
  width: 100%;
  height: 100%;
}
.next-prize .prize-text {
  max-width: 35vw;
  height: 40vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  /* font-size: 30px; */
  color: #d9534f;
  text-align: right;
}
.next-prize .prize-text .prize-title {
  margin: 0;
  padding: 0;
  margin-left: 2vh;
  font-size: 2.5vh;
}
/* 入场动画 */
/* 动画进入效果 */
.bounce-in-top {
	-webkit-animation: bounce-in-top 1.1s both;
	        animation: bounce-in-top 1.1s both;
}

@keyframes bounce-in-top {
  0% {
    -webkit-transform: translateY(-500px);
            transform: translateY(-500px);
    -webkit-animation-timing-function: ease-in;
            animation-timing-function: ease-in;
    opacity: 0;
  }
  38% {
    -webkit-transform: translateY(0);
            transform: translateY(0);
    -webkit-animation-timing-function: ease-out;
            animation-timing-function: ease-out;
    opacity: 1;
  }
  55% {
    -webkit-transform: translateY(-65px);
            transform: translateY(-65px);
    -webkit-animation-timing-function: ease-in;
            animation-timing-function: ease-in;
  }
  72% {
    -webkit-transform: translateY(0);
            transform: translateY(0);
    -webkit-animation-timing-function: ease-out;
            animation-timing-function: ease-out;
  }
  81% {
    -webkit-transform: translateY(-28px);
            transform: translateY(-28px);
    -webkit-animation-timing-function: ease-in;
            animation-timing-function: ease-in;
  }
  90% {
    -webkit-transform: translateY(0);
            transform: translateY(0);
    -webkit-animation-timing-function: ease-out;
            animation-timing-function: ease-out;
  }
  95% {
    -webkit-transform: translateY(-8px);
            transform: translateY(-8px);
    -webkit-animation-timing-function: ease-in;
            animation-timing-function: ease-in;
  }
  100% {
    -webkit-transform: translateY(0);
            transform: translateY(0);
    -webkit-animation-timing-function: ease-out;
            animation-timing-function: ease-out;
  }
}
.slide-in-elliptic-top-fwd {
	-webkit-animation: slide-in-elliptic-top-fwd 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
	        animation: slide-in-elliptic-top-fwd 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
}
@-webkit-keyframes slide-in-elliptic-top-fwd {
  0% {
    -webkit-transform: translateY(-600px) rotateX(-30deg) scale(0);
            transform: translateY(-600px) rotateX(-30deg) scale(0);
    -webkit-transform-origin: 50% 100%;
            transform-origin: 50% 100%;
    opacity: 0;
  }
  100% {
    -webkit-transform: translateY(0) rotateX(0) scale(1);
            transform: translateY(0) rotateX(0) scale(1);
    -webkit-transform-origin: 50% 1400px;
            transform-origin: 50% 1400px;
    opacity: 1;
  }
}
@keyframes slide-in-elliptic-top-fwd {
  0% {
    -webkit-transform: translateY(-600px) rotateX(-30deg) scale(0);
            transform: translateY(-600px) rotateX(-30deg) scale(0);
    -webkit-transform-origin: 50% 100%;
            transform-origin: 50% 100%;
    opacity: 0;
  }
  100% {
    -webkit-transform: translateY(0) rotateX(0) scale(1);
            transform: translateY(0) rotateX(0) scale(1);
    -webkit-transform-origin: 50% 1400px;
            transform-origin: 50% 1400px;
    opacity: 1;
  }
}


/* 展示全部中间box */
#prize-mark .prize-list-box {
  width: 80vw;
  overflow-y: auto;
  height: 100vh;
}
#prize-mark .prize-list-box .prize-list-box-title {
  padding-top: 200px;
}
#prize-mark .prize-list-box .prize-box:last-child {
  padding-bottom: 100px;
}
#prize-mark .prize-list-box::-webkit-scrollbar {
  display: none;
}
#prize-mark .prize-type-title, #prize-mark .prize-list-box-title {
  font-size: 5vh;
  color: #d9534f;
  text-align: center;
  font-weight: 700;
  margin-top: 60px;
  margin-bottom: 20px;
}
#prize-mark .prize-list {
  display: flex;
  flex-wrap: wrap;
  /* justify-content: center; */
}
#prize-mark .prize-list-box .prize-box:nth-child(2) .prize-list {
  justify-content: center;
}
#prize-mark .prize-list-box .prize-box:nth-child(3) .prize-list {
  justify-content: center;
}
#prize-mark .prize-list-box .prize-box:nth-child(4) .prize-list {
  justify-content: center;
}
#prize-mark .prize-list-box .prize-box:nth-child(5) .prize-list {
  justify-content: center;
}
#prize-mark .prize-list-item {
  transition: background-color 1.5s ease-in 0.3s;
  width: 15vw;
  height: 27vh;
  margin: 0 25px 40px 25px;
  /* background-color: rgba(253, 105, 0, 0.85) !important; */
  box-shadow: 0 0 12px rgba(253, 105, 0, 0.95);
  border: 1px solid rgba(253, 105, 0, 0.5);
  padding: 10px;
  position: relative;
}
#prize-mark .prize-list-item .name {
  font-size: 3.5vh;
  font-weight: bold;
  color: #fff;
  word-break: break-all;
  padding: 0 5px;
  text-align: center;
  margin-top: 30px;
}
#prize-mark .card-info {
  position: absolute;
  bottom: 10px;
  left: 0;
  text-align: center;
  width: 100%;
  text-align: center;
}
#prize-mark .prize-list-item .id-card, #prize-mark  .prize-list-item .company {
  font-size: 2.5vh;
  font-size: 600;
  color: rgba(253, 105, 0, 0.95);
  margin-top: 10px;
}
.slide-in-right {
	-webkit-animation: slide-in-right 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
	        animation: slide-in-right 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
}
@-webkit-keyframes slide-in-right {
  0% {
    -webkit-transform: translateX(1000px);
            transform: translateX(1000px);
    opacity: 0;
  }
  100% {
    -webkit-transform: translateX(0);
            transform: translateX(0);
    opacity: 1;
  }
}
@keyframes slide-in-right {
  0% {
    -webkit-transform: translateX(1000px);
            transform: translateX(1000px);
    opacity: 0;
  }
  100% {
    -webkit-transform: translateX(0);
            transform: translateX(0);
    opacity: 1;
  }
}

</style>