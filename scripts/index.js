const url = './public/data/FishEyeDataFR.json'
const main = document.getElementById('main')
const tagList = document.querySelector('.tag-list')

async function getData() {
  const response = await fetch(url)
  let fishEyeData

  if (response.ok) {
    fishEyeData = await response.json()
  } else {
    alert('HTTP-Error: ' + response.status)
  }

  main.innerHTML = buildCardPhotograph(fishEyeData.photographers)

  tagList.innerHTML = buildTagList(fishEyeData.photographers)
}

function buildCardPhotograph(photographers) {
  let cardPhotographBloc = ''

  photographers.forEach((photographer) => {
    cardPhotographBloc += `
        <section class="card-photograph">
          <div class="card-photograph__portrait">
            <img src="./public/img/1_small/PhotographersID/${photographer.portrait}" alt="${photographer.alt}" />
          </div>
          <div class="card-photograph__name">${photographer.name}</div>
          <div class="card-photograph__city">${photographer.city} ${photographer.country}</div>
          <div class="card-photograph__tagline">${photographer.tagline}</div>
          <div class="card-photograph__price">${photographer.price}€/jour</div>
          <div class="tag-list card-photograph__tags">`

    photographer.tags.forEach((tag) => {
      cardPhotographBloc += `<div class="tag">#${tag}</div>`
    })

    cardPhotographBloc += '</div></section>'
  })

  return cardPhotographBloc
}

function buildTagList(photographers) {
  let tagListBloc = ''

  const tags = []
  photographers.forEach((photographer) => {
    tags.push(...photographer.tags)
  })

  new Set(tags).forEach((tag) => {
    tagListBloc += `<div class="tag">#${tag}</div>`
  })

  return tagListBloc
}
