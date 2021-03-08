import { Photographer } from './Photographer.js'
import { PhotographerList } from './PhotographerList.js'

// ***************** Declarations ***************** //
const linkToData = './public/data/FishEyeDataFR.json'
const mainHomePage = document.querySelector('#main-homePage')
const tagList = document.querySelector('nav.tag-list')
const photographerList = new PhotographerList()

// ***************** Functions ***************** //
function createContent (photographerId) {
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
  displayTags(photographerList.getAllTags(), tagList)
  displayPhotographers()
}

function displayPhotographers () {
  photographerList.getAllPhotographer().forEach((photographer) => {
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
    divName.textContent = photographer.name
    divCity.textContent = photographer.city + ', ' + photographer.country
    divTagline.textContent = photographer.tagline
    divPrice.textContent = photographer.price + '€/jour'

    divPortrait.append(img)
    a.append(divPortrait, divName)
    cardPhotograph.append(a, divCity, divTagline, divPrice, divTag)

    displayTags(photographer.tags, divTag)

    mainHomePage.append(cardPhotograph)
  })
}

function displayTags (tags, location) {
  tags.forEach((tag) => {
    const a = document.createElement('a')
    const span = document.createElement('span')
    a.classList.add('display-contents')
    span.classList.add('tag')
    a.href = ''
    span.textContent = '#' + tag
    a.append(span)
    location.append(a)

    a.addEventListener('click', (e) => {
      e.preventDefault()
      span.classList.toggle('tag--selected')
    })
  })
}

createContent()
