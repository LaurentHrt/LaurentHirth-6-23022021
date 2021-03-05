import { Photographer } from './Photographer.js'
import { PhotographerList } from './PhotographerList.js'
import { Media } from './Media.js'

// ***************** Declarations ***************** //
const urlParams = new URLSearchParams(window.location.search)
const linkToData = './public/data/FishEyeDataFR.json'
const relativePathToSmallImg = './public/img/1_small/'
const photographerList = new PhotographerList()
const contactModal = document.querySelector('.contactModal')
const mediaModal = document.querySelector('.mediaModal')

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
  buildMediaModal()
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
  })

  button.addEventListener('click', () => openContactModal(photographerId))
}

function displayInfoBox (photographerId) {
  const likeText = document.querySelector('.info-box__like')
  const priceText = document.querySelector('.info-box__price')

  likeText.textContent = photographerList.getPhotographerById(photographerId).getLikes() + '❤'
  priceText.textContent = photographerList.getPhotographerById(photographerId).price + '€/jour'
}

function displayMediaList (photographerId) {
  const sectionMediaList = document.querySelector('.media-list')

  photographerList.getPhotographerById(photographerId).mediaList.forEach((media) => {
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
    a.addEventListener('click', (e) => e.preventDefault())
    a.addEventListener('click', () => openMediaModal(media, linkToMedia))

    divTitle.textContent = media.link.replace('.jpg', '').replaceAll('_', ' ')
    divPrice.textContent = media.price + '€'
    divLikes.textContent = media.likes + ' ❤'

    sectionCardMedia.append(divMedia)
    a.append(specificMediaElement)
    divMedia.append(a)
    textContainer.append(divTitle, divPrice, divLikes)
    sectionCardMedia.append(textContainer)
    sectionMediaList.append(sectionCardMedia)
  })
}

function buildMediaModal () {
  const close = mediaModal.querySelector('.mediaModal__content__close')
  const rightArrow = mediaModal.querySelector('.mediaModal__content__rightArrow')
  const leftArrow = mediaModal.querySelector('.mediaModal__content__leftArrow')

  close.addEventListener('click', closeMediaModal)
  mediaModal.addEventListener('click', closeMediaModal)
  mediaModal.firstElementChild.addEventListener('click', (e) => e.stopPropagation())

  rightArrow.addEventListener('click', () => {})
  leftArrow.addEventListener('click', () => {})
}

function openContactModal (photographerId) {
  const title = contactModal.querySelector('.contactModal__content__title')
  const close = contactModal.querySelector('.contactModal__content__close')

  close.addEventListener('click', closeContactModal)
  contactModal.addEventListener('click', closeContactModal)
  contactModal.firstElementChild.addEventListener('click', (e) => e.stopPropagation())

  title.innerHTML = photographerList.getPhotographerById(photographerId).name + '</br>' + 'Contactez-moi'
  contactModal.style.display = 'block'
  document.body.classList.add('disable-scroll')
}

function closeContactModal () {
  contactModal.style.display = 'none'
  document.body.classList.remove('disable-scroll')
}

function openMediaModal (media, linkToMedia) {
  const mediaSection = mediaModal.querySelector('.mediaModal__content__media')

  mediaSection.firstChild.replaceWith(media.getDOMComponent(linkToMedia))

  mediaModal.style.display = 'block'
  document.body.classList.add('disable-scroll')
}

function closeMediaModal () {
  mediaModal.style.display = 'none'
  document.body.classList.remove('disable-scroll')
}

createContent(Number(urlParams.get('id')))
