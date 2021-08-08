import fs from 'fs'
import path from 'path'
it('should make sure that only lerna manages the internal version numbers (relevant for lerna Fixed/Locked mode)', () => {
  const pacakgesDir = path.join(__dirname, '../../')
  const uniqVersionNumbers = fs
    .readdirSync(pacakgesDir)
    .map(p => path.join(pacakgesDir, p))
    .map(p => path.join(p, 'package.json'))
    .map(f => fs.readFileSync(f))
    .map(JSON.parse)
    .map(j => j.version)
    .reduce((s, v) => s.add(v), new Set())
  expect(uniqVersionNumbers.size).toEqual(1)
})
