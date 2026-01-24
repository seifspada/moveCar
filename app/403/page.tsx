// app/403/page.tsx
export default function Forbidden() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">403</h1>
        <p className="text-xl mb-4">Accès refusé</p>
        <a href="/auth/login" className="text-blue-600 underline">
          Retour à la connexion
        </a>
      </div>
    </div>
  );
}
