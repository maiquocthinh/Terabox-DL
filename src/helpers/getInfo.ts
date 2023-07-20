const getInfoRecursive = async (shortUrl: string, dir: string = "", root: string = "0", cookie: string = "") => {
    const queryString = new URLSearchParams({ app_id: "250528", shorturl: shortUrl.slice(1), root, dir }).toString()

    const response: any = await fetch("https://www.terabox.com/share/list?" + queryString, {
        method: "GET",
        headers: { Cookie: cookie },
    }).then(async (res) => await res.json())

    if (response.errno != 0) throw new Error("Failed get data")

    const childrenPromises = response.list.map(async (file: any) => ({
        category: file.category,
        fs_id: file.fs_id,
        is_dir: file.isdir,
        size: file.size,
        filename: file.server_filename,
        create_time: file.server_ctime,
        children: file.isdir ? await getInfoRecursive(shortUrl, file.path, "0", cookie) : undefined,
    }))

    const children = await Promise.all(childrenPromises)
    return children
}

const getAllInfo = async (shortUrl: string, pwd: string = "") => {
    try {
        // get Cookie if share link need password
        let cookie: string = ""
        if (pwd) cookie = await getCookieWithPass(shortUrl, pwd)

        const queryString = new URLSearchParams({ app_id: "250528", shorturl: shortUrl, root: "1" }).toString()

        const response: any = await fetch("https://www.terabox.com/api/shorturlinfo?" + queryString, {
            method: "GET",
            headers: { Cookie: cookie },
        }).then(async (res) => await res.json())

        if (response.errno != 0) throw new Error("Failed get data")

        const listPromises = response.list.map(async (file: any) => ({
            category: file.category,
            fs_id: file.fs_id,
            is_dir: file.isdir,
            size: file.size,
            filename: file.server_filename,
            create_time: file.server_ctime,
            children: file.isdir ? await getInfoRecursive(shortUrl, file.path, "0", cookie) : undefined,
        }))

        const list = await Promise.all(listPromises)

        return {
            ok: true,
            shareid: response.shareid,
            uk: response.uk,
            sign: response.sign,
            timestamp: response.timestamp,
            list: list,
        }
    } catch (error: any) {
        return {
            ok: false,
            message: error.message,
        }
    }
}

const getCookieWithPass = async (shortUrl: string, pwd: string) => {
    const queryString = new URLSearchParams({ app_id: "250528", surl: shortUrl.slice(1) }).toString()

    return await fetch("https://www.terabox.com/share/verify?" + queryString, {
        method: "POST",
        body: new URLSearchParams({ pwd }),
    }).then(async (res) => {
        const response: any = await res.json()
        if (response.errno != 0) throw new Error("Password wrong!!!")
        return res.headers.get("Set-Cookie")?.split(" ")[0] || ""
    })
}

export default getAllInfo
