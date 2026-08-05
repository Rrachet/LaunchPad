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
  try { adminToken = JSON.parse(adminRes.body).token || ""; } catch {}

  const authHeaders = { Authorization: `Bearer ${adminToken}`, "Content-Type": "application/json" };

  // 2. Create a new client
  const email = "newclient@example.com";
  const createRes = await request("POST /api/admin/users (create)", {
    path: "/api/admin/users",
    method: "POST",
    headers: authHeaders,
  }, { name: "New Client", email });

  let setupToken = "";
  try { setupToken = JSON.parse(createRes.body).setupToken || ""; } catch {}

  console.log("setupToken:", setupToken ? setupToken.slice(0, 12) + "..." : "NONE");

  // 3. Client sets their own password using the token
  if (setupToken) {
    await request("POST /api/auth/set-password (client sets pw)", {
      path: "/api/auth/set-password",
      method: "POST",
      headers: { "Content-Type": "application/json" },
    }, { token: setupToken, password: "newpass123" });
  }

  // 4. Client login with new password
  const loginRes = await request("POST /api/auth/login (new client)", {
    path: "/api/auth/login",
    method: "POST",
    headers: { "Content-Type": "application/json" },
  }, { email, password: "newpass123" });

  let clientToken = "";
  try { clientToken = JSON.parse(loginRes.body).token || ""; } catch {}

  // 5. Admin change password for a client
  const usersRes = await request("GET /api/admin/users", {
    path: "/api/admin/users",
    method: "GET",
    headers: authHeaders,
  });

  let clientId = "";
  try {
    const users = JSON.parse(usersRes.body).users || [];
    const c = users.find((u) => u.email === email);
    clientId = c?.id || "";
  } catch {}

  if (clientId) {
    await request("PUT /api/admin/users/:id/password (admin change pw)", {
      path: `/api/admin/users/${clientId}/password`,
      method: "PUT",
      headers: authHeaders,
    }, { newPassword: "changed123" });
  }

  // 6. Client login with admin-changed password
  await request("POST /api/auth/login (new client, changed pw)", {
    path: "/api/auth/login",
    method: "POST",
    headers: { "Content-Type": "application/json" },
  }, { email, password: "changed123" });

  // 7. Delete the test client (cleanup)
  if (clientId) {
    await request("DELETE /api/admin/users/:id (delete)", {
      path: `/api/admin/users/${clientId}`,
      method: "DELETE",
      headers: authHeaders,
    });
  }
})();
