import fs from 'fs'
import path from 'path'

const json = f => JSON.parse(fs.readFileSync(f))
const pacakgesDir = path.join(__dirname, '../../')
const pJsonPath = p => path.join(pacakgesDir, p, 'package.json')
const getVersion = f => json(f).version
const lernaVersion = getVersion(path.join(pacakgesDir, '../lerna.json'))
const packageFolderNames = fs.readdirSync(pacakgesDir)

it.skip('version numbers in all pacakages remain the same', () => {
  const uniqVersionNumbers = packageFolderNames
    .map(pJsonPath)
    .map(getVersion)
    .reduce((s, v) => s.add(v), new Set())

  expect(uniqVersionNumbers.size).toEqual(1)
  expect(uniqVersionNumbers).toContain(lernaVersion)
})

it.skip('consumption of dependencies in every pacakge is done with the same version number', () => {
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
      .forEach(e => expect(e[1]).toMatch(lernaVersion)) // using toMatch and not toEqual because "^4.0.15-beta.31" and "4.0.15-beta.31" is OK
 
  }
})
