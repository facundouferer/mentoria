'use client';

import { Button } from "@mui/material";
import FlagIcon from "@mui/icons-material/Flag";
import { useState, useEffect } from "react";
import { showCaptchaPopup } from "./CaptchaPopup";

export default function ReportButton({ props }) {
  const { handleReport, post } = props;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReported, setIsReported] = useState(false);

  // Revisar si el post ya fue reportado
  useEffect(() => {
    const reportedPosts = JSON.parse(localStorage.getItem("reportedPosts")) || [];
    setIsReported(reportedPosts.includes(post.id));
  }, [post.id]);

  const handleClick = async () => {
    if (isSubmitting || isReported) return;

    // Deshabilita el botón 
    setIsSubmitting(true);

    const success = await showCaptchaPopup();
    if (!success) {
      console.error('CAPTCHA Failed');
      setIsSubmitting(false);  
      return;
    }

    try {
      

      // Marcar el post como reportado
      setIsReported(true);

      // Almacenar el estado
      const reportedPosts = JSON.parse(localStorage.getItem("reportedPosts")) || [];
      handleReport(post);
    } catch (error) {
      console.error('Error reportando el post:', error);
      reportedPosts.push(post.id);
      localStorage.setItem("reportedPosts", JSON.stringify(reportedPosts));

    } finally {
      setIsSubmitting(false); 
    }
  };

  return (
    <Button
      startIcon={<FlagIcon />}
      onClick={handleClick}
      disabled={isSubmitting || isReported}  // Deshabilitar el botón si ya se ha reportado o si se está enviando
      color="warning"
      variant="outlined"
    >
      Reportar
    </Button>
  );
}
