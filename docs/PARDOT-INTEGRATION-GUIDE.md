# Pardot Form Handler Integration Guide

## The Problem

When submitting data to Pardot form handlers from web applications, **browser-based requests** (fetch, XHR, form submissions) often fail to trigger form handler **completion actions**, even though the prospect record is created.

This happens because:
1. Browsers add CORS-related headers (Origin, Referer, Sec-Fetch-*, etc.)
2. Pardot processes cross-origin requests differently
3. The form handler receives the data but doesn't execute completion actions

## The Solution: Server-Side Proxy

Use a **server-side function** (Firebase Cloud Function, AWS Lambda, etc.) to POST to Pardot. Server-side requests work exactly like `curl` and properly trigger completion actions.

### Architecture

```
Browser → Cloud Function (proxy) → Pardot Form Handler
                                         ↓
                              Completion Actions Fire ✓
```

## Implementation

### 1. Firebase Cloud Function (functions/index.js)

```javascript
const functions = require('firebase-functions');
const https = require('https');

exports.submitToPardot = functions.https.onRequest((req, res) => {
    // Enable CORS
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight
    if (req.method === 'OPTIONS') {
        res.status(204).send('');
        return;
    }

    if (req.method !== 'POST') {
        res.status(405).send('Method not allowed');
        return;
    }

    const { pardotUrl, fields } = req.body;

    if (!pardotUrl || !fields) {
        res.status(400).send('Missing pardotUrl or fields');
        return;
    }

    // Build URL-encoded body (required format for Pardot)
    const body = Object.entries(fields)
        .map(([key, value]) => encodeURIComponent(key) + '=' + encodeURIComponent(value || ''))
        .join('&');

    const url = new URL(pardotUrl);

    const options = {
        hostname: url.hostname,
        port: 443,
        path: url.pathname,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(body)
        }
    };

    const pardotReq = https.request(options, (pardotRes) => {
        let data = '';
        pardotRes.on('data', chunk => data += chunk);
        pardotRes.on('end', () => {
            console.log('Pardot response status:', pardotRes.statusCode);
            res.status(200).json({
                success: true,
                status: pardotRes.statusCode,
                message: 'Submitted to Pardot'
            });
        });
    });

    pardotReq.on('error', (error) => {
        console.error('Pardot request error:', error);
        res.status(500).json({ success: false, error: error.message });
    });

    pardotReq.write(body);
    pardotReq.end();
});
```

### 2. Client-Side Code (JavaScript)

```javascript
async function submitToPardot(formData) {
    const proxyUrl = 'https://us-central1-YOUR-PROJECT.cloudfunctions.net/submitToPardot';
    const pardotUrl = 'https://YOUR-TRACKER-DOMAIN.org/l/ACCOUNT_ID/DATE/HANDLER_ID';

    const fields = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        company: formData.company,
        // ... other fields matching your form handler configuration
    };

    try {
        const response = await fetch(proxyUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                pardotUrl: pardotUrl,
                fields: fields
            })
        });

        const result = await response.json();

        if (result.success) {
            console.log('Pardot submission successful');
            return true;
        } else {
            console.error('Pardot submission failed:', result.error);
            return false;
        }
    } catch (error) {
        console.error('Proxy error:', error);
        return false;
    }
}
```

### 3. Deploy the Cloud Function

```bash
# In your project directory
firebase deploy --only functions
```

## Key Points

### What DOESN'T Work (Browser-Side)

❌ Direct form POST from cross-origin domain
❌ fetch() with mode: 'no-cors'
❌ XMLHttpRequest to Pardot
❌ Hidden iframe form submission
❌ navigator.sendBeacon()

All of these create prospect records but **DO NOT** trigger completion actions.

### What DOES Work

✅ curl from terminal
✅ Server-side HTTP requests (Cloud Functions, Lambda, etc.)
✅ Any request without browser CORS restrictions

### Pardot Form Handler Field Mapping

Make sure your field names in the `fields` object match exactly what's configured in Pardot:

| Form Field Name | Pardot Field |
|----------------|--------------|
| `email` | Email (required) |
| `first_name` | First Name |
| `last_name` | Last Name |
| `company` | Company |
| `notes` | Comments |
| Custom fields | As configured in form handler |

### Testing

1. **Test with curl first** to verify form handler works:
```bash
curl -X POST "https://YOUR-PARDOT-URL" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "first_name=Test&last_name=User&email=test@example.com"
```

2. If curl works but browser doesn't → use the proxy solution

3. Check Pardot prospect record for:
   - Record created ✓
   - Completion actions fired (custom fields set, etc.) ✓

## Files in This Project

- `functions/index.js` - Cloud Function proxy
- `functions/package.json` - Function dependencies
- `public/js/app.js` - Client-side form submission code
- `firebase.json` - Firebase configuration

## Common Issues

### "Cannot find success page to redirect to"
This is normal when calling from server-side (no browser to redirect). The submission still works.

### Completion actions not firing
- Verify you're using the proxy, not direct browser submission
- Check form handler configuration in Pardot
- Test with curl to isolate the issue

### CORS errors
- Make sure proxy function has CORS headers set
- Ensure you're calling the proxy URL, not Pardot directly

## References

- Pardot Form Handlers: https://help.salesforce.com/s/articleView?id=sf.pardot_form_handlers.htm
- Firebase Cloud Functions: https://firebase.google.com/docs/functions
