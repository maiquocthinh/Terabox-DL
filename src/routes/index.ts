import { Hono } from "hono"
import home from "./home"
import api from "./apis"

const routes = new Hono()

routes.route("/", home)
routes.route("/api", api)

export default routes
