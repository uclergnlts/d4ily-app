
import { getMarketData } from "../lib/services/market";

async function test() {
    console.log("Fetching market data...");
    const data = await getMarketData();
    console.log("Result:", JSON.stringify(data, null, 2));
}

test();
