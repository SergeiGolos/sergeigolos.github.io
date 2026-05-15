declare module "@builder.io/partytown/integration" {
  export interface PartytownConfig {
    [key: string]: unknown;
  }

  export function partytownSnippet(config?: PartytownConfig): string;
}
