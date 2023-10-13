// import 'dotenv/config';
// import request from 'supertest';
// import App from '../app';
// import AuthRoute from '.@routes/auth.route';
// import UserRoute from '.@routes/userModel.route';
// // import { getIdToken } from '@utils/utils';
// import * as faker from 'faker';
//
// afterAll(async () => {
//   await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
// });
//
// describe('Testing UserModel', () => {
//   const userRoute = new UserRoute();
//   const authRoute = new AuthRoute();
//
//   const app = new App([userRoute, authRoute]);
//   let auth: any;
//
//   beforeAll(() => {
//     return new Promise(async resolve => {
//       auth = await request(app.getServer())
//         .post('/api/auth/authentication')
//         .set('Authorization', await getIdToken(faker.random.uuid()))
//         .send();
//       resolve(true);
//     });
//   });
//
//   describe('[GET] /api/userModel/suggestion', () => {
//     it('Can not get data if not authenticated', async done => {
//       const r = await request(app.getServer()).get('/api/userModel/suggestion');
//
//       expect(r.status).toBe(401);
//       done();
//     });
//
//     it('Can query post without params, default 6 items', async done => {
//       const r = await request(app.getServer())
//         .get('/api/userModel/suggestion')
//         .set('Authorization', 'Bearer ' + auth.body.token.token);
//
//       expect(r.status).toBe(200);
//
//       expect(r.body.limit).toBe(6);
//       expect(r.body.offset).toBe(0);
//       expect(r.body.data).toBeDefined();
//       done();
//     });
//
//     it('Can set an offset and a Limit', async done => {
//       const r = await request(app.getServer())
//         .get('/api/userModel/suggestion/?limit=100&offset=20')
//         .set('Authorization', 'Bearer ' + auth.body.token.token);
//
//       expect(r.status).toBe(200);
//
//       expect(r.body.limit).toBe(100);
//       expect(r.body.offset).toBe(20);
//       expect(r.body.order).toBe('desc');
//       expect(r.body.data).toBeDefined();
//       done();
//     });
//
//     it('Limit shall be >0', async done => {
//       const r = await request(app.getServer())
//         .get('/api/userModel/suggestion/?limit=-1')
//         .set('Authorization', 'Bearer ' + auth.body.token.token);
//
//       expect(r.status).toBe(500);
//       expect(r.body.message).toBe('LIMIT must not be negative');
//       done();
//     });
//
//     it('Offset shall be >0', async done => {
//       const r = await request(app.getServer())
//         .get('/api/userModel/suggestion/?offset=-1')
//         .set('Authorization', 'Bearer ' + auth.body.token.token);
//
//       expect(r.status).toBe(500);
//       expect(r.body.message).toBe('OFFSET must not be negative');
//       done();
//     });
//
//     it('Limit can not be > 100', async done => {
//       const r = await request(app.getServer())
//         .get('/api/userModel/suggestion/?limit=1000')
//         .set('Authorization', 'Bearer ' + auth.body.token.token);
//
//       expect(r.status).toBe(200);
//       expect(r.body.limit).toBe(100);
//       expect(r.body.offset).toBe(0);
//       expect(r.body.order).toBe('desc');
//       expect(r.body.data).toBeDefined();
//       done();
//     });
//
//     it.skip('List must not contain userModel I follow', async done => {
//       //todo
//     });
//     it.skip('List must not contain myself', async done => {
//       //todo
//     });
//   });
//   describe('[GET] /api/userModel/profile', () => {
//     it.skip('A created profile shall be searchable', async done => {
//       //todo
//       // test structure of output, to include photo url + hobbies
//     });
//     it.skip('Error if username does not exist', async done => {
//       //todo
//     });
//     it.skip('Error if username is empty', async done => {
//       //todo
//     });
//   });
//   describe('[PUT] /api/userModel/{id}/profile', () => {
//     it('UserModel shall exists to be updated', async done => {
//       // test structure of output, to include photo url + hobbies
//       const r = await request(app.getServer())
//         .put('/api/userModel/' + faker.random.uuid() + '/profile')
//         .set('Authorization', 'Bearer ' + auth.body.token.token);
//       expect(r.status).toBe(400);
//       done();
//     });
//     it('Id shall have a good format', async done => {
//       // test structure of output, to include photo url + hobbies
//       const r = await request(app.getServer())
//         .put('/api/userModel/' + faker.lorem.word() + '/profile')
//         .set('Authorization', 'Bearer ' + auth.body.token.token);
//       expect(r.status).toBe(400);
//       done();
//     });
//     it('UserModel id can not be empty', async done => {
//       const r = await request(app.getServer())
//         .put('/api/userModel/' + faker.random.uuid() + '/profile')
//         .set('Authorization', 'Bearer ' + auth.body.token.token);
//       expect(r.status).toBe(400);
//       done();
//     });
//     it.skip('I can not update a profile if I am not the owner', async done => {
//       //todo
//       // PUT existing profile
//     });
//     it.skip('I can update my profile', async done => {
//       const d = {
//         displayName: 'toto',
//         username: 'username',
//         biography: 'mybio',
//         fk_image_id_avatar: null,
//         fk_image_id_background: null,
//         country: 'fr',
//         hobbies: ['test'],
//         urlWebsite: 'http://',
//       };
//       const r = await request(app.getServer())
//         .put('/api/userModel/' + faker.random.uuid() + '/profile')
//         .set('Authorization', 'Bearer ' + auth.body.token.token)
//         .send(d);
//
//       expect(r.status).toBe(201);
//       done();
//     });
//
//     it('I can not add a username with non alphanumeric char', async done => {
//       const d = {
//         displayName: 'toto',
//         username: 'userModel;name',
//         biography: 'mybio',
//         fk_image_id_avatar: null,
//         fk_image_id_background: null,
//         country: 'fr',
//         hobbies: ['test'],
//         urlWebsite: 'http://',
//       };
//       const r = await request(app.getServer())
//         .put('/api/userModel/' + faker.random.uuid() + '/profile')
//         .set('Authorization', 'Bearer ' + auth.body.token.token)
//         .send(d);
//
//       expect(r.status).toBe(400);
//       done();
//     });
//     it('I can not a bio > 160 char', async done => {
//       const d = {
//         displayName: 'toto',
//         username: 'username',
//         biography:
//           'mybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybiomybio',
//         fk_image_id_avatar: null,
//         fk_image_id_background: null,
//         country: 'fr',
//         hobbies: ['test'],
//         urlWebsite: 'http://',
//       };
//       const r = await request(app.getServer())
//         .put('/api/userModel/' + faker.random.uuid() + '/profile')
//         .set('Authorization', 'Bearer ' + auth.body.token.token)
//         .send(d);
//
//       expect(r.status).toBe(400);
//       done();
//     });
//     it('I can have 0 hobbies', async done => {
//       const d = {
//         displayName: 'toto',
//         username: 'username',
//         biography: 'mybio',
//         fk_image_id_avatar: null,
//         fk_image_id_background: null,
//         country: 'fr',
//         hobbies: [],
//         urlWebsite: 'http://',
//       };
//       const r = await request(app.getServer())
//         .put('/api/userModel/' + auth.body.userModel.id + '/profile')
//         .set('Authorization', 'Bearer ' + auth.body.token.token)
//         .send(d);
//
//       expect(r.status).toBe(200);
//       done();
//     });
//     it('I can not add more than 5 hobbies', async done => {
//       const d = {
//         displayName: 'toto',
//         username: 'username',
//         biography: 'mybio',
//         fk_image_id_avatar: null,
//         fk_image_id_background: null,
//         country: 'fr',
//         hobbies: ['test', 'test', 'test', 'test', 'test', 'test'],
//         urlWebsite: 'http://',
//       };
//       const r = await request(app.getServer())
//         .put('/api/userModel/' + faker.random.uuid() + '/profile')
//         .set('Authorization', 'Bearer ' + auth.body.token.token)
//         .send(d);
//
//       expect(r.status).toBe(400);
//       done();
//     });
//     it.skip('I can not add an existing username', async done => {
//       // empty
//     });
//   });
//
//   describe('[GET] /api/userModel/:id/post', () => {
//     it.skip('We can get all posts of a userModel', async done => {
//       //todo
//       // test structure of output, to include photo url + hobbies
//     });
//     it.skip('Posts can be paginated', async done => {
//       //todo
//       // test structure of output, to include photo url + hobbies
//     });
//     it.skip('Without token, we can get only the first 12 posts', async done => {
//       //todo
//     });
//   });
//
//   describe('[GET] /api/userModel/:id/bookmark', () => {
//     it.skip('We can get all bookmarks of a userModel', async done => {
//       //todo
//       // test structure of output, to include photo url + hobbies
//     });
//     it.skip('Bookmarks can be paginated', async done => {
//       //todo
//       // test structure of output, to include photo url + hobbies
//     });
//   });
//
//   describe('[GET] /api/userModel/:id/reaction/post', () => {
//     it('Can not get userModel reacted posts if not authenticated', async done => {
//       const r = await request(app.getServer()).get(`/api/userModel/${faker.random.uuid()}/reaction/post`);
//
//       expect(r.status).toBe(401);
//       done();
//     });
//
//     it('Can query post without params, default 6 items', async done => {
//       const r = await request(app.getServer())
//         .get(`/api/userModel/${auth.body.userModel.id}/reaction/post`)
//         .set('Authorization', 'Bearer ' + auth.body.token.token);
//
//       expect(r.status).toBe(200);
//
//       expect(r.body.limit).toBe(10);
//       expect(r.body.offset).toBe(0);
//       expect(r.body.data).toBeDefined();
//       done();
//     });
//
//     it('Can set an offset and a Limit', async done => {
//       const r = await request(app.getServer())
//         .get(`/api/userModel/${auth.body.userModel.id}/reaction/post?limit=100&offset=20`)
//         .set('Authorization', 'Bearer ' + auth.body.token.token);
//
//       expect(r.status).toBe(200);
//
//       expect(r.body.limit).toBe(100);
//       expect(r.body.offset).toBe(20);
//       expect(r.body.order).toBe('createdAt');
//       expect(r.body.data).toBeDefined();
//       done();
//     });
//
//     it('Limit shall be >0', async done => {
//       const r = await request(app.getServer())
//         .get(`/api/userModel/${auth.body.userModel.id}/reaction/post?limit=-1`)
//         .set('Authorization', 'Bearer ' + auth.body.token.token);
//
//       expect(r.status).toBe(500);
//       expect(r.body.message).toBe('LIMIT must not be negative');
//       done();
//     });
//
//     it('Offset shall be >0', async done => {
//       const r = await request(app.getServer())
//         .get(`/api/userModel/${auth.body.userModel.id}/reaction/post?offset=-1`)
//         .set('Authorization', 'Bearer ' + auth.body.token.token);
//
//       expect(r.status).toBe(500);
//       expect(r.body.message).toBe('OFFSET must not be negative');
//       done();
//     });
//
//     it('Limit can not be > 100', async done => {
//       const r = await request(app.getServer())
//         .get(`/api/userModel/${auth.body.userModel.id}/reaction/post?limit=200`)
//         .set('Authorization', 'Bearer ' + auth.body.token.token);
//
//       expect(r.status).toBe(200);
//       expect(r.body.limit).toBe(100);
//       expect(r.body.offset).toBe(0);
//       expect(r.body.order).toBe('createdAt');
//       expect(r.body.data).toBeDefined();
//       done();
//     });
//   });
// });
