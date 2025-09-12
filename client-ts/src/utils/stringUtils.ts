/**
 * Convierte una cadena a mayúsculas
 * @param str - Cadena a convertir
 * @returns Cadena en mayúsculas
 */
export const toUpperCase = (str: string): string => {
  return str.toUpperCase();
};

/**
 * Capitaliza la primera letra de una cadena
 * @param str - Cadena a capitalizar
 * @returns Cadena con primera letra en mayúscula
 */
export const capitalize = (str: string): string => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Formatea una fecha para mostrar
 * @param date - Fecha a formatear
 * @returns Fecha formateada como string
 */
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
