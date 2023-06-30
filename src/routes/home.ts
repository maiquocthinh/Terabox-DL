import { Context, Hono } from "hono"

const home = new Hono()

home.get("/", (c: Context) => {
    console.log(c.env.API_TOKEN)

    return c.json({ ok: true, message: "Home" })
})

export default home
