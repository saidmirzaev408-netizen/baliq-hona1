import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,        // <-- barcha tarmoq interfeyslari (LAN IP ham)
    open: true,
    fs: {
      strict: false,
      allow: ['..', 'C:/Users/user']
    }
  }
})
