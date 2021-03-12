import { Photographer } from './Photographer.js'
import { Media } from './Media.js'
import { MediaList } from './MediaList.js'

// ***************** Declarations ***************** //
const urlParams = new URLSearchParams(window.location.search)
const linkToData = './public/data/FishEyeDataFR.json'
let currentPhotographer = Photographer
const mediaList = new MediaList()
const contactModal = document.querySelector('.contactModal')

// ***************** Functions ***************** //
function createContent (photographerId) {
  fetch(linkToData)
    .then((response) => {
      if (response.ok) {
        return response.json()
      } else {
        throw new Error('Unexpected responses status or content type')
      }
    })
    .then((data) => createData(data, photographerId))
    .then(displayPage)
    .catch(error => {
      console.log('Error while fetching data:', error)
    })
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
      mediaList.addMedia(mediaFactory.createMedia(media.id, media.photographerId, media.image?.split('.').pop() || media.video?.split('.').pop(), media.image || media.video, media.tags, media.likes, media.date, media.price, media.alt, currentPhotographer.name.toLowerCase().replace(' ', '') + '/'))
    }
  })
}

function displayPage () {
  document.title += ' - ' + currentPhotographer.name

  displayBanner()
  displayFilterMenu()
  displayMediaList()
  displayInfoBox()
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
    a.classList.add('tag')
    a.href = ''
    a.textContent = '#' + tag
    a.setAttribute('aria-labelledby', `${tag}`)

    span.id = `${tag}`
    span.textContent = 'Hashtag ' + tag
    span.classList.add('sr-only')

    divTag.append(a)
    divTag.append(span)

    a.addEventListener('click', (e) => {
      e.preventDefault()
      a.classList.toggle('tag--selected')
      displayMediaList()
    })
  })

  button.addEventListener('click', () => openContactModal())
}

function displayFilterMenu () {
  const dropDownMenu = document.querySelector('.dropdownMenu-wrapper a')
  const customSelect = document.querySelector('.custom-select')
  const customSelectTrigger = document.querySelector('.custom-select__trigger')

  dropDownMenu.addEventListener('click', function (e) {
    e.preventDefault()
    customSelect.classList.toggle('open')
    if (customSelectTrigger.getAttribute('aria-expanded') === 'true') {
      customSelectTrigger.setAttribute('aria-expanded', 'false')
    } else {
      customSelectTrigger.setAttribute('aria-expanded', 'true')
    }
  })

  for (const option of document.querySelectorAll('.custom-option')) {
    option.addEventListener('click', function (e) {
      e.preventDefault()
      if (!this.classList.contains('selected')) {
        customSelect.classList.remove('open')
        const selected = this.parentNode.querySelector('.custom-option.selected')
        selected.setAttribute('aria-selected', 'false')
        selected.classList.remove('selected')
        this.classList.add('selected')
        this.setAttribute('aria-selected', 'true')
        this.closest('.custom-select').querySelector('.custom-select__trigger span').textContent = this.textContent
        displayMediaList()
      }
    })
  }

  window.addEventListener('click', function (e) {
    if (!customSelect.contains(e.target)) {
      customSelect.classList.remove('open')
      customSelectTrigger.setAttribute('aria-expanded', 'false')
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
    const sectionCardMedia = document.createElement('section')
    const divMedia = document.createElement('div')
    const specificMediaElement = media.getDOMComponent()
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

    a.href = ''
    a.addEventListener('click', (e) => e.preventDefault())
    a.addEventListener('click', () => openMediaModal(media))

    divTitle.textContent = media.title
    divPrice.textContent = media.price + '€'
    divLikes.textContent = media.likes + ' ❤'
    divLikes.setAttribute('aria-label', 'likes')

    sectionCardMedia.append(divMedia)
    divMedia.append(specificMediaElement)
    a.append(divMedia)
    a.append(textContainer)
    textContainer.append(divTitle, divPrice, divLikes)
    sectionCardMedia.append(a)
    sectionMediaList.append(sectionCardMedia)
  })
}

function openContactModal () {
  const main = document.querySelector('main')
  const header = document.querySelector('header')
  const contactModal = document.querySelector('.contactModal')
  const title = contactModal.querySelector('.contactModal__content__title')
  const close = contactModal.querySelector('.contactModal__content__close')
  const form = contactModal.querySelector('.contactModal__content__form')
  const formData = contactModal.querySelectorAll('.contactModal__content__form .formData')
  const confirmation = contactModal.querySelector('.contactModal__content__confirmation')
  const submitBtn = contactModal.querySelector('.contactModal__content__btn-submit')

  main.setAttribute('aria-hidden', 'true')
  header.setAttribute('aria-hidden', 'true')
  contactModal.setAttribute('aria-hidden', 'false')

  close.addEventListener('click', e => e.preventDefault())
  close.addEventListener('click', closeContactModal)
  contactModal.addEventListener('click', closeContactModal)
  contactModal.firstElementChild.addEventListener('click', (e) => e.stopPropagation())

  form.addEventListener('submit', e => e.preventDefault())
  form.addEventListener('submit', submitContactModal)

  submitBtn.addEventListener('click', () => {
    formData.forEach((element) => {
      element.querySelectorAll('*[required]').forEach((input) => {
        if (input.matches(':invalid')) {
          element.setAttribute('data-error-visible', 'true')
        } else {
          element.setAttribute('data-error-visible', 'false')
        }
      })
    })
  })

  form.style.display = 'block'
  confirmation.style.display = 'none'

  title.innerHTML = currentPhotographer.name + '</br>' + 'Contactez-moi'
  contactModal.style.display = 'block'
  document.body.classList.add('disable-scroll')

  close.focus()
}

function closeContactModal () {
  const main = document.querySelector('main')
  const header = document.querySelector('header')
  const contactModal = document.querySelector('.contactModal')

  main.setAttribute('aria-hidden', 'false')
  header.setAttribute('aria-hidden', 'false')
  contactModal.setAttribute('aria-hidden', 'true')

  contactModal.style.display = 'none'
  document.body.classList.remove('disable-scroll')
}

function submitContactModal (e) {
  e.preventDefault()
  const form = contactModal.querySelector('.contactModal__content__form')
  const close = contactModal.querySelector('.contactModal__content__close')
  const confirmation = contactModal.querySelector('.contactModal__content__confirmation')
  form.style.display = 'none'
  confirmation.style.display = 'flex'
  close.focus()
}

function openMediaModal (media) {
  const main = document.querySelector('main')
  const header = document.querySelector('header')
  const mediaModal = document.querySelector('.mediaModal')
  const mediaSection = mediaModal.querySelector('.mediaModal__content__media')
  const mediaTitle = mediaModal.querySelector('.mediaModal__content__title')
  const close = mediaModal.querySelector('.mediaModal__close')
  const rightArrow = mediaModal.querySelector('.rightArrow')
  const leftArrow = mediaModal.querySelector('.leftArrow')

  main.setAttribute('aria-hidden', 'true')
  header.setAttribute('aria-hidden', 'true')
  mediaModal.setAttribute('aria-hidden', 'false')

  close.addEventListener('click', e => e.preventDefault())
  close.addEventListener('click', closeMediaModal)
  mediaModal.addEventListener('click', closeMediaModal)
  mediaModal.firstElementChild.addEventListener('click', e => e.stopPropagation())
  rightArrow.addEventListener('click', e => e.preventDefault())
  leftArrow.addEventListener('click', e => e.preventDefault())
  mediaTitle.textContent = media.title
  mediaSection.firstChild.replaceWith(media.getDOMComponent(true))

  mediaModal.style.display = 'block'
  document.body.classList.add('disable-scroll')

  close.focus()
}

function closeMediaModal () {
  const main = document.querySelector('main')
  const header = document.querySelector('header')
  const mediaModal = document.querySelector('.mediaModal')

  main.setAttribute('aria-hidden', 'false')
  header.setAttribute('aria-hidden', 'false')
  mediaModal.setAttribute('aria-hidden', 'true')

  mediaModal.style.display = 'none'
  document.body.classList.remove('disable-scroll')
}

createContent(Number(urlParams.get('id')))
