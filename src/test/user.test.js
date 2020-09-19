import { setUser, getUser } from '../user/user';

describe('Tests for getting default user name', () => {
  test('Should return Anonymous as a default name', () => {
    expect(getUser()).toBe('Anonymous');
  });
});

describe('Tests for setting a new user name', () => {
  test('Should return that the user name was succesfully stored', () => {
    expect(setUser('Taiwo')).toBe('User set to: Taiwo');
  });
});

describe('Tests for getting new users name', () => {
  test('Should return Taiwo', () => {
    expect(getUser()).toBe('Taiwo');
  });
});