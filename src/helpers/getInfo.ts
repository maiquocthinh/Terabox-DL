const getInfoRecursive = async (shortUrl: string, dir: string = "", root: string = "0") => {
    const queryString = new URLSearchParams({ app_id: "250528", shorturl: shortUrl, root, dir }).toString()

    const response: any = await fetch("https://www.terabox.com/api/shorturlinfo?" + queryString, {
        method: "GET",
    }).then(async (res) => await res.json())

    if (response.errno != 0) throw new Error("Failed get data")

    const childrenPromises = response.list.map(async (file: any) => ({
        category: file.category,
        fs_id: file.fs_id,
        is_dir: file.isdir,
        size: file.size,
        filename: file.server_filename,
        create_time: file.server_ctime,
        children: file.isdir ? await getInfoRecursive(shortUrl, file.path, "0") : undefined,
    }))

    const children = await Promise.all(childrenPromises)
    return children
}
const getAllInfo = async (shortUrl: string) => {
    try {
        const queryString = new URLSearchParams({ app_id: "250528", shorturl: shortUrl, root: "1" }).toString()

        const response: any = await fetch("https://www.terabox.com/api/shorturlinfo?" + queryString, {
            method: "GET",
        }).then(async (res) => await res.json())

        if (response.errno != 0) throw new Error("Failed get data")

        const listPromises = response.list.map(async (file: any) => ({
            category: file.category,
            fs_id: file.fs_id,
            is_dir: file.isdir,
            size: file.size,
            filename: file.server_filename,
            create_time: file.server_ctime,
            children: file.isdir ? await getInfoRecursive(shortUrl, file.path, "0") : undefined,
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

export default getAllInfo
