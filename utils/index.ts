export const playAudio = (path: string) => {
  return new Audio(path).play()
}

export const sendNotification = (title: string, options: object) => {
  return new Notification(title, options)
}

export const splitValue = (value: number | string, padSize: number = 2) => {
  return `${value}`.padStart(padSize, '0').split('')
}

export const getRandomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min) + min)
}

export const scrollToElement = (selector: string) => {
  const element: HTMLElement | null = document.querySelector(selector)
  const mediaQuery = window.matchMedia('(max-width: 639px)');

  if (element && mediaQuery.matches) {
    element.scrollIntoView({
      block: 'start',
      behavior: 'smooth'
    })
  }
}
