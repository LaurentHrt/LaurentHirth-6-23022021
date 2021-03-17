export class MediaList {
  constructor () {
    this.mediaList = []
  }

  addMedia (media) {
    this.mediaList.push(media)
  }

  getMediaList (sort, ...tags) {
    const localMediaList = this.mediaList.slice()
    let returnedList = []

    if (sort === 'popularite') {
      localMediaList.sort((a, b) => b.likes - a.likes)
    } else if (sort === 'date') {
      localMediaList.sort((a, b) => b.date - a.date)
    } else if (sort === 'titre') {
      localMediaList.sort(function (a, b) {
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
    }

    if (tags.length !== 0) {
      localMediaList.forEach((media) => {
        media.tags.forEach((tag) => {
          if (tags.includes(tag) && !returnedList.includes(media)) {
            returnedList.push(media)
          }
        })
      })
    } else {
      returnedList = localMediaList.slice()
    }

    return returnedList
  }

  getMediaById (id) {

  }

  getLikes () {
    let sum = 0
    this.mediaList.forEach((media) => {
      sum += media.likes
    })
    return sum
  }
}
