// app/api/mission/alertes-missions/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { decode, verify } from 'jsonwebtoken';

const BACKEND_URL =
  process.env.BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:3000';

const JWT_SECRET = process.env.JWT_SECRET;
const REQUEST_TIMEOUT = 10000;

interface DecodedToken {
  sub?: number;
  userId?: number;
  email?: string;
  role?: string;
  iat?: number;
  exp?: number;
}

interface AlertRequestBody {
  type?: 'GEOGRAPHIQUE' | 'TRAJET';
  villeNom?: string;
  latitude?: number;
  longitude?: number;
  villeDepartNom?: string;
  latitudeDepart?: number;
  longitudeDepart?: number;
  villeArriveeNom?: string;
  latitudeArrivee?: number;
  longitudeArrivee?: number;
  rayon?: number;
  emailActif?: boolean;
  pushActif?: boolean;
  fcmToken?: string;
  dateDepart?: string;
  dateDepartMax?: string;
}

function getDecodedToken(token: string): DecodedToken | null {
  if (JWT_SECRET) {
    return verify(token, JWT_SECRET) as DecodedToken;
  }

  // Fallback temporaire: utile si JWT_SECRET n'est pas configure sur le deploy.
  // Le backend reste responsable de valider les donnees recues.
  console.warn('JWT_SECRET manquant: utilisation temporaire de decode() sans verification');
  return decode(token) as DecodedToken | null;
}

function getUserIdFromToken(token: string): number {
  const rawDecoded = getDecodedToken(token);
  console.log('Token decode:', rawDecoded);

  if (!rawDecoded) {
    throw new Error('Token malforme');
  }

  const userId = rawDecoded.sub ?? rawDecoded.userId ?? 0;
  if (!userId) {
    throw new Error('userId manquant dans le token');
  }

  return userId;
}

export async function POST(request: NextRequest) {
  console.log('API Route Alertes - POST appelee');

  try {
    const authHeader = request.headers.get('authorization');
    console.log('Auth header present:', !!authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Token manquant. Vous devez etre connecte.' },
        { status: 401 },
      );
    }

    const token = authHeader.substring(7);
    let userId: number;

    try {
      userId = getUserIdFromToken(token);
    } catch (jwtError) {
      const message = jwtError instanceof Error ? jwtError.message : 'Token invalide';
      console.error('Erreur token:', message);

      return NextResponse.json(
        { success: false, error: message },
        { status: 401 },
      );
    }

    const body = (await request.json()) as AlertRequestBody;
    console.log('Body recu:', JSON.stringify(body, null, 2));

    if (!body.type || !['GEOGRAPHIQUE', 'TRAJET'].includes(body.type)) {
      return NextResponse.json(
        { success: false, error: 'Type invalide (GEOGRAPHIQUE ou TRAJET requis)' },
        { status: 400 },
      );
    }

    if (body.type === 'GEOGRAPHIQUE') {
      const missing = [];
      if (!body.villeNom) missing.push('villeNom');
      if (body.latitude === undefined) missing.push('latitude');
      if (body.longitude === undefined) missing.push('longitude');
      if (!body.rayon) missing.push('rayon');

      if (missing.length > 0) {
        return NextResponse.json(
          { success: false, error: `Champs manquants: ${missing.join(', ')}` },
          { status: 400 },
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
          { success: false, error: `Champs manquants: ${missing.join(', ')}` },
          { status: 400 },
        );
      }
    }

    const endpoint =
      body.type === 'GEOGRAPHIQUE'
        ? `${BACKEND_URL}/api/alertes/geographique`
        : `${BACKEND_URL}/api/alertes/trajet`;

    const backendBody =
      body.type === 'GEOGRAPHIQUE'
        ? {
            userId,
            villeNom: body.villeNom,
            latitude: body.latitude,
            longitude: body.longitude,
            rayon: body.rayon,
            emailActif: body.emailActif ?? true,
            pushActif: body.pushActif ?? false,
            fcmToken: body.fcmToken,
            dateDepart: body.dateDepart || undefined,
            dateDepartMax: body.dateDepartMax || undefined,
          }
        : {
            userId,
            villeDepartNom: body.villeDepartNom,
            latitudeDepart: body.latitudeDepart,
            longitudeDepart: body.longitudeDepart,
            villeArriveeNom: body.villeArriveeNom,
            latitudeArrivee: body.latitudeArrivee,
            longitudeArrivee: body.longitudeArrivee,
            rayon: body.rayon,
            emailActif: body.emailActif ?? true,
            pushActif: body.pushActif ?? false,
            fcmToken: body.fcmToken,
            dateDepart: body.dateDepart || undefined,
            dateDepartMax: body.dateDepartMax || undefined,
          };

    console.log('Backend URL:', BACKEND_URL);
    console.log('Envoi vers:', endpoint);
    console.log('Body envoye au backend:', JSON.stringify(backendBody, null, 2));

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(backendBody),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      console.log('Reponse backend:', response.status, response.statusText);

      const contentType = response.headers.get('content-type');

      if (!response.ok) {
        if (contentType?.includes('application/json')) {
          const error = await response.json();
          console.error('Erreur backend JSON:', error);

          let errorMessage = 'Erreur lors de la creation de l\'alerte';
          if (error.message && Array.isArray(error.message)) {
            errorMessage = error.message.join(', ');
          } else if (error.message) {
            errorMessage = error.message;
          } else if (error.error) {
            errorMessage = error.error;
          }

          return NextResponse.json(
            { success: false, error: errorMessage, details: error },
            { status: response.status },
          );
        }

        const textError = await response.text();
        console.error('Erreur backend texte:', textError.substring(0, 300));

        return NextResponse.json(
          { success: false, error: textError || `Erreur ${response.status}: ${response.statusText}` },
          { status: response.status },
        );
      }

      const data = await response.json();
      console.log('Alerte creee avec succes, ID:', data.data?.id || 'inconnu');

      return NextResponse.json(data, { status: 201 });
    } catch (fetchError) {
      clearTimeout(timeoutId);

      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        console.error('Timeout depasse');
        return NextResponse.json(
          { success: false, error: 'Delai d\'attente depasse (10s).' },
          { status: 504 },
        );
      }

      console.error('Erreur reseau:', fetchError);
      throw fetchError;
    }
  } catch (error) {
    console.error('Erreur dans API Route:', error);

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { success: false, error: 'JSON invalide dans la requete' },
        { status: 400 },
      );
    }

    const message = error instanceof Error ? error.message : 'Erreur serveur interne';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
