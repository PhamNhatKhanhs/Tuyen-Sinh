import React from 'react';
import { Carousel, Button, Typography } from 'antd';
import { ArrowRight } from 'lucide-react';
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
  return (
    <div className="banner-container">
      <Carousel
        autoplay
        effect="fade"
        dots={{ className: 'custom-dots' }}
        autoplaySpeed={5000}
        className="banner-carousel"
      >
        {items.map((item) => (
          <div key={item.id}>
            <div 
              className="banner-slide" 
              style={{ 
                backgroundImage: `linear-gradient(to right, ${item.gradientColors}), url(${item.imageUrl})` 
              }}
            >
              <div className="banner-content">
                <div className="banner-text-container">
                  <div className="banner-badge">{item.subtitle}</div>
                  <Title level={1} className="banner-title">{item.title}</Title>
                  <Paragraph className="banner-description">
                    {item.description}
                  </Paragraph>
                  <Button 
                    type="primary" 
                    size="large"
                    href={item.buttonLink}
                    className="banner-button"
                    icon={<ArrowRight className="ml-2" size={18} />}
                  >
                    {item.buttonText}
                  </Button>
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
