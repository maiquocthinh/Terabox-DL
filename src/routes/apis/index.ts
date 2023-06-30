import { Hono } from "hono"
import getInfo from "./getInfo"
import getDownload from "./getDownload"

const api = new Hono()

api.route("/get-info", getInfo)
api.route("/get-download", getDownload)

export default api
