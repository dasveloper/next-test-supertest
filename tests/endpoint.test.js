import endpointHandler from "../pages/api/endpoint.js";
import { createServer } from "http";
import { apiResolver } from "next/dist/server/api-utils/node";
import supertest from "supertest";

const testClient = (handler) => {
  const serverRequestListener = async (req, res) => {
    return apiResolver(req, res, undefined, handler, {}, undefined);
  };
  const server = createServer(serverRequestListener);
  return supertest(server);
};

describe("POST: /endpoint", () => {
  it("Should post name and 1kb avatar", async () => {
    await testClient(endpointHandler)
      .post("/endpoint")
      .field("name", "John Doe")
      .attach("avatar", Buffer.from("a".repeat(1000)), "filename")
      .expect({ success: true })
      .expect(200);
  });
  it("Should post name and 10mb avatar", async () => {
    await testClient(endpointHandler)
      .post("/endpoint")
      .field("name", "John Doe")
      .attach("avatar", Buffer.from("a".repeat(10000000)), "filename")
      .expect({ success: true })
      .expect(200);
  });
});
