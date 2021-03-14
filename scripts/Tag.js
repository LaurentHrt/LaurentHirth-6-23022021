export class Tag {
  constructor (name) {
    this.name = name
    this.selected = false
  }

  getHTML () {
    const a = document.createElement('a')
    a.classList.add('tag')
    a.href = ''
    a.textContent = '#' + this.name
    a.setAttribute('aria-labelledby', `${this.name}`)

    a.addEventListener('click', (e) => {
      e.preventDefault()
      a.classList.toggle('tag--selected')
    })

    return a
  }

  getSRspan () {
    const span = document.createElement('span')
    span.id = `${this.name}`
    span.textContent = 'Hashtag ' + this.name
    span.classList.add('sr-only')

    return span
  }
}
