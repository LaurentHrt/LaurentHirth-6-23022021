export class Media {
  constructor (id, photographerId, type, link, tags, likes, date, price, alt) {
    this.id = id
    this.photographerId = photographerId
    this.link = link
    this.type = type
    this.tags = tags
    this.likes = likes
    this.date = date
    this.price = price
    this.alt = alt
  }

  createMedia () {
    if (this.type === 'jpg') {
      return new Photo(this.id, this.photographerId, this.type, this.link, this.tags, this.likes, this.date, this.price, this.alt)
    } else if (this.type === 'mp4') {
      return new Video(this.id, this.photographerId, this.type, this.link, this.tags, this.likes, this.date, this.price, this.alt)
    }
  }
}

export class Photo extends Media {
  getDOMComponent (src) {
    const img = document.createElement('img')
    img.src = src
    img.alt = this.alt
    return img
  }
}

export class Video extends Media {
  getDOMComponent (src) {
    const video = document.createElement('video')
    const source = document.createElement('source')

    video.controls = true
    video.muted = true
    video.loop = true

    source.src = src
    source.type = 'video/mp4'

    video.append(source)

    return video
  }
}
