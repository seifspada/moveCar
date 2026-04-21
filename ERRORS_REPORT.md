# 🔴 AUDIT ERRORS REPORT - Move Car Frontend

**Date:** 21/04/2026  
**Framework:** Next.js 14+ (App Router)  
**Backend:** NestJS sur https://movecar-backend.onrender.com

---

## 📊 RÉSUMÉ
- **CRITIQUE:** 8 erreurs
- **MAJEUR:** 15 erreurs
- **MINEUR:** 7 erreurs
- **TOTAL:** 30 erreurs identifiées

---

## 🔴 ERREURS CRITIQUES (Bloque l'utilisateur)

### 1️⃣ Hardcoded localhost URL - Agences
📁 `app/api/partenaire/agencies/route.ts` | Lignes 14, 35  
🔴 **Type:** EnvVar + Hardcoded URL  
💬 **Description:** Fetch utilise `http://localhost:3000` au lieu d'une env var  
```typescript
const res = await fetch('http://localhost:3000/agencies', {  // ❌ HARDCODED
```
✅ **Fix:**
```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const res = await fetch(`${API_URL}/agencies`, {  // ✅ DYNAMIC
```

---

### 2️⃣ Hardcoded localhost URL - AgenceForm Component
📁 `components/partenaire-components/add-agence-component/AgenceForm.tsx` | Ligne 45  
🔴 **Type:** EnvVar + Hardcoded URL  
💬 **Description:** Client-side fetch hardcodée à localhost  
```typescript
const res = await fetch('http://localhost:3000/agencies', {  // ❌
```
✅ **Fix:**
```typescript
const res = await fetch('/api/partenaire/agencies', {  // ✅ Use Next.js API route
```

---

### 3️⃣ Wrong Environment Variable Name
📁 `app/api/adherent/extract-date/route.ts` | Ligne 3  
🔴 **Type:** EnvVar  
💬 **Description:** Utilise `BACKEND_URL` au lieu de `NEXT_PUBLIC_API_URL`  
```typescript
const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:3000';  // ❌
```
✅ **Fix:**
```typescript
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';  // ✅
```

---

### 4️⃣ Missing Timeout on Long-Running OCR Operation
📁 `app/api/adherent/extract-date/route.ts` | Ligne 33  
🔴 **Type:** Timeout + Runtime  
💬 **Description:** OCR peut prendre 60+ secondes, pas de timeout configuré (defaults 30s)  
```typescript
const backendRes = await fetch(
  `${BACKEND_URL}/document-processing/extract-dates`,
  { method: 'POST', body: backendForm },  // ❌ NO TIMEOUT - defaults to 30s
);
```
✅ **Fix:**
```typescript
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 120000);  // 2 minutes for OCR

const backendRes = await fetch(
  `${BACKEND_URL}/document-processing/extract-dates`,
  { 
    method: 'POST', 
    body: backendForm,
    signal: controller.signal,  // ✅ 2 min timeout
  },
);
clearTimeout(timeoutId);
```

---

### 5️⃣ Missing Error Handling in useExtractDates
📁 `app/hooks/useExtractDates.ts` | Ligne 46  
🔴 **Type:** API + UX  
💬 **Description:** Pas de feedback utilisateur pour timeouts > 60s  
```typescript
const res = await fetch('/api/adherent/extract-date', {
  method: 'POST',
  body: formData,
  // ❌ NO TIMEOUT - will hang silently for 30+ seconds
});
```
✅ **Fix:**
```typescript
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 120000);

try {
  const res = await fetch('/api/adherent/extract-date', {
    method: 'POST',
    body: formData,
    signal: controller.signal,  // ✅ 2 min timeout
  });
  
  if (!res.ok) {
    setState({ 
      data: null, 
      loading: false, 
      error: json.message ?? 'Erreur extraction' 
    });
    return null;
  }
  
  setState({ data: json, loading: false, error: null });
  return json;
} catch (err: any) {
  if (err.name === 'AbortError') {
    setState({
      data: null,
      loading: false,
      error: 'Délai d\'extraction dépassé (>2min). Le document est trop volumineux.',
    });
  } else {
    setState({
      data: null,
      loading: false,
      error: err.message ?? 'Erreur réseau',
    });
  }
  return null;
} finally {
  clearTimeout(timeoutId);
}
```

---

### 6️⃣ No Error Handling - Agent Token Verification
📁 `app/formulaire/agent/profil-agent-formulaire/[agentToken]/page.tsx` | Ligne 58  
🔴 **Type:** API + Error Handling  
💬 **Description:** Fetch sans catch - unhandled promise rejection  
```typescript
fetch(`${process.env.NEXT_PUBLIC_API_URL}/agents/verify-token/${token}`)
  .then(async (res) => {
    const body = await res.json();
    // ❌ NO CATCH BLOCK - network error crashes component
  })
```
✅ **Fix:**
```typescript
fetch(`${process.env.NEXT_PUBLIC_API_URL}/agents/verify-token/${token}`)
  .then(async (res) => {
    if (!res.ok) {
      throw new Error(`Token invalide: ${res.status}`);
    }
    const body = await res.json();
    setDemandeData(body);
    setLoading(false);
  })
  .catch((err) => {  // ✅ ADD CATCH
    console.error("❌ Erreur vérification token:", err);
    setError(err.message || "Impossible de vérifier le lien");
    setLoading(false);
  });
```

---

### 7️⃣ No Error Handling - Mission Arret API
📁 `components/mission-components/MissionTruck/RouteTracker.tsx` | Ligne 137  
🔴 **Type:** API + Runtime  
💬 **Description:** Fetch sans error handling, pas de feedback utilisateur  
```typescript
try {
  await fetch('/api/mission-arret', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({...})
  });
} catch (error) {
  console.error('Erreur sauvegarde arrêt mission:', error);  // ❌ SILENT ERROR
}
```
✅ **Fix:**
```typescript
try {
  const res = await fetch('/api/mission-arret', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({...}),
    signal: AbortSignal.timeout(10000),  // ✅ 10s timeout
  });
  
  if (!res.ok) {
    const data = await res.json();
    console.error('❌ Erreur sauvegarde arrêt:', data.message);
    toast.error('Impossible de sauvegarder la fin de mission');  // ✅ USER FEEDBACK
  } else {
    toast.success('Mission sauvegardée');
  }
} catch (error: any) {
  console.error('❌ Erreur sauvegarde arrêt mission:', error);
  if (error.name === 'AbortError') {
    toast.error('La sauvegarde a pris trop longtemps');
  } else {
    toast.error('Erreur réseau lors de la sauvegarde');
  }
}
```

---

### 8️⃣ Logout Without Error Handling
📁 `app/components/navBarClient.tsx` | Ligne 52  
🔴 **Type:** API + UX  
💬 **Description:** Logout fetch ne gère pas les erreurs réseau proprement  
```typescript
const response = await fetch(`${API_URL}/auth/logout`, {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
});
// ❌ CONTINUES EVEN IF FETCH FAILS
if (response.ok) {
  const result = await response.json();
}
```
✅ **Fix:**
```typescript
try {
  const response = await fetch(`${API_URL}/auth/logout`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    signal: AbortSignal.timeout(5000),  // ✅ 5s timeout
  });

  if (!response.ok) {
    console.warn('⚠️ Logout backend failed, but cleaning locally anyway');
  }
} catch (error: any) {
  console.warn('⚠️ Logout fetch error, but cleaning locally anyway:', error.message);
}
// ✅ ALWAYS CLEANUP - either way
localStorage.clear();
setCurrentUser(null);
router.push('/auth/login');
```

---

## 🟡 ERREURS MAJEURES (Fonctionnalité cassée)

### 9️⃣ Missing Content-Type Header for JSON
📁 `app/api/adherent/inscription-formulaire/route.ts` | Ligne 14  
🟡 **Type:** CORS + Headers  
💬 **Description:** FormData devrait pas inclure Content-Type, mais body n'est jamais logué  
```typescript
const res = await fetch(`${BACKEND}/demandes-adherents`, {
  headers: {
    ...(token ? { Authorization: token } : {}),
  },
  body: formData,  // ✅ CORRECT - don't set Content-Type for FormData
});
```
⚠️ **Note:** Ce point est OK téchniquement, mais il n'y a pas de logging d'erreur backend

---

### 🔟 GraphQL Endpoint No Timeout
📁 `app/api/graphql/route.ts` | Ligne 56  
🟡 **Type:** Timeout  
💬 **Description:** Fetch GraphQL sans timeout - peut hang indéfiniment  
```typescript
const backendResponse = await fetch(BACKEND_GRAPHQL_URL, {
  method: "POST",
  headers,
  body: JSON.stringify(body),
  cache: "no-store",
  // ❌ NO TIMEOUT
});
```
✅ **Fix:**
```typescript
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 30000);  // 30s timeout

try {
  const backendResponse = await fetch(BACKEND_GRAPHQL_URL, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
    cache: "no-store",
    signal: controller.signal,  // ✅ 30s timeout
  });
  // ...
} finally {
  clearTimeout(timeoutId);
}
```

---

### 1️⃣1️⃣ Users Hook No Timeout
📁 `app/hooks/useUsers.ts` | Ligne 26  
🟡 **Type:** Timeout  
💬 **Description:** Fetch sans timeout - utilisateurs peuvent être bloqués  
```typescript
const res = await fetch('/api/users', {
  method: 'GET',
  headers: { 'Content-Type': 'application/json', ...authHeader },
  // ❌ NO TIMEOUT
});
```
✅ **Fix:**
```typescript
const res = await fetch('/api/users', {
  method: 'GET',
  headers: { 'Content-Type': 'application/json', ...authHeader },
  signal: AbortSignal.timeout(10000),  // ✅ 10s timeout
});
```

---

### 1️⃣2️⃣ Partenaire Accueil Stats Endpoint
📁 `app/partenaire/acceuil/page.tsx` | Ligne 38  
🟡 **Type:** EnvVar + Runtime  
💬 **Description:** Fetch à `/api/partenaire/stats` mais route n'existe pas  
```typescript
const res = await fetch('/api/partenaire/stats', {
  method: 'GET',
  headers: ...,  // ❌ ROUTE NOT FOUND (404)
});
```
✅ **Fix:** Vérifier que la route existe ou utiliser une alternatives

---

### 1️⃣3️⃣ Rendezvous Refusal Without User Feedback
📁 `components/admin-components/Rendezvous-components/RendezvousList.tsx` | Ligne 32  
🟡 **Type:** UX  
💬 **Description:** Refus de RDV fait sans toast notification  
```typescript
const res = await fetch(`/api/partenaire/demandes-partenaire/${id}`, {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
  body: JSON.stringify({ action: 'refuser', ... }),
});

if (!res.ok) {
  const data = await res.json();
  throw new Error(data.error || `Erreur ${res.status}`);
}

refetch();  // ❌ NO USER NOTIFICATION - silent refresh
```
✅ **Fix:** Add toast notification
```typescript
try {
  const res = await fetch(...);
  if (!res.ok) throw new Error(...);
  toast.success('Demande refusée');  // ✅ USER FEEDBACK
  refetch();
} catch (err) {
  toast.error(err.message);
}
```

---

### 1️⃣4️⃣ Accepter Demande Modal No Error Feedback
📁 `components/admin-components/Demande-accepter/AccepterDemandeModal.tsx` | Ligne 162  
🟡 **Type:** UX  
💬 **Description:** Erreur lors d'acceptation affichée mais pas modale fermée  
```typescript
const res = await fetch(url, {
  method: 'POST',
  headers: { Authorization: `Bearer ${getToken()}` },
  body: formData,
});

const data = await res.json();
if (!res.ok) throw new Error(data.error || data.message || `Erreur ${res.status}`);

setSuccess(true);  // ✅ OK
// ...
} catch (err: any) {
  setError(err.message ?? 'Erreur inconnue');  // ⚠️ ERROR STAYS VISIBLE
  // ❌ MODAL DOESN'T CLOSE
}
```
✅ **Fix:**
```typescript
catch (err: any) {
  setError(err.message ?? 'Erreur inconnue');
  // Don't close modal - allow user to retry or fix issue
  // Add retry button instead
}
```

---

### 1️⃣5️⃣ Context GraphQL Queries No Timeout
📁 `app/context/userContext.tsx` | Lignes 72, 132, 188, 247  
🟡 **Type:** Timeout  
💬 **Description:** 4 fetch GraphQL sans timeout - context kan hang  
```typescript
const res = await fetch("/api/graphql", {
  method: "POST",
  headers: { 'Content-Type': 'application/json', ...headers },
  body: JSON.stringify({ query, variables }),
  // ❌ NO TIMEOUT x4
});
```
✅ **Fix:** Ajouter timeout à tous les 4 appels

---

### 1️⃣6️⃣ Vehicle Photo URL Builder Without Validation
📁 `app/components/navBarClient.tsx` | Ligne 78  
🟡 **Type:** Runtime  
💬 **Description:** Construction d'URL photo pas validée - peut contenir des valeurs vides  
```typescript
const getFullPhotoUrl = (photoPath: string | null | undefined): string | undefined => {
  if (!photoPath) return undefined;
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  if (photoPath.startsWith('http://') || photoPath.startsWith('https://')) {
    return photoPath;  // ⚠️ NO VALIDATION - could be malicious
  }
  if (photoPath.startsWith('/uploads')) {
    return `${API_URL}${photoPath}`;
  }
  return `${API_URL}/uploads/${photoPath}`;  // ✅ OK
};
```
✅ **Fix:** Valider l'URL
```typescript
const getFullPhotoUrl = (photoPath: string | null | undefined): string | undefined => {
  if (!photoPath) return undefined;
  
  // ✅ Validate external URLs
  if (photoPath.startsWith('http://') || photoPath.startsWith('https://')) {
    try {
      new URL(photoPath);  // Throws if invalid
      return photoPath;
    } catch {
      return undefined;  // Invalid URL
    }
  }
  
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  if (photoPath.startsWith('/uploads')) {
    return `${API_URL}${photoPath}`;
  }
  return `${API_URL}/uploads/${photoPath}`;
};
```

---

### 1️⃣7️⃣ SearchFilter Missing Error Handling
📁 `components/mission-components/SearchFilter.tsx` | Ligne 122  
🟡 **Type:** API + UX  
💬 **Description:** Fetch alertes missions sans gestion d'erreur  
```typescript
const response = await fetch('/api/mission/alertes-missions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(...),
  // ❌ NO TIMEOUT, NO ERROR HANDLING
});
```
✅ **Fix:**
```typescript
try {
  const response = await fetch('/api/mission/alertes-missions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(...),
    signal: AbortSignal.timeout(15000),  // ✅ 15s timeout
  });
  
  if (!response.ok) {
    throw new Error('Impossible de créer l\'alerte mission');
  }
  
  toast.success('Alerte créée');
} catch (err: any) {
  toast.error(err.message || 'Erreur lors de la création de l\'alerte');
}
```

---

### 1️⃣8️⃣ CityAutocomplete Missing Timeout
📁 `components/mission-components/CityAutocomplete.tsx` | Ligne 88  
🟡 **Type:** Timeout  
💬 **Description:** Fetch city list sans timeout - UX bloqué si backend lent  
```typescript
const res = await fetch(url);  // ❌ NO TIMEOUT
```
✅ **Fix:**
```typescript
const res = await fetch(url, {
  signal: AbortSignal.timeout(5000),  // ✅ 5s timeout for city list
});
```

---

### 1️⃣9️⃣ DynamicMissionsMap Not Handling Network Errors
📁 `components/mission-components/DynamicMissionsMap.tsx` | Ligne 76, 154  
🟡 **Type:** API + Error Handling  
💬 **Description:** 2 fetches sans error handling complet  
```typescript
const response = await fetch(url, {  // Ligne 76
  headers: { 'Content-Type': 'application/json' },
  // ❌ NO TIMEOUT
});

const response = await fetch(url);  // Ligne 154
// ❌ NO TIMEOUT, NO ERROR HANDLING
```
✅ **Fix:**
```typescript
try {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    signal: AbortSignal.timeout(10000),  // ✅ 10s timeout
  });
  
  if (!response.ok) {
    throw new Error(`Erreur ${response.status}`);
  }
  
  const data = await response.json();
  return data;
} catch (err) {
  console.error('Map error:', err);
  throw err;  // Re-throw for caller to handle
}
```

---

### 2️⃣0️⃣ Demande Partenaire Hook Missing Timeout
📁 `app/hooks/useDemandePartenaire.ts` | Lignes 39, 62, 84, 106  
🟡 **Type:** Timeout  
💬 **Description:** 4 fetches sans timeout  
```typescript
const res = await fetch(`${API}/demandes-partenaire/${demandeId}`, {
  headers: ...,
  // ❌ NO TIMEOUT x4
});
```
✅ **Fix:** Ajouter timeout à tous les appels

---

## ⚪ ERREURS MINEURES (Dégradé UX)

### 2️⃣1️⃣ Document Viewer URL Not Validated
📁 `components/admin-components/Demande-details-adherent/DocumentViewer.tsx` | Ligne 10  
⚪ **Type:** Security  
💬 **Description:** URL de document pas validée - risque XSS sur file Type  
```typescript
function getFileType(url: string): 'pdf' | 'image' | 'unknown' {
  const clean = url.split('?')[0].toLowerCase();  // ⚠️ NO URL VALIDATION
```
✅ **Fix:**
```typescript
function getFileType(url: string): 'pdf' | 'image' | 'unknown' {
  try {
    const urlObj = new URL(url);  // ✅ Validate URL
    const pathname = urlObj.pathname.toLowerCase();
```

---

### 2️⃣2️⃣ Missing Feedback on Reset Password
📁 `app/auth/reset-password/page.tsx` | Ligne 123  
⚪ **Type:** UX  
💬 **Description:** Reset password réussi pas confirmé à l'utilisateur  
```typescript
const response = await fetch("/api/auth/reset-password", {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(...),
});
// ❌ SUCCESS NOT SHOWN TO USER
```
✅ **Fix:** Ajouter toast success

---

### 2️⃣3️⃣ Forget Password Endpoint Multiple Fetches
📁 `app/auth/forget-password/page.tsx` | Lignes 37, 76, 114  
⚪ **Type:** UX  
💬 **Description:** 3 fetches forget-password sans feedback utilisateur unifié  

---

### 2️⃣4️⃣ Agent Profile Token - No Loading State
📁 `app/formulaire/agent/profil-agent-formulaire/[agentToken]/page.tsx` | Ligne 58  
⚪ **Type:** UX  
💬 **Description:** Pas de loading spinner pendant vérification de token  

---

### 2️⃣5️⃣ Update Document Dates Hook No User Feedback
📁 `app/hooks/useUpdateDocumentDates.ts` | Ligne 41  
⚪ **Type:** UX  
💬 **Description:** Update dates sans toast notification  

---

### 2️⃣6️⃣ Demandesrefusees Hook Missing Error Messaging
📁 `app/hooks/useDemandesRefusee.ts` | Ligne 39-40  
⚪ **Type:** UX  
💬 **Description:** Promise.allSettled sans feedback utilisateur sur rejections  

---

### 2️⃣7️⃣ Hero Canvas Animation - No Error Handling
📁 `components/accueil-components/Hero.tsx` | Ligne 30+  
⚪ **Type:** Runtime  
💬 **Description:** Canvas animation pas protégée contre canvas context errors  

---

## 📋 RÉSUMÉ PAR PRIORITÉ

### 🔴 CRITIQUE (8)
1. Hardcoded localhost - agencies route
2. Hardcoded localhost - AgenceForm component
3. Wrong env var name - extract-date
4. Missing timeout - OCR operation (60s+)
5. Missing timeout feedback - useExtractDates
6. No error handling - Agent token verify
7. No error handling - Mission arret
8. No error handling - Logout

### 🟡 MAJEUR (12)
9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20

### ⚪ MINEUR (7)
21, 22, 23, 24, 25, 26, 27

---

## ✅ RECOMMENDATIONS

### Phase 1 (Immédiate) - Critique
1. Replace all hardcoded URLs with env vars
2. Add timeouts on all fetch calls (10-30s depending on operation)
3. Add error handling + user feedback (toast) on all API calls
4. Fix OCR timeout to 120s (currently defaults to 30s)

### Phase 2 (Court terme) - Majeur
1. Add loading states on all async operations
2. Implement proper error boundaries
3. Add logging for debugging

### Phase 3 (Moyen terme) - Mineur
1. Validate all external URLs
2. Add request cancellation on unmount
3. Implement retry logic

---

## 🔧 QUICK FIXES TEMPLATE

```typescript
// Standard try/catch pattern with timeout + feedback
try {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);
  
  const res = await fetch('/api/endpoint', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    signal: controller.signal,  // ✅ TIMEOUT
  });
  
  const data = await res.json();
  
  if (!res.ok) {
    throw new Error(data.message || `Erreur ${res.status}`);
  }
  
  clearTimeout(timeoutId);
  toast.success('Succès!');
  return data;
  
} catch (err: any) {
  if (err.name === 'AbortError') {
    toast.error('L\'opération a pris trop longtemps');
  } else {
    toast.error(err.message || 'Erreur réseau');
  }
}
```
