import supertest, { SuperTest, Test, Response, agent } from 'supertest';
import { defaultErrMsg as ValidatorErr } from 'jet-validator';
import insertUrlParams from 'inserturlparams';

import app from '@src/server';

import HttpStatusCodes from '@src/constants/HttpStatusCodes';

import { TReqBody } from 'spec/support/types';
import { doesNotMatch } from 'assert';
import { originAgentCluster } from 'helmet';
import { after } from 'node:test';
import { errorMonitor } from 'events';


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

// **** Tests **** //

describe('adminRouter', () => {
    let token: string;
    let agent: SuperTest<Test>;

    beforeAll(() => {
        agent = supertest.agent(app)
    })

    describe('as superadmin', () => {
        beforeEach(async () => {
            const response = await agent.post('/admin/setup')
                .send(superadmin);
            token = response.body.data.token;
        });

        describe('GET /admin', () => {
            it('response status is OK and the body is of the expected shape', async () => {
                const response = await agent.get('/admin')
                    .set('X-Access-Token', token);
                expect(response.status).toEqual(OK);
                expect(Object.keys(response.body)).toContain("data");
                expect(Array.isArray(response.body.data)).toBeTrue();
                
                const adminData = response.body.data[0];
                const adminDataKeys = Object.keys(adminData);
                expect(adminDataKeys).toContain("id");
                expect(adminDataKeys).toContain("username");
                expect(adminDataKeys).toContain("level");
            });
        });

        describe('DELETE /admin', () => {
            it('response status is NO_CONTENT', async () => {
                const response = await agent.delete('/admin')
                    .set('X-Access-Token', token);
                expect(response.status).toEqual(NO_CONTENT);
            });
        });

        describe('GET /admin/1 with valid jwt but with admin removed from database', () => {
            it('response code is FORBIDDEN', async () => {
                await agent.delete('/admin')
                    .set('X-Access-Token', token);
                const response = await agent.get('/admin')
                    .set('X-Access-Token', token);
                expect(response.status).toEqual(FORBIDDEN);
            });
        });

        describe('GET /admin/1 after superadmin setup', () => {
            it('response code is OK and of the expected shape', async () => {
                const responseAdmin = await agent.post('/admin/setup')
                    .set('X-Access-Token', token);
                const adminId = responseAdmin.body.data.id;                
                const response = await agent.get('/admin/' + adminId)
                    .set('X-Access-Token', token);
                expect(response.status).toEqual(OK);
                expect(Object.keys(response.body)).toContain("data");

                const dataKeys = Object.keys(response.body.data);
                expect(dataKeys).toContain("id");
                expect(dataKeys).toContain("username");
                expect(dataKeys).toContain("level");
                expect(response.body.data.id).toEqual(adminId);
                expect(response.body.data.username).toEqual("chefen");
                expect(response.body.data.level).toEqual("superadmin");
            });
        });

        describe('POST /admin/1', () => {
            it('response code is OK', async () => {
                const response1 = await agent.post('/admin/1')
                    .set('X-Access-Token', token)
                    .send({
                        username: "klaro",
                        password: "klaro",
                        level: "admin"
                    });
                expect(response1.status).toEqual(CREATED);
                expect(Object.keys(response1.body)).toContain("data");

                const dataKeys = Object.keys(response1.body.data);
                expect(dataKeys).toContain("username");
                expect(dataKeys).toContain("token");
                expect(response1.body.data.username).toEqual("klaro");
                expect(response1.body.data.token).toMatch(/.+/);

                const response2 = await agent.get('/admin/1')
                    .set('X-Access-Token', token);
                expect(response2.body.data.level).toEqual("admin");
            });
        });

        describe('PUT /admin/1 to change level', () => {
            it('response code is NO_CONTENT and level is changed', async () => {
                const response1 = await agent.put('/admin/1')
                    .set('X-Access-Token', token)
                    .send({
                        level: "tech"
                    });
                expect(response1.status).toEqual(NO_CONTENT);

                const response2 = await agent.get('/admin/1')
                    .set('X-Access-Token', token);
                expect(response2.body.data.level).toEqual("tech");
            });
        });

        describe('DELETE /admin/1', () => {
            it('response code is NO_CONTENT and adminId is removed', async () => {
                const response1 = await agent.delete('/admin/1')
                    .set('X-Access-Token', token);
                expect(response1.status).toEqual(NO_CONTENT);

                const response2 = await agent.get('/admin/1')
                    .set('X-Access-Token', token);
                expect(response2.status).toEqual(NOT_FOUND);
            });
        });

        describe('POST /admin/token', () => {
            it('response code is OK and body is of the expected shape', async () => {
                await agent.post('/admin/1')
                    .set('X-Access-Token', token)
                    .send({
                        username: "slent",
                        password: "slent",
                        level: "admin"
                    });

                const response = await agent.post('/admin/token')
                    .set('X-Access-Token', token)
                    .send({
                        username: "slent",
                        password: "slent"
                    });
                expect(response.status).toEqual(OK);
                expect(Object.keys(response.body)).toContain("data");

                const dataKeys = Object.keys(response.body.data);
                expect(dataKeys).toContain("username");
                expect(dataKeys).toContain("token");
                expect(response.body.data.username).toEqual("slent");
                expect(response.body.data.token).toMatch(/.+/);
            });
        });
    });

    describe('as non-superadmin admin', () => {
        let thisAdminId: number;
        let notThisAdminId: number;

        beforeAll(async () => {
            const responseSuperadmin = await agent.post('/admin/setup')
                .send(superadmin);
            token = responseSuperadmin.body.data.token;

            await agent.post('/admin/post')
                .set('X-Access-Token', token)
                .send({
                    username: "testadmin",
                    password: "testpassword",
                    level: "admin"
                })

            const responseAdmins = await agent.get('/admin')
                .set("X-Access-Token", token);

            for (const admin of responseAdmins.body.data) {
                if (typeof admin === "object" && admin.hasOwnProperty("username") && admin.username === "testadmin") {
                    thisAdminId = admin.id;
                    notThisAdminId = thisAdminId + 1;
                }
            }

            if (!thisAdminId) {
                throw(new Error("beforeAll setup of suite 'as non-superadmin admin' failed unexpectedly"))
            }

            const responseToken = await agent.post('/admin/token')
                .send({
                    username: "testadmin",
                    password: "testpassword"
                })
            token = responseToken.body.data.token
        });

        describe('GET /admin', () => {
            it('response status is OK and body is of the expected shape', async () => {
                const response = await agent.get('/admin')
                    .set("X-Access-Token", token);
                expect(response.status).toEqual(OK);
                expect(Object.keys(response.body)).toContain("data");
                expect(Array.isArray(response.body.data)).toBeTrue();
                
                const adminData = response.body.data[0];
                const adminDataKeys = Object.keys(adminData);
                expect(adminDataKeys).toContain("id");
                expect(adminDataKeys).toContain("username");
                expect(adminDataKeys).toContain("level");
            });
        });

        describe('DELETE /admin', () => {
            it('response status is FORBIDDEN', async () => {
                const response = await agent.delete('/admin')
                    .set("X-Access-Token", token);
                expect(response.status).toEqual(FORBIDDEN);
            });
        });

        describe('POST /admin/1', () => {
            it('response status is FORBIDDEN', async () => {
                const response = await agent.post('/admin/1')
                    .set("X-Access-Token", token)
                    .send({
                        username: "snuten",
                        password: "aina",
                        level: "admin"
                    });
                expect(response.status).toEqual(FORBIDDEN);
            });
        });

        describe('GET /admin/:notThisAdminId', () => {
            it('response status is FORBIDDEN', async () => {
                const response = await agent.get('/admin/' + notThisAdminId)
                    .set("X-Access-Token", token);
                expect(response.status).toEqual(FORBIDDEN);
            });
        });

        describe('GET /admin/:thisAdminId', () => {
            it('response status is OK', async () => {
                const response = await agent.get('/admin/' + thisAdminId)
                    .set("X-Access-Token", token);
                expect(response.status).toEqual(OK);
            });
        });

        describe('PUT /admin/1', () => {
            it('response status is FORBIDDEN', async () => {
                const response = await agent.put('/admin/1')
                    .set("X-Access-Token", token);
                expect(response.status).toEqual(FORBIDDEN);
            });
        });

        describe('DELETE /admin/1', () => {
            it('response status is FORBIDDEN', async () => {
                const response = await agent.put('/admin/1')
                    .set("X-Access-Token", token);
                expect(response.status).toEqual(FORBIDDEN);
            });
        });

        describe('POST /admin/token with bad credentials', () => {
            it('response status is UNAUTHORIZED', async () => {
                const response = await agent.post('/admin/token')
                    .set("X-Access-Token", token)
                    .send({ 
                        username: "fel",
                        password: "fel också"
                    });
                expect(response.status).toEqual(UNAUTHORIZED);
            });
        });
    });

    describe('as client without access token', () => {
        describe('GET /admin', () => {
            it('response status is FORBIDDEN', async () => {
                const response = await agent.get('/admin');
                expect(response.status).toEqual(FORBIDDEN);
            });
        });

        describe('DELETE /admin', () => {
            it('response status is FORBIDDEN', async () => {
                const response = await agent.delete('/admin');
                expect(response.status).toEqual(FORBIDDEN);
            });
        });

        describe('POST /admin/1', () => {
            it('response status is FORBIDDEN', async () => {
                const response = await agent.post('/admin/1')
                    .send({
                        username: "snuten",
                        password: "aina",
                        level: "admin"
                    });
                expect(response.status).toEqual(FORBIDDEN);
            });
        });

        describe('GET /admin/1', () => {
            it('response status is FORBIDDEN', async () => {
                const response = await agent.delete('/admin/1');
                expect(response.status).toEqual(FORBIDDEN);
            });
        });

        describe('PUT /admin/1', () => {
            it('response status is FORBIDDEN', async () => {
                const response = await agent.put('/admin/1');
                expect(response.status).toEqual(FORBIDDEN);
            });
        });

        describe('DELETE /admin/1', () => {
            it('response status is FORBIDDEN', async () => {
                const response = await agent.put('/admin/1');
                expect(response.status).toEqual(FORBIDDEN);
            });
        });

        describe('POST /admin/token with bad credentials', () => {
            it('response status is UNAUTHORIZED', async () => {
                const response = await agent.post('/admin/token')
                    .send({ 
                        username: "fel",
                        password: "fel också"
                    });
                // console.log(response);
                expect(response.status).toEqual(UNAUTHORIZED);
            });
        });
    });
});
