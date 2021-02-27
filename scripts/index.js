const url = './public/data/FishEyeDataFR.json'
const mainHomePage = document.querySelector('#main-homePage')
const mainPhotographerPage = document.querySelector('#main-photographerPage')
const tagList = document.querySelector('nav.tag-list')
const photographerList = {}
const formModal = document.querySelector('.form-modal')

// Classes
class Photographer {
  constructor (name, id, city, country, tags, tagline, price, portrait, alt) {
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

  addMedia (media) {
    this.mediaList.push(media)
  }

  getLikes () {
    let sum = 0
    this.mediaList.forEach((media) => {
      sum += media.likes
    })
    return sum
  }

  getInfoBox () {
    const section = document.createElement('section')
    const likeText = document.createElement('p')
    const priceText = document.createElement('p')

    section.classList.add('info-box')
    likeText.classList.add('info-box__like')
    priceText.classList.add('info-box__price')

    section.append(likeText, priceText)

    likeText.textContent = this.getLikes() + '❤'
    priceText.textContent = this.price + '€/jour'

    return section
  }

  getCard () {
    const linkToPage = this.name.toLowerCase().replace(' ', '') + '.html'
    const linkToPhoto = './public/img/1_small/PhotographersID/' + this.portrait
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
    divTag.classList.add('tag-list', 'card-photograph__tags')

    a.href = linkToPage
    a.setAttribute('role', 'link')

    img.src = linkToPhoto
    img.alt = ''

    divName.textContent = this.name
    divCity.textContent = this.city + ', ' + this.country
    divTagline.textContent = this.tagline
    divPrice.textContent = this.price + '€/jour'

    divPortrait.append(img)
    a.append(divPortrait, divName)
    section.append(a, divCity, divTagline, divPrice, divTag)

    this.tags.forEach((tag) => {
      const a = document.createElement('a')
      const span = document.createElement('span')

      a.classList.add('display-contents')
      span.classList.add('tag')

      a.href = ''

      span.textContent = '#' + tag

      a.append(span)
      divTag.append(a)
    })

    return section
  }

  getMedia (filter, sort) {
    const sectionListMedia = document.createElement('section')
    let localMediaList = this.mediaList.slice()

    if (filter) {
      localMediaList = localMediaList.filter((media) =>
        media.tags.includes(filter)
      )
    }

    if (sort) {
      if (sort === 'likes') {
        localMediaList.sort((a, b) => a.likes - b.likes)
      } else if (sort === 'title') {
        localMediaList.sort((a, b) => a.image - b.image)
      } else if (sort === 'date') {
        localMediaList.sort((a, b) => a.date - b.date)
      }
    }

    localMediaList.forEach((media) => {
      const linkToMedia =
        './public/img/1_small/' +
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

      a.href = ''
      img.src = linkToMedia
      img.alt = media.alt

      video.controls = true
      video.muted = true
      video.loop = true

      source.src = linkToMedia
      source.type = 'video/mp4'

      divTitle.textContent =
        media.image?.replace('.jpg', '').replaceAll('_', ' ') ||
        media.video?.replace('.jpg', '').replaceAll('_', ' ')
      divPrice.textContent = media.price + '€'
      divLikes.textContent = media.likes + ' ❤'

      sectionCardMedia.append(divMedia)
      if (media.image) {
        a.append(img)
        divMedia.append(a)
      } else {
        divMedia.append(video)
        video.append(source)
      }
      textContainer.append(divTitle, divPrice, divLikes)
      sectionCardMedia.append(textContainer)
      sectionListMedia.append(sectionCardMedia)
    })

    return sectionListMedia
  }
}

function createContent (photographerId) {
  fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.json()
      }
    })
    .then((data) => createPhotographerList(data))
    .then(() => displayPage(photographerId))
}

function openModal (photographerId) {
  const title = document.querySelector('.form-modal-content__title')
  const close = document.querySelector('.close')

  title.innerHTML = photographerList[photographerId].name + '</br>' + 'Contactez-moi'

  close.addEventListener('click', closeModal)
  formModal.addEventListener('click', closeModal)
  formModal.firstElementChild.addEventListener('click', (e) => e.stopPropagation())

  formModal.style.display = 'block'
  document.body.classList.add('disable-scroll')
}

function closeModal () {
  formModal.style.display = 'none'
  document.body.classList.remove('disable-scroll')
}

function createPhotographerList (fetchedData) {
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

function displayPage (photographerId) {
  if (!photographerId) {
    for (const photographer of Object.values(photographerList)) {
      mainHomePage.append(photographer.getCard())
    }
    for (const tag of getDistinctTag()) {
      tagList.append(tag)
    }
  } else {
    document.title += ' - ' + photographerList[photographerId].name
    fillBanner(photographerId)
    mainPhotographerPage.append(
      photographerList[photographerId].getMedia()
    )
    mainPhotographerPage.append(
      photographerList[photographerId].getInfoBox()
    )
  }
}

function fillBanner (photographerId) {
  const linkToPhoto =
    './public/img/1_small/PhotographersID/' +
    photographerList[photographerId].portrait
  const img = document.querySelector('.card-banner-photograph__portrait img')

  const divName = document.querySelector('.card-banner-photograph__name')

  const divCity = document.querySelector('.card-banner-photograph__city')
  const divTagline = document.querySelector('.card-banner-photograph__tagline')
  const divTag = document.querySelector('.card-banner-photograph__tags')
  const button = document.querySelector('.card-banner-photograph__button')

  img.src = linkToPhoto
  img.alt = ''

  divName.textContent = photographerList[photographerId].name
  divCity.textContent = photographerList[photographerId].city + ', ' + photographerList[photographerId].country
  divTagline.textContent = photographerList[photographerId].tagline

  photographerList[photographerId].tags.forEach((tag) => {
    const a = document.createElement('a')
    const span = document.createElement('span')
    a.classList.add('display-contents')
    span.classList.add('tag')
    a.href = ''
    span.textContent = '#' + tag
    a.append(span)
    divTag.append(a)
  })

  button.addEventListener('click', () => openModal(photographerId))
}

function getDistinctTag () {
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
    a.href = ''
    span.textContent = '#' + tag
    a.append(span)
    returnTagList.push(a)
  })

  return returnTagList
}
