import { toUpperCase, capitalize, formatDate } from '../../utils/stringUtils';

// 📚 LECCIÓN: Estructura de un test
describe('stringUtils', () => {
  // 🎯 describe() agrupa tests relacionados
  
  describe('toUpperCase', () => {
    // 🧪 it() o test() define un test individual
    it('should convert string to uppercase', () => {
      // Arrange - Preparar los datos
      const input = 'hello world';
      const expected = 'HELLO WORLD';
      
      // Act - Ejecutar la función
      const result = toUpperCase(input);
      
      // Assert - Verificar el resultado
      expect(result).toBe(expected);
    });
    
    it('should handle empty string', () => {
      // Arrange
      const input = '';
      const expected = '';
      
      // Act
      const result = toUpperCase(input);
      
      // Assert
      expect(result).toBe(expected);
    });
    
    it('should handle string with numbers', () => {
      // Arrange
      const input = 'hello123';
      const expected = 'HELLO123';
      
      // Act
      const result = toUpperCase(input);
      
      // Assert
      expect(result).toBe(expected);
    });
  });
  
  describe('capitalize', () => {
    it('should capitalize first letter', () => {
      // Arrange
      const input = 'hello';
      const expected = 'Hello';
      
      // Act
      const result = capitalize(input);
      
      // Assert
      expect(result).toBe(expected);
    });
    
    it('should handle already capitalized string', () => {
      // Arrange
      const input = 'HELLO';
      const expected = 'Hello';
      
      // Act
      const result = capitalize(input);
      
      // Assert
      expect(result).toBe(expected);
    });
    
    it('should handle empty string', () => {
      // Arrange
      const input = '';
      const expected = '';
      
      // Act
      const result = capitalize(input);
      
      // Assert
      expect(result).toBe(expected);
    });
  });
  
  describe('formatDate', () => {
    it('should format date correctly', () => {
      // Arrange - Usar fecha específica para evitar problemas de zona horaria
      const date = new Date(2024, 0, 15); // 15 de enero de 2024
      const expected = '15 de enero de 2024';
      
      // Act
      const result = formatDate(date);
      
      // Assert
      expect(result).toBe(expected);
    });
  });
});
