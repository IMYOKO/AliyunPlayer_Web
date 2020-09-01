// import rateHtml from './index.html'
import './index.scss'
import { parseDom } from 'utils'

/**
 * 倍速播放组件
 */
export default class RateComponent {
  /**
   * @constructor 倍速播放组件构造函数
   */
  constructor(rateList) {
    this.rateList = rateList
    const rate = localStorage.getItem('videoRateSpeed') || ''
    const defaultItem = rateList.find(i => i.rate === 1)
    const rateItem = rate ? rateList.find(i => i.rate.toString() === rate) : defaultItem
    const liEl = rateList.map(i =>
      (
        `<li data-rate="${i.rate}" class="${i.rate === rateItem.rate ? 'current' : ''}">${i.text}</li>`
      ))
    const rateHtml = `<div class="rate-components">
    <div class="current-rate">${rateItem.text}</div>
      <ul class="rate-list">
      ${liEl.join('')}
      </ul>               
    </div>`
    this.html = parseDom(rateHtml)
  }

  createEl(el) {
    let eleControlbar = el.querySelector('.prism-controlbar')
    eleControlbar.appendChild(this.html)
  }

  ready(player, e) {
    let currentRateEle = this.html.querySelector('.current-rate')
    let rateListEle = this.html.querySelector('.rate-list')
    let timeId = null

    // 隐藏设置里面的倍速播放
    let settingRate = document.querySelector('.prism-setting-item.prism-setting-speed')
    if (settingRate) {
      settingRate.classList.add('player-hidden')
    }

    currentRateEle.onclick = () => {
      rateListEle.style.display = 'block'
    }
    currentRateEle.onmouseleave = () => {
      timeId = setTimeout(() => {
        rateListEle.style.display = 'none'
      }, 100);
    }

    rateListEle.onmouseenter = () => {
      clearTimeout(timeId)
    }
    rateListEle.onmouseleave = () => {
      rateListEle.style.display = 'none'
    }

    rateListEle.onclick = ({ target }) => {
      let rate = target.dataset.rate
      if (rate) {
        localStorage.setItem('videoRateSpeed', rate)
        player.setSpeed(rate)
        if (target.className !== 'current') {
          let currentEle = rateListEle.querySelector('.current')
          if (currentEle) {
            currentEle.className = ''
          }
          target.className = 'current'
        }
        rateListEle.style.display = 'none'
        currentRateEle.innerText = this.rateList.find(i => i.rate.toString() === rate).text

      }
    }
  }

}