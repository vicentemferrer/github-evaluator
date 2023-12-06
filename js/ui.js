import { getUserInfo, languagesTemplate, reposTemplate } from './data-helpers.js'
import { fadeIn, reset, lastUpdateTemplate, linkSetUp, accountData } from './ui-helpers.js'

export async function dispatchUI() {
  const userInfo = await getUserInfo(sessionStorage.getItem('username'))

  document.startViewTransition ? document.startViewTransition(() => fadeIn()) : fadeIn()
  document.startViewTransition ? document.startViewTransition(() => accountCard(userInfo)) : accountCard(userInfo)
}

function accountCard({ login, avatar_url, name, location, bio, updated_at, html_url, repos, languages }) {
  reset()

  const languagesSummary = languagesTemplate(languages)
  const reposFiltered = reposTemplate(repos)

  const card = document.createElement('div')
  const row = document.createElement('div')
  const row2 = document.createElement('div')
  const row3 = document.createElement('div')
  const wrap = document.createElement('div')
  const wrap2 = document.createElement('div')
  const canvasWrap = document.createElement('div')
  const profilePhoto = document.createElement('img')
  const nameHeader = document.createElement('h2')
  const bioParagraph = document.createElement('p')
  const githubLink = document.createElement('a')
  const lastUpdateParagraph = document.createElement('p')
  const canvas = document.createElement('canvas')

  card.classList.add('card')
  row.classList.add('row')
  row2.classList.add('row')
  row3.classList.add('row')
  row3.classList.add('analytics')
  wrap.classList.add('wrap')
  wrap2.classList.add('wrap')
  wrap2.classList.add('project')
  canvasWrap.classList.add('chart-box')

  row2.setAttribute('id', 'details')
  canvas.setAttribute('id', 'myChart')

  profilePhoto.setAttribute('src', avatar_url)
  profilePhoto.setAttribute('alt', `Profile photo of ${login}`)

  nameHeader.textContent = name ?? login
  nameHeader.innerHTML += ` <small>(${location ?? 'Planet Earth'})</small>`

  bioParagraph.textContent = bio

  linkSetUp(githubLink, `Visit ${login} GitHub`, html_url)

  lastUpdateParagraph.setAttribute('id', 'last-update')
  lastUpdateParagraph.classList.add('last-update')
  lastUpdateParagraph.textContent = lastUpdateTemplate(updated_at)

  row.appendChild(profilePhoto)

  wrap.appendChild(nameHeader)
  wrap.appendChild(bioParagraph)

  row2.appendChild(githubLink)
  row2.appendChild(lastUpdateParagraph)

  wrap.appendChild(row2)

  row.appendChild(wrap)

  function projectTemplate({ name, html_url, updated_at }) {
    const projectDiv = document.createElement('div')
    const projectLink = document.createElement('a')
    const projectUpdate = document.createElement('p')

    projectDiv.classList.add('project-card')

    linkSetUp(projectLink, name, html_url)
    projectUpdate.textContent = lastUpdateTemplate(updated_at)
    projectUpdate.classList.add('last-update')

    projectDiv.appendChild(projectLink)
    projectDiv.appendChild(projectUpdate)

    wrap2.appendChild(projectDiv)
  }

  reposFiltered.forEach(projectTemplate)

  canvasWrap.appendChild(canvas)

  row3.appendChild(wrap2)
  row3.appendChild(canvasWrap)

  card.appendChild(row)
  card.appendChild(row3)

  accountData.appendChild(card)
  buildChart(languagesSummary)
}

function buildChart(languagesSummary) {
  const ctx = document.getElementById('myChart');

  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: Object.keys(languagesSummary),
      datasets: [{
        label: '# of Written Lines',
        data: Object.values(languagesSummary),
        borderWidth: 1
      }]
    },
    options: {
      maintainAspectRatio: true,
      aspectRatio: 1.125,
      responsive: true,
      plugins: {
        title: {
          display: true,
          color: '#FFFFFF',
          text: ['Most used Programming Languages,', 'Frameworks, and Technologies', '(based on his/her last 15 projects)']
        },
        legend: {
          display: false
        }
      }
    }
  });
}