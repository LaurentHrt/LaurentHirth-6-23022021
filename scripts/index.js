const url = './public/data/FishEyeDataFR.json'
const main = document.getElementById('main')

async function getData() {
  const response = await fetch(url)
  let photographers

  if (response.ok) {
    photographers = await response.json()
  } else {
    alert('HTTP-Error: ' + response.status)
  }

  photographers.photographers.forEach((element) => {
    main.innerHTML += `
      <section class="card-photograph">
        <div class="card-photograph__portrait">
          <img src="./public/img/1_small/PhotographersID/${element.portrait}" alt="${element.alt}" />
        </div>
        <div class="card-photograph__name">${element.name}</div>
        <div class="card-photograph__city">${element.city} ${element.country}</div>
        <div class="card-photograph__tagline">${element.tagline}</div>
        <div class="card-photograph__price">${element.price}€/jour</div>
        <div class="tag-list card-photograph__tags">${element.tags}</div>
      </section>
    `
  })
}
