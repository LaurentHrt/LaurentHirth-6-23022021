export class PhotographerList {
  constructor () {
    this.photographerList = []
  }

  addPhotographer (photographer) {
    this.photographerList.push(photographer)
  }

  getAllPhotographer () {
    return this.photographerList
  }

  getAllTags () {
    const tags = []

    this.photographerList.forEach((photographer) => {
      photographer.tags.forEach((tag) => {
        tags.push(tag[0].toUpperCase() + tag.substring(1))
      })
    })

    return new Set(tags)
  }

  getPhotographerById (id) {
    for (const photographer of this.photographerList) {
      if (photographer.id === id) { return photographer }
    }
  }

  GetPhotographerByTag (...tag) {

  }

  getPhotographerSorted (sort) {

  }
}
