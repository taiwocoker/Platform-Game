import { getScore, setScore, resetScore } from '../score/score';

describe('Tests for getting initial score', () => {
  test('Should return 0 as initial score', () => {
    expect(getScore()).toEqual(0);
  });
});

describe('Tests for score', () => {
  test('Should return current score, after updating', () => {
    expect(setScore(10)).toBe('Current score: 10');
  });
});

describe('Tests for getting updated score', () => {
  test('Should return 10, after score was updated', () => {
    expect(getScore()).toEqual(10);
  });
});

describe('Tests for resetting score', () => {
  test('Should return current score 0', () => {
    expect(resetScore()).toBe('Score restored to 0');
  });
});