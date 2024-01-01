
/**
 * 创建元素
 */
// export const createElement = (css, text) => {
//   let dom = document.createElement("div");
//   dom.className = css || "";
//   dom.innerHTML = text || "";
//   return dom;
// }
// // 获取元素dom
// var createdElements = {};
// function getElement(id) {
//   if (!createdElements[id]) {
//     createdElements[id] = createElement();
//     createdElements[id].id = "card-" + id;
//   }
//   return createdElements[id];
// }

// // 添加类名和属性
// export const addClassesAndStyles = (element, isBold, showTable) => {
//   if (isBold) {
//     element.classList.add("element", "lightitem");
//     if (showTable) {
//       element.classList.add("highlight");
//     }
//   } else {
//     element.className = "element";
//     element.style.cssText =
//       "background-repeat: no-repeat; " +
//       "background-size: 100% 120%; " +
//       "background-position: center center; " +
//       "background-color: rgba(0,127,127," +
//       (Math.random() * 0.7 + 0.25) +
//       ")";
//   }
// }

// // 创建标题logo和公司标识
// export const createImageAndTextContainer = (imageSrc) => {
//   var imageStyle = `
//     width: 100%;
//     height: 20px;
//     object-fit: contain;
//   `;

//   return `
//     <div class="image-text-container">
//       <img src="${imageSrc}" style="${imageStyle}">
//     </div>
//   `;
// }
export const  getCardHTML = (user, basicData, isLucky) => {
  const cardConfigStyle = isLucky ? basicData.luckyCardConfigStyle : basicData.cardConfigStyle;
  // var companyContainerHTML = createImageAndTextContainer("http://172.90.0.10/_nuxt/img/logo.acb8f74.png");
  var companyElementHTML = `
    <div 
      class="company"
      style="
        top: ${cardConfigStyle.companyTop};
        font-size: ${cardConfigStyle.companyFontSize};
      ">
      <div class="image-text-container">
        <img 
          src="${cardConfigStyle.logo}" 
          style="${cardConfigStyle.imgWidth};
          height: ${cardConfigStyle.imgHeight};
          object-fit: contain;">
      </div>
    </div>`;
  var avatarElementHTML = `<div 
          class="avatar"
          style="height: 100%;
          display: flex;
          position: relative;
          justify-content: center;
          align-items: center;
          z-index: -1">
          <div style="width: 100%;height: 100%;background-color: rgba(0,0,0,0.1);position: absolute;top: 0;left:0;"></div>
      </div>`;
  var nameElementHTML = `
    <div 
      style="
        width: 100%;
        top: ${cardConfigStyle.nameTop};
        font-size: ${cardConfigStyle.nameFontSize}; 
        line-height: ${cardConfigStyle.nameFontSize};
      "
      class="name">${user[2]}</div>`;
  
  var detailsElementHTML = `
      <div 
        style="
          width: 100%;
          bottom: ${cardConfigStyle.detailsBottom};
          font-size: ${cardConfigStyle.detailsFontSize};
          line-height: ${cardConfigStyle.detailsFontSize};
        "
        class="details">
          <span class="cardIdTxt" id="card-${user[0]}">${user[0]}</span>
          <div style="height: ${'calc(' + cardConfigStyle.detailsFontSize + ' + -4px)'}"></div>
          <span 
            id="user-dept">${user[1]}</span>
      </div>`;

  var cardHTML = `
    ${companyElementHTML}
    ${avatarElementHTML}
    ${nameElementHTML}
    ${detailsElementHTML}
  `;
  return cardHTML
}

export const getCardWithParentHtml = (user, isBold, id, showTable, row_column, basicData, isLucky) => {
  let elementClassName = '';
  let elementCss = '';
  const cardConfigStyle = isLucky? basicData.luckyCardConfigStyle : basicData.cardConfigStyle;
  if (isBold) {
    elementClassName = "element lightitem";
    if (showTable) {
      elementClassName += ' highlight';
    }
  } else {
    elementClassName = "element";
    elementCss = "background-repeat: no-repeat; " +
      "background-size: 100% 120%; " +
      "background-position: center center; " +
      "background-color: rgba(0,127,127," +
      (Math.random() * 0.7 + 0.25) +
      ");";
  }

  elementCss += `
    width: ${cardConfigStyle.cardWidth};
    height: ${cardConfigStyle.cardHeight};
  `
  return `
    <div id="${"card-" + id}" class="${elementClassName} bind-user-${user[0]}" style="${elementCss}">
       ${getCardHTML(user, basicData, isLucky)} 
    </div>
  `
}

export const createCardWithParentDom = (user, isBold, id, showTable, row_column, basicData) => {
  let elementClassName = '';
  let elementCss = '';
  const cardConfigStyle = basicData.cardConfigStyle;
  if (isBold) {
    elementClassName = "element lightitem";
    if (showTable) {
      elementClassName += ' highlight';
    }
  } else {
    elementClassName = "element";
    elementCss = "background-repeat: no-repeat; " +
      "background-size: 100% 120%; " +
      "background-position: center center; " +
      "background-color: rgba(0,127,127," +
      (Math.random() * 0.7 + 0.25) +
      ");";
  }

  elementCss += `
    width: ${cardConfigStyle.cardWidth};
    height: ${cardConfigStyle.cardHeight};
  `
  let dom = document.createElement("div");
  dom.id = "card-" + id;
  dom.className = elementClassName + ` bind-user-${user[0]}`;
  dom.style = elementCss;
  dom.innerHTML = getCardHTML(user, basicData);
  return dom
}

// export const createCard = (user, isBold, id, showTable, row_column, basicData) => {
//   var element = getElement(id);
//   addClassesAndStyles(element, isBold, showTable, row_column);
//   element.innerHTML = getCardHTML(user, basicData);
  
//   return element;
// }

/**
 * 随机抽奖
 */
export const random = (num) => {
  // Math.floor取到0-num-1之间数字的概率是相等的
  return Math.floor(Math.random() * num);
}
/**
 * 随机切换背景和人员信息
 */
/**
 * 切换名牌背景
 */
let paramsFields = {}
let basicData = {}
export function shine(cardIndex, color) {
  if (!paramsFields.threeDCards[cardIndex]) {
    // debugger
  }
  let card = paramsFields.threeDCards[cardIndex].element ? paramsFields.threeDCards[cardIndex].element : paramsFields.threeDCards[cardIndex];
  // card.style.backgroundImage = "url(" + '../img/huawei.png' + ") no-repeat center center";
  card.style.backgroundColor =
    color || "rgba(0,127,127," + (Math.random() * 0.7 + 0.25) + ")";
}
/**
 * 切换名牌人员信息
 */
export const changeCard = (cardIndex, user) => {
  if (user) {
    if (basicData.currentLuckys.some(arr => arr[0] === user[0])) {
      return;
    }
    let card = paramsFields.threeDCards[cardIndex].element ? paramsFields.threeDCards[cardIndex].element : paramsFields.threeDCards[cardIndex];
    if (card.classList.value.includes("prize")) {
      return
    }
    let curCardId = card.querySelector('.cardIdTxt').id 
    if (('card-' + user[0]) != curCardId) {
      card.innerHTML = getCardHTML(user, basicData);
    }
  }
}
let shineTimer = null;
export const shineCard = (basicDataParam, paramsFieldsParam, switchTime = 500) => {
  basicData = basicDataParam;
  paramsFields = paramsFieldsParam;
  let maxCard = 20,
    maxUser;
  let shineCard = 10 + random(maxCard);
  if (!paramsFields.totalMember) return
  shineTimer = setInterval(() => {
    // 正在抽奖停止闪烁
    // if (isLotting || currentPrizeIndex < 7 || prizeMark.style.zIndex === '6') {
    //   return;
    // }
    if (paramsFields.isLotting) {
      return;
    }
    maxUser = paramsFields.totalMember;
    let totalNum = basicData.totalCards;
    if (totalNum > maxUser) totalNum = maxUser;
    for (let i = 0; i < shineCard; i++) {
      let index = random(maxUser),
        cardIndex = random(totalNum);
      // 当前显示的已抽中名单不进行随机切换
      if (paramsFields.selectedCardIndex.includes(cardIndex)) {
        continue;
      }
      shine(cardIndex);
      changeCard(cardIndex, paramsFields.member[index]);
    }
  }, switchTime);
}
export const removeShineCard = () => {
  clearInterval(shineTimer);
}