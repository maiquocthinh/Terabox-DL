import { Context, Hono } from "hono"
import getDownloadLink from "../../helpers/getDownload"

const getDownload = new Hono()

getDownload.post("/", async (c: Context) => {
    const { shareid, uk, sign, timestamp, fs_id } = await c.req.json()

    const download = await getDownloadLink(
        { shareid, uk, sign, timestamp, fs_id },
        {
            userAgent: c.req.header("User-Agent") || "",
            cookie: c.env.COOKIES,
            jsToken: c.env.JS_TOKEN,
            dpLogid: c.env.DP_LOGID,
        }
    )

    return c.json(download)
})

export default getDownload
