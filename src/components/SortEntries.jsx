"use client";

import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

export default function SortEntries({ onSortChange }) {
  return (
    <FormControl sx={{ minWidth: 130, ml: 2 }}>
      <InputLabel>Ordenar por</InputLabel>
      <Select
        defaultValue=""
        label="Ordenar por"
        onChange={(e) => onSortChange(e.target.value)}
      >
        <MenuItem value="">Más recientes</MenuItem>
        <MenuItem value="valoracion">Mejor valorados</MenuItem>
      </Select>
    </FormControl>
  );
}