import React from 'react'
import { useContent } from '../hooks/useContent'
import LoadingSpinner from '../components/ui/LoadingSpinner'

const HomePage = () => {
  const { content, loading, error } = useContent('pages', 'home')

  if (loading) return <LoadingSpinner />
  if (error) return <div className="text-red-600">Error loading content: {error}</div>
  if (!content) return <div>No content found</div>

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="text-center space-y-8 px-4 max-w-4xl mx-auto">
        <div className="space-y-4">
          {content.heroLines && content.heroLines.map((line, index) => (
            <h1 
              key={index}
              className="text-6xl md:text-8xl font-light tracking-tight text-slate-900 dark:text-slate-100"
              style={{ 
                animationDelay: `${index * 0.2}s`,
                animation: 'fadeInUp 1s ease-out forwards',
                opacity: 0
              }}
            >
              {line}
            </h1>
          ))}
        </div>
        
        <p 
          className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed"
          style={{ 
            animationDelay: `${(content.heroLines?.length || 0) * 0.2 + 0.3}s`,
            animation: 'fadeInUp 1s ease-out forwards',
            opacity: 0
          }}
        >
          {content.subtitle}
        </p>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  )
}

export default HomePage