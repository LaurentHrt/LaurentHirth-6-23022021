export class PhotographerList {
  constructor () {
    this.photographerList = []
  }

  addPhotographer (photographer) {
    this.photographerList.push(photographer)
  }

  getPhotographerById (id) {
    for (const photographer of this.photographerList) {
      if (photographer.id == id) { return photographer }
    }
  }

  GetPhotographerByTag (...tag) {

  }

  getPhotographerSorted (sort) {

  }
}
