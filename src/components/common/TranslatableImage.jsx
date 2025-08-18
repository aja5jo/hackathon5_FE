import React, { useState } from 'react';
import styled from 'styled-components';
import ImageTranslator from '../translation/ImageTranslator';

function TranslatableImage({ 
  src, 
  alt, 
  menuText = '', 
  showTranslateButton = true,
  className,
  ...props 
}) {
  const [showTranslator, setShowTranslator] = useState(false);

  const handleTranslateClick = (e) => {
    e.stopPropagation();
    setShowTranslator(true);
  };

  return (
    <>
      <ImageContainer className={className}>
        <StyledImage src={src} alt={alt} {...props} />
        {showTranslateButton && menuText && (
          <TranslateOverlay>
            <TranslateButton onClick={handleTranslateClick}>
              🌐 번역
            </TranslateButton>
          </TranslateOverlay>
        )}
      </ImageContainer>

      <ImageTranslator
        imageUrl={src}
        menuText={menuText}
        isVisible={showTranslator}
        onClose={() => setShowTranslator(false)}
      />
    </>
  );
}

export default TranslatableImage;

// ===== styled =====
const ImageContainer = styled.div`
  position: relative;
  display: inline-block;
  overflow: hidden;
  border-radius: 8px;

  &:hover {
    .translate-overlay {
      opacity: 1;
    }
  }
`;

const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;

  ${ImageContainer}:hover & {
    transform: scale(1.02);
  }
`;

const TranslateOverlay = styled.div.attrs({
  className: 'translate-overlay'
})`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
`;

const TranslateButton = styled.button`
  background: #FEE502;
  color: #262626;
  border: none;
  border-radius: 20px;
  padding: 0.8rem 1.5rem;
  font-size: 1.4rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);

  &:hover {
    background: #ffe95a;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
  }
`;