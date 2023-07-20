import { Hono } from "hono"
import home from "./home"
import api from "./apis"

const routes = new Hono()

routes.route("/api", api)
routes.route("/", home)

export default routes
