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
    username: 'chefen',
    password: 'chefen',
    level: 'superadmin',
};

// StatusCodes
const {
    OK,
    CREATED,
    NO_CONTENT,
    BAD_REQUEST,
    UNAUTHORIZED,
    FORBIDDEN,
    NOT_FOUND,
    CONFLICT,
} = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
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
        agent = supertest.agent(app);
    });

    describe('as superadmin', () => {
        beforeAll(async () => {
            const response = await agent.post('/v1/admin/setup')
                .send(superadmin);
            token = response.body.data.token;
        });

        describe('DELETE /customer', () => {
            it('response status is NO_CONTENT', async () => {
                const response = await agent.delete('/v1/customer')
                    .set('X-Access-Token', token);
                expect(response.status).toEqual(NO_CONTENT);
            });
        });

        describe('GET /customer', () => {
            it('response status is OK and response body is of the expected shape', async () => {
                const response = await agent.get('/v1/customer')
                    .set('X-Access-Token', token);
                expect(response.status).toEqual(OK);
                expect(Object.keys(response.body)).toContain('data');
                expect(Array.isArray(response.body.data)).toBeTrue();
            });
        });

        describe('POST /customer/1', () => {
            it('response status is CREATED and response body is of the expected shape', async () => {
                const response = await agent.post('/v1/customer/1')
                    .set('X-Access-Token', token)
                    .send({
                        email: 'clown@car.com',
                        customerName: 'bozo',
                    });
                expect(response.status).toEqual(CREATED);
                expect(Object.keys(response.body)).toContain('data');

                const dataKeys = Object.keys(response.body.data);
                expect(dataKeys).toContain('token');
                expect(dataKeys).toContain('email');
                expect(dataKeys).toContain('customerId');

                expect(typeof response.body.data.token).toBe('string');
                expect(response.body.data.token).toMatch(/.+/);
                expect(response.body.data.email).toEqual('clown@car.com');
                expect(response.body.data.customerId).toEqual(1);
            });
        });

        describe('GET /customer/1', () => {
            it('response status is OK and response body is of the expected shape', async () => {
                const response = await agent.get('/v1/customer/1')
                    .set('X-Access-Token', token);
                expect(response.status).toEqual(OK);
                expect(Object.keys(response.body)).toContain('data');

                const dataKeys = Object.keys(response.body.data);
                expect(dataKeys).toContain('id');
                expect(dataKeys).toContain('createdAt');
                expect(dataKeys).toContain('updatedAt');
                expect(dataKeys).toContain('email');
                expect(dataKeys).toContain('customerName');
                expect(dataKeys).toContain('positionX');
                expect(dataKeys).toContain('positionY');
                expect(dataKeys).toContain('balance');

                expect(response.body.data.email).toEqual('clown@car.com');
            });
        });

        describe('PUT /customer/1 with allowed data', () => {
            it('response status is NO_CONTENT and can GET the new data', async () => {
                const responsePut = await agent.put('/v1/customer/1')
                    .set('X-Access-Token', token)
                    .send({
                        customerName: 'car',
                        positionX: 2.2,
                        positionY: -4.4,
                        balance: 3.3,
                    });
                expect(responsePut.status).toEqual(NO_CONTENT);
                
                const responseGet = await agent.get('/v1/customer/1')
                    .set('X-Access-Token', token);
                expect(responseGet.status).toEqual(OK);
                expect(responseGet.body.data.customerName).toEqual('car');
                expect(responseGet.body.data.positionX).toEqual(2.2);
                expect(responseGet.body.data.positionY).toEqual(-4.4);
                expect(responseGet.body.data.balance).toEqual(3.3);
            });
        });

        describe('DELETE /customer/1', () => {
            it('response status is NO_CONTENT and GETing the customer returns NOT_FOUND', async () => {
                const responsePut = await agent.delete('/v1/customer/1')
                    .set('X-Access-Token', token);
                expect(responsePut.status).toEqual(NO_CONTENT);
                
                const responseGet = await agent.get('/v1/customer/1')
                    .set('X-Access-Token', token);
                expect(responseGet.status).toEqual(NOT_FOUND);
            });
        });

        describe('GET /customer/auth', () => {
            it('response status is OK and body is of the expected shape', async () => {
                const response = await agent.get('/v1/customer/auth')
                    .query({ redirectUrl: 'TESTING' })
                    .set('X-Access-Token', token);
                expect(response.status).toEqual(OK);
                expect(Object.keys(response.body)).toContain('data');
                expect(Object.keys(response.body.data)).toContain('url');
                expect(response.body.data.url).toContain('redirect_uri=TESTING');
            });
        });

        describe('POST /customer/auth with dummy code', () => {
            it('response status is UNAUTHORIZED', async () => {
                const response = await agent.post('/v1/customer/auth')
                    .set('X-Access-Token', token)
                    .send({ code: 'dummy' });
                expect(response.status).toEqual(UNAUTHORIZED);
            });
        });

        describe('POST /customer/token with dummy oAuthToken', () => {
            it('response status is NOT_FOUND', async () => {
                const response = await agent.post('/v1/customer/token')
                    .set('X-Access-Token', token)
                    .send({ oAuthToken: 'dummy token'});
                expect(response.status).toEqual(NOT_FOUND);
            });
        });

        describe('POST /customer/0', () => {
            it('response status is CREATED and response body is of the expected shape and ID is a number other than 0', async () => {
                const response = await agent.post('/v1/customer/0')
                    .set('X-Access-Token', token)
                    .send({
                        email: 'clowner@car.com',
                        customerName: 'bozo',
                    });
                expect(response.status).toEqual(CREATED);
                expect(Object.keys(response.body)).toContain('data');

                const dataKeys = Object.keys(response.body.data);
                expect(dataKeys).toContain('token');
                expect(dataKeys).toContain('email');
                expect(dataKeys).toContain('customerId');

                expect(typeof response.body.data.token).toBe('string');
                expect(response.body.data.token).toMatch(/.+/);
                expect(response.body.data.email).toEqual('clowner@car.com');
                expect(response.body.data.customerId).toBeGreaterThanOrEqual(2);
            });
        });
    });

    describe('as client without access token', () => {
        describe('GET /customer', () => {
            it('response status is FORBIDDEN', async () => {
                const response = await agent.get('/v1/customer');
                expect(response.status).toEqual(FORBIDDEN);
            });
        });

        describe('DELETE /customer', () => {
            it('response status is FORBIDDEN', async () => {
                const response = await agent.delete('/v1/customer');
                expect(response.status).toEqual(FORBIDDEN);
            });
        });

        describe('POST /customer/1', () => {
            it('response status is CREATED and response body is of the expected shape', async () => {
                const response = await agent.post('/v1/customer/1')
                    .send({
                        email: 'clown@car.com',
                        customerName: 'bozo',
                    });
                expect(response.status).toEqual(CREATED);
                expect(Object.keys(response.body)).toContain('data');

                const dataKeys = Object.keys(response.body.data);
                expect(dataKeys).toContain('token');
                expect(dataKeys).toContain('email');
                expect(dataKeys).toContain('customerId');

                expect(typeof response.body.data.token).toBe('string');
                expect(response.body.data.token).toMatch(/.+/);
                expect(response.body.data.email).toEqual('clown@car.com');
                expect(response.body.data.customerId).toEqual(1);
            });
        });

        describe('GET /customer/1', () => {
            it('response status is FORBIDDEN', async () => {
                const response = await agent.delete('/v1/customer/1');
                expect(response.status).toEqual(FORBIDDEN);
            });
        });

        describe('PUT /customer/1', () => {
            it('response status is FORBIDDEN', async () => {
                const response = await agent.put('/v1/customer/1');
                expect(response.status).toEqual(FORBIDDEN);
            });
        });

        describe('DELETE /customer/1', () => {
            it('response status is FORBIDDEN', async () => {
                const response = await agent.put('/v1/customer/1');
                expect(response.status).toEqual(FORBIDDEN);
            });
        });

        describe('GET /customer/auth', () => {
            it('response status is OK and body is of the expected shape', async () => {
                const response = await agent.get('/v1/customer/auth')
                    .query({ redirectUrl: 'TESTING' });
                expect(response.status).toEqual(OK);
                expect(Object.keys(response.body)).toContain('data');
                expect(Object.keys(response.body.data)).toContain('url');
                expect(response.body.data.url).toContain('redirect_uri=TESTING');
            });
        });

        describe('POST /customer/auth with dummy code', () => {
            it('response status is UNAUTHORIZED', async () => {
                const response = await agent.post('/v1/customer/auth')
                    .send({ code: 'dummy' });
                expect(response.status).toEqual(UNAUTHORIZED);
            });
        });

        describe('POST /customer/token with dummy oAuthToken', () => {
            it('response status is NOT_FOUND', async () => {
                const response = await agent.post('/v1/customer/token')
                    .send({ oAuthToken: 'dummy token'});
                expect(response.status).toEqual(NOT_FOUND);
            });
        });
    });

    describe('as customer', () => {
        beforeAll(async () => {
            const responseAdmin = await agent.post('/v1/admin/setup')
                .send(superadmin);

            await agent.delete('/v1/customer')
                .set('X-Access-Token', responseAdmin.body.data.token);

            const responseCustomer = await agent.post('/v1/customer/1')
                .send({
                    email: 'tester@test.com',
                    customerName: 'Tester Testersson',
                });

            token = responseCustomer.body.data.token;
        });

        describe('GET /customer', () => {
            it('response status is FORBIDDEN', async () => {
                const response = await agent.get('/v1/customer')
                    .set({'X-Access-Token': token});
                expect(response.status).toEqual(FORBIDDEN);
            });
        });

        describe('DELETE /customer', () => {
            it('response status is FORBIDDEN', async () => {
                const response = await agent.delete('/v1/customer')
                    .set({'X-Access-Token': token});
                expect(response.status).toEqual(FORBIDDEN);
            });
        });

        describe('POST /customer/1', () => {
            it('response status is CONFLICT', async () => {
                const response = await agent.post('/v1/customer/1')
                    .set({'X-Access-Token': token})
                    .send({
                        email: 'clown@car.com',
                        customerName: 'bozo',
                    });
                expect(response.status).toEqual(CONFLICT);
            });
        });

        describe('GET /customer/1', () => {
            it('response status is OK', async () => {
                const response = await agent.get('/v1/customer/1')
                    .set('X-Access-Token', token);
                expect(response.status).toEqual(OK);
                expect(Object.keys(response.body)).toContain('data');

                const dataKeys = Object.keys(response.body.data);
                expect(dataKeys).toContain('id');
                expect(dataKeys).toContain('createdAt');
                expect(dataKeys).toContain('updatedAt');
                expect(dataKeys).toContain('email');
                expect(dataKeys).toContain('customerName');
                expect(dataKeys).toContain('positionX');
                expect(dataKeys).toContain('positionY');
                expect(dataKeys).toContain('balance');

                expect(response.body.data.email).toEqual('tester@test.com');
                expect(response.body.data.customerName).toEqual('Tester Testersson');
            });
        });

        describe('GET /customer/auth', () => {
            it('response status is OK and body is of the expected shape', async () => {
                const response = await agent.get('/v1/customer/auth')
                    .query({ redirectUrl: 'TESTING' })
                    .set({'X-Access-Token': token});
                expect(response.status).toEqual(OK);
                expect(Object.keys(response.body)).toContain('data');
                expect(Object.keys(response.body.data)).toContain('url');
                expect(response.body.data.url).toContain('redirect_uri=TESTING');
            });
        });

        describe('POST /customer/auth with dummy code', () => {
            it('response status is UNAUTHORIZED', async () => {
                const response = await agent.post('/v1/customer/auth')
                    .set({'X-Access-Token': token})
                    .send({ code: 'dummy' });
                expect(response.status).toEqual(UNAUTHORIZED);
            });
        });

        describe('POST /customer/token with dummy oAuthToken', () => {
            it('response status is NOT_FOUND', async () => {
                const response = await agent.post('/v1/customer/token')
                    .set({'X-Access-Token': token})
                    .send({ oAuthToken: 'dummy token'});
                expect(response.status).toEqual(NOT_FOUND);
            });
        });
    });
});
