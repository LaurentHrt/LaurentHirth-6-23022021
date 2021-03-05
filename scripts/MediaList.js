// Non Utilisé

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

  }
}
