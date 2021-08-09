import { expect } from 'chai';
import { BlueprintsManager } from '../src/index';
it('should create a blueprints manager', () => {
  const id = 'my id';
  const bpm = new BlueprintsManager({ id });
  expect(bpm.id).equal(`${id}'s blueprintsManager`);
});
