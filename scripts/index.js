const url = '/public/data/FishEyeDataFR.json'
const main = document.getElementById('main')
const tagList = document.querySelector('nav.tag-list')
const photographerList = []

// Classes
class Photographer {
  constructor(name, id, city, country, tags, tagline, price, portrait, alt) {
    this.name = name
    this.id = id
    this.city = city
    this.country = country
    this.tags = tags
    this.tageline = tagline
    this.price = price
    this.portrait = portrait
    this.alt = alt
  }

  getCard() {
    let HTMLbloc = ''
    const link = '/pages/' + this.name.toLowerCase().replace(' ', '') + '.html'

    HTMLbloc += `
        <section class="card-photograph">
        <a class="display-contents" href="${link}" role="link">
          <div class="card-photograph__portrait">
            <img src="/public/img/1_small/PhotographersID/${this.portrait}" alt="" />
          </div>
          <div class="card-photograph__name">${this.name}</div>
        </a>
          <div class="card-photograph__city">${this.city}, ${this.country}</div>
          <div class="card-photograph__tagline">${this.tagline}</div>
          <div class="card-photograph__price">${this.price}€/jour</div>
          <div class="tag-list card-photograph__tags">`

    this.tags.forEach((tag) => {
      HTMLbloc += `<a class="display-contents" href=""><span class="tag">#${tag}</span></a>`
    })

    HTMLbloc += '</div></section>'

    return HTMLbloc
  }

  getBanner() {}
}

// Récupération des données pour l'affichage de la page d'accueil
// La fonction appelle getData puis displayHomePage
function getDataHomePage() {
  fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.json()
      }
    })
    .then((data) => buildPhotographerList(data.photographers))
    .then(() => displayHomePage())
}

// Récupération des données pour l'affichage d'une page d'un photographe
// @param : l'ID du photographe
// La fonction appelle getData, puis tri les données du JSON en fonction de l'id du photographe
// puis appelle la fonction displayPhotographerPage
function getDataPhotographerPage(photographerId) {
  fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.json()
      }
    })
    .then((data) => {
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
    })
    .then(() =>
      displayPhotographerPage(photographerData, mediaData, photographerId)
    )
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
}

function buildPhotographerList(fetchedPhotographers) {
  fetchedPhotographers.forEach((photographer) => {
    photographerList.push(
      new Photographer(
        photographer.name,
        photographer.id,
        photographer.city,
        photographer.country,
        photographer.tags,
        photographer.tagline,
        photographer.price,
        photographer.portrait,
        photographer.alt
      )
    )
  })
}

// Fonction d'affichage
function displayHomePage() {
  main.innerHTML = displayPhotographerList()
  tagList.innerHTML = buildTagList()
}

function displayPhotographerList() {
  let HTMLbloc = ''

  photographerList.forEach((photographer) => {
    HTMLbloc += photographer.getCard()
  })

  return HTMLbloc
}

function buildTagList() {
  let tagListBloc = ''

  const tags = []
  photographerList.forEach((photographer) => {
    photographer.tags.forEach((tag) => {
      tags.push(tag[0].toUpperCase() + tag.substring(1))
    })
  })

  new Set(tags).forEach((tag) => {
    tagListBloc += `<a class="display-contents" href=""><span class="tag">#${tag}</span></a>`
  })

  return tagListBloc
}
