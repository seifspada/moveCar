// app/api/missions/creer/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  console.log('🎯 API Route Next.js appelée');
  
  try {
    // ✅ Récupérer le JSON
    const body = await request.json();
    
    // ✅ Validation des champs obligatoires
    if (!body.partenaireId || !body.villeDepart || !body.villeArrivee) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Champs obligatoires manquants (partenaireId, villeDepart, villeArrivee)' 
        },
        { status: 400 }
      );
    }
    
    console.log('📦 Données envoyées au backend:');
    console.log(JSON.stringify(body, null, 2));
    
    // ✅ URL du backend NestJS (port 3000)
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    
    console.log(`🔄 Envoi vers: ${backendUrl}/missions/creer`);
    
    // ✅ Timeout pour éviter attente infinie (20 secondes pour laisser le temps au calcul)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000); // ✅ Augmenté à 20s
    
    try {
      // ✅ Envoyer en JSON au backend
      const response = await fetch(`${backendUrl}/missions/creer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json', // ✅ Ajouté
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log(`📥 Réponse backend: ${response.status} ${response.statusText}`);

      const contentType = response.headers.get('content-type');
      
      // Si erreur
      if (!response.ok) {
        if (contentType?.includes('application/json')) {
          const error = await response.json();
          console.error('❌ Erreur backend (JSON):', JSON.stringify(error, null, 2));
          
          // Formater le message d'erreur pour l'utilisateur
          let errorMessage = 'Erreur lors de la création de la mission';
          
          if (error.message && Array.isArray(error.message)) {
            // ValidationPipe de NestJS retourne un array
            errorMessage = `Erreur de validation: ${error.message.join(', ')}`;
          } else if (error.message) {
            errorMessage = error.message;
          } else if (error.error) {
            errorMessage = error.error;
          }
          
          return NextResponse.json(
            { 
              success: false,
              error: errorMessage,
              details: error 
            },
            { status: response.status }
          );
        }
        
        // Si erreur HTML ou texte
        const textError = await response.text();
        console.error('❌ Erreur backend (HTML/texte):', textError.substring(0, 500));
        
        return NextResponse.json(
          { 
            success: false,
            error: `Erreur ${response.status}: ${response.statusText}` 
          },
          { status: response.status }
        );
      }

      // ✅ Succès
      const data = await response.json();
      console.log('✅ Mission créée avec succès:', data.data?.id || 'ID inconnu');
      
      return NextResponse.json(data, { status: 201 });

    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      
      // Erreur de timeout
      if (fetchError.name === 'AbortError') {
        console.error('⏱️ Timeout dépassé (20 secondes)');
        return NextResponse.json(
          { 
            success: false,
            error: 'Délai d\'attente dépassé. Le calcul de la route prend trop de temps.' 
          },
          { status: 504 }
        );
      }
      
      // Erreur de connexion au backend
      if (fetchError.code === 'ECONNREFUSED' || fetchError.cause?.code === 'ECONNREFUSED') {
        console.error('🔌 Backend hors ligne');
        return NextResponse.json(
          { 
            success: false,
            error: `Le serveur backend NestJS est hors ligne. Vérifiez qu'il tourne sur ${backendUrl}` 
          },
          { status: 503 }
        );
      }
      
      // Autres erreurs réseau
      console.error('❌ Erreur réseau:', fetchError);
      throw fetchError;
    }

  } catch (error: any) {
    console.error('💥 Erreur dans API Route:', error);
    
    // Erreur de parsing JSON
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Format JSON invalide dans la requête' 
        },
        { status: 400 }
      );
    }
    
    // Autres erreurs
    return NextResponse.json(
      { 
        success: false,
        error: error.message || 'Erreur serveur interne' 
      },
      { status: 500 }
    );
  }
}
