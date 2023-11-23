import supertest, { SuperTest, Test, Response, agent } from 'supertest';
import { defaultErrMsg as ValidatorErr } from 'jet-validator';
import insertUrlParams from 'inserturlparams';

import app from '@src/server';

import HttpStatusCodes from '@src/constants/HttpStatusCodes';

import { TReqBody } from 'spec/support/types';
import { doesNotMatch } from 'assert';
import { originAgentCluster } from 'helmet';


// **** Variables **** //

// Superadmin
const superadmin = {
    username: "chefen",
    password: "chefen",
    level: "superadmin"
};

// StatusCodes
const {
    OK,
    CREATED,
    NO_CONTENT,
    BAD_REQUEST,
    FORBIDDEN,
    NOT_FOUND
} = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    FORBIDDEN: 403,
    NOT_FOUND: 404
};

// // Dummy update user
// const DummyUserData = {
//   user: User.new('Gordan Freeman', 'gordan.freeman@gmail.com'),
// } as const;


// **** Tests **** //

describe('customerRouter', () => {
    let token: string;
    let agent: SuperTest<Test>;

    beforeAll(() => {
        agent = supertest.agent(app)
    })

    describe('as superadmin', () => {
        beforeAll(async () => {
            const response = await agent.post('/admin/setup')
                .send(superadmin);
            token = response.body.data.token;
        });

        describe('DELETE /customer', () => {
            it('response status is NO_CONTENT', async () => {
                const response = await agent.delete('/customer')
                    .set('X-Access-Token', token);
                expect(response.status).toEqual(NO_CONTENT);
            });
        });

        describe('GET /customer', () => {
            it('response status is OK and response body is of the expected shape', async () => {
                const response = await agent.get('/customer')
                    .set('X-Access-Token', token);
                expect(response.status).toEqual(OK);
                expect(Object.keys(response.body)).toContain("data");
                expect(Array.isArray(response.body.data)).toBeTrue();
            });
        });

        describe('POST /customer/1', () => {
            it('response status is CREATED and response body is of the expected shape', async () => {
                const response = await agent.post('/customer/1')
                    .set('X-Access-Token', token)
                    .send({
                        email: "clown@car.com",
                        customerName: "bozo"
                    });
                expect(response.status).toEqual(CREATED);
                expect(Object.keys(response.body)).toContain("data");

                const dataKeys = Object.keys(response.body.data);
                expect(dataKeys).toContain("token");
                expect(dataKeys).toContain("email");
                expect(dataKeys).toContain("id");

                expect(typeof response.body.data.token).toBe("string");
                expect(response.body.data.token).toMatch(/.+/);
                expect(response.body.data.email).toEqual('clown@car.com');
                expect(response.body.data.id).toEqual(1);
            });
        });

        describe('GET /customer/1', () => {
            it('response status is OK and response body is of the expected shape', async () => {
                const response = await agent.get('/customer/1')
                    .set('X-Access-Token', token);
                expect(response.status).toEqual(OK);
                expect(Object.keys(response.body)).toContain("data");

                const dataKeys = Object.keys(response.body.data);
                expect(dataKeys).toContain("id");
                expect(dataKeys).toContain("createdAt");
                expect(dataKeys).toContain("updatedAt");
                expect(dataKeys).toContain("email");
                expect(dataKeys).toContain("customerName");
                expect(dataKeys).toContain("positionX");
                expect(dataKeys).toContain("positionY");
                expect(dataKeys).toContain("balance");

                expect(response.body.data.email).toEqual('clown@car.com');
            });
        });

        describe('PUT /customer/1 with new email', () => {
            it('response status is FORBIDDEN and response body is of the expected shape', async () => {
                const response = await agent.put('/customer/1')
                    .set('X-Access-Token', token)
                    .send({
                        email: "oops@wont.work"
                    });
                expect(response.status).toEqual(FORBIDDEN);
                expect(Object.keys(response.body)).toContain("error");
            });
        });

        describe('PUT /customer/1 with allowed data', () => {
            it('response status is NO_CONTENT and can GET the new data', async () => {
                const responsePut = await agent.put('/customer/1')
                    .set('X-Access-Token', token)
                    .send({
                        customerName: "car",
                        positionX: 2.2,
                        positionY: -4.4,
                        balance: 3.3
                    });
                expect(responsePut.status).toEqual(NO_CONTENT);
                
                const responseGet = await agent.get('/customer/1')
                    .set('X-Access-Token', token);
                expect(responseGet.status).toEqual(OK);
                expect(responseGet.body.data.customerName).toEqual("car");
                expect(responseGet.body.data.positionX).toEqual(2.2);
                expect(responseGet.body.data.positionY).toEqual(-4.4);
                expect(responseGet.body.data.balance).toEqual(3.3);
            });
        });

        describe('DELETE /customer/1', () => {
            it('response status is NO_CONTENT and GETing the customer returns NOT_FOUND', async () => {
                const responsePut = await agent.delete('/customer/1')
                    .set('X-Access-Token', token);
                expect(responsePut.status).toEqual(NO_CONTENT);
                
                const responseGet = await agent.get('/customer/1')
                    .set('X-Access-Token', token);
                expect(responseGet.status).toEqual(NOT_FOUND);
            });
        });

        

        describe('GET /customer/auth', () => {
            it('response status is OK and body is of the expected shape', async () => {
                const response = await agent.get('/customer/auth')
                    .query({ redirectUrl: "TESTING" })
                    .set('X-Access-Token', token);
                expect(response.status).toEqual(OK);
                expect(Object.keys(response.body)).toContain("data");
                expect(Object.keys(response.body.data)).toContain("url");
                expect(response.body.data.url).toContain("redirect_uri=TESTING")
            });
        });
    });
});

// describe('UserRouter', () => {

//   let agent: SuperTest<Test>;

//   // Run before all tests
//   beforeAll((done) => {
//     agent = supertest.agent(app);
//     done();
//   });

//   // ** Get all users ** //
//   describe(`"GET:${Paths.Users.Get}"`, () => {

//     const callApi = () => agent.get(Paths.Users.Get);

//     // Success
//     it('should return a JSON object with all the users and a status code ' + 
//     `of "${OK}" if the request was successful.`, (done) => {
//       // Add spy
//       spyOn(UserRepo, 'getAll').and.resolveTo([...DummyGetAllUsers]);
//       // Call API
//       callApi()
//         .end((_: Error, res: Response) => {
//           expect(res.status).toBe(OK);
//           for (let i = 0; i < res.body.users.length; i++) {
//             const user = res.body.users[i];
//             expect(user).toEqual(DummyGetAllUsers[i]);
//           }
//           done();
//         });
//     });
//   });

//   // Test add user
//   describe(`"POST:${Paths.Users.Add}"`, () => {

//     const ERROR_MSG = `${ValidatorErr}"user".`;

//     const callApi = (reqBody: TReqBody) => 
//       agent
//         .post(Paths.Users.Add)
//         .type('form').send(reqBody);

//     // Test add user success
//     it(`should return a status code of "${CREATED}" if the request was ` + 
//     'successful.', (done) => {
//       // Spy
//       spyOn(UserRepo, 'add').and.resolveTo();
//       // Call api
//       callApi(DummyUserData)
//         .end((_: Error, res: Response) => {
//           expect(res.status).toBe(CREATED);
//           expect(res.body.error).toBeUndefined();
//           done();
//         });
//     });

//     // Missing param
//     it('should return a JSON object with an error message of ' + 
//     `"${ERROR_MSG}" and a status code of "${BAD_REQUEST}" if the user ` + 
//     'param was missing.', (done) => {
//       // Call api
//       callApi({})
//         .end((_: Error, res: Response) => {
//           expect(res.status).toBe(BAD_REQUEST);
//           expect(res.body.error).toBe(ERROR_MSG);
//           done();
//         });
//     });
//   });

//   // ** Update users ** //
//   describe(`"PUT:${Paths.Users.Update}"`, () => {

//     const ERROR_MSG = `${ValidatorErr}"user".`;

//     const callApi = (reqBody: TReqBody) => 
//       agent
//         .put(Paths.Users.Update)
//         .type('form').send(reqBody);

//     // Success
//     it(`should return a status code of "${OK}" if the request was successful.`, 
//       (done) => {
//         // Setup spies
//         spyOn(UserRepo, 'update').and.resolveTo();
//         spyOn(UserRepo, 'persists').and.resolveTo(true);
//         // Call api
//         callApi(DummyUserData)
//           .end((_: Error, res: Response) => {
//             expect(res.status).toBe(OK);
//             expect(res.body.error).toBeUndefined();
//             done();
//           });
//       });

//     // Param missing
//     it('should return a JSON object with an error message of ' +
//     `"${ERROR_MSG}" and a status code of "${BAD_REQUEST}" if the user ` + 
//     'param was missing.', (done) => {
//       // Call api
//       callApi({})
//         .end((_: Error, res: Response) => {
//           expect(res.status).toBe(BAD_REQUEST);
//           expect(res.body.error).toBe(ERROR_MSG);
//           done();
//         });
//     });

//     // User not found
//     it('should return a JSON object with the error message of ' + 
//     `"${USER_NOT_FOUND_ERR}" and a status code of "${NOT_FOUND}" if the id ` + 
//     'was not found.', (done) => {
//       // Call api
//       callApi(DummyUserData)
//         .end((_: Error, res: Response) => {
//           expect(res.status).toBe(NOT_FOUND);
//           expect(res.body.error).toBe(USER_NOT_FOUND_ERR);
//           done();
//         });
//     });
//   });

//   // ** Delete user ** //
//   describe(`"DELETE:${Paths.Users.Delete}"`, () => {

//     const VALIDATOR_ERR = `${ValidatorErr}"id".`;

//     const callApi = (id: number) => 
//       agent
//         .delete(insertUrlParams(Paths.Users.Delete, { id }));

//     // Success
//     it(`should return a status code of "${OK}" if the request was successful.`, 
//       (done) => {
//         // Setup spies
//         spyOn(UserRepo, 'delete').and.resolveTo();
//         spyOn(UserRepo, 'persists').and.resolveTo(true);
//         // Call api
//         callApi(5)
//           .end((_: Error, res: Response) => {
//             expect(res.status).toBe(OK);
//             expect(res.body.error).toBeUndefined();
//             done();
//           });
//       });

//     // User not found
//     it('should return a JSON object with the error message of ' + 
//     `"${USER_NOT_FOUND_ERR}" and a status code of "${NOT_FOUND}" if the id ` + 
//     'was not found.', (done) => {
//       callApi(-1)
//         .end((_: Error, res: Response) => {
//           expect(res.status).toBe(NOT_FOUND);
//           expect(res.body.error).toBe(USER_NOT_FOUND_ERR);
//           done();
//         });
//     });

//     // Invalid param
//     it(`should return a status code of "${BAD_REQUEST}" and return an error ` + 
//     `message of "${VALIDATOR_ERR}" if the id was not a valid number`, (done) => {
//       callApi('horse' as unknown as number)
//         .end((_: Error, res: Response) => {
//           expect(res.status).toBe(BAD_REQUEST);
//           expect(res.body.error).toBe(VALIDATOR_ERR);
//           done();
//         });
//     });
//   });
// });
