interface TemplateKeyVarBaseGenerator {
  generate(domain: string): string;
}

const letters = 'BCDFGHJKLMNPRSTUVXZbcdfghjklmnprstuvxz'.split('');
const keyVarFormat = '123456789012'.split('');
const randChar = () =>
  letters[Math.floor(Math.random() * letters.length)] || 'A';
const domainIdLength = keyVarFormat.length + 3;

const getDomainAbbreviation = (domain: string): string =>
  `${domain.charAt(0)}${domain.charAt(domain.length - 1)}`;

/**
 * A very naive TemplateKeyVarGenerator
 */
export class NaiveTemplateKeyVarGenerator
  implements TemplateKeyVarBaseGenerator
{
  generate(domain: string): string {
    const domainId = keyVarFormat.map(randChar);
    const fullId = [...domainId, '-', getDomainAbbreviation(domain)];
    return fullId.join('');
  }
}

/**
 * Validate id produced by TemplateKeyVarGenerator
 */
export class NaiveTemplateKeyVarValidator {
  isValid(domain: string, id: string): boolean {
    if (id.length !== domainIdLength) {
      return false;
    }
    const [domainId, abbreviation] = id.split('-');
    if (!domainId || !abbreviation) {
      return false;
    }
    const expectedAbbreviation = getDomainAbbreviation(domain);
    if (abbreviation !== expectedAbbreviation) {
      return false;
    }
    return true;
  }
}
