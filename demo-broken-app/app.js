// CyberMart Sentinel Store - Client Logic
// Target Application for Ghost-QA Autonomous Chaos Testing

const cart = {
  items: [
    { id: "item-1", name: "Quantum Cyberdeck v4", price: 1299.00 },
    { id: "item-2", name: "Neural Net Access Token", price: 350.00 }
  ],
};

function logToConsole(message, type = 'info') {
  console.log(`[CyberMart] ${message}`);
  const logContainer = document.getElementById('console-logs');
  if (logContainer) {
    const entry = document.createElement('div');
    entry.className = `log-entry log-${type}`;
    entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    logContainer.prepend(entry);
  }
}

// BUG #1: Uncaught TypeError on Checkout
document.getElementById('checkout-btn')?.addEventListener('click', () => {
  logToConsole('Initiating checkout sequence...', 'info');
  const grandTotal = cart.checkoutDetails.pricing.calculateGrandTotal();
  logToConsole(`Checkout completed! Total: $${grandTotal}`, 'success');
  alert(`Order Placed! Total: $${grandTotal}`);
});

// BUG #2: Network 500 Failure on Sync
document.getElementById('sync-inventory-btn')?.addEventListener('click', async () => {
  logToConsole('Requesting live inventory sync from backend...', 'info');
  try {
    const response = await fetch('/api/broken/inventory-sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ warehouse: 'US-EAST-1' })
    });
    
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      const errMsg = `HTTP ${response.status}: ${errData.error || response.statusText}`;
      console.error(`[NetworkError] Inventory sync failed: ${errMsg}`);
      logToConsole(`Sync failed: ${errMsg}`, 'error');
    } else {
      const data = await response.json();
      logToConsole(`Inventory synced successfully! Count: ${data.items}`, 'success');
    }
  } catch (err) {
    console.error('[NetworkError] Fetch failed', err);
    logToConsole(`Fetch error: ${err.message}`, 'error');
  }
});

// BUG #3: Invisible Z-Index Overlay Block
document.getElementById('claim-voucher-btn')?.addEventListener('click', () => {
  logToConsole('VIP Discount Claimed: 50% OFF Applied!', 'success');
  alert('Congratulations! 50% discount voucher unlocked.');
});

// BUG #4: TypeError on Tax Calculation
function computeTax(regionConfig) {
  return regionConfig.rate * 100;
}

document.getElementById('calc-tax-btn')?.addEventListener('click', () => {
  logToConsole('Calculating regional sales tax...', 'info');
  const tax = computeTax(null);
  logToConsole(`Tax computed: ${tax}%`, 'success');
});
