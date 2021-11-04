const request = require('supertest');
const { validate } = require('uuid');

const { app } = require('../');

describe('Users', () => {
  let fakeUser

  beforeEach(() => {
    fakeUser = {
      name: 'John Doe',
      username: 'johndoe1'
    }  
  })
  
  afterEach(async () => {
    await request(app)
      .delete('/users')
      .send()
  })

  it('should be able to create a new user', async () => {
    const response = await request(app)
      .post('/users')
      .send(fakeUser);

    expect(validate(response.body.id)).toBe(true);

    expect(response.body).toMatchObject({
      ...fakeUser,
      todos: [],
      pro: false
    });

    expect(response.status).toBe(201);
  });

  it(
    'should not be able to create a new user when username already exists',
    async () => {
      const { body: userData } = await request(app)
        .post('/users')
        .send(fakeUser);

      const response = await request(app)
        .post('/users')
        .send(fakeUser)
        .expect(400);

      expect(response.body.error).toBeTruthy();
  });

  it('should be able to show user data', async () => {
    const { body: userData } = await request(app)
      .post('/users')
      .send(fakeUser);

    console.log(userData);
    const response = await request(app)
      .get(`/users/${userData.id}`);

    expect(response.body).toMatchObject({
      ...fakeUser,
      todos: [],
      pro: false
    })
  });
});