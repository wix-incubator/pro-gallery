import fs from 'fs'
import path from 'path'

const json = f => JSON.parse(fs.readFileSync(f))
const pacakgesDir = path.join(__dirname, '../../')
const pJsonPath = p => path.join(pacakgesDir, p, 'package.json')
const getVersion = f => json(f).version
const lernaVersion = getVersion(path.join(pacakgesDir, '../lerna.json'))
const packageFolderNames = fs.readdirSync(pacakgesDir)

it('should make sure that only lerna manages the internal version numbers (relevant for lerna Fixed/Locked mode)', () => {
  const uniqVersionNumbers = packageFolderNames
    .map(pJsonPath)
    .map(getVersion)
    .reduce((s, v) => s.add(v), new Set())

  expect(uniqVersionNumbers.size).toEqual(1)
  expect(uniqVersionNumbers).toContain(lernaVersion)
})

it('should make sure versions are consumed correctly by dependants', () => {
  const packageNames = packageFolderNames
    .map(pJsonPath)
    .map(json)
    .map(x => x.name)

  packageFolderNames
    .map(pJsonPath)
    .map(json)
    .forEach(assertJsonConsumingMonoRepoDepsCorrectly)

  function assertJsonConsumingMonoRepoDepsCorrectly(json) {
    Object
      .entries(json.dependencies || {})
      .filter(e => packageNames.includes(e[0]))
      .forEach(e => expect(e[1]).toMatch(lernaVersion))
  }
})
