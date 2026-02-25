import { describe, it, expect, beforeAll } from 'vitest';
import { hashPassword, comparePassword, authenticateUser, initializeAdminUser } from './auth';

describe('Authentication', () => {
  describe('hashPassword', () => {
    it('should hash a password', async () => {
      const password = 'testpassword123';
      const hash = await hashPassword(password);
      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(0);
    });

    it('should generate different hashes for the same password', async () => {
      const password = 'testpassword123';
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('comparePassword', () => {
    it('should return true for matching password and hash', async () => {
      const password = 'testpassword123';
      const hash = await hashPassword(password);
      const isMatch = await comparePassword(password, hash);
      expect(isMatch).toBe(true);
    });

    it('should return false for non-matching password and hash', async () => {
      const password = 'testpassword123';
      const hash = await hashPassword(password);
      const isMatch = await comparePassword('wrongpassword', hash);
      expect(isMatch).toBe(false);
    });
  });

  describe('Admin user initialization', () => {
    it('should initialize admin user with correct credentials', async () => {
      await initializeAdminUser();
      const user = await authenticateUser('claudineifrigo', 'paverbrasil2026');
      expect(user).toBeDefined();
      expect(user?.username).toBe('claudineifrigo');
      expect(user?.role).toBe('admin');
    });

    it('should fail authentication with wrong password', async () => {
      const user = await authenticateUser('claudineifrigo', 'wrongpassword');
      expect(user).toBeNull();
    });

    it('should fail authentication with wrong username', async () => {
      const user = await authenticateUser('wrongusername', 'paverbrasil2026');
      expect(user).toBeNull();
    });
  });
});
