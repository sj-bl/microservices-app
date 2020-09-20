import request from "supertest";
import { app } from "../../app";

it("return 201 after succesful test", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "1234567890",
    })
    .expect(201);
});
it("returns 400 for invalid email", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "testtest.com",
      password: "1234567890",
    })
    .expect(400);
});
it("returns 400 for empty email and password", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      password: "1234567890",
    })
    .expect(400);
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
    })
    .expect(400);
});
it("return 400 for duplicate email signup", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "1234567890",
    })
    .expect(201);
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "1234567890",
    })
    .expect(400);
});
it("return cookie after successfull login", async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com", password: "1234567890" })
    .expect(201);

  expect(response.get("Set-Cookie")).toBeDefined();
});
