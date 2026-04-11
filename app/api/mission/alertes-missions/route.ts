// app/api/mission/alertes-missions/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { verify, JwtPayload } from 'jsonwebtoken';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const REQUEST_TIMEOUT = 10000;

/**
 * Interface pour le payload JWT
 */
interface DecodedToken {
  sub?: number;
  userId?: number;
  email: string;
  role?: string;
  iat?: number;
  exp?: number;
}

/**
 * POST - Créer une alerte (géographique ou trajet)
 */
export async function POST(request: NextRequest) {
  console.log('🔔 API Route Alertes - POST appelée');

  try {
    // ✅ 1. Récupérer le token depuis l'en-tête Authorization
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Token manquant. Vous devez être connecté.' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    // ✅ 2. Décoder et vérifier le token JWT
    let userId: number;
    let userEmail: string;

    try {
      const decoded = verify(token, process.env.JWT_SECRET!) as DecodedToken;

      console.log('🔍 Token décodé:', decoded);

      userId = decoded.sub ?? decoded.userId ?? 0;

      if (!userId || userId === 0) {
        throw new Error('userId manquant dans le token');
      }

      userEmail = decoded.email;

      console.log('🔐 Utilisateur authentifié:', {
        userId,
        email: userEmail,
      });

    } catch (jwtError: any) {
      console.error('❌ Erreur JWT:', jwtError.message);
      return NextResponse.json(
        { success: false, error: 'Token invalide ou expiré' },
        { status: 401 }
      );
    }

    // ✅ 3. Récupérer le body de la requête
    const body = await request.json();
    console.log('📥 Body reçu:', JSON.stringify(body, null, 2));

    // ✅ 4. Validation du type
    if (!body.type || !['GEOGRAPHIQUE', 'TRAJET'].includes(body.type)) {
      return NextResponse.json(
        { success: false, error: 'Type invalide (GEOGRAPHIQUE ou TRAJET requis)' },
        { status: 400 }
      );
    }

    // ✅ 5. Validation selon le type
    if (body.type === 'GEOGRAPHIQUE') {
      const missing = [];
      if (!body.villeNom) missing.push('villeNom');
      if (body.latitude === undefined) missing.push('latitude');
      if (body.longitude === undefined) missing.push('longitude');
      if (!body.rayon) missing.push('rayon');

      if (missing.length > 0) {
        return NextResponse.json(
          { 
            success: false, 
            error: `Champs manquants: ${missing.join(', ')}` 
          },
          { status: 400 }
        );
      }
    }

    if (body.type === 'TRAJET') {
      const missing = [];
      if (!body.villeDepartNom) missing.push('villeDepartNom');
      if (body.latitudeDepart === undefined) missing.push('latitudeDepart');
      if (body.longitudeDepart === undefined) missing.push('longitudeDepart');
      if (!body.villeArriveeNom) missing.push('villeArriveeNom');
      if (body.latitudeArrivee === undefined) missing.push('latitudeArrivee');
      if (body.longitudeArrivee === undefined) missing.push('longitudeArrivee');
      if (!body.rayon) missing.push('rayon');

      if (missing.length > 0) {
        return NextResponse.json(
          { 
            success: false, 
            error: `Champs manquants: ${missing.join(', ')}` 
          },
          { status: 400 }
        );
      }
    }

    // ✅ 6. Endpoint selon le type
    const endpoint = body.type === 'GEOGRAPHIQUE'
      ? `${BACKEND_URL}/api/alertes/geographique`
      : `${BACKEND_URL}/api/alertes/trajet`;

    console.log(`🔄 Envoi vers: ${endpoint}`);

    // ✅ 7. 🔥 CONSTRUIRE LE BODY SELON LE TYPE
    let backendBody: any;

    if (body.type === 'GEOGRAPHIQUE') {
      // ✅ Pour alerte géographique : seulement les champs GEO
      backendBody = {
        userId,
        villeNom: body.villeNom,
        latitude: body.latitude,
        longitude: body.longitude,
        rayon: body.rayon,
      };
    } else {
      // ✅ Pour alerte trajet : seulement les champs TRAJET
      backendBody = {
        userId,
        villeDepartNom: body.villeDepartNom,
        latitudeDepart: body.latitudeDepart,
        longitudeDepart: body.longitudeDepart,
        villeArriveeNom: body.villeArriveeNom,
        latitudeArrivee: body.latitudeArrivee,
        longitudeArrivee: body.longitudeArrivee,
        rayon: body.rayon,
        dateDepart: body.dateDepart || undefined,
        dateDepartMax: body.dateDepartMax || undefined,
      };
    }

    console.log('📤 Body envoyé au backend:', JSON.stringify(backendBody, null, 2));

    // ✅ 8. Appel backend avec timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(backendBody),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log(`📥 Réponse backend: ${response.status} ${response.statusText}`);

      const contentType = response.headers.get('content-type');

      if (!response.ok) {
        if (contentType?.includes('application/json')) {
          const error = await response.json();
          console.error('❌ Erreur backend (JSON):', error);

          let errorMessage = 'Erreur lors de la création de l\'alerte';

          if (error.message && Array.isArray(error.message)) {
            errorMessage = error.message.join(', ');
          } else if (error.message) {
            errorMessage = error.message;
          } else if (error.error) {
            errorMessage = error.error;
          }

          return NextResponse.json(
            {
              success: false,
              error: errorMessage,
              details: error,
            },
            { status: response.status }
          );
        }

        const textError = await response.text();
        console.error('❌ Erreur backend (texte):', textError.substring(0, 300));

        return NextResponse.json(
          {
            success: false,
            error: `Erreur ${response.status}: ${response.statusText}`,
          },
          { status: response.status }
        );
      }

      // ✅ Succès
      const data = await response.json();
      console.log('✅ Alerte créée:', data.data?.id || 'ID inconnu');

      return NextResponse.json(data, { status: 201 });

    } catch (fetchError: any) {
      clearTimeout(timeoutId);

      if (fetchError.name === 'AbortError') {
        console.error('⏱️ Timeout dépassé');
        return NextResponse.json(
          {
            success: false,
            error: 'Délai d\'attente dépassé (10s).',
          },
          { status: 504 }
        );
      }

      if (fetchError.code === 'ECONNREFUSED' || fetchError.cause?.code === 'ECONNREFUSED') {
        console.error('🔌 Backend hors ligne');
        return NextResponse.json(
          {
            success: false,
            error: `Backend hors ligne (${BACKEND_URL}).`,
          },
          { status: 503 }
        );
      }

      console.error('❌ Erreur réseau:', fetchError);
      throw fetchError;
    }

  } catch (error: any) {
    console.error('💥 Erreur dans API Route:', error);

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { success: false, error: 'JSON invalide dans la requête' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Erreur serveur interne',
      },
      { status: 500 }
    );
  }
}
