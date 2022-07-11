import { InsuredClass } from 'src/app/features/insured/classes/insured-class';

describe('Service: Auth', () => {
  let insured: InsuredClass;

  beforeEach(() => {
    insured = new InsuredClass();
    insured.city = 'Newport';
    insured.zip = '41071';
    insured.country = 'USA';
    insured.isAddressOverride = true;

  });

  afterEach(() => {
    insured.validateAddress();

  });

  it('insured should be valid if there is a zip', () => {
    expect(insured.isValid).toBeTruthy();
  });

  it('insured should not be valid if there is not a zip', () => {
    insured.zip = null;
    expect(insured.isValid).toBeFalsy();
  });

});