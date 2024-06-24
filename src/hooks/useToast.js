import { useCallback, useState, useEffect, useRef } from "react";

export const useToast = () => {
  const [toast, setToast] = useState({ show: false, message: "" });
  const timeoutRef = useRef(null);

  const showToast = useCallback((message, duration = 3000) => {
    // 이전 타임아웃을 취소
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setToast({ show: true, message });

    // 새로운 타임아웃 설정
    timeoutRef.current = setTimeout(() => {
      setToast({ show: false, message: "" });
    }, duration);
  }, []);

  // 컴포넌트가 언마운트될 때 타임아웃을 클리어
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { toast, showToast };
};
