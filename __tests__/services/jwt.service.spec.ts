describe('JwtService', () => {
  describe('decode(token)', () => {
    test.todo('should properly decode a valid token');
  });

  describe('verify(token)', () => {
    test.todo('should return the token payload if its valid');
    test.todo('should throw an error if the token has expired');
    test.todo('should throw an error if the token is improperly signed');
  });

  describe('sign(payload, expiry)', () => {
    test.todo('should return a valid token');
    test.todo('should generate valid iat and exp in seconds');
  });
});
