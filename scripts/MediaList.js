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
    return this.mediaList.sort((a, b) => b[sort] - a[sort])
  }

  getLikes () {
    let sum = 0
    this.mediaList.forEach((media) => {
      sum += media.likes
    })
    return sum
  }
}
