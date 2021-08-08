import fs from 'fs'
import path from 'path'

it('should make sure that only lerna manages the internal version numbers (relevant for lerna Fixed/Locked mode)', () => {
  const getVersion = f => JSON.parse(fs.readFileSync(f)).version
  const pacakgesDir = path.join(__dirname, '../../')

  const uniqVersionNumbers = fs
    .readdirSync(pacakgesDir)
    .map(p => path.join(pacakgesDir, p, 'package.json'))
    .map(getVersion)
    .reduce((s, v) => s.add(v), new Set())

  expect(uniqVersionNumbers.size).toEqual(1)
  expect(uniqVersionNumbers).toContain(getVersion(path.join(pacakgesDir, '../lerna.json')))
})

