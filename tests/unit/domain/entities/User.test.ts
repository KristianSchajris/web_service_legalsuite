import { User, UserProps, UserRole } from '../../../../src/domain/entities/User';

describe('User Entity', () => {
  const validUserProps: UserProps = {
    id: '456',
    username: 'admin',
    password: 'hashedPassword123',
    role: UserRole.ADMIN
  };

  describe('Constructor', () => {
    it('should create a valid user with all properties', () => {
      const user = new User(validUserProps);

      expect(user.id).toBe('456');
      expect(user.username).toBe('admin');
      expect(user.password).toBe('hashedPassword123');
      expect(user.role).toBe(UserRole.ADMIN);
      expect(user.createdAt).toBeInstanceOf(Date);
      expect(user.updatedAt).toBeInstanceOf(Date);
    });

    it('should create a user without id', () => {
      const propsWithoutId = { ...validUserProps };
      delete propsWithoutId.id;
      
      const user = new User(propsWithoutId);

      expect(user.id).toBeUndefined();
      expect(user.username).toBe('admin');
    });

    it('should set default dates when not provided', () => {
      const user = new User(validUserProps);
      const now = new Date();

      expect(user.createdAt.getTime()).toBeLessThanOrEqual(now.getTime());
      expect(user.updatedAt.getTime()).toBeLessThanOrEqual(now.getTime());
    });

    it('should use provided dates when given', () => {
      const customDate = new Date('2023-01-01');
      const propsWithDates = {
        ...validUserProps,
        createdAt: customDate,
        updatedAt: customDate
      };

      const user = new User(propsWithDates);

      expect(user.createdAt).toEqual(customDate);
      expect(user.updatedAt).toEqual(customDate);
    });
  });

  describe('Setters', () => {
    let user: User;

    beforeEach(() => {
      user = new User(validUserProps);
    });

    it('should update username and updatedAt', () => {
      const originalUpdatedAt = user.updatedAt;
      
      setTimeout(() => {
        user.username = 'newadmin';
        
        expect(user.username).toBe('newadmin');
        expect(user.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
      }, 1);
    });

    it('should update password and updatedAt', () => {
      const originalUpdatedAt = user.updatedAt;
      
      setTimeout(() => {
        user.password = 'newHashedPassword456';
        
        expect(user.password).toBe('newHashedPassword456');
        expect(user.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
      }, 1);
    });

    it('should update role and updatedAt', () => {
      const originalUpdatedAt = user.updatedAt;
      
      setTimeout(() => {
        user.role = UserRole.OPERATOR;
        
        expect(user.role).toBe(UserRole.OPERATOR);
        expect(user.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
      }, 1);
    });
  });

  describe('Business Methods', () => {
    it('should return true when user is admin', () => {
      const adminUser = new User({ ...validUserProps, role: UserRole.ADMIN });
      
      expect(adminUser.isAdmin()).toBe(true);
    });

    it('should return false when user is operator', () => {
      const operatorUser = new User({ ...validUserProps, role: UserRole.OPERATOR });
      
      expect(operatorUser.isAdmin()).toBe(false);
    });
  });

  describe('toJSON', () => {
    it('should return plain object without password', () => {
      const user = new User(validUserProps);
      const json = user.toJSON();

      expect(json).toEqual({
        id: '456',
        username: 'admin',
        role: UserRole.ADMIN,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      });
      
      // Verificar que no incluye la password
      expect(json).not.toHaveProperty('password');
    });

    it('should return object without id when not provided', () => {
      const propsWithoutId = { ...validUserProps };
      delete propsWithoutId.id;
      
      const user = new User(propsWithoutId);
      const json = user.toJSON();

      expect(json.id).toBeUndefined();
      expect(json.username).toBe('admin');
      expect(json).not.toHaveProperty('password');
    });
  });

  describe('UserRole Enum', () => {
    it('should have correct enum values', () => {
      expect(UserRole.ADMIN).toBe('admin');
      expect(UserRole.OPERATOR).toBe('operator');
    });
  });
});