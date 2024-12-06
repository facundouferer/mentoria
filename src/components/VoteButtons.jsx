'use client';
import { useState } from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral';

export default function VoteButtons({ entryId, initialVote = null }) {
  const [currentVote, setCurrentVote] = useState(initialVote);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleVote = async (vote) => {
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      const response = await fetch('/api/vote', {   // Hay que hacer todavía los endpoints cuando esté accesible la base de datos
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          entryId,
          vote,
        }),
      });

      if (!response.ok) {
        throw new Error('Fallo al mandar el voto');
      }

      setCurrentVote(currentVote === vote ? null : vote);
    } catch (error) {
      console.error('Error al votar:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
      <Tooltip title="No me gustó">
        <IconButton
          onClick={() => handleVote('dislike')}
          color={currentVote === 'dislike' ? 'error' : 'default'}
          disabled={isSubmitting}
        >
          <SentimentDissatisfiedIcon fontSize='large' />
        </IconButton>
      </Tooltip>

      <Tooltip title="Neutral">
        <IconButton
          onClick={() => handleVote('meh')}
          color={currentVote === 'meh' ? 'primary' : 'default'}
          disabled={isSubmitting}
        >
          <SentimentNeutralIcon fontSize='large' />
        </IconButton>
      </Tooltip>

      <Tooltip title="Me gustó">
        <IconButton
          onClick={() => handleVote('like')}
          color={currentVote === 'like' ? 'success' : 'default'}
          disabled={isSubmitting}
        >
          <SentimentSatisfiedAltIcon fontSize='large' />
        </IconButton>
      </Tooltip>
    </Box>
  );
}