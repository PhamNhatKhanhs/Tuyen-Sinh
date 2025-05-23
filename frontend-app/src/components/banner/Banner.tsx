import React, { useState } from 'react';
import { Carousel, Button, Typography, Progress } from 'antd';
import { ArrowRight, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import './Banner.css';

const { Title, Paragraph } = Typography;

export interface BannerItemProps {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  imageUrl: string;
  gradientColors: string;
}

interface BannerProps {
  items: BannerItemProps[];
}

const Banner: React.FC<BannerProps> = ({ items }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  
  // Xử lý khi slide thay đổi
  const handleSlideChange = (current: number) => {
    setCurrentSlide(current);
    setProgress(0);
  };
  
  // Xử lý animation progress bar
  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!isHovered) {
      timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer);
            return 0;
          }
          return prev + 0.5;
        });
      }, 25);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [currentSlide, isHovered]);
  
  // Tham chiếu đến carousel
  const carouselRef = React.useRef<any>(null);
  
  // Xử lý next/prev slide
  const handlePrev = () => {
    if (carouselRef.current) {
      carouselRef.current.prev();
    }
  };
  
  const handleNext = () => {
    if (carouselRef.current) {
      carouselRef.current.next();
    }
  };
  
  return (
    <div 
      className="banner-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Custom navigation buttons */}
      <div className="banner-navigation">
        <button className="banner-nav-button banner-prev" onClick={handlePrev}>
          <ChevronLeft size={24} />
        </button>
        <button className="banner-nav-button banner-next" onClick={handleNext}>
          <ChevronRight size={24} />
        </button>
      </div>
      
      {/* Progress indicator */}
      <div className="banner-progress-container">
        <Progress 
          percent={progress} 
          showInfo={false} 
          strokeColor={{
            '0%': '#4F46E5',
            '100%': '#06B6D4'
          }}
          trailColor="rgba(255,255,255,0.3)"
          className="banner-progress"
        />
      </div>
      
      <Carousel
        autoplay={!isHovered}
        effect="fade"
        dots={{ className: 'custom-dots' }}
        autoplaySpeed={5000}
        className="banner-carousel"
        ref={carouselRef}
        afterChange={handleSlideChange}
      >
        {items.map((item) => (
          <div key={item.id}>
            <div 
              className="banner-slide" 
              style={{ 
                backgroundImage: `linear-gradient(to right, ${item.gradientColors}), url(${item.imageUrl})` 
              }}
            >
              {/* Decorative elements */}
              <div className="banner-decorative-circle banner-circle-1"></div>
              <div className="banner-decorative-circle banner-circle-2"></div>
              <div className="banner-decorative-circle banner-circle-3"></div>
              
              <div className="banner-content">
                <div className="banner-text-container">
                  <div className="banner-badge">
                    <Star size={14} className="banner-badge-icon" />
                    {item.subtitle}
                  </div>
                  <Title level={1} className="banner-title">{item.title}</Title>
                  <Paragraph className="banner-description">
                    {item.description}
                  </Paragraph>
                  <div className="banner-buttons">
                    <Button 
                      type="primary" 
                      size="large"
                      href={item.buttonLink}
                      className="banner-button banner-button-primary"
                      icon={<ArrowRight className="ml-2" size={18} />}
                    >
                      {item.buttonText}
                    </Button>
                    <Button 
                      size="large"
                      href="/universities"
                      className="banner-button banner-button-secondary"
                    >
                      Xem tất cả trường
                    </Button>
                  </div>
                </div>
                
                {/* Slide indicator */}
                <div className="banner-slide-indicator">
                  <span className="current-slide">{String(currentSlide + 1).padStart(2, '0')}</span>
                  <span className="slide-separator">/</span>
                  <span className="total-slides">{String(items.length).padStart(2, '0')}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default Banner;
