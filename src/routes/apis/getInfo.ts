import { Hono } from "hono"
import getAllInfo from "../../helpers/getInfo"

const getInfo = new Hono()

getInfo.get("/", async (c) => {
    const { shorturl: shortUrl } = await c.req.query()

    const info: any = await getAllInfo(shortUrl)

    return c.json(info)
})

export default getInfo
