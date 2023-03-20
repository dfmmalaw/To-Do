import chai from "chai";
import chaiHttp from "chai-http";
import app from "../server/index.js";
import createJWKSMock from "mock-jwks";
import { encryptData } from "../server/utils/crypto.util.js";

const AUTH_DOMAIN = process.env.AUTH_ISSUER;
const AUTH_AUDIENCE = process.env.AUTH_AUDIENCE;

const expect = chai.expect;
chai.use(chaiHttp);
chai.should();

let jwks;

function startAuthServer(jwksServer) {
  jwks = createJWKSMock(jwksServer);
  jwks.start();
}

function getToken(jwks, authDomain, authAudience) {
  const token = jwks.token({
    aud: [authAudience],
    iss: authDomain,
    "https://catkin.dev/permissions": [
      {
        group: "*",
        role: "admin",
      },
    ],
    sub: "testprovider|12345678",
  });
  return token;
}

function stopAuthServer() {
  jwks.stop();
}

before(function () {
  startAuthServer(AUTH_DOMAIN);
});

after(function () {
  stopAuthServer();
});

describe("Task Route", function () {
  this.timeout(5000000);
  let taskId;

  it("should create a task successfully", async () => {
    const token = getToken(jwks, AUTH_DOMAIN, AUTH_AUDIENCE);
    const res = await chai
      .request(app)
      .post("/api/create/task")
      .set({ Authorization: `Bearer ${token}` })
      .send({
        title: encryptData("My First Task"),
        description: encryptData("My First Task"),
        due_date: encryptData("2023-5-10"),
        priority: encryptData("LOW"),
      });

    taskId = res.body.task._id;
    expect(res.status).to.equal(200);
    expect(res.body.message).include("Task Successfull created");
  });

  it("should delete an task using their Task ID", async () => {
    const token = getToken(jwks, AUTH_DOMAIN, AUTH_AUDIENCE);
    const res = await chai
      .request(app)
      .delete(`/api/task/${taskId}`)
      .set({ Authorization: `Bearer ${token}` });

    expect(res.status).to.equal(200);
    expect(res.body.message).include("Task Deleted");
  });
});
