describe('JwtAuthService', () => {
  describe('isAuthenticated(context)', () => {
    test.todo('should return true if a valid token was passed');
    test.todo('should throw UnauthorizedError on missing token');
    test.todo('should throw UnauthorizedError on invalid token');
  });

  describe('login(email, password)', () => {
    test.todo("should return a jwt token with the user's id and profile");
    test.todo('should throw a NotFoundError if the user e-mail is invalid');
    test.todo('should throw a BadRequestError if the password is invalid');
  });

  describe('logout(context)', () => {
    test.todo('should make a valid token no longer work');
  });
});
