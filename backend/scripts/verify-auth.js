const http = require("http");

function request(desc, opts, body) {
  return new Promise((resolve) => {
    const req = http.request(
      { host: "localhost", port: 5000, ...opts },
      (res) => {
        let d = "";
        res.on("data", (c) => (d += c));
        res.on("end", () => {
          console.log(`${desc} => STATUS ${res.statusCode} | ${d}`);
          resolve({ status: res.statusCode, body: d });
        });
      }
    );
    req.on("error", (e) => {
      console.log(`${desc} => ERROR ${e.message}`);
      resolve({ status: 0, body: "", error: e.message });
    });
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

(async () => {
  // 1. Admin login
  const adminRes = await request("POST /api/auth/login (admin)", {
    path: "/api/auth/login",
    method: "POST",
    headers: { "Content-Type": "application/json" },
  }, { email: "amar@admin.com", password: "admin123" });

  let adminToken = "";
  try {
    adminToken = JSON.parse(adminRes.body).token || "";
  } catch {}

  // 2. Client login
  const clientRes = await request("POST /api/auth/login (client)", {
    path: "/api/auth/login",
    method: "POST",
    headers: { "Content-Type": "application/json" },
  }, { email: "amar@client.com", password: "client123" });

  let clientToken = "";
  try {
    clientToken = JSON.parse(clientRes.body).token || "";
  } catch {}

  // 3. Admin: get users
  if (adminToken) {
    await request("GET /api/admin/users (admin)", {
      path: "/api/admin/users",
      method: "GET",
      headers: { Authorization: `Bearer ${adminToken}` },
    });
  }

  // 4. Admin: get activity
  if (adminToken) {
    await request("GET /api/admin/activity (admin)", {
      path: "/api/admin/activity",
      method: "GET",
      headers: { Authorization: `Bearer ${adminToken}` },
    });
  }

  // 5. Client: try admin endpoint (should be denied)
  if (clientToken) {
    await request("GET /api/admin/users (client -> should be 403)", {
      path: "/api/admin/users",
      method: "GET",
      headers: { Authorization: `Bearer ${clientToken}` },
    });
  }

  // 6. Client logout
  if (clientToken) {
    await request("POST /api/auth/logout (client)", {
      path: "/api/auth/logout",
      method: "POST",
      headers: { Authorization: `Bearer ${clientToken}` },
    });
  }
})();
