import { Hono } from "hono"
import { serveStatic } from "hono/cloudflare-workers"

const home = new Hono()

home.get("/", serveStatic({ root: "./", path: "./home.html" }))
home.use("/favicon.ico", serveStatic({ path: "./favicon.ico" }))
home.get("/*", serveStatic({ root: "./" }))

export default home
