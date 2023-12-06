import { datediff } from './data-helpers.js'

const accountFinder = document.querySelector('#account-finder')
const accountData = document.getElementById('account-data')
const h1 = document.querySelector('h1')
const backLink = document.getElementById('back')

function fadeIn() {
  reset()
  h1.classList.add('disappear')
  accountFinder.classList.add('move-up')
  backLink.classList.remove('disappear')
}

function fadeOut() {
  reset()
  h1.classList.remove('disappear')
  accountFinder.classList.remove('move-up')
  backLink.classList.add('disappear')
}

function reset() {
  accountData.innerHTML = ''
}

function lastUpdateTemplate(date) {
  const lastUpdate = datediff(date)
  return `Last update: ${(lastUpdate ? `${lastUpdate} ago` : 'Recently')}`
}

function linkSetUp(linkElement, text, url) {
  linkElement.setAttribute('href', url)
  linkElement.setAttribute('target', '_blank')
  linkElement.textContent = text
  linkElement.innerHTML += ' <i class="fa-solid fa-arrow-up-right-from-square"></i>'
}

export { fadeIn, fadeOut, reset, lastUpdateTemplate, linkSetUp, accountData }