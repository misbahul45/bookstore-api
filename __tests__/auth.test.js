import request from 'supertest';
import app from '../src/server.js';
import db from '../src/db/index.js';

jest.mock('../src/lib/mail.js', () => jest.fn(() => Promise.resolve()));
jest.mock('../src/lib/winston.js', () => ({ httpLogger: { info: jest.fn() } }));

let testEmail = `test${Date.now()}@mail.com`;
let testOtp = '';
let testPassword = 'test12345';

describe('Auth API Test', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({
        email: testEmail,
        username: 'testuser',
        password: testPassword,
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('Successfully signed up');
  });

  it('should fail login before OTP verified', async () => {
    const res = await request(app)
      .post('/api/auth/signin')
      .send({
        email: testEmail,
        password: testPassword,
      });
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch(/verify your OTP/i);
  });

  it('should verify OTP', async () => {
    // Ambil OTP langsung dari database (hanya untuk testing, di production sebaiknya tidak)
    const [user] = await db
      .select()
      .from('users')
      .where({ email: testEmail });

    // Simulasi ambil OTP via fungsi internal
    const isHashed = user.otp;
    // Demi testing, seharusnya kamu simpan OTP asli di AuthController signup return-nya

    // ⚠️ Di sini kita mock OTP langsung sebagai '123456'
    testOtp = '123456';
    await db.update('users').set({
      otp: require('../lib/bcrypt.js').hashText(testOtp),
    }).where({ id: user.id });

    const res = await request(app)
      .post('/api/auth/verify-otp')
      .send({
        email: testEmail,
        otp: testOtp,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Successfully verified OTP');
  });

  it('should login user after OTP verified', async () => {
    const res = await request(app)
      .post('/api/auth/signin')
      .send({
        email: testEmail,
        password: testPassword,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.accessToken).toBeDefined();
    expect(res.body.data.refreshToken).toBeDefined();
  });

  it('should fail to refresh token with wrong token', async () => {
    const res = await request(app)
      .post('/api/auth/refresh-token')
      .send({
        email: testEmail,
        refreshToken: 'invalidtoken',
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe('Invalid refresh token');
  });
});
