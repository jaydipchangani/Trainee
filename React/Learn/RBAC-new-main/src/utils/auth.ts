import * as bcrypt from 'bcryptjs';
import * as jose from 'jose';
import { User, Permission, PermissionMatrix } from '../types/types';

// Secret key for JWT
const SECRET_KEY = new TextEncoder().encode('your-secret-key-should-be-at-least-32-chars');

// Hash password
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// Verify password
export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

// Generate JWT token
export const generateToken = async (user: User): Promise<string> => {
  const payload = {
    sub: user.id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const token = await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('2h')
    .sign(SECRET_KEY);

  return token;
};

// Verify JWT token
export const verifyToken = async (token: string): Promise<any> => {
  try {
    const { payload } = await jose.jwtVerify(token, SECRET_KEY);
    return payload;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

// Convert permissions array to a permission matrix for easier checking
export const createPermissionMatrix = (permissions: Permission[]): PermissionMatrix => {
  const matrix: PermissionMatrix = {};

  permissions.forEach((permission) => {
    matrix[permission.module] = {};
    permission.actions.forEach((action) => {
      matrix[permission.module][action] = true;
    });
  });

  return matrix;
};

// Check if user has permission
export const hasPermission = (
  permissionMatrix: PermissionMatrix,
  module: string,
  action: string
): boolean => {
  return Boolean(permissionMatrix[module]?.[action]);
};