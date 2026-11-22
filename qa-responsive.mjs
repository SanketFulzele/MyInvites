import { chromium } from 'playwright'

const URL = 'http://localhost:5173/invite/sakura-wedding'
const IDS = ['top', 'letter', 'couple', 'spring', 'story', 'journey', 'venue', 'events', 'countdown', 'family', 'keepsake', 'rsvp', 'closing']

const browser = await chromium.launch({ headless: true })
const results = []

for (const [width, height, reduced] of [
  [375, 812, false],
  [768, 1024, false],
  [1280, 800, false],
  [375, 812, true],
]) {
  const context = await browser.newContext({
    viewport: { width, height },
    reducedMotion: reduced ? 'reduce' : 'no-preference',
  })
  const page = await context.newPage()
  const errors = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text())
  })
  page.on('pageerror', (error) => errors.push(error.message))
  page.setDefaultTimeout(10000)
  await page.goto(URL, { waitUntil: 'domcontentloaded' })
  await page.waitForSelector('button')
  console.log('loaded', width, reduced)
  await page.evaluate(() => {
    const button = [...document.querySelectorAll('button')].find((b) => b.textContent?.includes('ENTER THE CELEBRATION'))
    button?.click()
  })
  await page.waitForTimeout(400)
  for (const id of IDS) {
    await page.evaluate((sectionId) => {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'instant', block: 'start' })
    }, id)
    await page.waitForTimeout(90)
  }
  await page.waitForTimeout(250)
  const info = await page.evaluate((ids) => ({
    overflow: document.documentElement.scrollWidth - window.innerWidth,
    h1: document.querySelectorAll('h1').length,
    missing: ids.filter((id) => !document.getElementById(id)),
    canvases: document.querySelectorAll('canvas').length,
    desktopNav: getComputedStyle(document.querySelector('nav[aria-label="Episode navigator"]') ?? document.body).display,
    mobileNav: getComputedStyle(document.querySelector('nav[aria-label="Episode navigator (mobile)"]') ?? document.body).display,
    rsvpInputs: document.querySelectorAll('#rsvp input, #rsvp textarea, #rsvp select').length,
    maps: document.querySelectorAll('#journey iframe').length,
  }), IDS)
  results.push({ width, height, reduced, ...info, errors })
  await context.close()
}

await browser.close()
console.log(JSON.stringify(results, null, 2))
