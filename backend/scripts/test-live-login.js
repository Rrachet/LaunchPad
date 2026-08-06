const https = require("https");

function liveRequest(desc, path, method, body, token) {
  return new Promise((resolve) => {
    const data = body ? JSON.stringify(body) : null;
    const req = https.request(
      {
        host: "launchpad-backend-zeta.vercel.app",
        path,
        method,
        headers: {
          "Content-Type": "application/json",
          ...(data ? { "Content-Length": Buffer.byteLength(data) } : {}),
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      },
      (res) => {
        let d = "";
        res.on("data", (c) => (d += c));
        res.on("end", () => {
          console.log(`${desc} => STATUS ${res.statusCode} | ${d.slice(0, 300)}`);
          resolve({ status: res.statusCode, body: d });
        });
      }
    );
    req.on("error", (e) => {
      console.log(`${desc} => ERROR ${e.message}`);
      resolve({ status: 0, body: "", error: e.message });
    });
    if (data) req.write(data);
    req.end();
  });
}

(async () => {
  // 1. Admin login
  const adminRes = await liveRequest(
    "POST /api/auth/login (admin)",
    "/api/auth/login",
    "POST",
    { email: "amar@admin.com", password: "admin123" }
  );

  let adminToken = "";
  try {
    adminToken = JSON.parse(adminRes.body).token || "";
  } catch {}

  // 2. Client login
  const clientRes = await liveRequest(
    "POST /api/auth/login (client)",
    "/api/auth/login",
    "POST",
    { email: "amar@client.com", password: "client123" }
  );

  let clientToken = "";
  try {
    clientToken = JSON.parse(clientRes.body).token || "";
  } catch {}

  // 3. Admin: get users
  if (adminToken) {
    await liveRequest("GET /api/admin/users (admin)", "/api/admin/users", "GET", null, adminToken);
  }

  // 4. Client: try admin endpoint (should be denied)
  if (clientToken) {
    await liveRequest("GET /api/admin/users (client -> should be 403)", "/api/admin/users", "GET", null, clientToken);
  }
})();
