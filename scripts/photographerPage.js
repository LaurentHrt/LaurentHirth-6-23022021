import { Photographer } from './Photographer.js'
import { Media } from './Media.js'
import { MediaList } from './MediaList.js'

// ***************** Declarations ***************** //
const urlParams = new URLSearchParams(window.location.search)
const linkToData = './public/data/FishEyeDataFR.json'
let currentPhotographer = Photographer
const mediaList = new MediaList()
let displayedMediaList = []
const contactModal = document.querySelector('.contactModal')

// ***************** Functions ***************** //
function createContent () {
  fetch(linkToData)
    .then((response) => {
      if (response.ok) {
        return response.json()
      } else {
        throw new Error('Unexpected responses status or content type')
      }
    })
    .then((fetchedData) => createData(fetchedData))
    .then(displayPage)
    .catch(error => {
      console.log('Error while fetching data:', error)
    })
}

function createData (fetchedData) {
  fetchedData.photographers.forEach((photographer) => {
    if (photographer.id === Number(urlParams.get('id'))) {
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
    if (media.photographerId === currentPhotographer.id) {
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
    a.href = '#'
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

    if (urlParams.get('tag') && urlParams.get('tag') === tag) {
      a.classList.toggle('tag--selected')
    }
  })

  button.addEventListener('click', () => openContactModal())
}

function displayFilterMenu () {
  const dropDownMenu = document.querySelector('.dropdownMenu-wrapper a')
  const customSelect = document.querySelector('.custom-select')
  const customSelectTrigger = document.querySelector('.custom-select__trigger')
  const customOptions = document.querySelectorAll('.custom-option')
  const firstCustomOption = document.querySelector('.custom-select a:first-child')
  const lastCustomOption = document.querySelector('.custom-select a:last-child')

  for (const option of customOptions) {
    option.addEventListener('click', function (e) {
      e.preventDefault()
      if (!this.classList.contains('selected')) {
        const selected = this.parentNode.querySelector('.custom-option.selected')
        selected.classList.remove('selected')
        this.classList.add('selected')
        this.setAttribute('aria-selected', 'true')
        this.closest('.custom-select').querySelector('.custom-select__trigger span').textContent = this.textContent
        collapseDropdown()
        displayMediaList()
      }
    })
  }

  dropDownMenu.addEventListener('click', function (e) {
    e.preventDefault()
    if (customSelect.classList.contains('open')) { collapseDropdown() } else { expandDropdown() }
  })

  lastCustomOption.addEventListener('keydown', function (e) {
    if (e.code === 'Tab' && !e.shiftKey) {
      collapseDropdown()
    }
  })

  firstCustomOption.addEventListener('keydown', function (e) {
    if (e.code === 'Tab' && e.shiftKey) {
      collapseDropdown()
    }
  })

  window.addEventListener('click', function (e) {
    if (!customSelect.contains(e.target)) {
      collapseDropdown()
    }
  })

  function expandDropdown () {
    customSelect.classList.add('open')
    customSelectTrigger.setAttribute('aria-expanded', 'true')
  }

  function collapseDropdown () {
    customSelect.classList.remove('open')
    customSelectTrigger.setAttribute('aria-expanded', 'false')
  }
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

  displayedMediaList = mediaList.getMediaList(sort, ...filters)

  displayedMediaList.forEach((media) => {
    const sectionCardMedia = document.createElement('section')
    const divMedia = document.createElement('div')
    const specificMediaElement = media.getDOMComponent()
    const divTitle = document.createElement('div')
    const divPrice = document.createElement('div')
    const divLikes = document.createElement('div')
    const textContainer = document.createElement('div')
    const a = document.createElement('a')
    const likeIcon = document.createElement('i')

    sectionCardMedia.classList.add('card-media')
    divMedia.classList.add('card-media__media')
    divTitle.classList.add('card-media__title')
    divPrice.classList.add('card-media__price')
    divLikes.classList.add('card-media__likes')
    textContainer.classList.add('card-media__textContainer')
    likeIcon.classList.add('far', 'fa-heart')

    a.href = '#'
    a.addEventListener('click', (e) => e.preventDefault())
    a.addEventListener('click', () => openMediaModal(media, displayedMediaList))

    divLikes.addEventListener('click', () => {
      if (likeIcon.classList.contains('fas')) {
        removeLike()
      } else {
        addLike()
      }
    })

    divLikes.addEventListener('keydown', (e) => {
      if (e.code === 'Enter' || e.code === 'NumpadEnter') {
        if (likeIcon.classList.contains('fas')) {
          removeLike()
        } else {
          addLike()
        }
      }
    })

    divTitle.textContent = media.title
    divPrice.textContent = media.price + '€'
    divLikes.innerHTML = media.likes + ' ' + likeIcon.outerHTML
    divLikes.setAttribute('aria-label', 'Aimer la photo')
    divLikes.setAttribute('role', 'button')
    divLikes.setAttribute('tabindex', '0')

    sectionCardMedia.append(divMedia)
    divMedia.append(specificMediaElement)
    a.append(divMedia)
    textContainer.append(divTitle, divPrice, divLikes)
    sectionCardMedia.append(a)
    sectionCardMedia.append(textContainer)
    sectionMediaList.append(sectionCardMedia)

    function addLike () {
      media.likes++
      likeIcon.classList.remove('far')
      likeIcon.classList.add('fas')
      divLikes.innerHTML = media.likes + ' ' + likeIcon.outerHTML
    }

    function removeLike () {
      media.likes--
      likeIcon.classList.add('far')
      likeIcon.classList.remove('fas')
      divLikes.innerHTML = media.likes + ' ' + likeIcon.outerHTML
    }
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

  close.addEventListener('click', closeContactModal)
  close.addEventListener('keydown', e => {
    if (e.code === 'Tab' && e.shiftKey) {
      e.preventDefault()
      submitBtn.focus()
    }
  })
  contactModal.addEventListener('click', closeContactModal)
  contactModal.addEventListener('keydown', e => { if (e.code === 'Escape') { closeContactModal() } })
  contactModal.firstElementChild.addEventListener('click', (e) => e.stopPropagation())

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
  submitBtn.addEventListener('keydown', e => {
    if (e.code === 'Tab') { e.preventDefault() }
    close.focus()
  })

  form.style.display = 'block'
  confirmation.style.display = 'none'

  title.innerHTML = 'Contactez-moi' + '</br>' + currentPhotographer.name
  contactModal.style.display = 'block'
  document.body.classList.add('disable-scroll')

  close.focus()
}

function closeContactModal (e) {
  e.preventDefault()
  const main = document.querySelector('main')
  const header = document.querySelector('header')
  const contactModal = document.querySelector('.contactModal')
  const button = document.querySelector('.card-banner-photograph__button')

  main.setAttribute('aria-hidden', 'false')
  header.setAttribute('aria-hidden', 'false')
  contactModal.setAttribute('aria-hidden', 'true')

  contactModal.style.display = 'none'
  document.body.classList.remove('disable-scroll')
  button.focus()
}

function submitContactModal (e) {
  e.preventDefault()
  const form = contactModal.querySelector('.contactModal__content__form')
  const close = contactModal.querySelector('.contactModal__content__close')
  const confirmation = contactModal.querySelector('.contactModal__content__confirmation')
  form.style.display = 'none'
  confirmation.style.display = 'flex'
  close.addEventListener('keydown', e => { if (e.code === 'Tab') { e.preventDefault() } })
  close.focus()
}

function openMediaModal (media, displayedMediaList) {
  const main = document.querySelector('main')
  const header = document.querySelector('header')
  const mediaModal = document.querySelector('.mediaModal')
  const mediaSection = mediaModal.querySelector('.mediaModal__content__media')
  const mediaTitle = mediaModal.querySelector('.mediaModal__content__title')
  const close = mediaModal.querySelector('.mediaModal__close')
  const arrows = mediaModal.querySelectorAll('a.mediaModal__arrow')
  const leftArrow = arrows[0]
  const rightArrow = arrows[1]

  let currentMedia = media

  main.setAttribute('aria-hidden', 'true')
  header.setAttribute('aria-hidden', 'true')
  mediaModal.setAttribute('aria-hidden', 'false')

  close.addEventListener('click', e => closeMediaModal(e, media))
  close.addEventListener('keydown', e => {
    if (e.code === 'Tab' && e.shiftKey) {
      e.preventDefault()
      rightArrow.focus()
    }
  })
  mediaModal.addEventListener('click', e => closeMediaModal(e, media))
  mediaModal.addEventListener('keydown', e => {
    if (e.code === 'Escape') { closeMediaModal(e, media) }
    if (e.code === 'ArrowRight') { nextMedia(e) }
    if (e.code === 'ArrowLeft') { previousMedia(e) }
  })
  mediaModal.firstElementChild.addEventListener('click', e => e.stopPropagation())
  rightArrow.addEventListener('click', e => nextMedia(e))
  leftArrow.addEventListener('click', e => previousMedia(e))
  rightArrow.addEventListener('keydown', e => {
    if (e.code === 'Tab' && !e.shiftKey) {
      e.preventDefault()
      close.focus()
    }
  })

  showContent()

  mediaModal.style.display = 'block'
  document.body.classList.add('disable-scroll')
  close.focus()

  function nextMedia (e) {
    e.preventDefault()
    if ((displayedMediaList.indexOf(currentMedia) + 1) >= displayedMediaList.length) {
      currentMedia = displayedMediaList[0]
    } else {
      currentMedia = displayedMediaList[displayedMediaList.indexOf(currentMedia) + 1]
    }
    showContent()
  }

  function previousMedia (e) {
    e.preventDefault()
    if ((displayedMediaList.indexOf(currentMedia) - 1) < 0) {
      currentMedia = displayedMediaList[displayedMediaList.length - 1]
    } else {
      currentMedia = displayedMediaList[displayedMediaList.indexOf(currentMedia) - 1]
    }
    showContent()
  }

  function showContent () {
    mediaTitle.textContent = currentMedia.title
    mediaSection.firstChild.replaceWith(currentMedia.getDOMComponent(true))
  }
}

function closeMediaModal (e, media) {
  e.preventDefault()
  const main = document.querySelector('main')
  const header = document.querySelector('header')
  const mediaModal = document.querySelector('.mediaModal')
  const mediaList = document.querySelector('.media-list a')

  main.setAttribute('aria-hidden', 'false')
  header.setAttribute('aria-hidden', 'false')
  mediaModal.setAttribute('aria-hidden', 'true')

  mediaModal.style.display = 'none'
  document.body.classList.remove('disable-scroll')
  mediaList.focus()
}

createContent()
