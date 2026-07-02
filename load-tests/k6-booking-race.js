import http from "k6/http";
import { check } from "k6";
import { SharedArray } from "k6/data";

const data = new SharedArray("load-test-data", function () {
    return [JSON.parse(open("./load-test-data.json"))];
})[0];

const BASE_URL = __ENV.BASE_URL || "http://localhost:8000";

export const options = {
    scenarios: {
        booking_race: {
            executor: "per-vu-iterations",
            vus: data.tokens.length,
            iterations: 1,
            maxDuration: "30s",
        },
    },
};

export default function () {
    const token = data.tokens[__VU - 1];

    const res = http.post(
        `${BASE_URL}/api/bookings`,
        JSON.stringify({
            id_screening: data.screening_id,
            seats_count: 1,
        }),
        {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
        }
    );

    check(res, {
        "r�ponse est 201 (r�serv�) ou 422 (complet)": (r) =>
            r.status === 201 || r.status === 422,
    });
}
