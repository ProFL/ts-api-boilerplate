describe('CreateUserDto', () => {
  test.todo('should allow valid email');
  test.todo('should deny invalid email');

  test.todo('should allow a password with 6 to 72 characters');
  test.todo("shouldn't allow a password with less than 6");
  test.todo("shouldn't allow a password with more than 72");

  test.todo('should require proper password confirmation');
  test.todo("shouldn't allow improper password confirmation");

  test.todo('should allow a simple user to be created');
  test.todo("shouldn't allow a manager or admin user to be created");

  test.todo("should require profile's firstName to be specified");
  test.todo("should require profile's lastName to be specified");
});
