import { Photographer } from './Photographer.js'
import { Media } from './Media.js'
import { MediaList } from './MediaList.js'

// ***************** Declarations ***************** //
const urlParams = new URLSearchParams(window.location.search)
const linkToData = './public/data/FishEyeDataFR.json'
const relativePathToSmallImg = './public/img/1_small/'
let currentPhotographer = Photographer
const mediaList = new MediaList()
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
    .then((data) => createData(data, photographerId))
    .then(displayPage)
}

function createData (fetchedData, photographerId) {
  fetchedData.photographers.forEach((photographer) => {
    if (photographer.id === photographerId) {
      currentPhotographer = new Photographer(
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
    }
  })

  const mediaFactory = new Media()

  fetchedData.media.forEach((media) => {
    if (media.photographerId === photographerId) {
      mediaList.addMedia(mediaFactory.createMedia(media.id, media.photographerId, media.image?.split('.').pop() || media.video?.split('.').pop(), media.image || media.video, media.tags, media.likes, media.date, media.price, media.alt))
    }
  })
}

function displayPage () {
  document.title += ' - ' + currentPhotographer.name

  displayBanner()
  displayFilterMenu()
  displayMediaList()
  displayInfoBox()
  buildMediaModal()
}

function displayBanner () {
  const linkToPhoto = './public/img/1_small/PhotographersID/' + currentPhotographer.portrait
  const img = document.querySelector('.card-banner-photograph__portrait img')
  const divName = document.querySelector('.card-banner-photograph__name')
  const divCity = document.querySelector('.card-banner-photograph__city')
  const divTagline = document.querySelector('.card-banner-photograph__tagline')
  const divTag = document.querySelector('.card-banner-photograph__tags')
  const button = document.querySelector('.card-banner-photograph__button')

  img.src = linkToPhoto
  img.alt = ''
  divName.textContent = currentPhotographer.name
  divCity.textContent = currentPhotographer.city + ', ' + currentPhotographer.country
  divTagline.textContent = currentPhotographer.tagline

  currentPhotographer.tags.forEach((tag) => {
    const a = document.createElement('a')
    const span = document.createElement('span')
    a.classList.add('display-contents')
    span.classList.add('tag')
    a.href = ''
    span.textContent = '#' + tag
    a.append(span)
    divTag.append(a)

    a.addEventListener('click', (e) => {
      e.preventDefault()
      span.classList.toggle('tag--selected')
      displayMediaList()
    })
  })

  button.addEventListener('click', () => openContactModal())
}

function displayFilterMenu () {
  document.querySelector('.dropdownMenu-wrapper').addEventListener('click', function () {
    this.querySelector('.custom-select').classList.toggle('open')
  })

  for (const option of document.querySelectorAll('.custom-option')) {
    option.addEventListener('click', function () {
      if (!this.classList.contains('selected')) {
        this.parentNode.querySelector('.custom-option.selected').classList.remove('selected')
        this.classList.add('selected')
        this.closest('.custom-select').querySelector('.custom-select__trigger span').textContent = this.textContent
        displayMediaList()
      }
    })
  }

  window.addEventListener('click', function (e) {
    const select = document.querySelector('.custom-select')
    if (!select.contains(e.target)) {
      select.classList.remove('open')
    }
  })
}

function displayInfoBox () {
  const likeText = document.querySelector('.info-box__like')
  const priceText = document.querySelector('.info-box__price')

  likeText.textContent = mediaList.getLikes() + '❤'
  priceText.textContent = currentPhotographer.price + '€/jour'
}

function displayMediaList () {
  const sectionMediaList = document.querySelector('.media-list')
  const sort = document.querySelector('.custom-option.selected')?.getAttribute('data-value')
  const filters = []

  sectionMediaList.innerHTML = ''
  document.querySelectorAll('.tag--selected').forEach((tagSelected) => {
    filters.push(tagSelected.textContent.replace('#', ''))
  })

  mediaList.getMediaList(sort, ...filters).forEach((media) => {
    const linkToMedia = relativePathToSmallImg + currentPhotographer.name.toLowerCase().replace(' ', '') + '/' + media.link

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

    divTitle.textContent = media.title
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

function openContactModal () {
  const title = contactModal.querySelector('.contactModal__content__title')
  const close = contactModal.querySelector('.contactModal__content__close')

  close.addEventListener('click', closeContactModal)
  contactModal.addEventListener('click', closeContactModal)
  contactModal.firstElementChild.addEventListener('click', (e) => e.stopPropagation())

  title.innerHTML = currentPhotographer.name + '</br>' + 'Contactez-moi'
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
