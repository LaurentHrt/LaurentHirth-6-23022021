export class Media {
  createMedia (id, photographerId, type, link, tags, likes, date, price, alt) {
    if (type === 'jpg') {
      const photo = new Photo()
      photo.title = link.replace('.jpg', '').replaceAll('_', ' ')
      photo.id = id
      photo.photographerId = photographerId
      photo.link = link
      photo.tags = tags
      photo.likes = likes
      photo.date = new Date(date)
      photo.price = price
      photo.alt = alt
      return photo
    } else if (type === 'mp4') {
      const video = new Video()
      video.title = link.replace('.mp4', '').replaceAll('_', ' ')
      video.id = id
      video.photographerId = photographerId
      video.link = link
      video.tags = tags
      video.likes = likes
      video.date = new Date(date)
      video.price = price
      video.alt = alt
      return video
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
