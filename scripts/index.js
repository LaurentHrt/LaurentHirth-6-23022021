const url = '../public/data/FishEyeDataFR.json'
const mainHomePage = document.getElementById('main-homePage')
const mainPhotographerPage = document.getElementById('main-photographerPage')
const tagList = document.querySelector('nav.tag-list')
const photographerList = {}
const formModal = document.getElementsByClassName('form-modal')[0]

// Classes
class Photographer {
  constructor(name, id, city, country, tags, tagline, price, portrait, alt) {
    this.name = name
    this.id = id
    this.city = city
    this.country = country
    this.tags = tags
    this.tagline = tagline
    this.price = price
    this.portrait = portrait
    this.alt = alt
    this.mediaList = []
  }

  addMedia(media) {
    this.mediaList.push(media)
  }

  getCard() {
    const linkToPage =
      'pages/' + this.name.toLowerCase().replace(' ', '') + '.html'
    const linkToPhoto = 'public/img/1_small/PhotographersID/' + this.portrait
    const section = document.createElement('section')
    const a = document.createElement('a')
    const img = document.createElement('img')
    const divPortrait = document.createElement('div')
    const divName = document.createElement('div')
    const divCity = document.createElement('div')
    const divTagline = document.createElement('div')
    const divPrice = document.createElement('div')
    const divTag = document.createElement('div')

    section.classList.add('card-photograph')
    a.classList.add('display-contents')
    divPortrait.classList.add('card-photograph__protrait')
    divName.classList.add('card-photograph__name')
    divCity.classList.add('card-photograph__city')
    divTagline.classList.add('card-photograph__tagline')
    divPrice.classList.add('card-photograph__price')
    divTag.classList.add('tag-list')
    divTag.classList.add('card-photograph__tags')

    a.setAttribute('href', linkToPage)
    a.setAttribute('role', 'link')
    img.setAttribute('src', linkToPhoto)
    img.setAttribute('alt', '')

    divName.textContent = this.name
    divCity.textContent = this.city + ', ' + this.country
    divTagline.textContent = this.tagline
    divPrice.textContent = this.price + '€/jour'

    divPortrait.appendChild(img)
    a.appendChild(divPortrait)
    a.appendChild(divName)
    section.appendChild(a)
    section.appendChild(divCity)
    section.appendChild(divTagline)
    section.appendChild(divPrice)
    section.appendChild(divTag)

    this.tags.forEach((tag) => {
      const a = document.createElement('a')
      const span = document.createElement('span')

      a.classList.add('display-contents')
      span.classList.add('tag')

      a.setAttribute('href', '')

      span.textContent = '#' + tag

      a.appendChild(span)
      divTag.appendChild(a)
    })

    return section
  }

  getMedia() {
    const sectionListMedia = document.createElement('section')

    this.mediaList.forEach((media) => {
      const linkToMedia =
        '../public/img/1_small/' +
        this.name.toLowerCase().replace(' ', '') +
        '/' +
        (media.image || media.video)

      const sectionCardMedia = document.createElement('section')
      const divMedia = document.createElement('div')
      const img = document.createElement('img')
      const video = document.createElement('video')
      const source = document.createElement('source')
      const divTitle = document.createElement('div')
      const divPrice = document.createElement('div')
      const divLikes = document.createElement('div')
      const textContainer = document.createElement('div')
      const a = document.createElement('a')

      sectionListMedia.classList.add('media-list')
      sectionCardMedia.classList.add('card-media')
      divMedia.classList.add('card-media__media')
      divTitle.classList.add('card-media__title')
      divPrice.classList.add('card-media__price')
      divLikes.classList.add('card-media__likes')
      textContainer.classList.add('card-media__textContainer')
      a.classList.add('display-contents')

      a.setAttribute('href', '')
      img.setAttribute('src', linkToMedia)
      img.setAttribute('alt', media.alt)

      video.setAttribute('controls', 'true')
      video.setAttribute('muted', 'true')
      video.setAttribute('loop', 'true')
      source.setAttribute('src', linkToMedia)
      source.setAttribute('type', 'video/mp4')

      divTitle.textContent =
        media.image?.replace('.jpg', '').replaceAll('_', ' ') ||
        media.video?.replace('.jpg', '').replaceAll('_', ' ')
      divPrice.textContent = media.price + '€'
      divLikes.textContent = media.likes + ' ❤'

      sectionCardMedia.appendChild(divMedia)
      if (media.image) {
        a.appendChild(img)
        divMedia.appendChild(a)
      } else {
        divMedia.appendChild(video)
        video.appendChild(source)
      }
      textContainer.appendChild(divTitle)
      textContainer.appendChild(divPrice)
      textContainer.appendChild(divLikes)
      sectionCardMedia.appendChild(textContainer)
      sectionListMedia.appendChild(sectionCardMedia)
    })

    return sectionListMedia
  }
}

function createContent(photographerId) {
  fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.json()
      }
    })
    .then((data) => createPhotographerList(data))
    .then(() => displayPage(photographerId))
}

function displayModal(photographerId) {
  const close = document.querySelector('.close')
  const title = document.querySelector('.form-modal-content__title')

  title.innerHTML =
    photographerList[photographerId].name + '</br>' + 'Contactez-moi'

  // When the user clicks on <span> (x), close the modal
  close.onclick = function () {
    formModal.style.display = 'none'
    document.body.classList.remove('disable-scroll')
  }

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    if (event.target === formModal) {
      formModal.style.display = 'none'
      document.body.classList.remove('disable-scroll')
    }
  }
}

function createPhotographerList(fetchedData) {
  fetchedData.photographers.forEach((photographer) => {
    photographerList[photographer.id] = new Photographer(
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
  })
  fetchedData.media.forEach((media) => {
    photographerList[media.photographerId].addMedia(media)
  })
}

function displayPage(photographerId) {
  if (!photographerId) {
    for (const photographer of Object.values(photographerList)) {
      mainHomePage.appendChild(photographer.getCard())
    }
    for (const tag of getDistinctTag()) {
      tagList.appendChild(tag)
    }
  } else {
    document.title += ' - ' + photographerList[photographerId].name
    fillBanner(photographerId)
    mainPhotographerPage.appendChild(
      photographerList[photographerId].getMedia()
    )
    displayModal(photographerId)
  }
}

function fillBanner(photographerId) {
  const linkToPhoto =
    '../public/img/1_small/PhotographersID/' +
    photographerList[photographerId].portrait
  const img = document.querySelector('.card-banner-photograph__portrait img')
  const divName = document.querySelector('.card-banner-photograph__name')
  const divCity = document.querySelector('.card-banner-photograph__city')
  const divTagline = document.querySelector('.card-banner-photograph__tagline')
  const divTag = document.querySelector('.card-banner-photograph__tags')
  const button = document.querySelector('.card-banner-photograph__button')

  img.setAttribute('src', linkToPhoto)
  img.setAttribute('alt', '')

  divName.textContent = photographerList[photographerId].name
  divCity.textContent =
    photographerList[photographerId].city +
    ', ' +
    photographerList[photographerId].country
  divTagline.textContent = photographerList[photographerId].tagline

  photographerList[photographerId].tags.forEach((tag) => {
    const a = document.createElement('a')
    const span = document.createElement('span')
    a.classList.add('display-contents')
    span.classList.add('tag')
    a.setAttribute('href', '')
    span.textContent = '#' + tag
    a.appendChild(span)
    divTag.appendChild(a)
  })

  // When the user clicks on the button, open the modal
  button.onclick = function () {
    formModal.style.display = 'block'
    document.body.classList.add('disable-scroll')
  }
}

function getDistinctTag() {
  const returnTagList = []

  const tags = []
  for (const photographer of Object.values(photographerList)) {
    photographer.tags.forEach((tag) => {
      tags.push(tag[0].toUpperCase() + tag.substring(1))
    })
  }

  new Set(tags).forEach((tag) => {
    const a = document.createElement('a')
    const span = document.createElement('span')
    a.classList.add('display-contents')
    span.classList.add('tag')
    a.setAttribute('href', '')
    span.textContent = '#' + tag
    a.appendChild(span)
    returnTagList.push(a)
  })

  return returnTagList
}
