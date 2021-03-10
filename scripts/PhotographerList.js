export class PhotographerList {
  constructor () {
    this.photographerList = []
  }

  addPhotographer (photographer) {
    this.photographerList.push(photographer)
  }

  getPhotographerList (...tags) {
    let returnedList = []

    if (tags.length !== 0) {
      this.photographerList.forEach((photograph) => {
        photograph.tags.forEach((tag) => {
          if (tags.includes(tag) && !returnedList.includes(photograph)) {
            returnedList.push(photograph)
          }
        })
      })
    } else {
      returnedList = this.photographerList.slice()
    }

    return returnedList
  }

  getAllTags () {
    const tags = []

    this.photographerList.forEach((photographer) => {
      photographer.tags.forEach((tag) => {
        tags.push(tag)
      })
    })

    return new Set(tags)
  }

  getPhotographerById (id) {
    for (const photographer of this.photographerList) {
      if (photographer.id === id) { return photographer }
    }
  }
}
