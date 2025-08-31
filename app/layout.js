import { Inter } from 'next/font/google'
import '../styles/globals.css'
import { AuthProvider } from '../context/AuthContext'
import Layout from '../components/Layout'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: ' - Find Your Dream Job',
  description: 'Discover thousands of IT jobs from top companies',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Layout>
            {children}
          </Layout>
        </AuthProvider>
      </body>
    </html>
  )
}
