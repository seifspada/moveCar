export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function handleApiResponse(response: Response) {
  const contentType = response.headers.get('content-type');
  
  // Si la réponse est OK
  if (response.ok) {
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    throw new ApiError('Le serveur a retourné une réponse invalide (pas de JSON)', response.status);
  }
  
  // Si erreur
  if (contentType && contentType.includes('application/json')) {
    const error = await response.json();
    throw new ApiError(
      error.error || error.message || 'Erreur lors de la requête',
      response.status,
      error
    );
  }
  
  // Si le serveur retourne du HTML (erreur 404, 500, etc.)
  const textError = await response.text();
  console.error('Réponse HTML reçue:', textError.substring(0, 200));
  
  const errorMessages: Record<number, string> = {
    400: 'Données invalides. Veuillez vérifier le formulaire.',
    401: 'Non autorisé. Veuillez vous reconnecter.',
    403: 'Accès interdit.',
    404: "L'API est introuvable. Vérifiez que le serveur backend est démarré.",
    500: 'Erreur serveur. Veuillez réessayer plus tard.',
    502: 'Serveur indisponible. Veuillez réessayer.',
    503: 'Service temporairement indisponible.',
  };
  
  throw new ApiError(
    errorMessages[response.status] || `Erreur ${response.status}`,
    response.status
  );
}
