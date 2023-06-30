const getDLink = async ({ shareid, uk, sign, timestamp, fs_id }: any, { cookie, jsToken, dpLogid }: any) => {
    const queryString = new URLSearchParams({
        app_id: "250528",
        web: "1",
        channel: "dubox",
        clienttype: "0",
        jsToken: jsToken,
        "dp-logid": dpLogid,
        shareid,
        uk,
        sign,
        timestamp,
        primaryid: shareid,
        product: "share",
        nozip: "0",
        fid_list: `[${fs_id}]`,
    }).toString()

    const response: any = await fetch("https://www.terabox.com/share/download?" + queryString, {
        method: "GET",
        headers: {
            Cookie: cookie,
        },
    }).then(async (res) => await res.json())

    if (response.errno != 0) throw new Error(`Failed get url download | Errno: ${response.errno}`)

    return {
        ok: true,
        dlink: response.dlink,
    }
}

const getUrlDownload = async (dlink: string, { userAgent, cookie }: any) => {
    const response: any = await fetch(dlink, {
        redirect: "follow",
        // follow: 0,
        headers: {
            "User-Agent": userAgent,
            "Accept-Language": "en-US,en;q=0.5",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin",
            Cookie: cookie,
        },
    })

    if (!response.redirected) throw new Error("Failed get url download")

    return {
        ok: true,
        downloadLink: response.url,
    }
}

const getDownloadLink = async (
    { shareid, uk, sign, timestamp, fs_id }: any,
    { userAgent, cookie, jsToken, dpLogid }: any
) => {
    try {
        const { dlink } = await getDLink({ shareid, uk, sign, timestamp, fs_id }, { cookie, jsToken, dpLogid })
        return await getUrlDownload(dlink, { userAgent, cookie })
    } catch (error: any) {
        return {
            ok: false,
            message: error.message,
        }
    }
}

export default getDownloadLink
