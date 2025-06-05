import React from 'react'
import ColorBall from './ColorBall'

// Define the props that can be passed to the HTML content
interface HtmlContentProps {
  type: string
  props: Record<string, any>
}

const HtmlContent: React.FC<{ content: HtmlContentProps }> = ({ content }) => {
  // Handle different component types
  switch (content.type) {
    case 'ColorBall':
      if (typeof content.props.color === 'string') {
        return (
          <ColorBall color={content.props.color} size={content.props.size} />
        )
      }
      return <div>Invalid ColorBall props</div>
    default:
      return <div>Unsupported component type: {content.type}</div>
  }
}

export default HtmlContent
