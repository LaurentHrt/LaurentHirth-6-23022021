import { Photographer } from './Photographer.js'
import { PhotographerList } from './PhotographerList.js'
import { Media } from './Media.js'

// ***************** Declarations ***************** //
const urlParams = new URLSearchParams(window.location.search)
const linkToData = './public/data/FishEyeDataFR.json'
const relativePathToSmallImg = './public/img/1_small/'
const mainPhotographerPage = document.querySelector('#main-photographerPage')
const photographerList = new PhotographerList()
const formModal = document.querySelector('.form-modal')

// ***************** Functions ***************** //
function createContent (photographerId) {
  fetch(linkToData)
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
    photographerList.addPhotographer(new Photographer(
      photographer.name,
      photographer.id,
      photographer.city,
      photographer.country,
      photographer.tags,
      photographer.tagline,
      photographer.price,
      photographer.portrait,
      photographer.alt
    ))
  })
  fetchedData.media.forEach((media) => {
    const mediaFactory = new Media(media.id, media.photographerId, media.image?.split('.').pop() || media.video?.split('.').pop(), media.image || media.video, media.tags, media.likes, media.date, media.price, media.alt)
    photographerList.getPhotographerById(media.photographerId).addMedia(mediaFactory.createMedia())
  })
}

function displayPage (photographerId) {
  document.title += ' - ' + photographerList.getPhotographerById(photographerId).name

  displayBanner(photographerId)
  displayMediaList(photographerId)
  displayInfoBox(photographerId)
}

function displayBanner (photographerId) {
  const linkToPhoto = './public/img/1_small/PhotographersID/' + photographerList.getPhotographerById(photographerId).portrait
  const img = document.querySelector('.card-banner-photograph__portrait img')
  const divName = document.querySelector('.card-banner-photograph__name')
  const divCity = document.querySelector('.card-banner-photograph__city')
  const divTagline = document.querySelector('.card-banner-photograph__tagline')
  const divTag = document.querySelector('.card-banner-photograph__tags')
  const button = document.querySelector('.card-banner-photograph__button')

  img.src = linkToPhoto
  img.alt = ''
  divName.textContent = photographerList.getPhotographerById(photographerId).name
  divCity.textContent = photographerList.getPhotographerById(photographerId).city + ', ' + photographerList.getPhotographerById(photographerId).country
  divTagline.textContent = photographerList.getPhotographerById(photographerId).tagline

  photographerList.getPhotographerById(photographerId).tags.forEach((tag) => {
    const a = document.createElement('a')
    const span = document.createElement('span')
    a.classList.add('display-contents')
    span.classList.add('tag')
    a.href = ''
    span.textContent = '#' + tag
    a.append(span)
    divTag.append(a)
    a.addEventListener('click', (e) => e.preventDefault())
    a.addEventListener('click', () => {
      document.querySelector('.media-list').replaceWith(photographerList.getPhotographerById(photographerId).getMediaList(tag))
    })
  })

  button.addEventListener('click', () => openModal(photographerId))
}

function displayInfoBox (photographerId) {
  const section = document.createElement('section')
  const likeText = document.createElement('p')
  const priceText = document.createElement('p')

  section.classList.add('info-box')
  likeText.classList.add('info-box__like')
  priceText.classList.add('info-box__price')

  section.append(likeText, priceText)

  likeText.textContent = photographerList.getPhotographerById(photographerId).getLikes() + '❤'
  priceText.textContent = photographerList.getPhotographerById(photographerId).price + '€/jour'

  mainPhotographerPage.append(section)
}

function displayMediaList (photographerId, filter, sort) {
  const sectionListMedia = document.createElement('section')
  let localMediaList = photographerList.getPhotographerById(photographerId).mediaList.slice()

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
    const linkToMedia = relativePathToSmallImg + photographerList.getPhotographerById(photographerId).name.toLowerCase().replace(' ', '') + '/' + media.link

    const sectionCardMedia = document.createElement('section')
    const divMedia = document.createElement('div')
    const specificMediaElement = media.getDOMComponent(linkToMedia)
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

    divTitle.textContent = media.link.replace('.jpg', '').replaceAll('_', ' ')
    divPrice.textContent = media.price + '€'
    divLikes.textContent = media.likes + ' ❤'

    sectionCardMedia.append(divMedia)
    a.append(specificMediaElement)
    divMedia.append(a)
    textContainer.append(divTitle, divPrice, divLikes)
    sectionCardMedia.append(textContainer)

    sectionListMedia.append(sectionCardMedia)
  })

  mainPhotographerPage.append(sectionListMedia)
}

function openModal (photographerId) {
  const title = document.querySelector('.form-modal-content__title')
  const close = document.querySelector('.close')

  close.addEventListener('click', closeModal)
  formModal.addEventListener('click', closeModal)
  formModal.firstElementChild.addEventListener('click', (e) => e.stopPropagation())

  title.innerHTML = photographerList.getPhotographerById(photographerId).name + '</br>' + 'Contactez-moi'
  formModal.style.display = 'block'
  document.body.classList.add('disable-scroll')
}

function closeModal () {
  formModal.style.display = 'none'
  document.body.classList.remove('disable-scroll')
}

createContent(Number(urlParams.get('id')))
