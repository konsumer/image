import { readFile } from 'node:fs/promises'
import { info, infoFetch } from '../src/index.js'

test('sus-palette-a.png', async () => {
  const image = await readFile('test/sus-palette-a.png')
  expect(info(image)).toMatchSnapshot()
})

test('sus-palette-no_a.png', async () => {
  const image = await readFile('test/sus-palette-no_a.png')
  expect(info(image)).toMatchSnapshot()
})

test('sus-rgb-a.png', async () => {
  const image = await readFile('test/sus-rgb-a.png')
  expect(info(image)).toMatchSnapshot()
})

test('sus-rgb-no_a.png', async () => {
  const image = await readFile('test/sus-rgb-no_a.png')
  expect(info(image)).toMatchSnapshot()
})

test('sus.jpg', async () => {
  const image = await readFile('test/sus.jpg')
  expect(info(image)).toMatchSnapshot()
})

test('remote jpg', async () => {
  expect(await infoFetch('https://placebear.com/200/300.jpg')).toMatchSnapshot()
})

test('remote png', async () => {
  expect(await infoFetch('https://sample-videos.com/img/Sample-png-image-100kb.png')).toMatchSnapshot()
})
