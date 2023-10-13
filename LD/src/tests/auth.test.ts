// import 'dotenv/config';
// import request from 'supertest';
// import App from '../app';
// import AuthRoute from '.@routes/auth.route';
// import * as faker from 'faker';
//
// afterAll(async () => {
//   await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
// });
//
// describe('Testing Auth', () => {
//   describe('[POST] /api/auth/authentication', () => {
//     it('Can not create userModel without a Token', async done => {
//       const authRoute = new AuthRoute();
//       const app = new App([authRoute]);
//
//       const r = await request(app.getServer()).post('/api/auth/authentication').send();
//
//       expect(r.status).toBe(401);
//       done();
//     });
//     it('Can create a userModel with a valid idToken', async done => {
//       const authRoute = new AuthRoute();
//       const app = new App([authRoute]);
//
//       const r: any = await request(app.getServer())
//         .post('/api/auth/authentication')
//         .set('Authorization', await getIdToken(faker.random.uuid()))
//         .send();
//
//       expect(r.status).toBe(201);
//
//       expect(r.body.userModel).toBeDefined();
//
//       done();
//     });
//
//     it('Can not create twice the same userModel', async done => {
//       const authRoute = new AuthRoute();
//       const app = new App([authRoute]);
//
//       const fakeToken = await getIdToken(faker.random.uuid());
//       const r: any = await request(app.getServer()).post('/api/auth/authentication').set('Authorization', fakeToken).send();
//
//       // USER NEVER EXISTED, WE CREATED HIM
//       expect(r.status).toBe(201);
//       expect(r.body.userModel).toBeDefined();
//
//       const r2: any = await request(app.getServer()).post('/api/auth/authentication').set('Authorization', fakeToken).send();
//
//       // USER ALREADY EXISTS, WE LOAD HIM
//       expect(r2.status).toBe(200);
//       expect(r2.body.userModel).toBeDefined();
//       done();
//     });
//   });
// });
