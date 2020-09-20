import request from "supertest";
import { app } from "../../app";

it("returns current user information", async () => {
  const cookie = await global.getcookie();
  const res = await request(app)
    .get("/api/users/currentuser")
    .set("Cookie", cookie)
    .send({})
    .expect(200);
  expect(res.body.currentUser.email).toEqual("test@test.com");
});
it("returns  null for unauthorized user", async () => {
  const res = await request(app)
    .get("/api/users/currentuser")
    .send({})
    .expect(200);

  expect(res.body.currentUser).toEqual(null);
});
