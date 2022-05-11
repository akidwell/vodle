export interface Version {
    version: string;
    machineName: string;
}

export const newVersion = (): Version => ({
  version: '?.?.?.?',
  machineName: ''
});