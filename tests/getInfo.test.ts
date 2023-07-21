import app from "../src"

describe("getAllInfo", () => {
    it("Get info sharelink", async () => {
        const res = await app.request("/api/get-info?shorturl=1MvXTEXILma3h8wMnUeNN9A")
        const body: any = await res.json()

        expect(res.status).toBe(200)
        expect(body.ok).toBe(true)
        expect(Number.isInteger(body.shareid)).toBe(true)
        expect(Number.isInteger(body.uk)).toBe(true)
        expect(Number.isInteger(body.timestamp)).toBe(true)
        expect((typeof body.sign === "string" || body.sign instanceof String) && body.sign !== "").toBe(true)
    })

    it("Get info sharelink with password", async () => {
        const res = await app.request("/api/get-info?shorturl=1oLdmsjCvW6jh8egiSZT5JQ&pwd=2hwq")
        const body: any = await res.json()

        expect(res.status).toBe(200)
        expect(body.ok).toBe(true)
        expect(Number.isInteger(body.shareid)).toBe(true)
        expect(Number.isInteger(body.uk)).toBe(true)
        expect(Number.isInteger(body.timestamp)).toBe(true)
        expect((typeof body.sign === "string" || body.sign instanceof String) && body.sign !== "").toBe(true)
    })
})
