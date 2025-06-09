import React from 'react';
import { Avatar, Card, Col } from 'antd';
import { ThumbsUp, MessageSquareText, HeartHandshake } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string; // Changed from ReactNode to string for URL
  comment: string;
  rating: number;
  icon?: React.ReactNode; // Optional: if you still want to use an icon sometimes
}

const testimonialsData: Testimonial[] = [
  {
    id: '1',
    name: 'Nguyễn Văn An',
    role: 'Thí sinh K27',
    avatar: 'https://i.pravatar.cc/150?u=nguyenvanan', // Placeholder avatar URL
    comment: "Hệ thống rất dễ sử dụng và giúp tôi tiết kiệm rất nhiều thời gian trong việc nộp hồ sơ. Giao diện thân thiện và quy trình rõ ràng.",
    rating: 5,
    icon: <ThumbsUp size={28} className="text-blue-500" />
  },
  {
    id: '2',
    name: 'Trần Thị Bình',
    role: 'Phụ huynh',
    avatar: 'https://i.pravatar.cc/150?u=tranthibinh', // Placeholder avatar URL
    comment: "Thông tin về các trường đại học rất đầy đủ và cập nhật. Tôi có thể so sánh và lựa chọn trường phù hợp một cách dễ dàng.",
    rating: 5,
    icon: <MessageSquareText size={28} className="text-green-500" />
  },
  {
    id: '3',
    name: 'Lê Minh Cường',
    role: 'Thí sinh K26',
    avatar: 'https://i.pravatar.cc/150?u=leminhcuong', // Placeholder avatar URL
    comment: "Dịch vụ hỗ trợ tuyệt vời! Nhân viên tư vấn nhiệt tình và giải đáp mọi thắc mắc một cách chi tiết và chuyên nghiệp.",
    rating: 5,
    icon: <HeartHandshake size={28} className="text-red-500" />
  },
];

const Testimonials: React.FC = () => {
  return (
    <div className="testimonials-section py-16">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">What Our Students Say</h2>
        </div>
        <div className="testimonials-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {testimonialsData.map((testimonial) => (
            <Col xs={24} sm={12} md={8} key={testimonial.id} className="mb-8">
              <Card className="testimonial-card h-full group">
                <div className="testimonial-card-header">
                  {testimonial.icon && <div className="testimonial-icon">{testimonial.icon}</div>}
                  <Avatar 
                    size={80} 
                    src={testimonial.avatar} // Use src for image URL
                    className="testimonial-avatar"
                  />
                </div>
                <div className="testimonial-card-body">
                  <h3 className="text-xl font-semibold">{testimonial.name}</h3>
                  <p className="text-gray-500">{testimonial.role}</p>
                  <p className="mt-4 text-gray-700">{testimonial.comment}</p>
                </div>
                <div className="testimonial-card-footer mt-4">
                  <div className="flex items-center">
                    <div className="flex gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 15l-5.878 3.09 1.121-6.535L.243 6.91l6.545-.954L10 .5l2.212 5.456 6.545.954-4.999 4.645 1.121 6.535z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;