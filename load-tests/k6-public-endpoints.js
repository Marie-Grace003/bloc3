import http from "k6/http";
import { check, sleep } from "k6";

const BASE_URL = __ENV.BASE_URL || "http://localhost:8000";

export const options = {
    scenarios: {
        catalogue_browsing: {
            executor: "ramping-vus",
            startVUs: 0,
            stages: [
                { duration: "10s", target: 20 },
                { duration: "30s", target: 20 },
                { duration: "10s", target: 50 },
                { duration: "20s", target: 50 },
                { duration: "10s", target: 0 },
            ],
        },
    },
    thresholds: {
        http_req_duration: ["p(95)<500"],
        http_req_failed: ["rate<0.01"],
    },
};

export default function () {
    const filmsRes = http.get(`${BASE_URL}/api/films`);
    check(filmsRes, {
        "GET /api/films => 200": (r) => r.status === 200,
    });

    const categoriesRes = http.get(`${BASE_URL}/api/categories`);
    check(categoriesRes, {
        "GET /api/categories => 200": (r) => r.status === 200,
    });

    const screeningsRes = http.get(`${BASE_URL}/api/screenings`);
    check(screeningsRes, {
        "GET /api/screenings => 200": (r) => r.status === 200,
    });

    const films = filmsRes.json();
    if (Array.isArray(films) && films.length > 0) {
        const filmId = films[0].id_film;
        const detailRes = http.get(`${BASE_URL}/api/films/${filmId}`);
        check(detailRes, {
            "GET /api/films/{id} => 200": (r) => r.status === 200,
        });
    }

    sleep(1);
}
