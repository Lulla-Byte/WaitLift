const request = require('supertest');
const app = require('../index');

describe('GET /equipment/status', () => {
  it('should return 200 and equipment status', async () => {
    const res = await request(app).get('/equipment/status');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('treadmill');
    expect(res.body).toHaveProperty('squatRack');
  });

  it('should return 404 on unknown route', async () => {
    const res = await request(app).get('/nope');
    expect(res.statusCode).toBe(404);
  });
});
