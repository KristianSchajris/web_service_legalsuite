import { Lawsuit, LawsuitProps, LawsuitCaseType, LawsuitStatus } from '../../../../src/domain/entities/Lawsuit';

describe('Lawsuit Entity', () => {
  const validLawsuitProps: LawsuitProps = {
    id: '789',
    caseNumber: 'CASE-2024-001',
    plaintiff: 'Juan Pérez',
    defendant: 'María García',
    caseType: LawsuitCaseType.CIVIL,
    status: LawsuitStatus.PENDING,
    lawyerId: null
  };

  describe('Constructor', () => {
    it('should create a valid lawsuit with all properties', () => {
      const lawsuit = new Lawsuit(validLawsuitProps);

      expect(lawsuit.id).toBe('789');
      expect(lawsuit.caseNumber).toBe('CASE-2024-001');
      expect(lawsuit.plaintiff).toBe('Juan Pérez');
      expect(lawsuit.defendant).toBe('María García');
      expect(lawsuit.caseType).toBe(LawsuitCaseType.CIVIL);
      expect(lawsuit.status).toBe(LawsuitStatus.PENDING);
      expect(lawsuit.lawyerId).toBeNull();
      expect(lawsuit.createdAt).toBeInstanceOf(Date);
      expect(lawsuit.updatedAt).toBeInstanceOf(Date);
    });

    it('should create a lawsuit without id', () => {
      const propsWithoutId = { ...validLawsuitProps };
      delete propsWithoutId.id;
      
      const lawsuit = new Lawsuit(propsWithoutId);

      expect(lawsuit.id).toBeUndefined();
      expect(lawsuit.caseNumber).toBe('CASE-2024-001');
    });

    it('should set default dates when not provided', () => {
      const lawsuit = new Lawsuit(validLawsuitProps);
      const now = new Date();

      expect(lawsuit.createdAt.getTime()).toBeLessThanOrEqual(now.getTime());
      expect(lawsuit.updatedAt.getTime()).toBeLessThanOrEqual(now.getTime());
    });

    it('should use provided dates when given', () => {
      const customDate = new Date('2023-01-01');
      const propsWithDates = {
        ...validLawsuitProps,
        createdAt: customDate,
        updatedAt: customDate
      };

      const lawsuit = new Lawsuit(propsWithDates);

      expect(lawsuit.createdAt).toEqual(customDate);
      expect(lawsuit.updatedAt).toEqual(customDate);
    });

    it('should handle lawyerId as string', () => {
      const propsWithLawyer = {
        ...validLawsuitProps,
        lawyerId: 'lawyer-123'
      };

      const lawsuit = new Lawsuit(propsWithLawyer);

      expect(lawsuit.lawyerId).toBe('lawyer-123');
    });
  });

  describe('Setters', () => {
    let lawsuit: Lawsuit;

    beforeEach(() => {
      lawsuit = new Lawsuit(validLawsuitProps);
    });

    it('should update caseNumber and updatedAt', () => {
      const originalUpdatedAt = lawsuit.updatedAt;
      
      setTimeout(() => {
        lawsuit.caseNumber = 'CASE-2024-002';
        
        expect(lawsuit.caseNumber).toBe('CASE-2024-002');
        expect(lawsuit.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
      }, 1);
    });

    it('should update plaintiff and updatedAt', () => {
      const originalUpdatedAt = lawsuit.updatedAt;
      
      setTimeout(() => {
        lawsuit.plaintiff = 'Carlos López';
        
        expect(lawsuit.plaintiff).toBe('Carlos López');
        expect(lawsuit.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
      }, 1);
    });

    it('should update defendant and updatedAt', () => {
      const originalUpdatedAt = lawsuit.updatedAt;
      
      setTimeout(() => {
        lawsuit.defendant = 'Ana Rodríguez';
        
        expect(lawsuit.defendant).toBe('Ana Rodríguez');
        expect(lawsuit.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
      }, 1);
    });

    it('should update caseType and updatedAt', () => {
      const originalUpdatedAt = lawsuit.updatedAt;
      
      setTimeout(() => {
        lawsuit.caseType = LawsuitCaseType.CRIMINAL;
        
        expect(lawsuit.caseType).toBe(LawsuitCaseType.CRIMINAL);
        expect(lawsuit.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
      }, 1);
    });

    it('should update status and updatedAt', () => {
      const originalUpdatedAt = lawsuit.updatedAt;
      
      setTimeout(() => {
        lawsuit.status = LawsuitStatus.ASSIGNED;
        
        expect(lawsuit.status).toBe(LawsuitStatus.ASSIGNED);
        expect(lawsuit.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
      }, 1);
    });
  });

  describe('Business Methods', () => {
    let lawsuit: Lawsuit;

    beforeEach(() => {
      lawsuit = new Lawsuit(validLawsuitProps);
    });

    describe('assignLawyer', () => {
      it('should assign lawyer and change status to ASSIGNED', () => {
        const originalUpdatedAt = lawsuit.updatedAt;
        
        setTimeout(() => {
          lawsuit.assignLawyer('lawyer-456');
          
          expect(lawsuit.lawyerId).toBe('lawyer-456');
          expect(lawsuit.status).toBe(LawsuitStatus.ASSIGNED);
          expect(lawsuit.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
        }, 1);
      });
    });

    describe('resolve', () => {
      it('should change status to RESOLVED', () => {
        const originalUpdatedAt = lawsuit.updatedAt;
        
        setTimeout(() => {
          lawsuit.resolve();
          
          expect(lawsuit.status).toBe(LawsuitStatus.RESOLVED);
          expect(lawsuit.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
        }, 1);
      });
    });

    describe('Status Check Methods', () => {
      it('should return true when lawsuit is assigned', () => {
        lawsuit.status = LawsuitStatus.ASSIGNED;
        
        expect(lawsuit.isAssigned()).toBe(true);
        expect(lawsuit.isPending()).toBe(false);
        expect(lawsuit.isResolved()).toBe(false);
      });

      it('should return true when lawsuit is pending', () => {
        lawsuit.status = LawsuitStatus.PENDING;
        
        expect(lawsuit.isPending()).toBe(true);
        expect(lawsuit.isAssigned()).toBe(false);
        expect(lawsuit.isResolved()).toBe(false);
      });

      it('should return true when lawsuit is resolved', () => {
        lawsuit.status = LawsuitStatus.RESOLVED;
        
        expect(lawsuit.isResolved()).toBe(true);
        expect(lawsuit.isPending()).toBe(false);
        expect(lawsuit.isAssigned()).toBe(false);
      });
    });
  });

  describe('toJSON', () => {
    it('should return plain object with all properties', () => {
      const lawsuit = new Lawsuit(validLawsuitProps);
      const json = lawsuit.toJSON();

      expect(json).toEqual({
        id: '789',
        caseNumber: 'CASE-2024-001',
        plaintiff: 'Juan Pérez',
        defendant: 'María García',
        caseType: LawsuitCaseType.CIVIL,
        status: LawsuitStatus.PENDING,
        lawyerId: null,
        createdAt: lawsuit.createdAt,
        updatedAt: lawsuit.updatedAt
      });
    });

    it('should return object without id when not provided', () => {
      const propsWithoutId = { ...validLawsuitProps };
      delete propsWithoutId.id;
      
      const lawsuit = new Lawsuit(propsWithoutId);
      const json = lawsuit.toJSON();

      expect(json.id).toBeUndefined();
      expect(json.caseNumber).toBe('CASE-2024-001');
    });
  });

  describe('Enums', () => {
    it('should have correct LawsuitCaseType enum values', () => {
      expect(LawsuitCaseType.CIVIL).toBe('civil');
      expect(LawsuitCaseType.CRIMINAL).toBe('criminal');
      expect(LawsuitCaseType.LABOR).toBe('labor');
      expect(LawsuitCaseType.COMMERCIAL).toBe('commercial');
    });

    it('should have correct LawsuitStatus enum values', () => {
      expect(LawsuitStatus.PENDING).toBe('pending');
      expect(LawsuitStatus.ASSIGNED).toBe('assigned');
      expect(LawsuitStatus.RESOLVED).toBe('resolved');
    });
  });
});