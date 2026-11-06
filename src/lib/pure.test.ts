import assert from "node:assert/strict";
import { test } from "node:test";
import { clientIp, MAX_CART_LINES, parseCart, youtubeId } from "./pure.ts";

test("parseCart keeps only valid lines", () => {
    assert.deepEqual(parseCart('{"5":2,"7":1000,"0":1,"abc":1,"9":0,"8":1.5,"6":"2"}'), { "5": 2, "7": 999 });
});

test("parseCart survives junk", () => {
    for (const raw of [undefined, "", "not json", "null", "[1,2]", "5"]) assert.deepEqual(parseCart(raw), {});
});

test("parseCart caps the number of lines", () => {
    const big = Object.fromEntries(Array.from({ length: 200 }, (_, i) => [i + 1, 1]));
    assert.equal(Object.keys(parseCart(JSON.stringify(big))).length, MAX_CART_LINES);
});

test("youtubeId reads every common link form", () => {
    for (const url of [
        "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        "https://youtube.com/watch?list=x&v=dQw4w9WgXcQ&t=3",
        "https://youtu.be/dQw4w9WgXcQ?si=abc",
        "https://www.youtube.com/shorts/dQw4w9WgXcQ",
        "https://m.youtube.com/embed/dQw4w9WgXcQ",
    ]) assert.equal(youtubeId(url), "dQw4w9WgXcQ", url);
    assert.equal(youtubeId("https://www.youtube.com/@techvision_uz"), null);
});

test("clientIp ignores what the visitor put in front", () => {
    assert.equal(clientIp("6.6.6.6, 1.2.3.4"), "1.2.3.4");
    assert.equal(clientIp(null), null);
});
