import { useState, useEffect, useRef } from 'react';

const useInView = () => {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // ビューポートに入ったら一度だけ true に設定
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect(); // 一度 in view 状態になったら監視を停止
        }
      },
      {
        threshold: 0.1, // 10% 表示された時にトリガー
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return { ref, isInView };
};

export default useInView;
