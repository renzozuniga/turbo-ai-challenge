async function getBackendHealth() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/health/`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function Home() {
  const health = await getBackendHealth();

  return (
    <main style={{ padding: "3rem", maxWidth: 640, margin: "0 auto" }}>
      <h1>Turbo AI Challenge</h1>
      <p>Django backend + Next.js frontend starter.</p>
      <p>
        Backend health check:{" "}
        <strong>{health ? health.status : "unreachable"}</strong>
      </p>
    </main>
  );
}
