const url = '/public/data/FishEyeDataFR.json'
const main = document.getElementById('main')
const tagList = document.querySelector('nav.tag-list')

// Récupération des données pour l'affichage de la page d'accueil
// La fonction appelle getData puis displayHomePage
async function getDataHomePage() {
  getData().then((data) => displayHomePage(data.photographers))
}

// Récupération des données pour l'affichage d'une page d'un photographe
// @param : l'ID du photographe
// La fonction appelle getData, puis tri les données du JSON en fonction de l'id du photographe
// puis appelle la fonction displayPhotographerPage
async function getDataPhotographerPage(photographerId) {
  getData().then((data) => {
    const mediaData = []
    let photographerData

    data.photographers.forEach((photographer) => {
      if (photographer.id === photographerId) {
        photographerData = photographer
      }
    })

    data.media.forEach((media) => {
      if (media.photographerId === photographerId) {
        mediaData.push(media)
      }
    })

    displayPhotographerPage(photographerData, mediaData, photographerId)
  })
}

// Récupération des données dans le fichier JSON
async function getData() {
  let data

  const response = await fetch(url)
  if (response.ok) {
    data = await response.json()
  } else {
    alert('HTTP-Error: ' + response.status)
  }

  return data
}

// Fonction d'affichage
function displayHomePage(photographersList) {
  main.innerHTML = buildPhotographersList(photographersList)
  tagList.innerHTML = buildTagList(photographersList)
}

function displayPhotographerPage(photographerData, mediaData, photographerId) {
  main.innerHTML = buildPhotographerBanner(photographerData, photographerId)
  main.innerHTML += buildPhotographerContentList(
    photographerData,
    mediaData,
    photographerId
  )
}

function buildPhotographerBanner(photographerData, photographerId) {
  let photographerBannerBloc = ''

  photographerBannerBloc += `
          <section class="card-banner-photograph">
            <div class="card-banner-photograph__portrait">
              <img src="/public/img/1_small/PhotographersID/${photographerData.portrait}" alt="" />
            </div>
            <div class="card-banner-photograph__name">${photographerData.name}</div>
            <div class="card-banner-photograph__city">${photographerData.city}, ${photographerData.country}</div>
            <div class="card-banner-photograph__tagline">${photographerData.tagline}</div>
            <div class="tag-list card-banner-photograph__tags">`

  photographerData.tags.forEach((tag) => {
    photographerBannerBloc += `<a class="display-contents" href=""><span class="tag">#${tag}</span></a>`
  })

  photographerBannerBloc += '</div></section>'

  return photographerBannerBloc
}

function buildPhotographerContentList(
  photographerData,
  mediaData,
  photographerId
) {
  let photographerContentBloc = ''

  mediaData.forEach((media) => {
    const mediaLink =
      '/public/img/1_small/' +
      photographerData.name.toLowerCase().replace(' ', '') +
      '/' +
      media.image

    photographerContentBloc += `
          <section class="card-media">
            <div class="card-media__media">
              <img src="${mediaLink}" alt="" />
            </div>
            <div class="card-media__alt">${media.alt}</div>
            <div class="card-media__price">${media.price}</div>
            <div class="card-media__likes">${media.likes}</div>`
  })

  return photographerContentBloc
}

function buildPhotographersList(photographersList) {
  let cardPhotographBloc = ''

  photographersList.forEach((photographer) => {
    const link =
      '/pages/' + photographer.name.toLowerCase().replace(' ', '') + '.html'

    cardPhotographBloc += `
        <section class="card-photograph">
        <a class="display-contents" href="${link}" role="link">
          <div class="card-photograph__portrait">
            <img src="/public/img/1_small/PhotographersID/${photographer.portrait}" alt="" />
          </div>
          <div class="card-photograph__name">${photographer.name}</div>
        </a>
          <div class="card-photograph__city">${photographer.city}, ${photographer.country}</div>
          <div class="card-photograph__tagline">${photographer.tagline}</div>
          <div class="card-photograph__price">${photographer.price}€/jour</div>
          <div class="tag-list card-photograph__tags">`

    photographer.tags.forEach((tag) => {
      cardPhotographBloc += `<a class="display-contents" href=""><span class="tag">#${tag}</span></a>`
    })

    cardPhotographBloc += '</div></section>'
  })

  return cardPhotographBloc
}

function buildTagList(photographersList) {
  let tagListBloc = ''

  const tags = []
  photographersList.forEach((photographer) => {
    photographer.tags.forEach((tag) => {
      tags.push(tag[0].toUpperCase() + tag.substring(1))
    })
  })

  new Set(tags).forEach((tag) => {
    tagListBloc += `<a class="display-contents" href=""><span class="tag">#${tag}</span></a>`
  })

  return tagListBloc
}
