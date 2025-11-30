// --- Configuration ---
const COINS = [
    { symbol: "BTCUSDT", name: "BTC", icon: "fab fa-bitcoin", color: "#f7931a" },
    { symbol: "ETHUSDT", name: "ETH", icon: "fab fa-ethereum", color: "#627eea" },
    { symbol: "BNBUSDT", name: "BNB", icon: "fas fa-coins", color: "#f3ba2f" },
    { symbol: "USDTTRY", name: "USDT", icon: "fas fa-dollar-sign", color: "#16a085" },
    { symbol: "SOLUSDT", name: "SOL", icon: "fas fa-sun", color: "#00ffbd" },
    { symbol: "XRPUSDT", name: "XRP", icon: "fas fa-water", color: "#3466af" },
    { symbol: "ADAUSDT", name: "ADA", icon: "fas fa-cubes", color: "#0033cc" },
    { symbol: "DOGEUSDT", name: "DOGE", icon: "fab fa-dog", color: "#c2a63a" },
    { symbol: "MATICUSDT", name: "MATIC", icon: "fas fa-layer-group", color: "#8247e5" },
    { symbol: "DOTUSDT", name: "DOT", icon: "fas fa-circle-dot", color: "#e6007a" },
];

const TIMEFRAMES_FOR_AI = [
    { id: "5m", interval: "5" }, 
    { id: "15m", interval: "15" },
    { id: "1h", interval: "60" }, 
    { id: "4h", interval: "240" }
];

// **WEIGHTS for more reliable signals**
// 4H and 1H are given more influence on the final score.
const WEIGHTS = {
    "5m": 1.0, 
    "15m": 1.0,
    "1h": 1.5, 
    "4h": 2.0  
};
// Total maximum score possible: (1.0 + 1.0 + 1.5 + 2.0) * 2 points = 11.0
const MAX_BASE_SCORE = (1.0 + 1.0 + 1.5 + 2.0) * 2; 

const RSI_PERIOD = 14;
const BINANCE_API = "https://api.binance.com/api/v3/klines";

// --- Global State ---
let currentCoin = "BTCUSDT";
let isDark = false;
let updateInterval;
let tvWidgets = {}; 

// --- MASTER INDEX DATA ---
const masterMetricsData = [
    { category: "1. PRICE RAW", metric: "Open Price", value: "$67,420.35", change: "+1.2%", categoryClass: "master-c-price" },
    { category: "1. PRICE RAW", metric: "High Price", value: "$67,850.10", change: "+0.8%", categoryClass: "master-c-price" },
    { category: "1. PRICE RAW", metric: "Low Price", value: "$66,950.80", change: "-0.5%", categoryClass: "master-c-price" },
    { category: "1. PRICE RAW", metric: "Close Price (LTP)", value: "$67,520.75", change: "+1.1%", categoryClass: "master-c-price" },
    { category: "1. PRICE RAW", metric: "VWAP (Volume Weighted)", value: "$67,310.20", change: "+0.9%", categoryClass: "master-c-price" },
    { category: "1. PRICE RAW", metric: "TWAP (Time Weighted)", value: "$67,280.45", change: "+0.7%", categoryClass: "master-c-price" },
    
    { category: "2. VOLUME", metric: "Spot Volume", value: "$28.5B", change: "+15.3%", categoryClass: "master-c-vol" },
    { category: "2. VOLUME", metric: "Futures Volume", value: "$85.2B", change: "+22.1%", categoryClass: "master-c-vol" },
    { category: "2. VOLUME", metric: "Options Volume", value: "$12.7B", change: "+8.5%", categoryClass: "master-c-vol" },
    { category: "2. VOLUME", metric: "OBV (On Balance Vol)", value: "4.2M BTC", change: "+3.2%", categoryClass: "master-c-vol" },
    { category: "2. VOLUME", metric: "CVD (Cumulative Delta)", value: "+$420M", change: "+5.7%", categoryClass: "master-c-vol" },
    
    { category: "3. VOLATILITY", metric: "Bollinger Bands", value: "Width: 4.2%", change: "-0.3%", categoryClass: "master-c-price" },
    { category: "3. VOLATILITY", metric: "ATR (Avg True Range)", value: "$1,250", change: "+2.1%", categoryClass: "master-c-price" },
    { category: "3. VOLATILITY", metric: "Standard Deviation", value: "3.8%", change: "-0.5%", categoryClass: "master-c-price" },
    { category: "3. VOLATILITY", metric: "Historical Volatility", value: "62%", change: "+4.2%", categoryClass: "master-c-price" },
    { category: "3. VOLATILITY", metric: "Implied Volatility (IV)", value: "68%", change: "+3.7%", categoryClass: "master-c-price" },
    
    { category: "4. MOMENTUM", metric: "RSI (Relative Strength)", value: "58.2", change: "+2.4", categoryClass: "master-c-price" },
    { category: "4. MOMENTUM", metric: "MACD", value: "Bullish", change: "+0.002", categoryClass: "master-c-price" },
    { category: "4. MOMENTUM", metric: "Stochastic RSI", value: "72.5", change: "+5.2", categoryClass: "master-c-price" },
    { category: "4. MOMENTUM", metric: "CCI (Commodity Channel)", value: "+125.8", change: "+15.3", categoryClass: "master-c-price" },
    { category: "4. MOMENTUM", metric: "Awesome Oscillator", value: "Bullish", change: "+0.8", categoryClass: "master-c-price" },
    
    { category: "5. TREND", metric: "SMA (20, 50, 200)", value: "Bullish", change: "+1.2%", categoryClass: "master-c-price" },
    { category: "5. TREND", metric: "EMA (Exponential)", value: "67,100", change: "+0.8%", categoryClass: "master-c-price" },
    { category: "5. TREND", metric: "Parabolic SAR", value: "Bullish", change: "+0.3%", categoryClass: "master-c-price" },
    { category: "5. TREND", metric: "Ichimoku Cloud", value: "Support", change: "+0.5%", categoryClass: "master-c-price" },
    { category: "5. TREND", metric: "ADX (Trend Strength)", value: "42.5", change: "+2.1", categoryClass: "master-c-price" },
    
    { category: "6. ORDER BOOK", metric: "Bid/Ask Spread", value: "0.01%", change: "-0.002%", categoryClass: "master-c-vol" },
    { category: "6. ORDER BOOK", metric: "Depth Chart", value: "Balanced", change: "+2.1%", categoryClass: "master-c-vol" },
    { category: "6. ORDER BOOK", metric: "Buy Wall Size", value: "$45M", change: "+8.2%", categoryClass: "master-c-vol" },
    { category: "6. ORDER BOOK", metric: "Sell Wall Size", value: "$38M", change: "-3.5%", categoryClass: "master-c-vol" },
    { category: "6. ORDER BOOK", metric: "Slippage Est.", value: "0.05%", change: "-0.01%", categoryClass: "master-c-vol" },
    
    { category: "7. FUTURES", metric: "Open Interest (OI)", value: "$18.5B", change: "+4.2%", categoryClass: "master-c-vol" },
    { category: "7. FUTURES", metric: "Funding Rate", value: "0.01%", change: "+0.002%", categoryClass: "master-c-vol" },
    { category: "7. FUTURES", metric: "Long/Short Ratio", value: "1.25", change: "+0.08", categoryClass: "master-c-vol" },
    { category: "7. FUTURES", metric: "Liquidations (Long)", value: "$2.1M", change: "-15%", categoryClass: "master-c-vol" },
    { category: "7. FUTURES", metric: "Liquidations (Short)", value: "$3.4M", change: "+22%", categoryClass: "master-c-vol" },
    
    { category: "8. OPTIONS", metric: "Delta", value: "0.45", change: "+0.02", categoryClass: "master-c-vol" },
    { category: "8. OPTIONS", metric: "Gamma", value: "0.08", change: "+0.01", categoryClass: "master-c-vol" },
    { category: "8. OPTIONS", metric: "Theta (Time Decay)", value: "-0.002", change: "-0.0001", categoryClass: "master-c-vol" },
    { category: "8. OPTIONS", metric: "Vega", value: "0.15", change: "+0.03", categoryClass: "master-c-vol" },
    { category: "8. OPTIONS", metric: "Max Pain Price", value: "$67,000", change: "+500", categoryClass: "master-c-vol" },
    
    { category: "9. ADDRESSES", metric: "Active Addresses", value: "987K", change: "+2.3%", categoryClass: "master-c-chain" },
    { category: "9. ADDRESSES", metric: "New Addresses", value: "145K", change: "+5.1%", categoryClass: "master-c-chain" },
    { category: "9. ADDRESSES", metric: "Zero Balance Addr", value: "2.1M", change: "-0.8%", categoryClass: "master-c-chain" },
    { category: "9. ADDRESSES", metric: "Whale Addr (>1k BTC)", value: "1,842", change: "+12", categoryClass: "master-c-chain" },
    { category: "9. ADDRESSES", metric: "Retail Addr (<0.1 BTC)", value: "42M", change: "+1.2%", categoryClass: "master-c-chain" },
    
    { category: "10. SUPPLY", metric: "Circulating Supply", value: "19.6M", change: "+0.01%", categoryClass: "master-c-chain" },
    { category: "10. SUPPLY", metric: "Illiquid Supply", value: "14.8M", change: "+0.2%", categoryClass: "master-c-chain" },
    { category: "10. SUPPLY", metric: "Long Term Holder Supply", value: "13.9M", change: "+0.3%", categoryClass: "master-c-chain" },
    { category: "10. SUPPLY", metric: "Short Term Holder Supply", value: "2.8M", change: "-0.5%", categoryClass: "master-c-chain" },
    { category: "10. SUPPLY", metric: "Exchange Balance", value: "2.1M", change: "-0.2%", categoryClass: "master-c-chain" },
    
    { category: "11. MINING", metric: "Hashrate", value: "645 EH/s", change: "+2.1%", categoryClass: "master-c-chain" },
    { category: "11. MINING", metric: "Difficulty", value: "81.7T", change: "+3.5%", categoryClass: "master-c-chain" },
    { category: "11. MINING", metric: "Miner Revenue", value: "$42M", change: "+8.2%", categoryClass: "master-c-chain" },
    { category: "11. MINING", metric: "Transaction Fees", value: "$2.8M", change: "+15%", categoryClass: "master-c-chain" },
    { category: "11. MINING", metric: "Hash Ribbons", value: "Accumulation", change: "+5%", categoryClass: "master-c-chain" },
    
    { category: "12. PROFIT", metric: "NUPL (Net Unrealized P/L)", value: "0.42", change: "+0.08", categoryClass: "master-c-chain" },
    { category: "12. PROFIT", metric: "MVRV Ratio", value: "2.15", change: "+0.12", categoryClass: "master-c-chain" },
    { category: "12. PROFIT", metric: "SOPR", value: "1.08", change: "+0.03", categoryClass: "master-c-chain" },
    { category: "12. PROFIT", metric: "Realized Price", value: "$24,500", change: "+150", categoryClass: "master-c-chain" },
    { category: "12. PROFIT", metric: "aSOPR (Adjusted)", value: "1.02", change: "+0.01", categoryClass: "master-c-chain" },
    
    { category: "13. MACRO", metric: "DXY (Dollar Index)", value: "104.2", change: "-0.3", categoryClass: "master-c-macro" },
    { category: "13. MACRO", metric: "US 10Y Yields", value: "4.28%", change: "+0.05%", categoryClass: "master-c-macro" },
    { category: "13. MACRO", metric: "US CPI (Inflation)", value: "3.2%", change: "-0.1%", categoryClass: "master-c-macro" },
    { category: "13. MACRO", metric: "Fed Fund Rate", value: "5.50%", change: "0.00%", categoryClass: "master-c-macro" },
    { category: "13. MACRO", metric: "M2 Money Supply", value: "$20.8T", change: "+0.2%", categoryClass: "master-c-macro" },
    
    { category: "14. INSTITUTIONAL", metric: "ETF Inflows", value: "+$125M", change: "+$45M", categoryClass: "master-c-macro" },
    { category: "14. INSTITUTIONAL", metric: "GBTC Premium/Discount", value: "-0.12%", change: "+0.05%", categoryClass: "master-c-macro" },
    { category: "14. INSTITUTIONAL", metric: "CME Futures Gap", value: "+$150", change: "+$25", categoryClass: "master-c-macro" },
    { category: "14. INSTITUTIONAL", metric: "MicroStrategy Holdings", value: "214,400", change: "+400", categoryClass: "master-c-macro" },
    { category: "14. INSTITUTIONAL", metric: "Tesla Holdings", value: "9,720", change: "0", categoryClass: "master-c-macro" },
    
    { category: "15. SOCIAL", metric: "Fear & Greed Index", value: "74", change: "+2", categoryClass: "master-c-macro" },
    { category: "15. SOCIAL", metric: "Google Trends (Bitcoin)", value: "42", change: "+5", categoryClass: "master-c-macro" },
    { category: "15. SOCIAL", metric: "Twitter Sentiment", value: "Bullish", change: "+3%", categoryClass: "master-c-macro" },
    { category: "15. SOCIAL", metric: "Reddit Volume", value: "8.2K/hr", change: "+12%", categoryClass: "master-c-macro" },
    { category: "15. SOCIAL", metric: "Bull/Bear Polls", value: "68% Bull", change: "+4%", categoryClass: "master-c-macro" },
    
    { category: "16. STRUCTURE", metric: "Market Cap", value: "$1.32T", change: "+1.8%", categoryClass: "master-c-price" },
    { category: "16. STRUCTURE", metric: "BTC Dominance %", value: "52.4%", change: "+0.3%", categoryClass: "master-c-price" },
    { category: "16. STRUCTURE", metric: "Total Crypto Cap", value: "$2.51T", change: "+2.1%", categoryClass: "master-c-price" },
    { category: "16. STRUCTURE", metric: "Altcoin Market Cap", value: "$1.19T", change: "+2.5%", categoryClass: "master-c-price" },
    { category: "16. STRUCTURE", metric: "ETH/BTC Ratio", value: "0.0512", change: "+0.001", categoryClass: "master-c-price" },
    
    { category: "17. TIME", metric: "Halving Countdown", value: "42 days", change: "-1", categoryClass: "master-c-macro" },
    { category: "17. TIME", metric: "4 Year Cycle", value: "Bull", change: "+15%", categoryClass: "master-c-macro" },
    { category: "17. TIME", metric: "Pi Cycle Top", value: "$98K", change: "+$2K", categoryClass: "master-c-macro" },
    { category: "17. TIME", metric: "Mayer Multiple", value: "2.45", change: "+0.08", categoryClass: "master-c-macro" },
    { category: "17. TIME", metric: "200 Week MA Heatmap", value: "Accumulation", change: "+5%", categoryClass: "master-c-macro" },
    
    { category: "18. DEFI", metric: "TVL (Total Value Locked)", value: "$52B", change: "+3.2%", categoryClass: "master-c-chain" },
    { category: "18. DEFI", metric: "WBTC Supply", value: "245K", change: "+1.2%", categoryClass: "master-c-chain" },
    { category: "18. DEFI", metric: "Lightning Network Cap", value: "$180M", change: "+8%", categoryClass: "master-c-chain" },
    { category: "18. DEFI", metric: "Lightning Channels", value: "85K", change: "+2.1%", categoryClass: "master-c-chain" },
    { category: "18. DEFI", metric: "Token Velocity", value: "0.042", change: "+0.003", categoryClass: "master-c-chain" }
];

// --- DOM Elements ---
const elements = {
    body: document.body,
    coinLabel: document.getElementById("coin-label"),
    themeIcon: document.getElementById("theme-icon"),
    coinSelectorBtn: document.getElementById("coin-selector-btn"),
    menuOverlay: document.getElementById("menu"),
    coinList: document.getElementById("coin-list"),
    buySig: document.getElementById("buy-sig"),
    sellSig: document.getElementById("sell-sig"),
    dispPrice: document.getElementById("disp-price"),
    dispRSI: document.getElementById("disp-rsi"),
    dispChange: document.getElementById("disp-change"),
    dispVolume: document.getElementById("disp-volume"),
    dispVolumeSig: document.getElementById("disp-volume-sig"),
    dispStatus: document.getElementById("disp-status"),
    masterIndex: document.getElementById("master-index"),
    masterMetrics: document.getElementById("master-metrics"),
    masterSearch: document.getElementById("master-search")
};

// --- MASTER INDEX FUNCTIONS ---
function toggleMasterIndex() {
    elements.masterIndex.style.display = 'block';
    initMasterIndex();
}

function closeMasterIndex() {
    elements.masterIndex.style.display = 'none';
}

function initMasterIndex() {
    // Clear container
    elements.masterMetrics.innerHTML = '';
    
    // Add all metrics to the container
    masterMetricsData.forEach((item, index) => {
        const metricElement = document.createElement('div');
        metricElement.className = `master-item ${item.categoryClass}`;
        metricElement.setAttribute('data-category', item.categoryClass);
        
        metricElement.innerHTML = `
            <div class="master-cat-name">${item.category}</div>
            <div class="master-metric">${item.metric}</div>
            <div class="master-metric-value">${item.value} <span style="color: ${item.change.startsWith('+') ? 'var(--green)' : 'var(--red)'}">${item.change}</span></div>
        `;
        
        elements.masterMetrics.appendChild(metricElement);
    });

    // Add search functionality
    elements.masterSearch.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const items = document.querySelectorAll('.master-item');
        
        items.forEach(item => {
            const text = item.textContent.toLowerCase();
            if (text.includes(searchTerm)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });

    // Add filter functionality
    document.querySelectorAll('.master-filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active button
            document.querySelectorAll('.master-filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const category = this.getAttribute('data-category');
            const items = document.querySelectorAll('.master-item');
            
            items.forEach(item => {
                if (category === 'all') {
                    item.style.display = 'block';
                } else {
                    const itemCategory = item.getAttribute('data-category');
                    if (itemCategory.includes(category)) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                }
            });
        });
    });
}

function toggleMetrics() {
    const grid = document.getElementById('metrics-grid');
    const arrow = document.getElementById('metrics-arrow');
    if (grid.classList.contains('show')) {
        grid.classList.remove('show');
        arrow.classList.remove('rotate');
    } else {
        grid.classList.add('show');
        arrow.classList.add('rotate');
    }
}

// --- RSI Calculation ---
function calculateRSI(prices, period) {
    if (!prices || prices.length < period + 1) return NaN;
    let gains = 0;
    let losses = 0;
    for (let i = prices.length - period; i < prices.length; i++) {
        let diff = prices[i] - prices[i - 1];
        if (diff >= 0) { gains += diff; } else { losses -= diff; }
    }
    const avgGain = gains / period;
    const avgLoss = losses / period;
    if (avgLoss === 0 && avgGain === 0) return 50;
    if (avgLoss === 0) return 100;
    if (avgGain === 0) return 0;
    const rs = avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
}

// --- AI Signal Logic ---
function getRsiSignal(rsi) {
    if (isNaN(rsi)) return { sig: "WAIT", color: "#888", class: "" };
    // Strong Sell > 70, Sell > 60
    if (rsi > 70) return { sig: "STRONG SELL", color: "var(--red)", class: "r" };
    if (rsi > 60) return { sig: "SELL", color: "var(--red)", class: "r" };
    // Strong Buy < 30, Buy < 40
    if (rsi < 30) return { sig: "STRONG BUY", color: "var(--green)", class: "g" };
    if (rsi < 40) return { sig: "BUY", color: "var(--green)", class: "g" };
    
    return { sig: "NEUTRAL", color: "var(--yellow)", class: "y" };
}

async function fetchAndAnalyzeTF(tf) {
    let rsiValue = NaN;
    let signal = { sig: "WAIT", color: "#888", class: "" };
    const badgeElement = document.getElementById(`badge-${tf.id}`);
    
    if(badgeElement) {
        badgeElement.classList.add("shimmer");
        badgeElement.innerText = "WAIT";
        badgeElement.className = "ai-badge shimmer";
    }

    try {
        // Using tf.id for interval (e.g., '5m'), which Binance API can handle.
        const response = await fetch(`${BINANCE_API}?symbol=${currentCoin}&interval=${tf.id}&limit=100`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        
        const closes = data.map(k => parseFloat(k[4]));
        rsiValue = calculateRSI(closes, RSI_PERIOD);
        
        signal = getRsiSignal(rsiValue);

        if (badgeElement) {
            badgeElement.innerText = signal.sig.replace('STRONG ', ''); 
            badgeElement.style.color = signal.color;
            badgeElement.classList.remove("shimmer");
            badgeElement.classList.remove("g", "r", "y");
            badgeElement.classList.add(signal.class);
        }

    } catch(e) {
        console.error(`Error fetching data for ${tf.id}:`, e);
        if (badgeElement) {
            badgeElement.innerText = "FAIL";
            badgeElement.style.color = "var(--red)";
            badgeElement.classList.remove("shimmer");
        }
    }
    return signal.sig;
}

async function runMasterAI() {
    let buyScore = 0;
    let sellScore = 0;

    let livePrice = NaN;
    let priceChange = 0;
    let volume = 0;
    let rsi1m = NaN;

    // Reset UI
    elements.buySig.innerText = "--%";
    elements.sellSig.innerText = "--%";
    elements.buySig.style.color = "var(--text-main)";
    elements.sellSig.style.color = "var(--text-main)";
    
    // Prepare analysis promises with their weights
    const analysisPromises = TIMEFRAMES_FOR_AI.map(tf => ({
        promise: fetchAndAnalyzeTF(tf),
        weight: WEIGHTS[tf.id] // Use the new weight
    }));
    
    // Resolve promises
    const results = await Promise.all(analysisPromises.map(p => p.promise));
    
    // --- UPDATED WEIGHTED SCORE LOGIC ---
    // Apply higher weight to larger timeframes (1H, 4H) for stability.
    results.forEach((sig, index) => {
        const weight = analysisPromises[index].weight; 
        
        if (sig === "STRONG BUY") {
            buyScore += 2 * weight;
        } else if (sig === "BUY") {
            buyScore += 1 * weight;
        }
        
        if (sig === "STRONG SELL") {
            sellScore += 2 * weight;
        } else if (sig === "SELL") {
            sellScore += 1 * weight;
        }
    });
    // --- END WEIGHTED SCORE LOGIC ---


    try {
        // Fetch 24hr data for price, change, and volume
        const res24h = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${currentCoin}`);
        const data24h = await res24h.json();
        livePrice = parseFloat(data24h.lastPrice) || NaN;
        priceChange = parseFloat(data24h.priceChangePercent) || 0;
        volume = parseFloat(data24h.volume) || 0; 

        // Fetch 1m data for RSI (used in status card)
        const res1m = await fetch(`${BINANCE_API}?symbol=${currentCoin}&interval=1m&limit=100`);
        const data1m = await res1m.json();
        const closes1m = data1m.map(k => parseFloat(k[4]));
        rsi1m = calculateRSI(closes1m, RSI_PERIOD);

    } catch(e) {
        elements.dispStatus.innerText = "ERROR";
    }
    
    updateHUDMetrics(livePrice, priceChange, volume, rsi1m);
    updateDualSignals(buyScore, sellScore);
}

function updateHUDMetrics(price, change, volume, rsi) {
    if (!isNaN(price)) {
        elements.dispPrice.innerText = `$${price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
    }
    
    if (typeof change === "number") {
        elements.dispChange.innerText = `${change.toFixed(2)}%`;
        elements.dispChange.className = `c-sub ${change >= 0 ? 'g' : 'r'}`;
    }

    const volBillions = (typeof volume === "number" && !isNaN(volume)) ? (volume / 1000000000) : 0; 
    elements.dispVolume.innerText = volBillions > 0 ? `$${volBillions.toFixed(2)}B` : `--`;
    if (volBillions > 0.5) {
        elements.dispVolumeSig.innerText = 'HIGH';
        elements.dispVolumeSig.className = `c-sub g`;
    } else {
        elements.dispVolumeSig.innerText = 'AVG';
        elements.dispVolumeSig.className = `c-sub y`;
    }

    let rsiSignal = getRsiSignal(rsi);
    if (!isNaN(rsi)) {
        elements.dispRSI.innerText = rsi.toFixed(1);
        elements.dispRSI.className = `c-val ${rsiSignal.class}`;
    }
    elements.dispStatus.innerText = rsiSignal.sig.replace('STRONG ', ''); 
    elements.dispStatus.className = `c-val ${rsiSignal.class}`;
}

// --- UPDATED PERCENTAGE LOGIC: Solves the ZERO percent problem ---
function updateDualSignals(buyScore, sellScore) {
    // Max score is now 11.0
    const maxScore = MAX_BASE_SCORE; 
    
    let buyPercent = Math.round((buyScore / maxScore) * 100);
    let sellPercent = Math.round((sellScore / maxScore) * 100);
    
    // **NEW LOGIC to fix 0% display on neutral market**
    // If the total weighted score is very low (less than 1 point), 
    // we assume a neutral/low-conviction market and show a base level.
    if ((buyScore + sellScore) < 1.0) { 
         buyPercent = 20; // Base 20% for neutral
         sellPercent = 20; 
    }
    // **END NEW LOGIC**

    // Limit to 100% strictly
    if(buyPercent > 100) buyPercent = 100;
    if(sellPercent > 100) sellPercent = 100;

    elements.buySig.innerText = `${buyPercent}%`;
    elements.sellSig.innerText = `${sellPercent}%`;
    
    // Color Logic: Only color if score is significant (> 35% of max score)
    const significantThreshold = maxScore * 0.35; 

    // Logic for Buying Signal Coloring
    if (buyScore > sellScore && buyScore >= significantThreshold) {
        elements.buySig.classList.add("g");
        elements.buySig.classList.remove("r", "y");
    } else if (buyPercent > 0) {
         elements.buySig.classList.add("y");
         elements.buySig.classList.remove("g", "r");
    }
    else {
        elements.buySig.classList.remove("g", "r", "y");
    }
    
    // Logic for Selling Signal Coloring
    if (sellScore > buyScore && sellScore >= significantThreshold) {
        elements.sellSig.classList.add("r");
        elements.sellSig.classList.remove("g", "y");
    } else if (sellPercent > 0) {
        elements.sellSig.classList.add("y");
        elements.sellSig.classList.remove("g", "r");
    }
    else {
        elements.sellSig.classList.remove("g", "r", "y");
    }
    
    // If scores are tied or very close (and not zero)
    if (Math.abs(buyScore - sellScore) < 0.1 && (buyScore > 0 || buyPercent > 0)) {
         elements.buySig.classList.add("y");
         elements.sellSig.classList.add("y");
         elements.buySig.classList.remove("g", "r");
         elements.sellSig.classList.remove("g", "r");
    }

    // Clean up if scores are actually zero and not triggered by the new logic
    if (buyScore === 0 && sellScore === 0 && buyPercent === 0) { 
         elements.buySig.classList.remove("g", "r", "y");
         elements.sellSig.classList.remove("g", "r", "y");
    }
}

// --- TradingView Charts ---
function loadTradingViewCharts() {
    const coinData = COINS.find(c => c.symbol === currentCoin) || COINS[0];
    elements.coinLabel.innerText = coinData.name;
    const theme = isDark ? "dark" : "light";
    
    if (Object.keys(tvWidgets).length === 0) {
        const tvConfigs = [
            { id: "1m", interval: "1", container_id: "chart-1m", hide_top_toolbar: false },
            { id: "5m", interval: "5", container_id: "chart-5m" }, 
            { id: "15m", interval: "15", container_id: "chart-15m" },
            { id: "1h", interval: "60", container_id: "chart-1h" }, 
            { id: "4h", interval: "240", container_id: "chart-4h" }
        ];
        const bg = isDark ? "#131722" : "#f2f4f8";
        const ops = {
            autosize: true, symbol: `BINANCE:${currentCoin}`, timezone: "Asia/Kolkata", 
            theme: theme, style: "1", toolbar_bg: bg, hide_side_toolbar: true,
            overrides: { "paneProperties.background": bg, "mainSeriesProperties.showPriceLine": false },
            save_image: false,
        };
        tvConfigs.forEach(conf => {
            const finalOps = {...ops, interval: conf.interval, container_id: conf.container_id, hide_top_toolbar: conf.hide_top_toolbar || true};
            try {
                tvWidgets[conf.id] = new TradingView.widget(finalOps);
                tvWidgets[conf.id].onChartReady(() => {
                     const screen = document.getElementById(`screen-${conf.id}`);
                     if (screen) screen.classList.remove("shimmer");
                });
            } catch (e) { }
        });
    } else {
        const newSymbol = `BINANCE:${currentCoin}`;
        for (const key in tvWidgets) {
            if (tvWidgets[key] && tvWidgets[key].changeSymbol) {
                tvWidgets[key].changeSymbol(newSymbol);
                tvWidgets[key].changeTheme(theme);
            }
        }
    }
}

function toggleTheme() {
    isDark = !isDark;
    elements.body.setAttribute("data-theme", isDark ? "dark" : "light");
    elements.themeIcon.className = isDark ? "fas fa-sun" : "fas fa-moon";
    const theme = isDark ? "dark" : "light";
    for (const key in tvWidgets) {
        if (tvWidgets[key] && tvWidgets[key].changeTheme) {
            tvWidgets[key].changeTheme(theme);
        }
    }
}
function openMenu(){ 
    elements.menuOverlay.style.display="flex"; 
    elements.menuOverlay.onclick = (e) => {
        if (e.target === elements.menuOverlay) closeMenu();
    };
}
function closeMenu(){ elements.menuOverlay.style.display="none"; }
function buildCoinMenu() {
    elements.coinList.innerHTML = "";
    COINS.forEach(c => {
        const d = document.createElement("div");
        d.className = "menu-item";
        d.innerHTML = `<i class="${c.icon}" style="color:${c.color}"></i> ${c.name} <span style="margin-left:auto;color:var(--text-sub);font-weight:700">${c.symbol.replace('USDT','/USDT')}</span>`;
        d.onclick = (e) => { 
            e.stopPropagation(); 
            if (currentCoin !== c.symbol) {
                currentCoin = c.symbol; 
                const newSymbol = `BINANCE:${currentCoin}`;
                for (const key in tvWidgets) {
                    if (tvWidgets[key] && tvWidgets[key].changeSymbol) {
                        tvWidgets[key].changeSymbol(newSymbol);
                    }
                }
                clearInterval(updateInterval); 
                updateInterval = setInterval(runMasterAI, 5000); 
                runMasterAI(); 
            }
            closeMenu(); 
        };
        elements.coinList.appendChild(d);
    });
}
function init() {
    buildCoinMenu();
    document.querySelectorAll('.inner-screen').forEach(el => el.classList.add('shimmer'));
    loadTradingViewCharts(); 
    elements.coinSelectorBtn.onclick = openMenu;
    updateInterval = setInterval(runMasterAI, 5000);
    runMasterAI(); 
}
window.onload = init;