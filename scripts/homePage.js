import { Photographer } from './Photographer.js'
import { PhotographerList } from './PhotographerList.js'

// ***************** Declarations ***************** //
const linkToData = './public/data/FishEyeDataFR.json'
const photographerList = new PhotographerList()

// ***************** Functions ***************** //
function createContent () {
  fetch(linkToData)
    .then((response) => {
      if (response.ok) {
        return response.json()
      }
    })
    .then((data) => createPhotographerList(data))
    .then(displayPage)
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
}

function displayPage () {
  displayTags()
  displayPhotographers()
}

function displayTags () {
  const tagList = document.querySelector('nav.tag-list')

  photographerList.getAllTags().forEach((tag) => {
    const a = document.createElement('a')
    const span = document.createElement('span')
    a.classList.add('tag')
    a.href = ''
    a.textContent = '#' + tag.name
    a.setAttribute('aria-labelledby', `${tag.name}`)

    span.id = `${tag.name}`
    span.textContent = 'Hashtag ' + tag.name
    span.classList.add('sr-only')

    tagList.append(a)
    tagList.append(span)

    a.addEventListener('click', (e) => {
      e.preventDefault()
      a.classList.toggle('tag--selected')
      displayPhotographers()
    })
  })
}

function displayPhotographers () {
  const mainHomePage = document.querySelector('#main-homePage')
  const filters = []

  mainHomePage.innerHTML = ''
  document.querySelectorAll('.tag--selected').forEach((tagSelected) => {
    filters.push(tagSelected.textContent.replace('#', ''))
  })

  photographerList.getPhotographerList(...filters).forEach((photographer) => {
    const linkToPage = 'photographer.html?id=' + photographer.id
    const linkToPhoto = './public/img/1_small/PhotographersID/' + photographer.portrait
    const cardPhotograph = document.createElement('section')
    const a = document.createElement('a')
    const img = document.createElement('img')
    const divPortrait = document.createElement('div')
    const divName = document.createElement('div')
    const divCity = document.createElement('div')
    const divTagline = document.createElement('div')
    const divPrice = document.createElement('div')
    const divTag = document.createElement('div')

    cardPhotograph.classList.add('card-photograph')
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
    divName.textContent = photographer.name
    divCity.textContent = photographer.city + ', ' + photographer.country
    divTagline.textContent = photographer.tagline
    divPrice.textContent = photographer.price + '€/jour'

    divPortrait.append(img)
    a.append(divPortrait, divName)
    cardPhotograph.append(a, divCity, divTagline, divPrice, divTag)

    photographer.tags.forEach((tag) => {
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

      a.href = linkToPage + '&tag=' + tag
    })

    mainHomePage.append(cardPhotograph)
  })
}

createContent()
