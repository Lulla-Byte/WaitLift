const request = require('supertest');
const app = require('../index');

// Test for the machines API
describe('GET /machines', () => {
  it('return an array of machines with name, status, and queue', async () => {
    const res = await request(app).get('/machines');

    //check if the response is successful
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    // check if each machine has the required properties
    const machine = res.body[0];
    expect(machine).toHaveProperty('name');
    expect(machine).toHaveProperty('status');
    expect(machine).toHaveProperty('queue');
    expect(Array.isArray(machine.queue)).toBe(true);
  });
});

// Test for joining a queue
describe('POST /machines/join-queue (invalid machine)', () => {
  it('return 404 if machine does not exist', async () => {
    const res = await request(app)
      .post('/machines/join-queue')
      .send({ machineName: 'FakeMachine', userId: 'ghost-user' });

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe('Machine not found');
  });
});