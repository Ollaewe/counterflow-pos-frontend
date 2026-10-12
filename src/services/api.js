export async function api(url, body, method = "POST") {
  const r = await fetch(
    "/api" + url,
    body === undefined
      ? {}
      : {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        },
  );
  const j = await r.json();
  if (!r.ok) throw new Error(j.error || "Request failed");
  return j;
}
