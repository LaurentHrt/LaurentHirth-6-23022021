// ***************** Declarations ***************** //
const url = './public/data/FishEyeDataFR.json'
const mainHomePage = document.querySelector('#main-homePage')
const mainPhotographerPage = document.querySelector('#main-photographerPage')
const tagList = document.querySelector('nav.tag-list')
const photographerList = {}
const formModal = document.querySelector('.form-modal')

// ***************** Classes ***************** //
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

  getMediaList (filter, sort) {
    const sectionListMedia = document.createElement('section')
    let localMediaList = this.mediaList.slice()

    sectionListMedia.classList.add('media-list')

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
      sectionListMedia.append(media.getCard())
    })

    return sectionListMedia
  }
}

class Media {
  createMedia (id, photographerId, type, link, tags, likes, date, price, alt) {
    if (type === 'jpg') {
      return new Photo(id, photographerId, link, tags, likes, date, price, alt)
    } else if (type === 'mp4') {
      return new Video(id, photographerId, link, tags, likes, date, price, alt)
    }
  }
}

class Photo extends Media {
  constructor (id, photographerId, link, tags, likes, date, price, alt) {
    super()
    this.id = id
    this.photographerId = photographerId
    this.link = link
    this.tags = tags
    this.likes = likes
    this.date = date
    this.price = price
    this.alt = alt
  }

  getCard () {
    const linkToMedia = './public/img/1_small/' + photographerList[this.photographerId].name.toLowerCase().replace(' ', '') + '/' + this.link

    const sectionCardMedia = document.createElement('section')
    const divMedia = document.createElement('div')
    const img = document.createElement('img')
    const divTitle = document.createElement('div')
    const divPrice = document.createElement('div')
    const divLikes = document.createElement('div')
    const textContainer = document.createElement('div')
    const a = document.createElement('a')

    sectionCardMedia.classList.add('card-media')
    divMedia.classList.add('card-media__media')
    divTitle.classList.add('card-media__title')
    divPrice.classList.add('card-media__price')
    divLikes.classList.add('card-media__likes')
    textContainer.classList.add('card-media__textContainer')
    a.classList.add('display-contents')

    a.href = ''
    img.src = linkToMedia
    img.alt = this.alt

    divTitle.textContent = this.link.replace('.jpg', '').replaceAll('_', ' ')
    divPrice.textContent = this.price + '€'
    divLikes.textContent = this.likes + ' ❤'

    sectionCardMedia.append(divMedia)
    a.append(img)
    divMedia.append(a)
    textContainer.append(divTitle, divPrice, divLikes)
    sectionCardMedia.append(textContainer)

    return sectionCardMedia
  }

  getModal () {

  }
}

class Video extends Media {
  constructor (id, photographerId, link, tags, likes, date, price, alt) {
    super()
    this.id = id
    this.photographerId = photographerId
    this.link = link
    this.tags = tags
    this.likes = likes
    this.date = date
    this.price = price
    this.alt = alt
  }

  getCard () {
    const linkToMedia = './public/img/1_small/' + photographerList[this.photographerId].name.toLowerCase().replace(' ', '') + '/' + this.link

    const sectionCardMedia = document.createElement('section')
    const divMedia = document.createElement('div')
    const video = document.createElement('video')
    const source = document.createElement('source')
    const divTitle = document.createElement('div')
    const divPrice = document.createElement('div')
    const divLikes = document.createElement('div')
    const textContainer = document.createElement('div')
    const a = document.createElement('a')

    sectionCardMedia.classList.add('card-media')
    divMedia.classList.add('card-media__media')
    divTitle.classList.add('card-media__title')
    divPrice.classList.add('card-media__price')
    divLikes.classList.add('card-media__likes')
    textContainer.classList.add('card-media__textContainer')
    a.classList.add('display-contents')

    a.href = ''

    video.controls = true
    video.muted = true
    video.loop = true

    source.src = linkToMedia
    source.type = 'video/mp4'

    divTitle.textContent = this.link.replace('.jpg', '').replaceAll('_', ' ')
    divPrice.textContent = this.price + '€'
    divLikes.textContent = this.likes + ' ❤'

    sectionCardMedia.append(divMedia)
    divMedia.append(video)
    video.append(source)

    textContainer.append(divTitle, divPrice, divLikes)
    sectionCardMedia.append(textContainer)

    return sectionCardMedia
  }

  getModal () {

  }
}

// ***************** Functions ***************** //
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
    photographerList[media.photographerId].addMedia(Media.prototype.createMedia(media.id, media.photographerId, media.image?.split('.').pop() || media.video?.split('.').pop(), media.image || media.video, media.tags, media.likes, media.date, media.price, media.alt))
  })
}

function displayPage (photographerId) {
  if (!photographerId) {
    photographerList.forEach((photographer) => { mainHomePage.append(photographer.getCard()) })
    getDistinctTag().forEach((tag) => { tagList.append(tag) })
  } else {
    document.title += ' - ' + photographerList[photographerId].name
    fillBanner(photographerId)
    mainPhotographerPage.append(photographerList[photographerId].getMediaList())
    mainPhotographerPage.append(photographerList[photographerId].getInfoBox())
  }
}

function fillBanner (photographerId) {
  const linkToPhoto = './public/img/1_small/PhotographersID/' + photographerList[photographerId].portrait
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

function openModal (photographerId) {
  const title = document.querySelector('.form-modal-content__title')
  const close = document.querySelector('.close')

  close.addEventListener('click', closeModal)
  formModal.addEventListener('click', closeModal)
  formModal.firstElementChild.addEventListener('click', (e) => e.stopPropagation())

  title.innerHTML = photographerList[photographerId].name + '</br>' + 'Contactez-moi'
  formModal.style.display = 'block'
  document.body.classList.add('disable-scroll')
}

function closeModal () {
  formModal.style.display = 'none'
  document.body.classList.remove('disable-scroll')
}
