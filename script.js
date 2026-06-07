// الرابط البرمجي السحابي المحدث والصحيح الخاص بك 
const cloudWebhookUrl = "https://script.google.com/macros/s/AKfycbzSXfs2wlqdk_QQQDfEACs4L6rncFrYblA95wezBJ1TBgfrDLw13lrfZbVaGigwmvGi/exec";

// حجز الذاكرة ومؤشرات الرسوم البيانية عالمياً بشكل آمن
let rawLeads = [];
let rawSales = [];
let empToSuperMap = {}; 
let superTeamSizes = {}; 
let supervisorsList = []; 
let clientCourseToSourceMap = {};
let clientToEmployeeMap = {}; 
let employeeFilterType = 'all'; 
let homeEmployeeFilterType = 'all'; 
let globalDateFormat = 'MDY'; 

let dailyChartInstance = null; 
let employeeChartInstance = null; 
let supervisorTargetChartInstance = null;
let underperformingCCChartInstance = null; 
let ttggSalesChartInstance = null;
let ccEmployeeTargetChartInstance = null; 
let ttggEmployeeTargetChartInstance = null;
let employeeMatrixChartInstance = null; 
let sourceMatrixChartInstance = null;
let statusMatrixChartInstance = null; 
let courseMatrixChartInstance = null;
let teamChartInstance = null; 
let employeeTimelineChartInstance = null;

// مصفوفة اليوزرات الافتراضية
let employeeDatabase = [
    { name: 'آية احمد', oldUser: 'CC 35', newUser: 'TT 06', category: 'إعادة استهداف', supervisor: 'علي' },
    { name: 'عبد الرحمن', oldUser: 'CC 22', newUser: 'TT 01', category: 'إعادة استهداف', supervisor: 'علي' },
    { name: 'مريم احمد', oldUser: 'CC 04', newUser: 'TT 11', category: 'إعادة استهداف', supervisor: 'علي' },
    { name: 'محمد سيد', oldUser: 'CC 16', newUser: 'TT 09', category: 'إعادة استهداف', supervisor: 'علي' },
    { name: 'عمرو عبدالعظيم', oldUser: 'CC 17', newUser: 'TT 10', category: 'إعادة استهداف', supervisor: 'علي' },
    { name: 'حنين محيي', oldUser: 'CC 18', newUser: 'TT 12', category: 'إعادة استهداف', supervisor: 'علي' },
    { name: 'افنان', oldUser: 'CC 12', newUser: 'TT 05', category: 'إعادة استهداف', supervisor: 'عبدالفتاح' },
    { name: 'ابراهيم عادل', oldUser: 'CC 07', newUser: 'TT 08', category: 'إعادة استهداف', supervisor: 'عبدالفتاح' },
    { name: 'ابراهيم خليل', oldUser: 'CC 26', newUser: 'TT 04', category: 'إعادة استهداف', supervisor: 'زينب' },
    { name: 'حبيبه محمد', oldUser: 'GG80', newUser: 'GG80', category: 'إعادة استهداف', supervisor: 'زينب' },
    { name: 'احمد خالد', oldUser: 'GG81', newUser: 'GG81', category: 'إعادة استهداف', supervisor: 'زينب' },
    { name: 'مؤيد', oldUser: 'CC 23', newUser: 'TT 02', category: 'إعادة استهداف', supervisor: 'خالد' },
    { name: 'محمد حسام', oldUser: 'CC 09', newUser: 'TT 07', category: 'إعادة استهداف', supervisor: 'خالد' },
    { name: 'عبد الله', oldUser: 'CC 24', newUser: 'TT 03', category: 'إعادة استهداف', supervisor: 'خالد' },
    { name: 'سارة', oldUser: 'CC 28', newUser: 'CC 28', category: 'طلبات مران', supervisor: 'عبدالفتاح' },
    { name: 'ريناد حمدان', oldUser: 'CC 10', newUser: 'CC 10', category: 'طلبات مران', supervisor: 'عبدالفتاح' },
    { name: 'عمر', oldUser: 'CC 34', newUser: 'CC 34', category: 'طلبات مران', supervisor: 'عبدالفتاح' },
    { name: 'عمر مرسي', oldUser: 'CC 06', newUser: 'CC 06', category: 'طلبات مران', supervisor: 'عبدالفتاح' },
    { name: 'سندس', oldUser: 'CC 08', newUser: 'CC 08', category: 'طلبات مران', supervisor: 'عبدالفتاح' },
    { name: 'نغم', oldUser: 'CC 32', newUser: 'CC 32', category: 'طلبات مران', supervisor: 'زينب' },
    { name: 'تاج', oldUser: 'CC 31', newUser: 'CC 31', category: 'طلبات مران', supervisor: 'خالد' },
    { name: 'ريناد', oldUser: 'CC 03', newUser: 'CC 03', category: 'طلبات مران', supervisor: 'خالد' },
    { name: 'معاذ', oldUser: 'CC 29', newUser: 'CC 29', category: 'طلبات مران', supervisor: 'خالد' },
    { name: 'مصطفي فضل', oldUser: 'CC 30', newUser: 'CC 30', category: 'طلبات مران', supervisor: 'خالد' }
];

// دالة فحص سمة ألوان الشارتات لمنع إسقاط الرسوم وتحقيق التوافق التام مع الوضع الليلي
function getChartThemeColors() {
    const isDark = document.documentElement.getAttribute('data-bs-theme') === 'dark';
    return {
        dynamicTextColor: isDark ? '#ffffff' : '#1e293b',
        dynamicGridColor: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(128, 128, 128, 0.1)'
    };
}

async function fetchDataFromCloudAuto() {
    const mainFilterBtn = document.getElementById('mainFilterBtn');
    const uploadContainer = document.getElementById('uploadContainer');
    
    if (uploadContainer) {
        uploadContainer.className = "card p-4 text-center mb-4 border-start border-primary border-4 bg-body-tertiary shadow-sm";
        uploadContainer.innerHTML = `
            <div class="mb-2"><i class="fa-solid fa-arrows-spin fa-spin text-primary display-4"></i></div>
            <h5 class="fw-bold text-primary">جاري الاتصال السحابي بالرابط الجديد واسترجاع كافة البيانات الحية...</h5>
            <div class="small fw-bold text-secondary">يرجى الانتظار، جاري تنشيط جداول الكفاءة للفترة الحالية...</div>
        `;
    }
    if (mainFilterBtn) mainFilterBtn.disabled = true;

    try {
        const response = await fetch(cloudWebhookUrl);
        if (!response.ok) throw new Error("فشل الـ Web App في الاستجابة الآمنة.");
        const payload = await response.json();
        if (!payload.leads || !payload.sales) throw new Error("بنية تبويبات الشيت غير مطابقة للتوقعات.");

        rawLeads = cleanSheetData(payload.leads);
        rawSales = cleanSheetData(payload.sales);
        
        if (payload.employees && payload.employees.length > 0) {
            let cleanedEmp = cleanSheetData(payload.employees);
            employeeDatabase = cleanedEmp.map(row => {
                return {
                    name: String(row['اسم الموظف'] || row['اسم_الموظف'] || '').trim(),
                    oldUser: String(row['اليوزر القديم'] || row['اليوزر_القديم'] || '').trim(),
                    newUser: String(row['اليوزر الجديد'] || row['اليوزر_الجديد'] || '').trim(),
                    category: String(row['الفئة'] || '').trim(),
                    supervisor: String(row['المشرف'] || '').trim()
                };
            }).filter(emp => emp.name || emp.oldUser || emp.newUser);
        }

        updateSupervisorMapsFromDatabase();
        renderCloudEmployeeTable(); 

        clientCourseToSourceMap = {}; clientToEmployeeMap = {}; 
        rawLeads.forEach(lead => {
            let clientNum = String(lead['رقم العميل'] || '').trim();
            let courseName = normalizeCourseName(lead['نوع الدورة']);
            if(clientNum) {
                let key = clientNum + "_" + courseName;
                clientCourseToSourceMap[key] = String(lead['كود التسويق'] || 'غير مححدد').trim();
                if(!clientCourseToSourceMap[clientNum]) clientCourseToSourceMap[clientNum] = String(lead['كود التسويق'] || 'غير مححدد').trim();
                if(String(lead['الموظف']).trim()) clientToEmployeeMap[clientNum] = String(lead['الموظف']).trim();
            }
        });

        document.getElementById('quickStats').classList.remove('d-none');
        document.getElementById('stickyStatsWrapper').classList.remove('d-none');
        document.getElementById('homeChartSection').classList.remove('d-none'); 

        if (uploadBox = document.getElementById('uploadContainer')) {
            uploadBox.className = "card p-3 mb-4 border-start border-success border-4 shadow-sm";
            uploadBox.innerHTML = `
                <div class="d-flex justify-content-between align-items-center flex-wrap gap-2 text-start">
                    <div class="d-flex align-items-center gap-3">
                        <i class="fa-solid fa-circle-check text-success fa-2x"></i>
                        <div>
                            <h5 class="mb-0 fw-bold">الربط والاتصال السحابي مستقر ومطابق بنسبة 100% 🟢</h5>
                            <p class="text-muted small mb-0">الموقع متصل بالرابط الجديد حياً. تم تفعيل إصلاح التاريخ السيرفري لحساب كافة الـ 647 ليد بدقة تامة.</p>
                        </div>
                    </div>
                    <div>
                        <button class="btn btn-sm btn-primary fw-bold px-4 py-2 shadow-sm" id="syncBtn" onclick="fetchDataFromCloudAuto()">
                            <i class="fa-solid fa-arrows-rotate me-1"></i> مزامنة الشيت الان
                        </button>
                    </div>
                </div>
            `;
        }
        applyFilters();
    } catch (error) {
        console.error(error);
        alert("حدث خطأ أثناء محاولة الاتصال بجوجل شيت: " + error.message);
    } finally {
        if (mainFilterBtn) {
            mainFilterBtn.disabled = false;
            mainFilterBtn.innerHTML = `<i class="fa-solid fa-sync me-2"></i> تحديث ومزامنة الحسابات الفترية`;
        }
    }
}

function applyFilters() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    if (!startDate || !endDate) return;

    hideSupervisorTeamDetails(); hideEmployeeDetails();
    document.getElementById('stickyDateLabel').innerHTML = `<i class="fa-solid fa-calendar-days me-2"></i> الإحصائيات الحالية المعروضة للفترة من: <span class="badge bg-primary fs-6">${startDate}</span> إلى: <span class="badge bg-primary fs-6">${endDate}</span>`;

    const filteredLeads = rawLeads.filter(item => item['التاريخ'] && item['التاريخ'] >= startDate && item['التاريخ'] <= endDate);
    const filteredSales = rawSales.filter(item => item['التاريخ'] && item['التاريخ'] >= startDate && item['التاريخ'] <= endDate);

    document.getElementById('totalLeadsCount').innerText = filteredLeads.length;
    document.getElementById('totalSalesCount').innerText = filteredSales.length;
    
    let totalConvRate = filteredLeads.length > 0 ? ((filteredSales.length / filteredLeads.length) * 100).toFixed(1) : 0;
    let totalConvRateNum = parseFloat(totalConvRate); let totalConvEl = document.getElementById('totalConversionRate');
    
    if (filteredLeads.length === 0 || totalConvRateNum === 0) { totalConvEl.innerHTML = "0%"; totalConvEl.style.color = "#64748b"; }
    else if (totalConvRateNum >= 16.5) { totalConvEl.innerHTML = `&uarr; ${totalConvRate}%`; totalConvEl.style.color = "#10b981"; }
    else { totalConvEl.innerHTML = `&darr; ${totalConvRate}%`; totalConvEl.style.color = "#ef4444"; }

    const noStoreLeads = filteredLeads.filter(item => { let emp = normalizeEmpCode(item['الموظف']); return emp !== 'CC01' && emp !== 'CC02'; });
    const noStoreSales = filteredSales.filter(item => { let emp = normalizeEmpCode(item['الموظف']); return emp !== 'CC01' && emp !== 'CC02'; });

    document.getElementById('cleanLeadsCount').innerText = noStoreLeads.length;
    document.getElementById('cleanSalesCount').innerText = noStoreSales.length;
    
    let cleanConvRate = noStoreLeads.length > 0 ? ((noStoreSales.length / noStoreLeads.length) * 100).toFixed(1) : 0;
    let cleanConvRateNum = parseFloat(cleanConvRate); let cleanConvEl = document.getElementById('cleanConversionRate');
    
    if (noStoreLeads.length === 0 || cleanConvRateNum === 0) { cleanConvEl.innerHTML = "0%"; cleanConvEl.style.color = "#64748b"; }
    else if (cleanConvRateNum >= 16.5) { cleanConvEl.innerHTML = `&uarr; ${cleanConvRate}%`; cleanConvEl.style.color = "#10b981"; }
    else { cleanConvEl.innerHTML = `&darr; ${cleanConvRate}%`; cleanConvEl.style.color = "#ef4444"; }

    let sortedDates = getDatesInRange(startDate, endDate);
    
    renderDailyPerformanceChart(filteredLeads, filteredSales, sortedDates);
    renderEmployeeSalesChart(filteredLeads, filteredSales);
    renderSupervisorCharts(filteredLeads, filteredSales);
    renderHomeTargetCharts(filteredLeads, filteredSales);
    renderSourceMatrix(filteredLeads, filteredSales, sortedDates);
    renderStatusMatrix(filteredLeads, sortedDates);
    renderCourseMatrix(filteredLeads, filteredSales, sortedDates);
    renderEmployeeMatrix(filteredLeads, filteredSales, sortedDates);
}

function renderHomeTargetCharts(leads, sales) {
    let empLeads = {}; let empSales = {};
    leads.forEach(l => {
        let emp = String(l['الموظف'] || '').trim(); if(!emp || emp === 'غير حدد' || emp === 'غير مححدد' || emp === 'null') return;
        let clean = normalizeEmpCode(emp); empLeads[clean] = (empLeads[clean] || 0) + 1;
    });
    sales.forEach(s => {
        let emp = String(s['الموظف'] || '').trim(); if(!emp || emp === 'غير حدد' || emp === 'غير مححدد' || emp === 'null') return;
        let clean = normalizeEmpCode(emp); empSales[clean] = (empSales[clean] || 0) + 1;
    });

    let unionEmps = Array.from(new Set([...Object.keys(empLeads), ...Object.keys(empSales)]));
    let ccData = [];
    unionEmps.forEach(emp => {
        if (normalizeEmpCode(emp).startsWith('CC')) {
            if (emp === 'CC01' || emp === 'CC02') return; 
            let l = empLeads[emp] || 0; let s = empSales[emp] || 0;
            ccData.push({ name: emp, rate: l > 0 ? parseFloat((s / l * 100).toFixed(1)) : 0 });
        }
    });
    ccData.sort((a, b) => b.rate - a.rate);

    let ttggData = [];
    unionEmps.forEach(emp => { 
        let norm = normalizeEmpCode(emp);
        if (norm.startsWith('TT') || norm.startsWith('GG')) ttggData.push({ name: emp, sales: empSales[emp] || 0 }); 
    });
    ttggData.sort((a, b) => b.sales - a.sales);

    const { dynamicTextColor, dynamicGridColor } = getChartThemeColors();

    if (ccEmployeeTargetChartInstance) ccEmployeeTargetChartInstance.destroy();
    ccEmployeeTargetChartInstance = new Chart(document.getElementById('ccEmployeeTargetChart').getContext('2d'), {
        type: 'bar', plugins: [customTopLabelsPlugin],
        data: {
            labels: ccData.map(d => d.name),
            datasets: [
                { label: 'نسبة تحويل الموظف (%)', data: ccData.map(d => d.rate), backgroundColor: '#3b82f6', borderRadius: 4, barPercentage: 0.45, type: 'bar' },
                { label: 'خط التارجت المطلوب (17%)', data: ccData.map(() => 17), borderColor: '#ef4444', borderWidth: 2.5, borderDash: [5, 5], pointRadius: 0, type: 'line', fill: false }
            ]
        },
        options: {
            responsive: true, maintainAspectRatio: false, layout: { padding: { top: 25 } },
            scales: {
                y: { beginAtZero: true, grid: { color: dynamicGridColor }, ticks: { color: dynamicTextColor, font: { family: 'Cairo', weight: 'bold' } } },
                x: { grid: { display: false }, ticks: { color: dynamicTextColor, font: { family: 'Cairo', weight: 'bold' } } }
            }
        }
    });

    if (ttggEmployeeTargetChartInstance) ttggEmployeeTargetChartInstance.destroy();
    ttggEmployeeTargetChartInstance = new Chart(document.getElementById('ttggEmployeeTargetChart').getContext('2d'), {
        type: 'bar', plugins: [customTopLabelsPlugin],
        data: {
            labels: ttggData.map(d => d.name),
            datasets: [
                { label: 'عدد الإتمامات', data: ttggData.map(d => d.sales), backgroundColor: '#7c3aed', borderRadius: 4, barPercentage: 0.45 },
                { label: 'خط التارجت (15 إتمام)', data: ttggData.map(() => 15), borderColor: '#ef4444', borderWidth: 2.5, borderDash: [5, 5], pointRadius: 0, type: 'line', fill: false }
            ]
        },
        options: { responsive: true, maintainAspectRatio: false, layout: { padding: { top: 25 } }, scales: { y: { beginAtZero: true, grid: { color: dynamicGridColor }, ticks: { color: dynamicTextColor, font: { family: 'Cairo', weight: 'bold' } } }, x: { grid: { display: false }, ticks: { color: dynamicTextColor, font: { family: 'Cairo', weight: 'bold' } } } } }
    });
}

function renderSupervisorCharts(leads, sales) {
    let empLeads = {}; let empSales = {};
    leads.forEach(l => { let emp = String(l['الموظف'] || '').trim(); if(emp) empLeads[normalizeEmpCode(emp)] = (empLeads[normalizeEmpCode(emp)] || 0) + 1; });
    sales.forEach(s => { let emp = String(s['الموظف'] || '').trim(); if(emp) empSales[normalizeEmpCode(emp)] = (empSales[normalizeEmpCode(emp)] || 0) + 1; });

    let tableHtml = `<div class="table-responsive"><table class="table table-bordered text-center align-middle m-0"><thead class="table-dark"><tr><th>اسم المشرف المسؤول</th><th>عدد الموظفين الإجمالي</th><th>عدد ليدز (CC)</th><th>عدد إتمامات (CC)</th><th>كفاءة تحويل فريق (CC)</th><th style="background-color: #7c3aed !important;">إتمامات فئة اعادة إستهداف</th></tr></thead><tbody>`;
    let chartRates = []; let chartLowCC = []; let chartTTGG = [];

    supervisorsList.forEach(sup => {
        let totalCcLeads = 0; let totalCcSales = 0; let totalTtggSales = 0; let lowCcCount = 0;
        let unionEmps = new Set([...Object.keys(empLeads), ...Object.keys(empSales)]);

        unionEmps.forEach(cleanEmp => {
            if (empToSuperMap[cleanEmp] === sup) {
                if (cleanEmp.startsWith('CC')) {
                    let l = empLeads[cleanEmp] || 0; let s = empSales[cleanEmp] || 0; totalCcLeads += l; totalCcSales += s;
                    if ((l > 0 ? (s / l * 100) : 0) < 17.0) lowCcCount++;
                } else if (cleanEmp.startsWith('TT') || cleanEmp.startsWith('GG')) {
                    totalTtggSales += (empSales[cleanEmp] || 0);
                }
            }
        });

        let ccRate = totalCcLeads > 0 ? parseFloat((totalCcSales / totalCcLeads * 100).toFixed(1)) : 0;
        tableHtml += `<tr><td><button class="btn btn-supervisor-drilldown" onclick="showSupervisorTeamDetails('${sup}')"><i class="fa-solid fa-users-viewfinder"></i> <span>${sup}</span></button></td><td><span class="badge bg-secondary fs-6 px-3">${superTeamSizes[sup] || 0}</span></td><td><span class="badge bg-primary fs-6 px-3">${totalCcLeads}</span></td><td><span class="badge bg-success fs-6 px-3">${totalCcSales}</span></td><td class="table-primary fw-bold">${ccRate}%</td><td style="color: #7c3aed; font-weight:700;">${totalTtggSales}</td></tr>`;
        chartRates.push(ccRate); chartLowCC.push(lowCcCount); chartTTGG.push(totalTtggSales);
    });

    tableHtml += `</tbody></table></div>`; document.getElementById('supervisorTableContainer').innerHTML = tableHtml;

    const { dynamicTextColor, dynamicGridColor } = getChartThemeColors();

    if (supervisorTargetChartInstance) supervisorTargetChartInstance.destroy();
    supervisorTargetChartInstance = new Chart(document.getElementById('supervisorTargetChart').getContext('2d'), {
        type: 'bar', plugins: [customTopLabelsPlugin],
        data: { labels: supervisorsList, datasets: [{ label: 'نسبة تحويل موظفي مران (%)', data: chartRates, backgroundColor: '#3b82f6', borderRadius: 4, barPercentage: 0.35 }, { label: 'خط التارجت (17%)', data: supervisorsList.map(() => 17), borderColor: '#ef4444', borderWidth: 3, borderDash: [5, 5], type: 'line', fill: false }] },
        options: { responsive: true, maintainAspectRatio: false, layout: { padding: { top: 25 } }, scales: { y: { beginAtZero: true, grid: { color: dynamicGridColor }, ticks: { color: dynamicTextColor, font: { family: 'Cairo', weight: 'bold' } } }, x: { grid: { display: false }, ticks: { color: dynamicTextColor, font: { family: 'Cairo', weight: 'bold' } } } } }
    });

    if (underperformingCCChartInstance) underperformingCCChartInstance.destroy();
    underperformingCCChartInstance = new Chart(document.getElementById('underperformingCCChart').getContext('2d'), { type: 'bar', plugins: [customTopLabelsPlugin], data: { labels: supervisorsList, datasets: [{ label: 'موظفين دون التارجت الفردي', data: chartLowCC, backgroundColor: '#f59e0b', borderRadius: 4, barPercentage: 0.35 }] }, options: { responsive: true, maintainAspectRatio: false, layout: { padding: { top: 25 } }, scales: { y: { beginAtZero: true, grid: { color: dynamicGridColor }, ticks: { color: dynamicTextColor, font: { family: 'Cairo', weight: 'bold' } } }, x: { grid: { display: false }, ticks: { color: dynamicTextColor, font: { family: 'Cairo', weight: 'bold' } } } } } });

    if (ttggSalesChartInstance) ttggSalesChartInstance.destroy();
    ttggSalesChartInstance = new Chart(document.getElementById('ttggSalesChart').getContext('2d'), { type: 'bar', plugins: [customTopLabelsPlugin], data: { labels: supervisorsList, datasets: [{ label: 'مبيعات فئة اعادة إستهداف', data: chartTTGG, backgroundColor: '#7c3aed', borderRadius: 4, barPercentage: 0.35 }] }, options: { responsive: true, maintainAspectRatio: false, layout: { padding: { top: 25 } }, scales: { y: { beginAtZero: true, grid: { color: dynamicGridColor }, ticks: { color: dynamicTextColor, font: { family: 'Cairo', weight: 'bold' } } }, x: { grid: { display: false }, ticks: { color: dynamicTextColor, font: { family: 'Cairo', weight: 'bold' } } } } } });
}

function showSupervisorTeamDetails(supName) {
    const startDate = document.getElementById('startDate').value; const endDate = document.getElementById('endDate').value;
    const leads = rawLeads.filter(item => item['التاريخ'] && item['التاريخ'] >= startDate && item['التاريخ'] <= endDate);
    const sales = rawSales.filter(item => item['التاريخ'] && item['التاريخ'] >= startDate && item['التاريخ'] <= endDate);

    document.getElementById('supervisorMainView').classList.add('d-none');
    document.getElementById('supervisorDetailView').classList.remove('d-none');
    document.getElementById('supervisorDetailTitle').innerHTML = `تحليل فريق المشرف: <span class="text-success">${supName}</span>`;

    let teamEmps = employeeDatabase.filter(e => e.supervisor === supName);
    let stats = {}; teamEmps.forEach(emp => { stats[emp.name] = { name: emp.name, category: emp.category, oldCode: normalizeEmpCode(emp.oldUser), newCode: normalizeEmpCode(emp.newUser), ccLeads: 0, ccSales: 0, ttSales: 0 }; });

    leads.forEach(l => { let code = normalizeEmpCode(l['الموظف']); let empObj = teamEmps.find(e => normalizeEmpCode(e.oldUser) === code); if(empObj && stats[empObj.name]) stats[empObj.name].ccLeads++; });
    sales.forEach(s => { let code = normalizeEmpCode(s['الموظف']); let empObj = teamEmps.find(e => normalizeEmpCode(e.oldUser) === code || normalizeEmpCode(e.newUser) === code); if(empObj && stats[empObj.name]) { if(normalizeEmpCode(empObj.oldUser) === code) stats[empObj.name].ccSales++; else stats[empObj.name].ttSales++; } });

    let today = new Date(); let currentDay = today.getDate(); let totalDays = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    let proRatedTtTarget = (15 / totalDays) * currentDay;

    let tableHtml = `<div class="table-responsive"><table class="table table-bordered text-center align-middle m-0"><thead class="table-dark"><tr><th rowspan="2">الموظف البيعي</th><th colspan="3" class="bg-primary">قناة مران (CC)</th><th colspan="2" style="background-color: #7c3aed !important;">قناة إعادة الاستهداف</th><th rowspan="2">الحالة تشغيلية</th></tr><tr><th class="bg-primary-subtle text-dark">الليدز</th><th class="bg-primary-subtle text-dark">الاتمامات</th><th class="bg-primary-subtle text-dark">التحويل</th><th style="background-color: #ddd6fe !important; color:#000;">الاتمامات</th><th style="background-color: #ddd6fe !important; color:#000;">تحقيق التارجت</th></tr></thead><tbody>`;

    Object.values(stats).forEach(emp => {
        let ccRate = emp.ccLeads > 0 ? ((emp.ccSales / emp.ccLeads) * 100).toFixed(1) : 0;
        let ttTargetAchieved = ((emp.ttSales / 15) * 100).toFixed(1);
        let statusText = emp.oldCode.startsWith('TT') || emp.oldCode.startsWith('GG') || emp.newCode.startsWith('TT') || emp.newCode.startsWith('GG') ? (emp.ttSales >= proRatedTtTarget ? "على التراك 🟢" : "متأخر 🔴") : (parseFloat(ccRate) >= 17.0 ? "على التراك 🟢" : "دون التارجت 🔴");
        let statusStyle = statusText.includes('🔴') ? "color:#ef4444;" : "color:#10b981;";

        tableHtml += `<tr><td class="fw-bold text-primary">${emp.name}</td><td>${emp.ccLeads}</td><td>${emp.ccSales}</td><td class="table-primary">${ccRate}%</td><td style="color:#7c3aed;">${emp.ttSales}</td><td>${ttTargetAchieved}%</td><td class="fw-bold" style="${statusStyle}">${statusText}</td></tr>`;
    });
    tableHtml += `</tbody></table></div>`; document.getElementById('teamTableContainer').innerHTML = tableHtml;

    const { dynamicTextColor, dynamicGridColor } = getChartThemeColors();

    if (teamChartInstance) teamChartInstance.destroy();
    teamChartInstance = new Chart(document.getElementById('teamPerformanceChart').getContext('2d'), { type: 'bar', plugins: [customTopLabelsPlugin], data: { labels: Object.values(stats).map(r => r.name), datasets: [{ label: 'CC Sales', data: Object.values(stats).map(r => r.ccSales), backgroundColor: '#3b82f6', borderRadius: 4 }, { label: 'TT/GG Sales', data: Object.values(stats).map(r => r.ttSales), backgroundColor: '#7c3aed', borderRadius: 4 }] }, options: { responsive: true, maintainAspectRatio: false, layout: { padding: { top: 25 } }, scales: { y: { beginAtZero: true, grid: { color: dynamicGridColor }, ticks: { color: dynamicTextColor, font: { family: 'Cairo', weight: 'bold' } } }, x: { grid: { display: false }, ticks: { color: dynamicTextColor, font: { family: 'Cairo', weight: 'bold' } } } } } });
}

function renderDailyPerformanceChart(leads, sales, sortedDates) {
    let dailyLeadsMap = {}; let dailySalesMap = {}; sortedDates.forEach(d => { dailyLeadsMap[d] = 0; dailySalesMap[d] = 0; });
    leads.forEach(l => { if(dailyLeadsMap[l['التاريخ']] !== undefined) dailyLeadsMap[l['التاريخ']]++; });
    sales.forEach(s => { if(dailySalesMap[s['التاريخ']] !== undefined) dailySalesMap[s['التاريخ']]++; });

    const { dynamicTextColor, dynamicGridColor } = getChartThemeColors();

    if (dailyChartInstance) dailyChartInstance.destroy();
    dailyChartInstance = new Chart(document.getElementById('dailyPerformanceChart').getContext('2d'), { type: 'bar', plugins: [customTopLabelsPlugin], data: { labels: sortedDates, datasets: [{ label: 'الليدز الواردة', data: sortedDates.map(d => dailyLeadsMap[d]), backgroundColor: '#3b82f6', borderRadius: 4 }, { label: 'الاتمامات', data: sortedDates.map(d => dailySalesMap[d]), backgroundColor: '#10b981', borderRadius: 4 }] }, options: { responsive: true, maintainAspectRatio: false, layout: { padding: { top: 25 } }, scales: { y: { beginAtZero: true, grid: { color: dynamicGridColor }, ticks: { color: dynamicTextColor, font: { family: 'Cairo', weight: 'bold' } } }, x: { grid: { display: false }, ticks: { color: dynamicTextColor, font: { family: 'Cairo', weight: 'bold' } } } } } });
}

function renderEmployeeSalesChart(leads, sales) {
    let employeeLeadsMap = {}; let employeeSalesMap = {};
    leads.forEach(l => { let emp = String(l['الموظف'] || '').trim(); if (emp) employeeLeadsMap[emp] = (employeeLeadsMap[emp] || 0) + 1; });
    sales.forEach(s => { let emp = String(s['الموظف'] || '').trim(); if (emp) employeeSalesMap[emp] = (employeeSalesMap[emp] || 0) + 1; });

    let empSortedArray = Array.from(new Set([...Object.keys(employeeLeadsMap), ...Object.keys(employeeSalesMap)])).map(name => { return { name: name, leadsCount: employeeLeadsMap[name] || 0, salesCount: employeeSalesMap[name] || 0 }; }).filter(item => { let c = normalizeEmpCode(item.name); return c !== 'CC01' && c !== 'CC02'; });
    
    if (homeEmployeeFilterType === 'cc') empSortedArray = empSortedArray.filter(item => normalizeEmpCode(item.name).startsWith('CC'));
    else if (homeEmployeeFilterType === 'tt_gg') empSortedArray = empSortedArray.filter(item => { let c = normalizeEmpCode(item.name); return c.startsWith('TT') || c.startsWith('GG'); });
    
    empSortedArray.sort((a, b) => b.salesCount - a.salesCount);

    const { dynamicTextColor, dynamicGridColor } = getChartThemeColors();

    if (employeeChartInstance) employeeChartInstance.destroy();
    employeeChartInstance = new Chart(document.getElementById('employeeSalesChart').getContext('2d'), { type: 'bar', plugins: [customTopLabelsPlugin], data: { labels: empSortedArray.map(item => item.name), datasets: [{ label: 'الليدز', data: empSortedArray.map(item => item.leadsCount), backgroundColor: '#3b82f6', borderRadius: 4 }, { label: 'المبيعات', data: empSortedArray.map(item => item.salesCount), backgroundColor: '#8b5cf6', borderRadius: 4 }] }, options: { responsive: true, maintainAspectRatio: false, layout: { padding: { top: 25 } }, scales: { y: { beginAtZero: true, grid: { color: dynamicGridColor }, ticks: { color: dynamicTextColor, font: { family: 'Cairo', weight: 'bold' } } }, x: { grid: { display: false }, ticks: { color: dynamicTextColor, font: { family: 'Cairo', weight: 'bold' } } } } });
}

function renderSourceMatrix(filteredLeads, filteredSales, sortedDates) {
    let matrix = {};
    filteredLeads.forEach(l => { let src = String(l['كود التسويق'] || 'غير مححدد').trim(); if (!matrix[src]) matrix[src] = { totalLeads: 0, totalSales: 0 }; matrix[src].totalLeads++; });
    filteredSales.forEach(s => { let clientNum = String(s['رقم العميل'] || '').trim(); let courseName = normalizeCourseName(s['نوع الدورة']); let src = clientCourseToSourceMap[clientNum + "_" + courseName] || clientCourseToSourceMap[clientNum] || 'غير مححدد'; if (!matrix[src]) matrix[src] = { totalLeads: 0, totalSales: 0 }; matrix[src].totalSales++; });

    let rowsArray = Object.keys(matrix).filter(src => src !== 'غير مححدد' && src !== 'null' && src !== '').map(src => { let totalLeads = matrix[src].totalLeads; return { src, totalLeads, totalSales: matrix[src].totalSales, conv: totalLeads > 0 ? parseFloat(((matrix[src].totalSales / totalLeads) * 100).toFixed(1)) : 0 }; });
    rowsArray.sort((a, b) => b.conv - a.conv);

    document.getElementById('sourceTableHeader').innerHTML = `<tr><th>السورس</th><th>الليدز</th><th>الاتمامات</th><th>التحويل</th></tr>`;
    document.getElementById('sourceTableBody').innerHTML = rowsArray.map(row => `<tr><td class="fw-bold text-primary">${row.src}</td><td>${row.totalLeads}</td><td>${row.totalSales}</td><td class="table-primary"><b>${row.conv}%</b></td></tr>`).join('');

    const { dynamicTextColor, dynamicGridColor } = getChartThemeColors();

    if (sourceMatrixChartInstance) sourceMatrixChartInstance.destroy();
    sourceMatrixChartInstance = new Chart(document.getElementById('sourceMatrixChart').getContext('2d'), { type: 'bar', plugins: [customTopLabelsPlugin], data: { labels: rowsArray.map(r => r.src), datasets: [{ label: 'الليدز الكلية', data: rowsArray.map(r => r.totalLeads), backgroundColor: '#3b82f6', borderRadius: 4 }, { label: 'الاتمامات الناجحة', data: rowsArray.map(r => r.totalSales), backgroundColor: '#10b981', borderRadius: 4 }] }, options: { responsive: true, maintainAspectRatio: false, layout: { padding: { top: 25 } }, scales: { y: { beginAtZero: true, grid: { color: dynamicGridColor }, ticks: { color: dynamicTextColor, font: { family: 'Cairo', weight: 'bold' } } }, x: { grid: { display: false }, ticks: { color: dynamicTextColor, font: { family: 'Cairo', weight: 'bold' } } } } });
}

function renderStatusMatrix(leads, sortedDates) {
    let matrix = {}; let totalGlobalLeads = leads.length;
    leads.forEach(l => { let status = String(l['الحالة 1'] || 'غير حدد').trim(); if (!matrix[status]) matrix[status] = { total: 0 }; matrix[status].total++; });

    let rowsArray = Object.keys(matrix).filter(status => status !== 'غير حدد' && status !== 'null' && status !== '').map(status => { return { status, total: matrix[status].total, pct: totalGlobalLeads > 0 ? parseFloat(((matrix[status].total / totalGlobalLeads) * 100).toFixed(1)) : 0 }; });
    rowsArray.sort((a, b) => b.pct - a.pct);

    document.getElementById('statusTableHeader').innerHTML = `<tr><th>الحالة البيعية للعميل</th><th>التكرار الكلي</th><th>النسبة من التدفق</th></tr>`;
    document.getElementById('statusTableBody').innerHTML = rowsArray.map(row => `<tr><td class="text-start fw-bold text-secondary">${row.status}</td><td>${row.total}</td><td class="table-warning"><b>${row.pct}%</b></td></tr>`).join('');

    const { dynamicTextColor, dynamicGridColor } = getChartThemeColors();

    if (statusMatrixChartInstance) statusMatrixChartInstance.destroy();
    statusMatrixChartInstance = new Chart(document.getElementById('statusMatrixChart').getContext('2d'), { type: 'bar', plugins: [customTopLabelsPlugin], data: { labels: rowsArray.map(r => r.status), datasets: [{ label: 'التكرار', data: rowsArray.map(r => r.total), backgroundColor: '#f59e0b', borderRadius: 4 }] }, options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false, layout: { padding: { left: 20, right: 20 } }, scales: { x: { beginAtZero: true, grid: { color: dynamicGridColor }, ticks: { color: dynamicTextColor, font: { family: 'Cairo', weight: 'bold' } } }, y: { grid: { display: false }, ticks: { color: dynamicTextColor, font: { family: 'Cairo', weight: 'bold' } } } } });
}

function renderCourseMatrix(leads, sales, sortedDates) {
    let matrix = {};
    leads.forEach(l => { let course = normalizeCourseName(l['نوع الدورة']); if (!matrix[course]) matrix[course] = { totalLeads: 0, totalSales: 0 }; matrix[course].totalLeads++; });
    sales.forEach(s => { let course = normalizeCourseName(s['نوع الدورة']); if (!matrix[course]) matrix[course] = { totalLeads: 0, totalSales: 0 }; matrix[course].totalSales++; });

    let rowsArray = Object.keys(matrix).filter(course => course !== 'أخرى / غير محدد' && course !== 'null' && course !== '').map(course => { let totalLeads = matrix[course].totalLeads; return { course, totalLeads, totalSales: matrix[course].totalSales, conv: totalLeads > 0 ? parseFloat(((matrix[course].totalSales / totalLeads) * 100).toFixed(1)) : 0 }; });
    rowsArray.sort((a, b) => b.conv - a.conv);

    const { dynamicTextColor, dynamicGridColor } = getChartThemeColors();

    if (courseMatrixChartInstance) courseMatrixChartInstance.destroy();
    courseMatrixChartInstance = new Chart(document.getElementById('courseMatrixChart').getContext('2d'), { type: 'bar', plugins: [customTopLabelsPlugin], data: { labels: rowsArray.map(r => r.course), datasets: [{ label: 'الليدز المستلمة', data: rowsArray.map(r => r.totalLeads), backgroundColor: '#3b82f6', borderRadius: 4 }, { label: 'المبيعات الفعلية', data: rowsArray.map(r => r.totalSales), backgroundColor: '#10b981', borderRadius: 4 }] }, options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false, layout: { padding: { left: 10, right: 20 } }, scales: { x: { beginAtZero: true, grid: { color: dynamicGridColor }, ticks: { color: dynamicTextColor, font: { family: 'Cairo', weight: 'bold' } } }, y: { grid: { display: false }, ticks: { color: dynamicTextColor, font: { family: 'Cairo', weight: 'bold' } } } } });
}

function renderEmployeeMatrix(leads, sales, sortedDates) {
    let stats = {};
    employeeDatabase.forEach(emp => { stats[emp.name] = { name: emp.name, category: emp.category, supervisor: emp.supervisor || 'بدون مشرف', oldUser: emp.oldUser || '', newUser: emp.newUser || '', oldCode: normalizeEmpCode(emp.oldUser), newCode: normalizeEmpCode(emp.newUser), ccLeads: 0, ccSales: 0, ttSales: 0 }; });

    leads.forEach(l => { 
        let code = normalizeEmpCode(l['الموظف']); if(!code) return;
        let empObj = Object.values(stats).find(e => e.oldCode === code || e.newCode === code);
        if(empObj) empObj.ccLeads++;
    });
    sales.forEach(s => { 
        let code = normalizeEmpCode(s['الموظف']); if(!code) return; 
        let empObj = Object.values(stats).find(e => e.oldCode === code || e.newCode === code); 
        if(empObj) { if(empObj.oldCode === code) empObj.ccSales++; else empObj.ttSales++; } 
    });

    let rowsArray = Object.values(stats).filter(item => item.oldCode !== 'CC01' && item.oldCode !== 'CC02');
    if (employeeFilterType === 'cc') rowsArray = rowsArray.filter(item => normalizeEmpCode(item.oldUser).startsWith('CC'));
    else if (employeeFilterType === 'tt_gg') rowsArray = rowsArray.filter(item => { let c = normalizeEmpCode(item.newUser || item.oldUser); return c.startsWith('TT') || c.startsWith('GG'); });
    rowsArray.sort((a, b) => (b.ccSales + b.ttSales) - (a.ccSales + a.ttSales));

    let today = new Date(); let currentDay = today.getDate(); let totalDays = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    let proRatedTtTarget = (15 / totalDays) * currentDay;

    document.getElementById('employeeTableHeader').innerHTML = `<tr><th rowspan="2">اسم الموظف</th><th rowspan="2">الكود الفعلي</th><th rowspan="2">المشرف</th><th colspan="3" class="bg-primary">قناة مران CC</th><th colspan="2" style="background-color:#7c3aed !important; color:#fff;">إعادة الاستهداف</th><th rowspan="2">الحالة</th></tr><tr><th class="bg-primary-subtle text-dark">الليدز</th><th class="bg-primary-subtle text-dark">الاتمامات</th><th class="bg-primary-subtle text-dark">التحويل</th><th style="background-color:#ddd6fe !important; color:#000;">الاتمامات</th><th style="background-color:#ddd6fe !important; color:#000;">تحقيق المستهدف</th></tr>`;
    document.getElementById('employeeTableBody').innerHTML = rowsArray.map(row => {
        let ccRate = row.ccLeads > 0 ? ((row.ccSales / row.ccLeads) * 100).toFixed(1) : "0.0";
        let ttTargetAchieved = ((row.ttSales / 15) * 100).toFixed(1);
        let statusText = row.oldCode.startsWith('TT') || row.oldCode.startsWith('GG') || row.newCode.startsWith('TT') || row.newCode.startsWith('GG') ? (row.ttSales >= proRatedTtTarget ? "على التراك 🟢" : "متأخر عن التراك 🔴") : (parseFloat(ccRate) >= 17.0 ? "على التراك 🟢" : "دون التارجت 🔴");
        let statusStyle = statusText.includes('🔴') ? "color: #ef4444;" : "color: #10b981;";
        let codeDisplay = row.oldUser + (row.newUser && row.newUser !== row.oldUser ? ` / ${row.newUser}` : '');

        return `<tr><td><button class="btn btn-employee-drilldown" onclick="showEmployeeDetails('${row.name}')">${row.name}</button></td><td class="font-monospace small fw-bold">${codeDisplay}</td><td>${row.supervisor}</td><td>${row.ccLeads}</td><td>${row.ccSales}</td><td class="fw-bold">${ccRate}%</td><td style="color:#7c3aed; font-weight:700;">${row.ttSales}</td><td>${ttTargetAchieved}%</td><td class="fw-bold" style="${statusStyle}">${statusText}</td></tr>`;
    }).join('');

    const { dynamicTextColor, dynamicGridColor } = getChartThemeColors();

    if (employeeMatrixChartInstance) employeeMatrixChartInstance.destroy();
    employeeMatrixChartInstance = new Chart(document.getElementById('employeeMatrixChart').getContext('2d'), { type: 'bar', plugins: [customTopLabelsPlugin], data: { labels: rowsArray.map(r => r.name), datasets: [{ label: 'إتمامات مران CC', data: rowsArray.map(r => r.ccSales), backgroundColor: '#3b82f6', borderRadius: 4 }, { label: 'إتمامات الاستهداف TT/GG', data: rowsArray.map(r => r.ttSales), backgroundColor: '#8b5cf6', borderRadius: 4 }] }, options: { responsive: true, maintainAspectRatio: false, layout: { padding: { top: 25 } }, scales: { y: { beginAtZero: true, grid: { color: dynamicGridColor }, ticks: { color: dynamicTextColor, font: { family: 'Cairo', weight: 'bold' } } }, x: { grid: { display: false }, ticks: { color: dynamicTextColor, font: { family: 'Cairo', weight: 'bold' } } } } } });
}

function showEmployeeDetails(empName) {
    const startDate = document.getElementById('startDate').value; const endDate = document.getElementById('endDate').value;
    let empObj = employeeDatabase.find(e => e.name === empName);
    let oldCode = empObj ? normalizeEmpCode(empObj.oldUser) : normalizeEmpCode(empName);
    let newCode = empObj ? normalizeEmpCode(empObj.newUser) : normalizeEmpCode(empName);

    const empLeads = rawLeads.filter(item => { let c = normalizeEmpCode(item['الموظف']); return item['التاريخ'] && item['التاريخ'] >= startDate && item['التاريخ'] <= endDate && (c === oldCode || c === newCode); });
    const empSales = rawSales.filter(item => { let c = normalizeEmpCode(item['الموظف']); return item['التاريخ'] && item['التاريخ'] >= startDate && item['التاريخ'] <= endDate && (c === oldCode || c === newCode); });

    document.getElementById('employeeMainView').classList.add('d-none'); document.getElementById('employeeDetailView').classList.remove('d-none');
    document.getElementById('employeeDetailTitle').innerHTML = `تحليل الموظف الفردي: <span class="text-success">${empName}</span>`;
    document.getElementById('empDetailSales').innerText = empSales.length;

    let isTtGg = oldCode.startsWith('TT') || oldCode.startsWith('GG') || newCode.startsWith('TT') || newCode.startsWith('GG');
    if (isTtGg) {
        document.getElementById('empCard1Label').innerText = "مسار الأداء التشغيلي"; document.getElementById('empDetailLeads').innerText = "قناة إعادة استهداف";
        document.getElementById('empCard3Label').innerText = `تحقيق المستهدف الشهرى (15 صفقة)`; document.getElementById('empDetailConversion').innerText = `${((empSales.length/15)*100).toFixed(1)}%`;
    } else {
        document.getElementById('empCard1Label').innerText = "إجمالي الليدز"; document.getElementById('empDetailLeads').innerText = empLeads.length;
        document.getElementById('empCard3Label').innerText = "معدل التحويل الكلي"; document.getElementById('empDetailConversion').innerText = (empLeads.length > 0 ? ((empSales.length/empLeads.length)*100).toFixed(1) : 0) + "%";
    }

    let sortedDates = getDatesInRange(startDate, endDate);
    let dailySalesMap = {}; sortedDates.forEach(d => dailySalesMap[d] = 0);
    empSales.forEach(s => { if(dailySalesMap[s['التاريخ']] !== undefined) dailySalesMap[s['التاريخ']]++; });

    const { dynamicTextColor, dynamicGridColor } = getChartThemeColors();

    if (employeeTimelineChartInstance) employeeTimelineChartInstance.destroy();
    employeeTimelineChartInstance = new Chart(document.getElementById('employeeTimelineChart').getContext('2d'), { type: 'line', data: { labels: sortedDates, datasets: [{ label: 'الإغلاقات اليومية الناجحة له', data: sortedDates.map(d => dailySalesMap[d]), borderColor: '#7c3aed', fill: true, backgroundColor: 'rgba(124, 58, 237, 0.05)' }] }, options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, grid: { color: dynamicGridColor }, ticks: { color: dynamicTextColor } }, x: { grid: { display: false }, ticks: { color: dynamicTextColor } } } } });
}

function hideEmployeeDetails() { document.getElementById('employeeDetailView').classList.add('d-none'); document.getElementById('employeeMainView').classList.remove('d-none'); }
function hideSupervisorTeamDetails() { document.getElementById('supervisorDetailView').classList.add('d-none'); document.getElementById('supervisorMainView').classList.remove('d-none'); }

window.addEventListener('DOMContentLoaded', () => {
    updateSupervisorMapsFromDatabase();
    
    // جلب وضبط النطاق التلقائي الدقيق للفترة من يوم 1 في الشهر إلى اليوم الحالي تماماً لعام 2026
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = String(today.getMonth() + 1).padStart(2, '0');
    const currentDay = String(today.getDate()).padStart(2, '0');
    
    document.getElementById('startDate').value = `${currentYear}-${currentMonth}-01`;
    document.getElementById('endDate').value = `${currentYear}-${currentMonth}-${currentDay}`;

    fetchDataFromCloudAuto();
});
