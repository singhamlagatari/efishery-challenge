const request = require('supertest');
const {
  beforeAction,
  afterAction,
} = require('../setup/_setup');
const User = require('../../api/models/User');

let api;

beforeAll(async () => {
  api = await beforeAction();
});

afterAll(() => {
  afterAction();
});

test('Auth | Register', async () => {
  const res = await request(api)
    .post('/public/register')
    .set('Accept', /json/)
    .send({
      name: 'test',
      phone: '08562229222',
      role: 'admin',
    })
    .expect(200);

  expect(res.body).toBeTruthy();

  const user = await User.findOne({ where: { phone: res.body.phone } });

  expect(user.name).toBe(res.body.name);
  expect(user.phone).toBe(res.body.phone);
  expect(user.role).toBe(res.body.role);
  expect(user.password);

  await user.destroy();
});

test('Auth | Login', async () => {
  const password = Math.random().toString(36).substr(2, 4);
  const phone = '08562229777';

  const user = await User.create({
    name: 'User Test',
    phone,
    role: 'admin',
    password,
  });

  const res = await request(api)
    .post('/public/login')
    .set('Accept', /json/)
    .send({
      phone,
      password,
    })
    .expect(200);

  expect(res.body.token).toBeTruthy();

  expect(user).toBeTruthy();

  await user.destroy();
});

test('Auth | Validate', async () => {
  const password = Math.random().toString(36).substr(2, 4);
  const phone = '08562229777';

  const user = await User.create({
    name: 'User Test',
    phone,
    role: 'admin',
    password,
  });

  const resLogin = await request(api)
    .post('/public/login')
    .set('Accept', /json/)
    .send({
      phone,
      password,
    })
    .expect(200);

  expect(resLogin.body.token).toBeTruthy();

  const res = await request(api)
    .post('/public/validate')
    .set('Accept', /json/)
    .send({
      token: resLogin.body.token,
      password,
    })
    .expect(200);

  expect(res.body.name).toBe(user.name);
  expect(res.body.phone).toBe(user.phone);
  expect(res.body.role).toBe(user.role);
  expect(res.body.created_at);

  await user.destroy();
});
