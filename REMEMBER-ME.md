# Remember Me Feature - NutriSihat

## Gambaran Keseluruhan

Feature "Ingat Saya" membolehkan pengguna kekal logged in walaupun selepas menutup browser, sama seperti aplikasi Grab.

## Cara Ia Berfungsi

### 1. Login dengan "Ingat Saya"
- User login dan check checkbox "Ingat saya (tidak perlu login semula)"
- Sistem simpan preference dalam `localStorage`
- Session cookie di-extend selama **30 hari**

### 2. Auto-Login
- Bila user buka semula app, sistem check localStorage
- Jika ada persistent session, user automatik logged in
- Token di-refresh secara automatik sebelum expiry

### 3. Logout
- Bila user logout, semua persistent session flags di-clear
- Cookies dihapuskan
- User perlu login semula

## Technical Implementation

### Files Modified

| File | Purpose |
|------|---------|
| `src/app/auth/login/page.tsx` | Login page dengan checkbox "Ingat Saya" |
| `src/lib/auth/constants.ts` | Storage keys dan session configuration |
| `src/lib/auth/utils.ts` | Helper functions untuk manage remember me |
| `src/lib/auth/index.ts` | Export auth utilities |
| `src/lib/supabase/auth.ts` | Clear persistent session pada logout |
| `src/lib/supabase/server.ts` | Extend cookie maxAge untuk persistent sessions |
| `src/lib/supabase/middleware.ts` | Handle cookies di middleware |
| `src/app/auth/logout/route.ts` | Clear cookies pada logout |
| `tests/e2e/remember-me.spec.ts` | E2E tests untuk remember me feature |

### LocalStorage Keys

```typescript
{
  REMEMBER_ME: 'nutrisihat_remember_me',        // User preference
  PERSISTENT_SESSION: 'nutrisihat_persistent_session'  // Active session flag
}
```

### Session Configuration

```typescript
{
  STANDARD_MAX_AGE: 60 * 60 * 24,     // 24 hours (tanpa remember me)
  PERSISTENT_MAX_AGE: 60 * 60 * 24 * 30  // 30 days (dengan remember me)
}
```

## Usage

### Enable Remember Me
```typescript
import { enableRememberMe } from '@/lib/auth/utils'

// Call after successful login
enableRememberMe()
```

### Check Remember Me Status
```typescript
import { isRememberMeEnabled } from '@/lib/auth/utils'

if (isRememberMeEnabled()) {
  // User has remember me enabled
}
```

### Disable Remember Me
```typescript
import { disableRememberMe } from '@/lib/auth/utils'

// Call on logout
disableRememberMe()
```

## Testing

### Run E2E Tests
```bash
npm run test:e2e
```

### Manual Testing
1. Buka browser dan pergi ke `/auth/login`
2. Login dengan credentials yang sah
3. Check "Ingat saya (tidak perlu login semula)"
4. Klik "Log Masuk"
5. Tutup browser
6. Buka semula browser dan pergi ke app
7. Anda sepatutnya masih logged in

### Clear Remember Me
```javascript
// Dalam browser console
localStorage.removeItem('nutrisihat_remember_me')
localStorage.removeItem('nutrisihat_persistent_session')
```

## Security Considerations

### When NOT to use Remember Me
- Shared/public computers
- Internet cafes
- Computers di library
- Devices yang bukan milik sendiri

### Best Practices
- Gunakan HTTPS dalam production (cookies secure flag)
- Token rotation enabled (auto refresh sebelum expiry)
- Clear semua sessions pada logout
- SameSite cookie policy untuk prevent CSRF

## Troubleshooting

### User still asked to login after enabling remember me
- Check localStorage ada value `'true'` untuk `nutrisihat_remember_me`
- Verify cookies tidak di-block oleh browser
- Ensure HTTPS digunakan dalam production

### Session expired sebelum 30 hari
- Supabase tokens ada maximum lifetime (default 1 year)
- Refresh tokens boleh expire jika tidak digunakan untuk tempoh lama
- User manually logout akan clear session

### Cookies not persisting
- Check browser settings (some browsers block third-party cookies)
- Verify site is served over HTTPS in production
- Check cookie domain/path configuration

## Future Improvements

- [ ] Add session management UI (lihat active sessions, revoke access)
- [ ] Add email notification untuk new login
- [ ] Add device fingerprinting untuk security
- [ ] Add option untuk set custom session duration
- [ ] Add "Trust this device for 7 days" option
