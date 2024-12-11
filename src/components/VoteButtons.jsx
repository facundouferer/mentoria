'use client';

import { useState } from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral';
import { showCaptchaPopup } from './CaptchaPopup';

export default function VoteButtons({ entryId, initialVote = null }) {
  const [currentVote, setCurrentVote] = useState(initialVote);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captchaCompleted, setCaptchaCompleted] = useState(
    typeof window !== 'undefined' && localStorage.getItem('captchaCompleted') === 'true'
  );

  const handleVote = async (vote) => {
    if (isSubmitting) return;

    if (!captchaCompleted) {
       const success = await showCaptchaPopup(); // Llamar al componente Captcha
      if (!success) {
        console.error('CAPTCHA Failed');
        return;
      }

      localStorage.setItem('captchaCompleted', 'true');
      setCaptchaCompleted(true);
    }
   const voteMap = {
    like: 2,
    dislike: -1,
    meh: 1,
  };

  const parsedVote = voteMap[vote];

    try {
      setIsSubmitting(true);
      const response = await fetch('/api/vote', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          entryId,
          parsedVote,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit vote');
      }

      setCurrentVote(currentVote === vote ? null : vote);
    } catch (error) {
      console.error('Error voting:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
      <Tooltip title="No me gustó">
        <IconButton
          onClick={() => handleVote("dislike")}
          color={currentVote === 'dislike' ? 'error' : 'default'}
          disabled={isSubmitting}
        >
          <SentimentDissatisfiedIcon fontSize="large" />
        </IconButton>
      </Tooltip>

      <Tooltip title="Neutral">
        <IconButton
          onClick={() => handleVote("meh")}
          color={currentVote === 'meh' ? 'primary' : 'default'}
          disabled={isSubmitting}
        >
          <SentimentNeutralIcon fontSize="large" />
        </IconButton>
      </Tooltip>

      <Tooltip title="Me gustó">
        <IconButton
          onClick={() => handleVote("like")}
          color={currentVote === 'like' ? 'success' : 'default'}
          disabled={isSubmitting}
        >
          <SentimentSatisfiedAltIcon fontSize="large" />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
