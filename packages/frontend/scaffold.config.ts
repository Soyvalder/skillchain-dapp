// packages/frontend/scaffold.config.ts
import { Chain } from 'viem'

export interface ScaffoldConfig {
    targetNetworks: Chain[];
    pollingInterval: number;
}

const scaffoldConfig: ScaffoldConfig = {
    targetNetworks: [
        // Add your networks here
    ],
    pollingInterval: 1000,
};

export default scaffoldConfig;