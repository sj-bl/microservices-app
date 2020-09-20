import request from "supertest";
import { app } from "../../app";

it("return 400 if user doesnt exist", async () => {
  return request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "1234567890",
    })
    .expect(400);
});
it("return 200 after successful login", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "1234567890",
    })
    .expect(201);

  await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "1234567890",
    })
    .expect(200);
});

it("return 400 after login fail", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "1234567890",
    })
    .expect(201);

  await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "12123sdfgfds",
    })
    .expect(400);
});
