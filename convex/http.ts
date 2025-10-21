import { httpRouter } from "convex/server";
import { vapiWebhook } from "./webhook";

const http = httpRouter();

http.route({
  path: "/webhook/vapi",
  method: "POST",
  handler: vapiWebhook,
});

export default http;
