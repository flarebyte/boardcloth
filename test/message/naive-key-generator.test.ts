import {
  NaiveTemplateKeyVarGenerator,
  NaiveTemplateKeyVarValidator,
} from '../../src/message/naive-key-generator';

describe('naive-key-generator', () => {
  const generator = new NaiveTemplateKeyVarGenerator();
  const validator = new NaiveTemplateKeyVarValidator();
  const authorId = generator.generate('author');
  const contributorId = generator.generate('contributor');
  it('should validate an id for the right domain', () => {
    expect(validator.isValid('author', authorId)).toBeTruthy();
    expect(validator.isValid('contributor', contributorId)).toBeTruthy();
  });
  it('should reject an id for the wrong domain', () => {
    expect(validator.isValid('contributor', authorId)).toBeFalsy();
    expect(validator.isValid('author', contributorId)).toBeFalsy();
  });
});
