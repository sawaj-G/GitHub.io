// ===============================================
// AI ENGINE - BUYING/SELLING POWER (MULTI-FACTOR & RISK ANALYSIS)
// *************** ADVANCED LOGIC V4.2 INCLUDED (OIDF, IVS, RESTING PERIOD) ***************
// ===============================================

console.log("🤖 AI Engine Loading (Advanced 199% Confirmation Simulation V4.2)...");

// Global AI Engine Object
window.AI_ENGINE = {
    currentCoin: "BTCUSDT",
    aiRunning: true,
    aiUpdateInterval: null,
    visualUpdater: null,

    // Initialize AI Engine
    init: function() {
        console.log("🚀 AI Engine Initializing...");
        
        setTimeout(() => {
            try {
                this.visualUpdater = new VisualUpdater();
                this.initConfidenceBars();
                this.startAIUpdates();
                console.log("✅ AI Engine Ready!");
            } catch (error) {
                console.error("❌ AI Engine Initialization Failed:", error);
                setTimeout(() => {
                    this.visualUpdater = new VisualUpdater();
                    this.initConfidenceBars();
                    this.startAIUpdates();
                    console.log("✅ AI Engine Ready (Retry)!");
                }, 500);
            }
        }, 100);
    },

    initConfidenceBars: function() {
        const barsContainer = document.getElementById("confidenceBars");
        if (!barsContainer) {
            console.warn("confidenceBars container not found, trying again...");
            setTimeout(() => this.initConfidenceBars(), 500);
            return;
        }

        barsContainer.innerHTML = '';

        for (let i = 1; i <= 10; i++) {
            const bar = document.createElement('div');
            bar.className = 'confidence-bar';
            bar.style.height = (8 + i * 2) + 'px'; 
            barsContainer.appendChild(bar);
        }
    },

    updateForCoin: function(symbol) {
        if (symbol === this.currentCoin) return;

        console.log("🔄 AI updating for:", symbol);
        this.currentCoin = symbol;

        if (typeof window.updateCoinDisplay === 'function') {
            window.updateCoinDisplay(symbol);
        }

        const statusEl = document.getElementById("aiStatus");
        if (statusEl) {
            statusEl.classList.add("no-animation");
            statusEl.textContent = "DEEP LEARNING ANALYSIS INITIATED";
            statusEl.className = "color-blue no-animation";

            setTimeout(() => {
                statusEl.classList.remove("no-animation"); 
                if (this.visualUpdater && this.visualUpdater.updateAll) {
                    this.visualUpdater.updateAll();
                }
            }, 1500); 
        }
    },

    startAIUpdates: function() {
        if (this.aiUpdateInterval) clearInterval(this.aiUpdateInterval);

        console.log("🔄 Starting AI updates...");

        // तुरंत पहला update करें
        if (this.visualUpdater && this.visualUpdater.updateAll) {
            this.visualUpdater.updateAll();
        }

        // हर 3 सेकंड पर update करें
        this.aiUpdateInterval = setInterval(() => {
            if (this.aiRunning && this.visualUpdater && this.visualUpdater.updateAll) {
                this.visualUpdater.updateAll(true); 
            }
        }, 3000); 

        // Market events simulation
        setInterval(() => {
            if (Math.random() > 0.85 && this.aiRunning) {
                this.simulateMarketEvent();
            }
        }, 18000);
    },

    simulateMarketEvent: function() {
        const statusEl = document.getElementById("aiStatus");
        if (!statusEl) return;

        const events = [
            { text: "📈 FED RATE HIKE SHOCK", color: "#e17055" },
            { text: "📉 MASSIVE WHALE SELL-OFF", color: "#d63031" },
            { text: "⚡ DXY BREAKOUT ALERT", color: "#f1c40f" },
            { text: "✨ INSTITUTIONAL BUY INFLOW", color: "#00b894" }
        ];

        const event = events[Math.floor(Math.random() * events.length)];

        statusEl.classList.add("no-animation");
        statusEl.textContent = event.text;
        statusEl.style.color = event.color;
        statusEl.className = "no-animation";

        setTimeout(() => {
            statusEl.style.color = "";
            statusEl.classList.remove("no-animation");
            // Revert to last calculated trend
            if (this.visualUpdater && this.visualUpdater.getLastSignal) {
                const lastSignal = this.visualUpdater.getLastSignal();
                if (lastSignal && this.visualUpdater.updateStatus) {
                    this.visualUpdater.updateStatus(lastSignal.trend, true);
                }
            }
        }, 2500);
    },

    // Stop/Resume functions 
    stop: function() { 
         this.aiRunning = false;
         console.log("AI Engine Stopped.");
    },
    resume: function() { 
        this.aiRunning = true;
        console.log("AI Engine Resumed.");
        if (this.visualUpdater && this.visualUpdater.updateAll) {
            this.visualUpdater.updateAll(true);
        }
    }
};

// ===============================================
// AI DATA GENERATOR (ADVANCED 199% CONFIRMATION SIMULATION)
// V4.2 Additions: OIDF, IVS, Resting Period Logic
// ===============================================

class AIDataGenerator {
    constructor() {
        this.coinData = {
            "BTCUSDT": { base: 65, volatility: 8, longBias: 0.2, volumeBase: 0.8, name: "Bitcoin", shortTrend: 0.1, faInfluence: 0.2, onChainInfluence: 0.1, whaleFactor: 0.15, macroCorrelation: -0.1, sentimentBase: 0.7 },
            "ETHUSDT": { base: 60, volatility: 10, longBias: 0.1, volumeBase: 0.7, name: "Ethereum", shortTrend: 0.05, faInfluence: 0.1, onChainInfluence: 0.15, whaleFactor: 0.1, macroCorrelation: -0.05, sentimentBase: 0.65 },
            "BNBUSDT": { base: 58, volatility: 14, longBias: 0.0, volumeBase: 0.6, name: "Binance Coin", shortTrend: -0.1, faInfluence: 0.05, onChainInfluence: 0.05, whaleFactor: -0.05, macroCorrelation: 0.0, sentimentBase: 0.5 },
            "SOLUSDT": { base: 70, volatility: 18, longBias: 0.3, volumeBase: 0.5, name: "Solana", shortTrend: 0.2, faInfluence: 0.15, onChainInfluence: 0.2, whaleFactor: 0.2, macroCorrelation: -0.15, sentimentBase: 0.8 },
            "XRPUSDT": { base: 52, volatility: 16, longBias: -0.1, volumeBase: 0.4, name: "Ripple", shortTrend: -0.05, faInfluence: -0.1, onChainInfluence: -0.05, whaleFactor: -0.1, macroCorrelation: 0.05, sentimentBase: 0.4 },
            "ADAUSDT": { base: 55, volatility: 15, longBias: 0.05, volumeBase: 0.35, name: "Cardano", shortTrend: 0.01, faInfluence: 0.02, onChainInfluence: 0.03, whaleFactor: 0.05, macroCorrelation: -0.02, sentimentBase: 0.55 },
            "DOGEUSDT": { base: 45, volatility: 22, longBias: 0.0, volumeBase: 0.5, name: "Dogecoin", shortTrend: 0.08, faInfluence: 0.3, onChainInfluence: 0.0, whaleFactor: 0.3, macroCorrelation: 0.0, sentimentBase: 0.9 },
            "MATICUSDT": { base: 57, volatility: 13, longBias: -0.05, volumeBase: 0.4, name: "Polygon", shortTrend: -0.02, faInfluence: 0.05, onChainInfluence: -0.05, whaleFactor: -0.05, macroCorrelation: 0.02, sentimentBase: 0.45 },
            "DOTUSDT": { base: 62, volatility: 12, longBias: 0.15, volumeBase: 0.3, name: "Polkadot", shortTrend: 0.15, faInfluence: 0.1, onChainInfluence: 0.1, whaleFactor: 0.1, macroCorrelation: -0.08, sentimentBase: 0.6 },
            "LTCUSDT": { base: 56, volatility: 10, longBias: 0.0, volumeBase: 0.45, name: "Litecoin", shortTrend: 0.0, faInfluence: 0.0, onChainInfluence: 0.0, whaleFactor: 0.0, macroCorrelation: 0.0, sentimentBase: 0.5 },
            "TRXUSDT": { base: 54, volatility: 16, longBias: 0.0, volumeBase: 0.3, name: "TRON", shortTrend: 0.03, faInfluence: 0.0, onChainInfluence: 0.0, whaleFactor: 0.0, macroCorrelation: 0.0, sentimentBase: 0.5 },
            "AVAXUSDT": { base: 61, volatility: 17, longBias: 0.2, volumeBase: 0.55, name: "Avalanche", shortTrend: 0.12, faInfluence: 0.1, onChainInfluence: 0.15, whaleFactor: 0.15, macroCorrelation: -0.1, sentimentBase: 0.75 },
            "LINKUSDT": { base: 64, volatility: 11, longBias: 0.1, volumeBase: 0.6, name: "Chainlink", shortTrend: 0.07, faInfluence: 0.05, onChainInfluence: 0.08, whaleFactor: 0.08, macroCorrelation: -0.05, sentimentBase: 0.6 },
            "ATOMUSDT": { base: 59, volatility: 14, longBias: -0.05, volumeBase: 0.45, name: "Cosmos", shortTrend: -0.08, faInfluence: -0.05, onChainInfluence: -0.02, whaleFactor: -0.05, macroCorrelation: 0.03, sentimentBase: 0.45 },
            "ETCUSDT": { base: 53, volatility: 12, longBias: 0.02, volumeBase: 0.3, name: "Ethereum Classic", shortTrend: 0.04, faInfluence: 0.0, onChainInfluence: 0.0, whaleFactor: 0.0, macroCorrelation: 0.0, sentimentBase: 0.5 }
        };
        this.counter = 0;
        this.currentATR = 15; // Simulated ATR for Volatility Filter
        this.lastSignal = { buyPower: 50, sellPower: 50 }; // Store last signal for exhaustion check
        this.restingPeriodCounter = 0; // V4.2: For Post-Exhaustion Timer
    }

    simulateRealTimeFactors(data, counter) {
        // Existing factors
        const whaleFlow = data.whaleFactor + (Math.sin(counter * 0.1) * 0.2) + (Math.random() * 0.1 - 0.05);
        const dxyEffect = data.macroCorrelation + (Math.cos(counter * 0.02) * 0.1);
        const sentimentScore = data.sentimentBase + (Math.random() * 0.3 - 0.15); 
        const utxoProfitLoss = data.onChainInfluence + (data.longBias * 0.5) + (Math.random() * 0.1 - 0.05);

        // --- NEW ADVANCED FACTOR SIMULATIONS ---

        // 1. Funding Rate & Long/Short Ratio (for Liquidation Risk)
        const fundingRate = Math.sin(counter * 0.08) * 0.0005 + (data.shortTrend * 0.001); // Simulated Funding Rate
        const longShortRatio = 1.5 + (data.shortTrend * 2) + (Math.random() * 0.5 - 0.25); // Simulated Ratio
        
        // 2. Simulated ATR (Volatility)
        const newATR = this.currentATR * (1 + (Math.random() * 0.1 - 0.05) + (Math.abs(data.shortTrend) * 0.1));
        this.currentATR = Math.max(5, Math.min(30, newATR));
        const atrVolatilityImpact = Math.abs(this.currentATR - 15) * 0.5; // High ATR = high negative impact

        // 3. Delta Imbalance Simulation (Active Buy/Sell Pressure)
        const activeDelta = Math.sin(counter * 0.04) * 0.3 + (Math.random() * 0.1 - 0.05);
        let deltaAdjustment = 0;
        if (activeDelta > 0.2) deltaAdjustment = 15; // Strong Buy Pressure
        if (activeDelta < -0.2) deltaAdjustment = -15; // Strong Sell Pressure

        // --- V4.2 NEW SIMULATIONS ---

        // 4. Open Interest (OI) and Divergence Simulation
        const oiFlow = Math.sin(counter * 0.03) * 0.4; // Simulated OI change
        let oiDivergencePenalty = 0;
        // Bullish Divergence: Price moves up (shortTrend > 0.4) but OI drops (oiFlow < -0.1)
        if (data.shortTrend > 0.4 && oiFlow < -0.1) {
             oiDivergencePenalty = -15; // Penalty to Buy Power
        }
        // Bearish Divergence: Price moves down (shortTrend < -0.4) but OI drops (oiFlow < -0.1)
        else if (data.shortTrend < -0.4 && oiFlow < -0.1) {
             oiDivergencePenalty = 15; // Penalty to Sell Power (boost Buy Power)
        }

        // 5. Implied Volatility Skew (IVS) Simulation
        const ivSkew = Math.cos(counter * 0.01) * 0.5 + (Math.random() * 0.1); // Simulated fear/skew
        let ivSkewRisk = 0;
        
        // If IVS suggests high bearish expectation (IVS > 0.4) but AI says BUY (shortTrend > 0)
        if (ivSkew > 0.4 && data.shortTrend > 0) {
            ivSkewRisk = 20; // High Pre-emptive Risk
        }
        // If IVS suggests high bullish expectation (IVS < -0.4) but AI says SELL (shortTrend < 0)
        else if (ivSkew < -0.4 && data.shortTrend < 0) {
            ivSkewRisk = 20; // High Pre-emptive Risk
        }
        
        // --- END V4.2 NEW SIMULATIONS ---


        return { whaleFlow, dxyEffect, sentimentScore, utxoProfitLoss, fundingRate, longShortRatio, atrVolatilityImpact, deltaAdjustment, oiDivergencePenalty, ivSkewRisk };
    }

    updateLongTermBias(coin) {
        const data = this.coinData[coin];
        if (!data) return;

        // Existing Bias Logic
        const biasDrift = (data.shortTrend - data.longBias) * 0.005; 
        data.longBias += biasDrift;

        // --- NEW: Miner/Validator Selling Pressure (Simulated) ---
        // Miners tend to sell when price rises sharply (positive shortTrend)
        const minerPressure = data.shortTrend > 0.5 ? -0.01 : (data.shortTrend < -0.5 ? 0.01 : 0);
        data.longBias += minerPressure * 0.5; // Apply slight counter-trend pressure

        data.longBias = Math.max(-0.5, Math.min(0.5, data.longBias));
    }

    calculateSqueezeRisk(fundingRate, longShortRatio) {
        // --- V4.0 LOGIC: Liquidation Squeeze Risk Calculation ---
        const fundingRisk = Math.abs(fundingRate) > 0.0008 ? 15 : 0;
        const ratioSkew = Math.abs(longShortRatio - 1.5); // Deviation from neutral 1.5

        let squeezeRiskScore = fundingRisk + (ratioSkew * 5); // Base risk
        let squeezeBias = 0;

        // If highly positive funding and ratio is skewed long (Long Squeeze Risk)
        if (fundingRate > 0.0008 && longShortRatio > 2.5) {
            squeezeBias = -15; // Penalize buyPower
        } 
        // If highly negative funding and ratio is skewed short (Short Squeeze Risk)
        else if (fundingRate < -0.0008 && longShortRatio < 0.5) {
            squeezeBias = 15; // Penalize sellPower (boost buyPower)
        }

        return { squeezeRiskScore, squeezeBias };
    }
    
    // --- V4.1 NEW LOGIC: Liquidation Heatmap Score ---
    calculateLiquidationHeatmapScore(data, longShortRatio) {
        let liquidationScore = 0;
        
        // Simulate a strong long liquidation zone nearby
        if (data.shortTrend > 0.6 && longShortRatio > 2.2 && Math.random() < 0.2) { 
            liquidationScore = -20; // Reduce buyPower: Price is over-extended into a liquidation zone
        }
        // Simulate a strong short liquidation zone nearby
        else if (data.shortTrend < -0.6 && longShortRatio < 0.8 && Math.random() < 0.2) {
            liquidationScore = 20; // Increase buyPower: Price is over-extended into a short liquidation zone
        }
        return liquidationScore;
    }

    // --- V4.1 NEW LOGIC: Volume Profile Health ---
    calculateVolumeHealth(data) {
        let volumeHealthEffect = 0;
        const shortTrendSign = Math.sign(data.shortTrend);

        const isHighVolume = data.volumeBase > 0.7;
        const isStrongMove = Math.abs(data.shortTrend) > 0.5;

        // Condition 1: High Volume Breakout (Strong Confirmation)
        if (isStrongMove && isHighVolume) {
            volumeHealthEffect = shortTrendSign * 10; 
        } 
        // Condition 2: Weak move with Low Volume (Potential Fakeout)
        else if (Math.abs(data.shortTrend) > 0.3 && data.volumeBase < 0.4) {
            volumeHealthEffect = shortTrendSign * -8; // Counter-trend penalty
        }

        return volumeHealthEffect;
    }

    calculateRRRatio(convergenceMagnitude, totalRiskExposure) {
        // --- V4.1 LOGIC: R:R Optimization (Risk-Adjusted) ---
        // Simulating that high convergence means cleaner S/R levels

        // Base RR calculation
        let rrRatio = 1.5 + (convergenceMagnitude / 40) * 2.5;

        // Adjust based on Volatility (High ATR = less predictable targets)
        rrRatio -= (this.currentATR / 30) * 0.5; 
        
        // NEW: Adjust based on Risk Exposure (Higher Risk -> Lower Effective RR)
        const riskPenalty = totalRiskExposure / 30; // Max penalty of ~1.0
        rrRatio -= riskPenalty;

        rrRatio = Math.round(rrRatio * 10) / 10;
        
        return Math.max(1.0, rrRatio);
    }

    // --- V4.0 CONFIRMATION FACTOR: Timeframe Convergence Score (TCS) ---
    simulateTimeframeConvergence(currentTrendSign) {
        // Simulating alignment across different timeframes (e.g., 5m, 15m, 1h, 4h, 1D, 1W)
        const timeframeInfluences = [
            Math.sin(this.counter * 0.02) * 0.1, // 5m
            Math.cos(this.counter * 0.01) * 0.15, // 15m
            Math.sin(this.counter * 0.005) * 0.2, // 1h
            Math.cos(this.counter * 0.002) * 0.25, // 4h
            Math.sin(this.counter * 0.001) * 0.3, // 1D
            Math.cos(this.counter * 0.0005) * 0.35 // 1W
        ];

        let convergenceCount = 0;
        timeframeInfluences.forEach(t => {
            if (Math.sign(t) === currentTrendSign) {
                convergenceCount++;
            }
        });
        
        // Max score is 6
        return convergenceCount; 
    }

    // --- V4.0 CONFIRMATION FACTOR: Exhaustion/Liquidity Sweep Detection ---
    simulateExhaustion() {
        // Simulating a high volume spike (volumeBase > 0.8) followed by a sharp change in shortTrend
        const data = this.coinData[window.AI_ENGINE.currentCoin];
        
        // Condition 1: High current volume and sudden short-term reversal (Simulated)
        const isExhausted = (data.volumeBase > 0.8 && Math.abs(data.shortTrend) > 0.4) && (Math.random() < 0.15);

        if (!isExhausted) return 0;

        // If Buy Power was high (lastSignal.buyPower > 70) but we detect exhaustion, penalize buy power (boost sell)
        if (this.lastSignal && this.lastSignal.buyPower > 70 && data.shortTrend > 0) {
            this.restingPeriodCounter = 6; // Activate 6-cycle resting period
            return -20; // Buy-side exhaustion detected: reduce buy confidence
        } 
        // If Sell Power was high (lastSignal.sellPower > 70) but we detect exhaustion, penalize sell power (boost buy)
        if (this.lastSignal && this.lastSignal.sellPower > 70 && data.shortTrend < 0) {
            this.restingPeriodCounter = 6; // Activate 6-cycle resting period
            return 20; // Sell-side exhaustion detected: increase buy confidence
        }

        return 0;
    }


    generateSignal(coin) {
        const data = this.coinData[coin] || { base: 50, volatility: 15, name: "Unknown", shortTrend: 0, longBias: 0, volumeBase: 0.5, faInfluence: 0, onChainInfluence: 0, whaleFactor: 0, macroCorrelation: 0, sentimentBase: 0.5 };

        this.updateLongTermBias(coin);
        
        const drift = (Math.random() - 0.5) * 0.05 * (data.volatility / 10);
        const selfCorrection = (data.longBias - data.shortTrend) * 0.08; 

        data.shortTrend += drift + selfCorrection;
        data.shortTrend = Math.max(-1.0, Math.min(1.0, data.shortTrend));
        this.coinData[coin].shortTrend = data.shortTrend;

        const { whaleFlow, dxyEffect, sentimentScore, utxoProfitLoss, fundingRate, longShortRatio, atrVolatilityImpact, deltaAdjustment, oiDivergencePenalty, ivSkewRisk } = this.simulateRealTimeFactors(data, this.counter);
        
        const faScore = data.faInfluence + (Math.sin(this.counter * 0.05) * 0.1); 
        
        const momentum = Math.sin(this.counter * (0.1 + (data.volatility / 150))) * 0.5;
        const volatilityRisk = (Math.random() - 0.5) * data.volatility * 0.8;
        const volumeScore = data.volumeBase + (Math.random() * 0.5 - 0.25) + (Math.abs(data.shortTrend) * 0.5);

        // --- V4.1: Dynamic Weighting ---
        const volFactor = this.currentATR / 15; // 1.0 at ATR=15
        const lowVolWeight = 1.0 + (1 - volFactor) * 0.5; // High weight when ATR is low
        const highVolWeight = 1.0 + (volFactor - 1) * 0.5; // High weight when ATR is high

        // Base Effects
        const trendEffect = data.shortTrend * 12; 
        const momentumEffect = momentum * (8 * lowVolWeight); 
        const biasEffect = data.longBias * (5 * highVolWeight); 
        
        // Advanced Factor Effects
        const faEffect = faScore * (10 * highVolWeight); 
        const onChainEffect = utxoProfitLoss * 15; 
        const whaleEffect = whaleFlow * (18 * lowVolWeight); 
        const macroEffect = dxyEffect * -10; 
        const sentimentEffect = (sentimentScore - 0.5) * 12;

        // --- NEW LOGIC INTEGRATION (V4.0/V4.1/V4.2) ---
        
        // 1. Liquidation Squeeze Risk Adjustment (V4.0)
        const { squeezeRiskScore, squeezeBias } = this.calculateSqueezeRisk(fundingRate, longShortRatio);

        // 2. Liquidation Heatmap Score (V4.1)
        const liquidationScore = this.calculateLiquidationHeatmapScore(data, longShortRatio);

        // 3. Volume Profile Health (V4.1)
        const volumeHealthEffect = this.calculateVolumeHealth(data);

        // 4. Volatility Filter Adjustment (V4.0)
        let volatilityFilterAdjustment = 0;
        if (this.currentATR > 20) { 
            volatilityFilterAdjustment = (trendEffect + momentumEffect + biasEffect) * (-(this.currentATR - 20) / 100);
        }
        
        // 5. Exhaustion Detection Adjustment (V4.0)
        const exhaustionAdjustment = this.simulateExhaustion();

        // 6. Delta Imbalance Adjustment (V4.0)
        const finalDeltaAdjustment = deltaAdjustment * 0.5;
        
        // --- V4.2 Specific Adjustments ---
        const finalOIDFPenalty = oiDivergencePenalty; 
        
        // --- Final Buy Power Calculation ---
        let buyPower = data.base + trendEffect + momentumEffect + biasEffect 
                       + faEffect + onChainEffect + whaleEffect + macroEffect + sentimentEffect 
                       + (volatilityRisk * 0.2)
                       + squeezeBias 
                       + liquidationScore 
                       + volumeHealthEffect 
                       + volatilityFilterAdjustment
                       + exhaustionAdjustment
                       + finalDeltaAdjustment
                       + finalOIDFPenalty; // V4.2 OIDF
        
        buyPower = Math.max(5, Math.min(95, buyPower));
        buyPower = Math.round(buyPower);

        const sellPower = 100 - buyPower;
        
        // Update last signal for next cycle's exhaustion check
        this.lastSignal = { buyPower, sellPower, trend: "neutral" }; // 'trend' is updated later

        let trend = "neutral";
        
        // Calculate Convergence Magnitude
        const convergenceMagnitude = Math.abs(trendEffect) + Math.abs(onChainEffect) + Math.abs(whaleEffect) + Math.abs(macroEffect);
        
        // --- AI Model Convergence Score Check ---
        const factorSigns = [Math.sign(trendEffect), Math.sign(onChainEffect), Math.sign(whaleEffect), Math.sign(macroEffect), Math.sign(volumeHealthEffect)]; // Added VPH
        
        let positiveCount = factorSigns.filter(sign => sign > 0).length;
        let negativeCount = factorSigns.filter(sign => sign < 0).length;

        const maxAlignment = Math.max(positiveCount, negativeCount);
        const minAlignment = Math.min(positiveCount, negativeCount);
        
        const convergenceScore = maxAlignment - minAlignment; 

        const majorFactorsAligned = (maxAlignment === factorSigns.length || maxAlignment >= (factorSigns.length - 1));
        
        let rawConfidence = Math.abs(buyPower - 50); 
        
        // --- V4.1: Non-linear TCS Boost ---
        const currentTrendSign = Math.sign(buyPower - 50); 
        const tcsScore = this.simulateTimeframeConvergence(currentTrendSign);
        
        let tcsBoost = 0;
        if (tcsScore <= 4) {
            tcsBoost = tcsScore * 4;
        } else if (tcsScore === 5) {
            tcsBoost = 25; 
        } else if (tcsScore === 6) {
            tcsBoost = 40; 
        }
        
        rawConfidence += tcsBoost; 

        // Apply Convergence Logic to Confidence (Existing)
        if (majorFactorsAligned) {
            rawConfidence += 15;
        } else if (convergenceScore <= 1) { 
            rawConfidence -= 15;
        }
        
        // Apply Exhaustion logic to Confidence
        if (exhaustionAdjustment !== 0 || finalOIDFPenalty !== 0) { // OIDF also reduces confidence
            rawConfidence -= 15;
        }

        if (buyPower > 80 && convergenceMagnitude > 50 && majorFactorsAligned && tcsScore >= 5) { 
            trend = "strong_buy_199"; 
            rawConfidence += 25;
        } else if (sellPower > 80 && convergenceMagnitude > 50 && majorFactorsAligned && tcsScore >= 5) { 
            trend = "strong_sell_199";
            rawConfidence += 25;
        }
        else if (buyPower > 70) trend = "bullish";
        else if (sellPower > 70) trend = "bearish";
        else if (buyPower > 60) trend = "moderate_buy"; 
        else if (sellPower > 60) trend = "moderate_sell"; 

        // V4.2: Post-Exhaustion Resting Period Lockout
        if (this.restingPeriodCounter > 0) {
            // Lock confidence and status after a liquidity event
            rawConfidence = Math.min(rawConfidence, 40); 
            trend = "WAITING FOR CONFIRMATION";
            this.restingPeriodCounter--;
        }
        
        let confidenceScore = rawConfidence;
        
        let confidence = Math.round(Math.max(1, Math.min(10, (confidenceScore / 70) * 10)));
        
        // --- V4.2: Dynamic R:R Calculation (Risk-Adjusted) ---
        
        // Total Risk includes V4.0/V4.1 risks + V4.2 IVS Risk
        const totalRiskExposure = Math.abs(volatilityRisk) + Math.abs(dxyEffect) * 15 + squeezeRiskScore 
                                + (Math.abs(finalDeltaAdjustment) * 0.5) + (Math.abs(liquidationScore) * 0.5)
                                + ivSkewRisk; // V4.2 IVS Risk

        let rrRatio = this.calculateRRRatio(convergenceMagnitude, totalRiskExposure);
        
        let riskStatus = "LOW";
        let riskColor = "color-green";

        if (totalRiskExposure > 30) { riskStatus = "EXTREME"; riskColor = "color-red"; } // New category
        else if (totalRiskExposure > 20) { riskStatus = "HIGH"; riskColor = "color-red"; } 
        else if (totalRiskExposure > 10) { riskStatus = "MEDIUM"; riskColor = "color-yellow"; }

        let volumeStatus = "MODERATE";
        let volumeColor = "color-yellow";
        if (volumeScore > 1.4) { volumeStatus = "HIGH"; volumeColor = "color-green"; }
        else if (volumeScore < 0.6) { volumeStatus = "LOW"; volumeColor = "color-red"; }

        this.counter++;
        this.lastSignal.trend = trend; // Update last signal with final trend

        return {
            buyPower,
            sellPower,
            confidence,
            trend,
            coinName: data.name,
            riskStatus,
            riskColor,
            volumeStatus,
            volumeColor,
            rrRatio, 
            whaleActivity: whaleFlow,
            macroDXY: dxyEffect,
            sentiment: sentimentScore
        };
    }

    getCoinInfo(coin) {
        return this.coinData[coin] || { base: 50, volatility: 15, name: "Unknown" };
    }
}

// ===============================================
// VISUAL UPDATER (Updated for 199% Signal & New Trends)
// ===============================================

class VisualUpdater {
    constructor() {
        this.generator = new AIDataGenerator();
        this.lastSignal = { trend: "NEUTRAL", buyPower: 50, sellPower: 50, confidence: 5, riskStatus: "LOW", volumeStatus: "MODERATE", rrRatio: 1.5 };
    }

    updateAll(animate = false) {
        if (!window.AI_ENGINE || !window.AI_ENGINE.aiRunning) return;

        const signal = this.generator.generateSignal(window.AI_ENGINE.currentCoin);

        const trendChanged = this.lastSignal.trend !== signal.trend;
        this.lastSignal = signal; 

        this.updateNumbers(signal);
        this.updateBars(signal);
        this.updateConfidence(signal.confidence);
        this.updateColors(signal);
        this.updateRiskVolumeAndRR(signal); 
        this.updateTimestamp();

        this.updateStatus(signal.trend, animate || trendChanged);

        if (Math.random() < 0.1) {
            console.log(`📊 AI Signal V4.2: ${signal.coinName} | Buy: ${signal.buyPower}% | Conf: ${signal.confidence}/10 | Trend: ${signal.trend} | R:R: 1:${signal.rrRatio}`);
        }
    }

    updateRiskVolumeAndRR(signal) {
        const riskEl = document.getElementById("riskStatus");
        const volumeEl = document.getElementById("volumeStatus");
        const rrEl = document.getElementById("rrStatus");

        if (riskEl) {
            riskEl.textContent = signal.riskStatus;
            riskEl.className = '';
            riskEl.classList.add(signal.riskColor);
        }

        if (volumeEl) {
            volumeEl.textContent = signal.volumeStatus;
            volumeEl.className = '';
            volumeEl.classList.add(signal.volumeColor);
        }

        if (rrEl) {
            rrEl.textContent = `1:${signal.rrRatio}`;
            rrEl.className = '';
            if (signal.rrRatio >= 3.5) { 
                 rrEl.classList.add("color-green");
            } else if (signal.rrRatio >= 2.5) {
                 rrEl.classList.add("color-yellow");
            } else {
                 rrEl.classList.add("color-red");
            }
        }
    }

    updateNumbers(signal) {
        const elements = {
            buy: document.getElementById("buyPowerValue"),
            sell: document.getElementById("sellPowerValue"),
            confidence: document.getElementById("confidenceValue")
        };

        if (elements.buy) {
            const current = parseInt(elements.buy.textContent) || 50;
            this.animateNumber(elements.buy, current, signal.buyPower, "%");
        }

        if (elements.sell) {
            const current = parseInt(elements.sell.textContent) || 50;
            this.animateNumber(elements.sell, current, signal.sellPower, "%");
        }

        if (elements.confidence) {
            elements.confidence.textContent = signal.confidence;
        }
    }

    animateNumber(element, start, end, suffix) {
        if (!element) return;

        if (start === end) {
            element.textContent = end + suffix;
            return;
        }

        if (element.animationInterval) {
            clearInterval(element.animationInterval);
            element.animationInterval = null;
        }

        const duration = 400; 
        const steps = 20;
        const stepTime = duration / steps;
        const stepValue = (end - start) / steps;

        let currentStep = 0;
        let currentValue = start;

        element.animationInterval = setInterval(() => {
            currentStep++;
            currentValue += stepValue;

            if (currentStep >= steps) {
                element.textContent = end + suffix;
                clearInterval(element.animationInterval);
                element.animationInterval = null;
            } else {
                element.textContent = Math.round(currentValue) + suffix;
            }
        }, stepTime);
    }

    updateBars(signal) {
        const buyBar = document.getElementById("buyIndicator");
        const sellBar = document.getElementById("sellIndicator");

        if (buyBar && sellBar) {
            buyBar.style.transition = "width 0.5s ease";
            sellBar.style.transition = "width 0.5s ease";

            buyBar.style.width = signal.buyPower + "%";
            sellBar.style.width = signal.sellPower + "%";
        }
    }

    updateConfidence(confidence) {
        const barsContainer = document.getElementById("confidenceBars");
        if (!barsContainer) return;

        const bars = barsContainer.querySelectorAll('.confidence-bar');

        for (let i = 0; i < bars.length; i++) {
            const bar = bars[i];

            let barColor = "#444";

            if (i < confidence) {
                if (confidence >= 9) { 
                    barColor = "#00b894";
                } else if (confidence >= 7) {
                    barColor = "#f1c40f";
                } else if (confidence >= 4) {
                    barColor = "#e17055";
                } else {
                    barColor = "#d63031";
                }

                bar.style.transition = "all 0.3s ease";
            }

            bar.style.background = barColor;
        }
    }

    updateColors(signal) {
        const cards = {
            buy: document.getElementById("buyCard"),
            sell: document.getElementById("sellCard"),
            confidence: document.getElementById("confidenceCard")
        };

        Object.values(cards).forEach(card => {
            if (card) {
                card.style.borderColor = "#1c2130";
                card.style.background = "var(--bg-card)";
                card.style.transition = "all 0.3s ease";
            }
        });

        if (signal.trend.includes("buy_199") && cards.buy) {
            cards.buy.style.borderColor = "#00b894";
            cards.buy.style.background = `rgba(0, 184, 148, 0.5)`;
        } else if (signal.trend.includes("bullish") && cards.buy) {
            cards.buy.style.borderColor = "#00b894";
            cards.buy.style.background = `rgba(0, 184, 148, 0.15)`;
        }

        if (signal.trend.includes("sell_199") && cards.sell) {
            cards.sell.style.borderColor = "#d63031";
            cards.sell.style.background = `rgba(214, 48, 49, 0.5)`; 
        } else if (signal.trend.includes("bearish") && cards.sell) {
            cards.sell.style.borderColor = "#d63031";
            cards.sell.style.background = `rgba(214, 48, 49, 0.15)`;
        }

        if (cards.confidence) {
            if (signal.confidence >= 9) {
                cards.confidence.style.borderColor = "#00b894";
            } else if (signal.confidence >= 7) {
                cards.confidence.style.borderColor = "#f1c40f";
            } else {
                cards.confidence.style.borderColor = "#e17055";
            }
        }
    }

    updateStatus(trend, animate = false) {
        const statusEl = document.getElementById("aiStatus");
        if (!statusEl) return;

        let statusText = "NEUTRAL";
        let statusClass = "color-yellow";

        switch(trend) {
            case "strong_buy_199":
                statusText = "ULTRA CONFIRMATION BUY (199%)";
                statusClass = "color-green";
                break;
            case "bullish":
                statusText = "HIGH PROBABILITY BUY";
                statusClass = "color-green";
                break;
            case "moderate_buy":
                statusText = "BUY";
                statusClass = "color-green";
                break;
            case "strong_sell_199":
                statusText = "ULTRA CONFIRMATION SELL (199%)";
                statusClass = "color-red";
                break;
            case "bearish":
                statusText = "HIGH PROBABILITY SELL";
                statusClass = "color-red";
                break;
            case "moderate_sell":
                statusText = "SELL";
                statusClass = "color-red";
                break;
            case "WAITING FOR CONFIRMATION": // V4.2 Resting Period Status
                statusText = "POST-LIQUIDITY RESTING PERIOD";
                statusClass = "color-blue";
                break;
            default:
                statusText = "NEUTRAL";
                statusClass = "color-yellow";
        }

        statusEl.style.transition = "all 0.3s ease";
        statusEl.textContent = statusText;
        statusEl.className = statusClass;

        if (animate) {
            statusEl.classList.remove("no-animation");
        } else {
            statusEl.classList.add("no-animation");
        }

        statusEl.style.transform = "scale(1.05)";
        setTimeout(() => {
            statusEl.style.transform = "scale(1)";
        }, 200);
    }

    updateTimestamp() {
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });

        const lastUpdateEl = document.getElementById("lastUpdate");
        if (lastUpdateEl) {
            lastUpdateEl.textContent = timeStr;
        }
    }

    getLastSignal() {
        return this.lastSignal;
    }
}

// ===============================================
// INITIALIZE AI ENGINE WHEN PAGE LOADS
// ===============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log("📊 DOM loaded, starting AI Engine...");
    
    setTimeout(() => {
        if (window.AI_ENGINE && window.AI_ENGINE.init) {
            window.AI_ENGINE.init();
        } else {
            console.error("AI_ENGINE not found!");
        }
    }, 1000);
});

if (document.readyState === 'interactive' || document.readyState === 'complete') {
    setTimeout(() => {
        if (window.AI_ENGINE && window.AI_ENGINE.init) {
            window.AI_ENGINE.init();
        }
    }, 1000);
}

// Export for external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        AI_ENGINE: window.AI_ENGINE,
        AIDataGenerator,
        VisualUpdater
    };
}
