import { describe, expect, it } from 'vitest'
import { validateNewPassword, validateSignup } from './authValidation'

describe('auth validation', () => {
  it('accepts a valid signup', () => {
    expect(validateSignup({ displayName: 'Alya', email: 'alya@example.com', password: 'quest1234', confirmation: 'quest1234' })).toBeNull()
  })
  it('rejects mismatched passwords', () => {
    expect(validateSignup({ displayName: 'Alya', email: 'alya@example.com', password: 'quest1234', confirmation: 'different' })).toContain('correspondent')
  })
  it('requires a sufficiently long new password', () => {
    expect(validateNewPassword('court', 'court')).toContain('8 caractères')
  })
})
