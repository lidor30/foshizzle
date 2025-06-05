import React from 'react'

interface ColorBallProps {
  color: string
  size?: 'small' | 'medium' | 'large'
}

const ColorBall: React.FC<ColorBallProps> = ({ color, size = 'medium' }) => {
  // Define sizes
  const sizes = {
    small: 'w-16 h-16',
    medium: 'w-24 h-24 md:w-32 md:h-32',
    large: 'w-32 h-32 md:w-40 md:h-40'
  }

  // Calculate a darker shade for the bottom of the ball to create 3D effect
  const darkenColor = (color: string, amount: number): string => {
    // For white, use a light gray
    if (color.toLowerCase() === '#ffffff') {
      return `rgba(200, 200, 200, ${amount})`
    }

    // For other colors, use a semi-transparent black overlay
    return `${color}${Math.round(amount * 255)
      .toString(16)
      .padStart(2, '0')}`
  }

  return (
    <div
      className={`${sizes[size]} rounded-full relative overflow-hidden mx-auto transition-transform hover:scale-105`}
      style={{
        backgroundColor: color,
        boxShadow: '4px 6px 10px rgba(0, 0, 0, 0.3)',
        border: color.toLowerCase() === '#ffffff' ? '1px solid #CCCCCC' : 'none'
      }}
    >
      {/* Light reflection effect on top-left */}
      <div
        className="absolute left-[10%] top-[10%] w-[30%] h-[30%] rounded-full opacity-50 transform -rotate-45"
        style={{
          background:
            'radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 70%)'
        }}
      />

      {/* Bottom shadow for 3D effect */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[40%] rounded-b-full"
        style={{
          background: `linear-gradient(to bottom, transparent, ${darkenColor(color, 0.3)})`
        }}
      />
    </div>
  )
}

export default ColorBall
