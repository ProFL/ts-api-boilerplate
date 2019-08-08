describe('BcryptService', () => {
  describe('hash(data)', () => {
    test.todo('should return a hash string');
  });

  describe('compare(data, encrypted)', () => {
    test.todo(
      'should return true for a known value hashed with the hash method',
    );
    test.todo('should return false for a known hashed value mistmatched');
    test.todo('should return false for two random strings');
  });
});
