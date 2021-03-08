export class MediaList {
  constructor () {
    this.mediaList = []
  }

  addMedia (media) {
    this.mediaList.push(media)
  }

  getAllMedia () {
    return this.mediaList
  }

  getMediaById (id) {
    for (const media of this.mediaList) {
      if (media.id === id) { return media }
    }
  }

  GetMediaByTag (...tag) {

  }

  getMediaSorted (sort) {
    if (sort === 'popularite') {
      return this.mediaList.sort((a, b) => b.likes - a.likes)
    } else if (sort === 'date') {
      return this.mediaList.sort((a, b) => b.date - a.date)
    } else if (sort === 'titre') {
      return this.mediaList.sort(function (a, b) {
        const titleA = a.title.toUpperCase()
        const titleB = b.title.toUpperCase()
        if (titleA < titleB) {
          return -1
        }
        if (titleA > titleB) {
          return 1
        }
        return 0
      })
    } else { return this.mediaList }
  }

  getLikes () {
    let sum = 0
    this.mediaList.forEach((media) => {
      sum += media.likes
    })
    return sum
  }
}
