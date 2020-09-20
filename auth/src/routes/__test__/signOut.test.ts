import request from "supertest";
import { app } from "../../app";

it("return 200 after successful signout", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "1234567890",
    })
    .expect(201);

  const response = await request(app).post("/api/users/signout").expect(200);
  expect(response.get("Set-Cookie")).toBeDefined();
});
