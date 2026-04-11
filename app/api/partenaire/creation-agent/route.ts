export async function POST(req: Request) {
  const body = await req.json();

  // ✅ Récupérer le token depuis le header Authorization de la requête
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return Response.json({ message: 'Token manquant' }, { status: 401 });
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/agencies`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: authHeader, // ✅ on le transmet tel quel
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return Response.json(data, { status: res.status });
}
