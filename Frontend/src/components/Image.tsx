import { useState, useRef, useEffect } from "react";
import { Image, ImageProps } from "@chakra-ui/react";
type LazyLoadImageProps = ImageProps & {
  src: string;
  alt?: string;
};

export const LazyLoadImage: React.FC<LazyLoadImageProps> = ({ src, alt, ...props }) => {
  const [isVisible, setIsVisible] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1, // Ketika 10% gambar terlihat
        rootMargin: "200px 0px", // Memicu lebih awal saat gambar dekat dengan viewport
      }
    );

    if (imageRef.current) {
      observer.observe(imageRef.current);
    }

    return () => {
      if (imageRef.current) {
        observer.disconnect();
      }
    };
  }, []);

  return <div ref={imageRef}>{isVisible && <Image src={src} alt={alt} {...props} />}</div>;
};
