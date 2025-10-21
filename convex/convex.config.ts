<<<<<<< HEAD
import { defineApp } from "convex/server";
import agent from "@convex-dev/agent/convex.config";
import rag from "@convex-dev/rag/convex.config";

const app = defineApp();
app.use(agent);
app.use(rag);
=======
import agent from "@convex-dev/agent/convex.config";
import { defineApp } from "convex/server";

const app = defineApp();
app.use(agent);
>>>>>>> ca705d8 (yolo bitches)

export default app;
