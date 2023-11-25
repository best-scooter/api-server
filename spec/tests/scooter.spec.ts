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
    UNAUTHORIZED,
    FORBIDDEN,
    NOT_FOUND,
    CONFLICT
} = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409
};

// // Dummy update user
// const DummyUserData = {
//   user: User.new('Gordan Freeman', 'gordan.freeman@gmail.com'),
// } as const;


// **** Tests **** //

describe('scooterRouter', () => {
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

        describe('DELETE /scooter', () => {
            it('response status is NO_CONTENT', async () => {
                const response = await agent.delete('/scooter')
                    .set('X-Access-Token', token);
                expect(response.status).toEqual(NO_CONTENT);
            });
        });

        describe('GET /scooter', () => {
            it('response status is OK and response body is of the expected shape', async () => {
                const response = await agent.get('/scooter')
                    .set('X-Access-Token', token);
                expect(response.status).toEqual(OK);
                expect(Object.keys(response.body)).toContain("data");
                expect(Array.isArray(response.body.data)).toBeTrue();
            });
        });

        describe('POST /scooter/1', () => {
            it('response status is CREATED and response body is of the expected shape', async () => {
                const response = await agent.post('/scooter/1')
                    .set('X-Access-Token', token)
                    .send({
                        password: "1"
                    });
                expect(response.status).toEqual(CREATED);
                expect(Object.keys(response.body)).toContain("data");

                const dataKeys = Object.keys(response.body.data);
                expect(dataKeys).toContain("token");
                expect(dataKeys).toContain("scooterId");

                expect(typeof response.body.data.token).toBe("string");
                expect(response.body.data.token).toMatch(/.+/);
                expect(response.body.data.scooterId).toEqual(1);
            });
        });

        describe('GET /scooter/1', () => {
            it('response status is OK and response body is of the expected shape', async () => {
                const response = await agent.get('/scooter/1')
                    .set('X-Access-Token', token);
                expect(response.status).toEqual(OK);
                expect(Object.keys(response.body)).toContain("data");

                const dataKeys = Object.keys(response.body.data);
                expect(dataKeys).toContain("id");
                expect(dataKeys).toContain("createdAt");
                expect(dataKeys).toContain("updatedAt");
                expect(dataKeys).toContain("positionX");
                expect(dataKeys).toContain("positionY");
                expect(dataKeys).toContain("battery");
                expect(dataKeys).toContain("maxSpeed");
                expect(dataKeys).toContain("charging");
                expect(dataKeys).toContain("available");
                expect(dataKeys).toContain("decomissioned");
                expect(dataKeys).toContain("beingServiced");
                expect(dataKeys).toContain("connected");

                expect(response.body.data.id).toEqual(1);
            });
        });

        describe('PUT /scooter/1 with new id', () => {
            it('response status is FORBIDDEN and response body is of the expected shape', async () => {
                const response = await agent.put('/scooter/1')
                    .set('X-Access-Token', token)
                    .send({
                        id: 2
                    });
                expect(response.status).toEqual(FORBIDDEN);
                expect(Object.keys(response.body)).toContain("error");
            });
        });

        describe('PUT /scooter/1 with allowed data', () => {
            it('response status is NO_CONTENT and can GET the new data', async () => {
                const responsePut = await agent.put('/scooter/1')
                    .set('X-Access-Token', token)
                    .send({
                        positionX: 2.2,
                        positionY: -4.4,
                        battery: 0.33,
                        maxSpeed: 15,
                        charging: true,
                        available: true,
                        decomissioned: true,
                        beingServiced: true,
                        connected: true
                    });
                expect(responsePut.status).toEqual(NO_CONTENT);
                
                const responseGet = await agent.get('/scooter/1')
                    .set('X-Access-Token', token);
                expect(responseGet.status).toEqual(OK);
                expect(responseGet.body.data.id).toEqual(1);
                expect(responseGet.body.data.positionX).toEqual(2.2);
                expect(responseGet.body.data.positionY).toEqual(-4.4);
                expect(responseGet.body.data.battery).toEqual(0.33);
                expect(responseGet.body.data.maxSpeed).toEqual(15);
                expect(responseGet.body.data.charging).toEqual(true);
                expect(responseGet.body.data.available).toEqual(true);
                expect(responseGet.body.data.decomissioned).toEqual(true);
                expect(responseGet.body.data.beingServiced).toEqual(true);
                expect(responseGet.body.data.connected).toEqual(true);
            });
        });

        describe('DELETE /scooter/1', () => {
            it('response status is NO_CONTENT and GETing the scooter returns NOT_FOUND', async () => {
                const responseDelete = await agent.delete('/scooter/1')
                    .set('X-Access-Token', token);
                expect(responseDelete.status).toEqual(NO_CONTENT);
                
                const responseGet = await agent.get('/scooter/1')
                    .set('X-Access-Token', token);
                expect(responseGet.status).toEqual(NOT_FOUND);
            });
        });

        describe('POST /scooter/token bad password', () => {
            it('response status is UNAUTHORIZED', async () => {
                await agent.post('/scooter/1')
                    .set('X-Access-Token', token)
                    .send({
                        password: "1"
                    });
                const response = await agent.post('/scooter/token')
                    .set('X-Access-Token', token)
                    .send({ scooterId: 1, password: "655"});
                // console.log(response);
                expect(response.status).toEqual(UNAUTHORIZED);
            });
        });

        describe('POST /scooter/0', () => {
            it('response status is CREATED and response body is of the expected shape and ID is a number other than 0', async () => {
                const response = await agent.post('/scooter/0')
                    .set('X-Access-Token', token)
                    .send({
                        password: "testing"
                    });
                expect(response.status).toEqual(CREATED);
                expect(Object.keys(response.body)).toContain("data");

                const dataKeys = Object.keys(response.body.data);
                expect(dataKeys).toContain("token");
                expect(dataKeys).toContain("scooterId");

                expect(typeof response.body.data.token).toBe("string");
                expect(response.body.data.token).toMatch(/.+/);
                expect(response.body.data.scooterId).toBeGreaterThanOrEqual(1);
            });
        });
    });

    describe('as client without access token', () => {
        describe('GET /scooter', () => {
            it('response status is FORBIDDEN', async () => {
                const response = await agent.get('/scooter');
                expect(response.status).toEqual(FORBIDDEN);
            });
        });

        describe('DELETE /scooter', () => {
            it('response status is FORBIDDEN', async () => {
                const response = await agent.delete('/scooter');
                expect(response.status).toEqual(FORBIDDEN);
            });
        });

        describe('POST /scooter/1', () => {
            it('response status is FORBIDDEN', async () => {
                const response = await agent.post('/scooter/1')
                    .send({
                        password: "wrång"
                    });
                expect(response.status).toEqual(FORBIDDEN);
            });
        });

        describe('GET /scooter/1', () => {
            it('response status is FORBIDDEN', async () => {
                const response = await agent.delete('/scooter/1');
                expect(response.status).toEqual(FORBIDDEN);
            });
        });

        describe('PUT /scooter/1', () => {
            it('response status is FORBIDDEN', async () => {
                const response = await agent.put('/scooter/1');
                expect(response.status).toEqual(FORBIDDEN);
            });
        });

        describe('DELETE /scooter/1', () => {
            it('response status is FORBIDDEN', async () => {
                const response = await agent.put('/scooter/1');
                expect(response.status).toEqual(FORBIDDEN);
            });
        });

        describe('POST /scooter/token with bad credentials', () => {
            it('response status is UNAUTHORIZED', async () => {
                const response = await agent.post('/scooter/token')
                    .send({ scooterId: 1, password: "nähäru"});
                expect(response.status).toEqual(UNAUTHORIZED);
            });
        });

        describe('POST /scooter/token with good credentials', () => {
            it('response status is UNAUTHORIZED', async () => {
                const response = await agent.post('/scooter/token')
                    .send({ scooterId: 1, password: "1"});
                expect(response.status).toEqual(OK);
                expect(Object.keys(response.body)).toContain("data");

                const dataKeys = Object.keys(response.body.data);
                expect(dataKeys).toContain("token");
                expect(dataKeys).toContain("scooterId");

                expect(typeof response.body.data.token).toBe("string");
                expect(response.body.data.token).toMatch(/.+/);
                expect(response.body.data.scooterId).toEqual(1);
            });
        });
    });

    describe('as customer', () => {
        beforeAll(async () => {
            const responseAdmin = await agent.post('/admin/setup')
                .send(superadmin);

            await agent.delete('/customer')
                .set('X-Access-Token', responseAdmin.body.data.token);

            const responseCustomer = await agent.post('/customer/1')
                .send({
                    email: "tester@test.com",
                    customerName: "Tester Testersson"
                });

            token = responseCustomer.body.data.token;
        });

        describe('GET /scooter', () => {
            it('response status is OK and response body is of the expected shape', async () => {
                const response = await agent.get('/scooter')
                    .set({'X-Access-Token': token});
                expect(response.status).toEqual(OK);
                expect(Object.keys(response.body)).toContain("data");
                expect(Array.isArray(response.body.data)).toBeTrue();
            });
        });

        describe('DELETE /scooter', () => {
            it('response status is FORBIDDEN', async () => {
                const response = await agent.delete('/scooter')
                    .set({'X-Access-Token': token});
                expect(response.status).toEqual(FORBIDDEN);
            });
        });

        describe('POST /scooter/1', () => {
            it('response status is CONFLICT', async () => {
                const response = await agent.post('/scooter/1')
                    .set({'X-Access-Token': token})
                    .send({
                        password: "bozo"
                    });
                expect(response.status).toEqual(FORBIDDEN);
            });
        });

        describe('GET /scooter/1', () => {
            it('response status is OK', async () => {
                const response = await agent.get('/scooter/1')
                    .set('X-Access-Token', token);
                expect(response.status).toEqual(OK);
                expect(Object.keys(response.body)).toContain("data");

                const dataKeys = Object.keys(response.body.data);
                expect(dataKeys).toContain("id");
                expect(dataKeys).toContain("createdAt");
                expect(dataKeys).toContain("updatedAt");
                expect(dataKeys).toContain("positionX");
                expect(dataKeys).toContain("positionY");
                expect(dataKeys).toContain("battery");
                expect(dataKeys).toContain("maxSpeed");
                expect(dataKeys).toContain("charging");
                expect(dataKeys).toContain("available");
                expect(dataKeys).toContain("decomissioned");
                expect(dataKeys).toContain("beingServiced");
                expect(dataKeys).toContain("connected");

                expect(response.body.data.id).toEqual(1);
            });
        });

        describe('POST /scooter/token with bad credentials', () => {
            it('response status is UNAUTHORIZED', async () => {
                const response = await agent.post('/scooter/token')
                    .set({'X-Access-Token': token})
                    .send({ scooterId: 1, password: "nähäru"});
                expect(response.status).toEqual(UNAUTHORIZED);
            });
        });

        describe('POST /scooter/token with good credentials', () => {
            it('response status is UNAUTHORIZED', async () => {
                const response = await agent.post('/scooter/token')
                    .set({'X-Access-Token': token})
                    .send({ scooterId: 1, password: "1"});
                expect(response.status).toEqual(OK);
                expect(Object.keys(response.body)).toContain("data");

                const dataKeys = Object.keys(response.body.data);
                expect(dataKeys).toContain("token");
                expect(dataKeys).toContain("scooterId");

                expect(typeof response.body.data.token).toBe("string");
                expect(response.body.data.token).toMatch(/.+/);
                expect(response.body.data.scooterId).toEqual(1);
            });
        });
    });
});
