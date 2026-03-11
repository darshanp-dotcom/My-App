import { init } from "@instantdb/react";
import schema from "../../instant.schema";

const APP_ID =
  process.env.NEXT_PUBLIC_INSTANT_APP_ID ??
  "38737290-7b48-4287-b520-6852e034cfd9";

const db = init({ appId: APP_ID, schema });

export default db;

