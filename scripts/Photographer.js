import { Tag } from './Tag.js'

export class Photographer {
  constructor (name, id, city, country, tags, tagline, price, portrait, alt) {
    this.name = name
    this.id = id
    this.city = city
    this.country = country
    this.tagline = tagline
    this.price = price
    this.portrait = portrait
    this.alt = alt
    this.tags = []
    tags.forEach(tag => {
      this.tags.push(new Tag(tag))
    })
  }

  getFolderName () {
    return this.name.toLowerCase().replace(' ', '')
  }
}
