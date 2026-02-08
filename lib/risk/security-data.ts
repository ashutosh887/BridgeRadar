export interface BridgeSecurity {
  key: string;
  name: string;
  audits: number;
  exploits: number;
  tvlUsd: number;
  ageMonths: number;
}

export const BRIDGE_SECURITY: Record<string, BridgeSecurity> = {
  stargate: {
    key: "stargate",
    name: "Stargate",
    audits: 3,
    exploits: 0,
    tvlUsd: 500_000_000,
    ageMonths: 36,
  },
  across: {
    key: "across",
    name: "Across",
    audits: 2,
    exploits: 0,
    tvlUsd: 200_000_000,
    ageMonths: 36,
  },
  hop: {
    key: "hop",
    name: "Hop",
    audits: 2,
    exploits: 0,
    tvlUsd: 100_000_000,
    ageMonths: 42,
  },
  connext: {
    key: "connext",
    name: "Connext",
    audits: 2,
    exploits: 0,
    tvlUsd: 80_000_000,
    ageMonths: 36,
  },
  celer: {
    key: "celer",
    name: "Celer",
    audits: 2,
    exploits: 1,
    tvlUsd: 150_000_000,
    ageMonths: 42,
  },
  squid: {
    key: "squid",
    name: "Squid",
    audits: 1,
    exploits: 0,
    tvlUsd: 50_000_000,
    ageMonths: 24,
  },
  lifi: {
    key: "lifi",
    name: "LI.FI",
    audits: 2,
    exploits: 0,
    tvlUsd: 0,
    ageMonths: 36,
  },
  circle: {
    key: "circle",
    name: "Circle CCTP",
    audits: 3,
    exploits: 0,
    tvlUsd: 1_000_000_000,
    ageMonths: 24,
  },
  orbiter: {
    key: "orbiter",
    name: "Orbiter",
    audits: 1,
    exploits: 0,
    tvlUsd: 30_000_000,
    ageMonths: 30,
  },
  hyphen: {
    key: "hyphen",
    name: "Hyphen",
    audits: 1,
    exploits: 0,
    tvlUsd: 20_000_000,
    ageMonths: 36,
  },
};

export const DEFAULT_BRIDGE: BridgeSecurity = {
  key: "unknown",
  name: "Unknown",
  audits: 0,
  exploits: 1,
  tvlUsd: 1_000_000,
  ageMonths: 6,
};
