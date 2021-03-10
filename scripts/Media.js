export class Media {
  createMedia (id, photographerId, type, link, tags, likes, date, price, alt, path) {
    if (type === 'jpg') {
      const photo = new Photo()
      photo.title = link.replace('.jpg', '').replaceAll('_', ' ')
      photo.id = id
      photo.photographerId = photographerId
      photo.link = path + link
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
      video.link = path + link
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
  getDOMComponent () {
    const relativePathToSmallImg = './public/img/1_small/'
    const relativePathToMediumImg = './public/img/2_medium/'
    const picture = document.createElement('picture')
    const source = document.createElement('source')
    const img = document.createElement('img')

    source.srcset = relativePathToMediumImg + this.link
    source.media = '(min-width: 768px)'

    img.src = relativePathToSmallImg + this.link
    img.alt = this.alt

    picture.append(source)
    picture.append(img)

    return picture
  }
}

export class Video extends Media {
  getDOMComponent () {
    const relativePathToSmallImg = './public/img/1_small/'
    const relativePathToMediumImg = './public/img/2_medium/'
    const video = document.createElement('video')
    const sourceSmall = document.createElement('source')
    const sourceMedium = document.createElement('source')

    video.controls = true
    video.muted = true
    video.loop = true

    sourceMedium.media = '(min-width: 1200px)'
    sourceMedium.src = relativePathToMediumImg + this.link
    sourceMedium.type = 'video/mp4'

    sourceSmall.media = '(max-width: 1200px)'
    sourceSmall.src = relativePathToSmallImg + this.link
    sourceSmall.type = 'video/mp4'

    video.append(sourceMedium)
    video.append(sourceSmall)

    return video
  }
}
