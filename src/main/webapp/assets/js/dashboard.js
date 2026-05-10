// script.js – modular, dynamic page switching + chart initialization
// UPDATED: Weekly Sales part now has a smooth live line chart (Binance style)

// ---------- TEMPLATE DEFINITIONS (embedded as strings) ----------
const pages = {
    overview: `
    <div class="stats-grid">
      <div class="card"><div class="stat-label">Total Revenue</div><div class="stat-value">$284.5K</div><span style="color:#ff8888">↑ 12%</span></div>
      <div class="card"><div class="stat-label">Total Orders</div><div class="stat-value">2,413</div><span>+94</span></div>
      <div class="card"><div class="stat-label">Customers</div><div class="stat-value">1,289</div><span>new 43</span></div>
      <div class="card"><div class="stat-label">Products</div><div class="stat-value">347</div><span>active 312</span></div>
    </div>
    <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 1.8rem; margin-bottom: 2rem;">
      <!-- LIVE LINE CHART CARD (Binance style) -->
      <div class="card" style="height: 320px; display: flex; flex-direction: column; padding: 1rem 1.2rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
          <h4 style="margin:0; color:#ff8888;">📈 Weekly Sales (live)</h4>
          <span style="background: #1f0f0f; padding:0.2rem 0.8rem; border-radius: 30px; border:1px solid red; font-size:0.8rem;">
            <span style="color:#ff4d4d;" id="price-change">+2.4%</span>
          </span>
        </div>
        <!-- Time indicator -->
        <div style="display: flex; justify-content: space-between; font-size:0.9rem; color:#aaa; border-bottom:1px solid #ff4d4d30; padding-bottom:0.5rem;">
          <span>⏱️ <span id="live-timer" style="color:#ff7b7b; font-family: monospace;">updating 3s</span></span>
          <span>⚡ <span style="color:#ffaaaa;">641.86</span></span>
        </div>
        <!-- Chart container (fixed height) -->
        <div style="flex:1; margin-top: 10px; min-height:0; position: relative;">
          <canvas id="weeklyLiveChart" style="width:100%; height:100%; display:block;"></canvas>
        </div>
        <!-- Mini stats -->
        <div style="display: flex; justify-content: space-between; margin-top: 8px; color: #ffbebe; border-top: 1px solid #ff4d4d40; padding-top: 8px; font-size:0.85rem;">
          <span>💰 High <span id="high-price">648.2</span></span>
          <span>📉 Low <span id="low-price">635.4</span></span>
          <span>📊 Vol <span id="volume">2.4K</span></span>
        </div>
      </div>

      <div class="card">
        <h4>⚡ Recent Activity</h4>
        <ul class="recent-list">
          <li><span>Order #EL9032</span> <span style="color:#ff7b7b">$1,240</span></li>
          <li><span>New user: Alex R.</span> <span>just now</span></li>
          <li><span>Product restock</span> <span>5 min ago</span></li>
          <li><span>Refund processed</span> <span>23 min ago</span></li>
          <li><span>BTC update</span> <span style="color:#77ff77;">+1.2%</span></li>
        </ul>
      </div>
    </div>
  `,
    products: `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
      <h2 style="color:#ffbebe"><i class="fas fa-box"></i> Products</h2>
      <div><input type="text" class="search-bar" placeholder="🔍 Search product..."><button class="btn-primary" style="margin-left:1rem;"><i class="fas fa-plus"></i> Add Product</button></div>
    </div>
    <div class="card">
      <table>
        <tr><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th>Actions</th></tr>
        <tr><td><i class="fas fa-headphones" style="color:red; font-size:1.8rem;"></i></td><td>Nova Buds Pro</td><td>Audio</td><td>$129</td><td>45</td><td><span class="status-badge shipped">active</span></td><td><button class="btn-icon"><i class="fas fa-edit"></i></button> <button class="btn-icon"><i class="fas fa-trash"></i></button></td></tr>
        <tr><td><i class="fas fa-laptop" style="color:red; font-size:1.8rem;"></i></td><td>Phantom X1</td><td>Laptops</td><td>$1,899</td><td>12</td><td><span class="status-badge pending">low stock</span></td><td><button class="btn-icon"><i class="fas fa-edit"></i></button> <button class="btn-icon"><i class="fas fa-trash"></i></button></td></tr>
        <tr><td><i class="fas fa-clock" style="color:red; font-size:1.8rem;"></i></td><td>Cyber watch Z</td><td>Wearables</td><td>$349</td><td>28</td><td><span class="status-badge delivered">active</span></td><td><button class="btn-icon"><i class="fas fa-edit"></i></button> <button class="btn-icon"><i class="fas fa-trash"></i></button></td></tr>
        <tr><td><i class="fas fa-tv" style="color:red; font-size:1.8rem;"></i></td><td>Nova 4K Display</td><td>Monitors</td><td>$529</td><td>8</td><td><span class="status-badge pending">low</span></td><td><button class="btn-icon"><i class="fas fa-edit"></i></button> <button class="btn-icon"><i class="fas fa-trash"></i></button></td></tr>
      </table>
    </div>
  `,
    orders: `
    <div style="display: flex; gap: 1rem; align-items: center; margin-bottom: 2rem;">
      <h2 style="color:#ffbebe"><i class="fas fa-shopping-cart"></i> Orders</h2>
      <select style="background:#1f0f0f; color:white; border:1px solid red; border-radius:30px; padding:0.5rem 1rem;">
        <option>All status</option><option>Pending</option><option>Shipped</option><option>Delivered</option>
      </select>
    </div>
    <div class="card">
      <table>
        <tr><th>Order ID</th><th>Customer</th><th>Product</th><th>Date</th><th>Price</th><th>Status</th></tr>
        <tr><td>#EL1001</td><td>Mia Chen</td><td>Nova Buds</td><td>2025-03-04</td><td>$129</td><td><span class="status-badge shipped">Shipped</span></td></tr>
        <tr><td>#EL1002</td><td>Jay S.</td><td>Phantom X1</td><td>2025-03-03</td><td>$1,899</td><td><span class="status-badge pending">Pending</span></td></tr>
        <tr><td>#EL1003</td><td>Elena V.</td><td>Cyber watch</td><td>2025-03-02</td><td>$349</td><td><span class="status-badge delivered">Delivered</span></td></tr>
        <tr><td>#EL1004</td><td>Omar F.</td><td>Nova 4K</td><td>2025-03-02</td><td>$529</td><td><span class="status-badge delivered">Delivered</span></td></tr>
        <tr><td>#EL1005</td><td>Zara K.</td><td>Gaming mouse</td><td>2025-03-01</td><td>$79</td><td><span class="status-badge pending">Pending</span></td></tr>
      </table>
    </div>
  `,
    customers: `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
      <h2 style="color:#ffbebe"><i class="fas fa-users"></i> Customers</h2>
      <input type="text" class="search-bar" placeholder="🔍 Find customer...">
    </div>
    <div class="card">
      <table>
        <tr><th>Avatar</th><th>Name</th><th>Email</th><th>Phone</th><th>Orders</th><th>Spent</th><th></th></tr>
        <tr><td><i class="fas fa-user-circle" style="font-size:2rem; color:#ff8888"></i></td><td>Alex Rivera</td><td>a.rivera@mail.com</td><td>+1 234 567</td><td>12</td><td>$4,280</td><td><button class="btn-icon">profile</button></td></tr>
        <tr><td><i class="fas fa-user-circle" style="font-size:2rem; color:#ff8888"></i></td><td>Blair Yu</td><td>blair.y@cyber.me</td><td>+1 987 654</td><td>8</td><td>$2,930</td><td><button class="btn-icon">profile</button></td></tr>
        <tr><td><i class="fas fa-user-circle" style="font-size:2rem; color:#ff8888"></i></td><td>Carlos M.</td><td>c.mendez@neo.com</td><td>+44 123 456</td><td>23</td><td>$8,124</td><td><button class="btn-icon">profile</button></td></tr>
      </table>
    </div>
  `,
    analytics: `
    <h2 style="color:#ffbebe; margin-bottom: 1.5rem;"><i class="fas fa-chart-line"></i> Analytics</h2>
    <div class="stats-grid" style="grid-template-columns: repeat(4,1fr);">
      <div class="card"><span>Visitors</span><div class="stat-value">23.4k</div></div>
      <div class="card"><span>Conversion</span><div class="stat-value">4.6%</div></div>
      <div class="card"><span>Avg. order</span><div class="stat-value">$218</div></div>
      <div class="card"><span>Traffic</span><div class="stat-value">+22%</div></div>
    </div>
    <div class="chart-row">
      <div class="chart-box"><canvas id="lineChart" style="height:200px; width:100%;"></canvas></div>
      <div class="chart-box"><canvas id="barChart" style="height:200px; width:100%;"></canvas></div>
      <div class="chart-box"><canvas id="pieChart" style="height:200px; width:100%;"></canvas></div>
    </div>
  `,
    settings: `
    <h2 style="color:#ffbebe"><i class="fas fa-cog"></i> Settings</h2>
    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:2rem; margin-top:2rem;">
      <div class="card">
        <h4>👤 Profile info</h4>
        <input class="search-bar" style="width:100%; margin:12px 0;" placeholder="Display name" value="Electro Admin">
        <input class="search-bar" style="width:100%;" placeholder="Email" value="admin@electro.tech">
      </div>
      <div class="card">
        <h4>🔒 Change password</h4>
        <input class="search-bar" style="width:100%; margin:6px 0;" type="password" placeholder="Current">
        <input class="search-bar" style="width:100%;" type="password" placeholder="New">
      </div>
    </div>
    <div class="card" style="margin-top:2rem;">
      <div style="display:flex; align-items:center; justify-content:space-between; margin:12px 0;"><span>🔔 Notifications</span> <input type="checkbox" class="toggle-switch" checked></div>
      <div style="display:flex; align-items:center; justify-content:space-between; margin:12px 0;"><span>🌙 Dark mode (red/black)</span> <input type="checkbox" class="toggle-switch" checked></div>
      <div style="display:flex; align-items:center; justify-content:space-between; margin:12px 0;"><span>📧 Email reports</span> <input type="checkbox" class="toggle-switch"></div>
      <button class="btn-primary" style="margin-top: 1.5rem;">Save settings</button>
    </div>
  `
};

// ---------- GLOBAL VARIABLES ----------
let activeChartInstances = [];
let liveInterval = null;
let chartInstance = null;  // for the live weekly chart

function destroyCharts() {
    if (liveInterval) {
        clearInterval(liveInterval);
        liveInterval = null;
    }
    if (chartInstance) {
        chartInstance.destroy();
        chartInstance = null;
    }
    activeChartInstances.forEach(chart => chart.destroy());
    activeChartInstances = [];
}

// Generate random walk data for live line chart (Binance style)
function generateLiveData(prevData) {
    if (!prevData) {
        // Initial data: start with a nice curve
        return [42, 48, 45, 52, 58, 55, 62, 68, 64, 71, 75, 69, 73, 78, 74];
    }
    // Random walk: each point moves up/down slightly
    return prevData.map(val => {
        const change = (Math.random() * 6) - 3; // -3 to +3
        let newVal = val + change;
        // Keep within reasonable range
        return Math.max(35, Math.min(90, Math.round(newVal * 10) / 10));
    });
}

// Update chart and mini stats
function updateLiveChart() {
    if (!chartInstance) return;

    const oldData = chartInstance.data.datasets[0].data;
    const newData = generateLiveData(oldData);

    // Calculate change percentage (from first to last)
    const first = newData[0];
    const last = newData[newData.length - 1];
    const changePct = ((last - first) / first * 100).toFixed(1);
    const changeEl = document.getElementById('price-change');
    if (changeEl) {
        changeEl.innerHTML = (changePct > 0 ? '+' : '') + changePct + '%';
        changeEl.style.color = changePct >= 0 ? '#77ff77' : '#ff7b7b';
    }

    // Update high/low
    const high = Math.max(...newData).toFixed(1);
    const low = Math.min(...newData).toFixed(1);
    document.getElementById('high-price').innerText = high;
    document.getElementById('low-price').innerText = low;

    // Random volume
    document.getElementById('volume').innerText = (Math.random() * 3 + 1.2).toFixed(1) + 'K';

    // Update chart
    chartInstance.data.datasets[0].data = newData;
    chartInstance.update({
        duration: 500,
        easing: 'easeInOutQuad'
    });
}

function renderPage(pageId) {
    const main = document.getElementById('main-content');
    main.innerHTML = pages[pageId] || pages.overview;
    destroyCharts();

    if (pageId === 'overview') {
        // Create live line chart
        const ctx = document.getElementById('weeklyLiveChart')?.getContext('2d');
        if (ctx) {
            const initialData = [42, 48, 45, 52, 58, 55, 62, 68, 64, 71, 75, 69, 73, 78, 74];
            const labels = ['09:30', '09:32', '09:34', '09:36', '09:38', '09:40', '09:42', '09:44', '09:46', '09:48', '09:50', '09:52', '09:54', '09:56', '09:58'];

            chartInstance = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Price (USD)',
                        data: initialData,
                        borderColor: '#ff4d4d',
                        backgroundColor: 'rgba(255, 70, 70, 0.1)',
                        borderWidth: 3,
                        pointRadius: 2,
                        pointHoverRadius: 5,
                        pointBackgroundColor: '#ff8888',
                        tension: 0.3,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: { backgroundColor: '#1a0000', titleColor: '#ffaaaa', bodyColor: '#ffcccc' }
                    },
                    scales: {
                        x: {
                            grid: { color: '#330000', display: true },
                            ticks: { color: '#ffaaaa', maxTicksLimit: 6 }
                        },
                        y: {
                            grid: { color: '#330000' },
                            ticks: { color: '#ffaaaa' },
                            min: 35,
                            max: 90
                        }
                    },
                    animation: { duration: 300 }
                }
            });

            activeChartInstances.push(chartInstance);

            // Set initial high/low
            document.getElementById('high-price').innerText = Math.max(...initialData).toFixed(1);
            document.getElementById('low-price').innerText = Math.min(...initialData).toFixed(1);
            document.getElementById('volume').innerText = '2.4K';

            // Live update every 3 seconds (Binance style)
            liveInterval = setInterval(() => {
                updateLiveChart();
            }, 3000);
        }
    }
    else if (pageId === 'analytics') {
        // Static analytics charts
        const line = document.getElementById('lineChart')?.getContext('2d');
        if (line) activeChartInstances.push(new Chart(line, { type: 'line', data: { labels: ['Jan','Feb','Mar','Apr','May'], datasets: [{ label: 'Revenue', data: [30, 45, 52, 48, 70], borderColor: '#ff6666' }] }, options: { responsive: true } }));

        const bar = document.getElementById('barChart')?.getContext('2d');
        if (bar) activeChartInstances.push(new Chart(bar, { type: 'bar', data: { labels: ['Electro','Phantom','Nova'], datasets: [{ label: 'Sales by category', data: [45, 22, 38], backgroundColor: '#ff4d4d' }] } }));

        const pie = document.getElementById('pieChart')?.getContext('2d');
        if (pie) activeChartInstances.push(new Chart(pie, { type: 'pie', data: { labels: ['Direct','Search','Social','Mail'], datasets: [{ data: [44, 32, 18, 6], backgroundColor: ['#ff3333','#ff6666','#ff9999','#ffcccc'] }] } }));
    }
}

// ---------- SIDEBAR NAVIGATION ----------
document.querySelectorAll('.sidebar-nav li').forEach(item => {
    item.addEventListener('click', e => {
        document.querySelectorAll('.sidebar-nav li').forEach(li => li.classList.remove('active'));
        item.classList.add('active');
        const page = item.dataset.page;
        if (page) renderPage(page);
    });
});

window.addEventListener('load', () => {
    renderPage('overview');
    document.querySelectorAll('.sidebar-nav li').forEach(li => li.classList.remove('active'));
    document.querySelector('.sidebar-nav li[data-page="overview"]').classList.add('active');
});


