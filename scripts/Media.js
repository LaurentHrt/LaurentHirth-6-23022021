export class Media {
  createMedia (id, photographerId, type, link, tags, likes, date, price, alt) {
    if (type === 'jpg') {
      return new Photo(id, photographerId, link, tags, likes, date, price, alt)
    } else if (type === 'mp4') {
      return new Video(id, photographerId, link, tags, likes, date, price, alt)
    }
  }
}

export class Photo extends Media {
  constructor (id, photographerId, link, tags, likes, date, price, alt) {
    super()
    this.id = id
    this.photographerId = photographerId
    this.link = link
    this.tags = tags
    this.likes = likes
    this.date = date
    this.price = price
    this.alt = alt
  }
}

export class Video extends Media {
  constructor (id, photographerId, link, tags, likes, date, price, alt) {
    super()
    this.id = id
    this.photographerId = photographerId
    this.link = link
    this.tags = tags
    this.likes = likes
    this.date = date
    this.price = price
    this.alt = alt
  }
}
