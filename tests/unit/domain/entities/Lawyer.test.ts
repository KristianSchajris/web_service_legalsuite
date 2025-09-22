import { Lawyer, LawyerProps, LawyerStatus } from '../../../../src/domain/entities/Lawyer';

describe('Lawyer Entity', () => {
  const validLawyerProps: LawyerProps = {
    id: '123',
    name: 'Juan Pérez',
    email: 'juan.perez@example.com',
    phone: '555-1234',
    specialization: 'Civil',
    status: LawyerStatus.ACTIVE
  };

  describe('Constructor', () => {
    it('should create a valid lawyer with all properties', () => {
      const lawyer = new Lawyer(validLawyerProps);

      expect(lawyer.id).toBe('123');
      expect(lawyer.name).toBe('Juan Pérez');
      expect(lawyer.email).toBe('juan.perez@example.com');
      expect(lawyer.phone).toBe('555-1234');
      expect(lawyer.specialization).toBe('Civil');
      expect(lawyer.status).toBe(LawyerStatus.ACTIVE);
      expect(lawyer.createdAt).toBeInstanceOf(Date);
      expect(lawyer.updatedAt).toBeInstanceOf(Date);
    });

    it('should create a lawyer without id', () => {
      const propsWithoutId = { ...validLawyerProps };
      delete propsWithoutId.id;
      
      const lawyer = new Lawyer(propsWithoutId);

      expect(lawyer.id).toBeUndefined();
      expect(lawyer.name).toBe('Juan Pérez');
    });

    it('should set default dates when not provided', () => {
      const lawyer = new Lawyer(validLawyerProps);
      const now = new Date();

      expect(lawyer.createdAt.getTime()).toBeLessThanOrEqual(now.getTime());
      expect(lawyer.updatedAt.getTime()).toBeLessThanOrEqual(now.getTime());
    });

    it('should use provided dates when given', () => {
      const customDate = new Date('2023-01-01');
      const propsWithDates = {
        ...validLawyerProps,
        createdAt: customDate,
        updatedAt: customDate
      };

      const lawyer = new Lawyer(propsWithDates);

      expect(lawyer.createdAt).toEqual(customDate);
      expect(lawyer.updatedAt).toEqual(customDate);
    });
  });

  describe('Setters', () => {
    let lawyer: Lawyer;

    beforeEach(() => {
      lawyer = new Lawyer(validLawyerProps);
    });

    it('should update name and updatedAt', () => {
      const originalUpdatedAt = lawyer.updatedAt;
      
      // Esperar un poco para asegurar diferencia en timestamp
      setTimeout(() => {
        lawyer.name = 'María García';
        
        expect(lawyer.name).toBe('María García');
        expect(lawyer.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
      }, 1);
    });

    it('should update email and updatedAt', () => {
      const originalUpdatedAt = lawyer.updatedAt;
      
      setTimeout(() => {
        lawyer.email = 'maria.garcia@example.com';
        
        expect(lawyer.email).toBe('maria.garcia@example.com');
        expect(lawyer.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
      }, 1);
    });

    it('should update phone and updatedAt', () => {
      const originalUpdatedAt = lawyer.updatedAt;
      
      setTimeout(() => {
        lawyer.phone = '555-5678';
        
        expect(lawyer.phone).toBe('555-5678');
        expect(lawyer.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
      }, 1);
    });

    it('should update specialization and updatedAt', () => {
      const originalUpdatedAt = lawyer.updatedAt;
      
      setTimeout(() => {
        lawyer.specialization = 'Criminal';
        
        expect(lawyer.specialization).toBe('Criminal');
        expect(lawyer.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
      }, 1);
    });

    it('should update status and updatedAt', () => {
      const originalUpdatedAt = lawyer.updatedAt;
      
      setTimeout(() => {
        lawyer.status = LawyerStatus.INACTIVE;
        
        expect(lawyer.status).toBe(LawyerStatus.INACTIVE);
        expect(lawyer.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
      }, 1);
    });
  });

  describe('Business Methods', () => {
    let lawyer: Lawyer;

    beforeEach(() => {
      lawyer = new Lawyer(validLawyerProps);
    });

    it('should activate lawyer', () => {
      lawyer.status = LawyerStatus.INACTIVE;
      const originalUpdatedAt = lawyer.updatedAt;
      
      setTimeout(() => {
        lawyer.activate();
        
        expect(lawyer.status).toBe(LawyerStatus.ACTIVE);
        expect(lawyer.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
      }, 1);
    });

    it('should deactivate lawyer', () => {
      const originalUpdatedAt = lawyer.updatedAt;
      
      setTimeout(() => {
        lawyer.deactivate();
        
        expect(lawyer.status).toBe(LawyerStatus.INACTIVE);
        expect(lawyer.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
      }, 1);
    });

    it('should return true when lawyer is active', () => {
      lawyer.status = LawyerStatus.ACTIVE;
      
      expect(lawyer.isActive()).toBe(true);
    });

    it('should return false when lawyer is inactive', () => {
      lawyer.status = LawyerStatus.INACTIVE;
      
      expect(lawyer.isActive()).toBe(false);
    });
  });

  describe('toJSON', () => {
    it('should return plain object with all properties', () => {
      const lawyer = new Lawyer(validLawyerProps);
      const json = lawyer.toJSON();

      expect(json).toEqual({
        id: '123',
        name: 'Juan Pérez',
        email: 'juan.perez@example.com',
        phone: '555-1234',
        specialization: 'Civil',
        status: LawyerStatus.ACTIVE,
        createdAt: lawyer.createdAt,
        updatedAt: lawyer.updatedAt
      });
    });

    it('should return object without id when not provided', () => {
      const propsWithoutId = { ...validLawyerProps };
      delete propsWithoutId.id;
      
      const lawyer = new Lawyer(propsWithoutId);
      const json = lawyer.toJSON();

      expect(json.id).toBeUndefined();
      expect(json.name).toBe('Juan Pérez');
    });
  });
});