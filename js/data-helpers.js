async function getData(url) {
  return fetch(url).then(res => res.json())
}

async function getUserInfo(username, { limit = 15 } = { limit: 15 }) {
  const accountUrl = `https://api.github.com/users/${username}`
  const reposUrl = `https://api.github.com/users/${username}/repos`

  const userInfo = {
    'login': '',
    'avatar_url': '',
    'name': '',
    'location': '',
    'bio': '',
    'updated_at': '',
    'html_url': ''
  }

  const account = getData(accountUrl)
  const repos = getData(reposUrl)

  await Promise.allSettled([account, repos])
    .then(async ([accountInfo, reposList]) => {
      Object.keys(userInfo).forEach(key => userInfo[key] = accountInfo.value[key])

      reposList.value.sort((a, b) => {
        const dateA = new Date(a['updated_at'])
        const dateB = new Date(b['updated_at'])

        if (dateA < dateB) return 1
        if (dateA > dateB) return -1
        return 0
      })

      userInfo['repos'] = reposList.value.toSpliced(3)

      const languages = reposList.value.map(async ({ languages_url }, i) => {
        if (i < limit) {
          const languagesInfo = getData(languages_url)
          return languagesInfo
        }
      })

      await Promise.allSettled(languages)
        .then(data => userInfo['languages'] = data.map(({ value }) => (value)).filter(obj => obj && Object.getOwnPropertyNames(obj).length > 0))
    })

  return userInfo
}

function languagesTemplate(languages) {
  const languagesData = Object.fromEntries(
    [...new Set(languages.reduce((acc, elem) => [...acc, ...Object.keys(elem)], []))]
      .map((key) => [key, 0])
  )

  languages.forEach((elem) => {
    Object.keys(languagesData).forEach(key => {
      if (key in elem) languagesData[key] += elem[key]
    })
  })

  return languagesData
}

function reposTemplate(repos) {
  return repos.map(({ name, html_url, updated_at }) => ({ name, html_url, updated_at }))
}

function datediff(initDate, lastDate = new Date()) {
  const DAYS_CONST = 1000 * 60 * 60 * 24
  const date1 = new Date(initDate)
  const date2 = new Date(lastDate)

  const datediff = Math.floor(Math.abs(date2 - date1) / DAYS_CONST)

  const diffInfo = {
    year: Math.floor(datediff / 365),
    month: Math.floor((datediff % 365) / 30),
    day: (datediff % 365) % 30
  }

  return Object.entries(diffInfo).reduce((acc, [key, value]) => {
    if (value > 0) return acc + `${value} ${key}/s `
    return acc
  }, '').trim()
}

export { getUserInfo, languagesTemplate, reposTemplate, datediff }