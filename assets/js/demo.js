const cases = [
  {
    title: 'DLBCL Prognostic Risk Model',
    titleZh: 'DLBCL 预后风险模型',
    desc: 'A 63-gene LASSO-Cox model for stratifying patients by survival risk.',
    descZh: '基于 63 基因 LASSO-Cox 模型对患者进行生存风险分层。',
    context: 'Using gene-expression profiles and follow-up data from 420 DLBCL patients, this analysis builds and validates a prognostic model independent of age, stage, LDH, and ECOG status.',
    contextZh: '利用 420 例 DLBCL 患者的基因表达谱与随访数据,本分析构建并验证了一个独立于年龄、分期、LDH 与 ECOG 状态的预后模型。',
    result: 'High- and low-risk groups differ significantly (P=1.18e-31); adjusted HR=4.59; C-index improves from 0.731 to 0.862.',
    resultZh: '高、低风险组差异显著(P=1.18e-31);校正 HR=4.59;C-index 从 0.731 提升至 0.862。',
    video: 'assets/video/1-web.mp4',
    report: 'assets/reports/report-1.pdf'
  },
  {
    title: 'Single-Cell Hematopoietic Trajectory',
    titleZh: '单细胞造血分化轨迹',
    desc: 'Reconstructing differentiation paths from HSCs to mature blood cells.',
    descZh: '重建从造血干细胞到成熟血细胞的连续分化路径。',
    context: 'This task uses mouse bone-marrow single-cell RNA-seq data to reconstruct continuous differentiation trajectories, identify branch points, and find regulators of cell fate decisions.',
    contextZh: '本任务使用小鼠骨髓单细胞 RNA-seq 数据,重建连续分化轨迹、识别分支点,并寻找细胞命运决定的调控因子。',
    result: '8,399 cells; 6 differentiation paths; 4 branch points; 10,415 dynamic genes identified.',
    resultZh: '8,399 个细胞;6 条分化路径;4 个分支点;10,415 个动态基因。',
    video: 'assets/video/2-web.mp4',
    report: 'assets/reports/report-2.pdf'
  },
  {
    title: 'Protein-Protein Interaction Network',
    titleZh: '蛋白质互作网络',
    desc: 'Identifying core hub genes from ulcerative-colitis differential expression data.',
    descZh: '从溃疡性结肠炎差异表达数据中识别核心 hub 基因。',
    context: 'Differentially expressed genes from GSE65114 are used to build a STRING protein-interaction network, followed by module analysis and topology-based hub-gene screening.',
    contextZh: '利用 GSE65114 的差异表达基因构建 STRING 蛋白质互作网络,随后进行模块分析与基于拓扑的 hub 基因筛选。',
    result: '299 DEGs; 224 nodes and 1,283 edges; 8 hub genes selected.',
    resultZh: '299 个 DEG;224 个节点、1,283 条边;筛选出 8 个 hub 基因。',
    video: 'assets/video/3-web.mp4',
    report: 'assets/reports/report-3.pdf'
  },
  {
    title: 'PBMC3k Clustering and Annotation',
    titleZh: 'PBMC3k 聚类与注释',
    desc: 'A complete single-cell workflow from quality control to immune-cell annotation.',
    descZh: '从质控到免疫细胞注释的完整单细胞流程。',
    context: 'Starting from the PBMC3k expression matrix, the workflow performs QC, normalization, highly variable gene selection, PCA, Louvain clustering, UMAP, and marker-based annotation.',
    contextZh: '从 PBMC3k 表达矩阵出发,流程依次完成质控、标准化、高变基因选择、PCA、Louvain 聚类、UMAP 与基于标志物的注释。',
    result: '2,643 cells retained; 10 clusters; 9 PBMC cell types annotated.',
    resultZh: '保留 2,643 个细胞;10 个簇;注释出 9 种 PBMC 细胞类型。',
    video: 'assets/video/4-web.mp4',
    report: 'assets/reports/report-4.pdf'
  },
  {
    title: 'Machine-Learning Biomarker Screening',
    titleZh: '机器学习生物标志物筛选',
    desc: 'Combining LASSO and SVM-RFE to identify HCM diagnostic biomarkers.',
    descZh: '结合 LASSO 与 SVM-RFE 识别 HCM 诊断标志物。',
    context: 'Differential expression and oxidative-stress gene sets are integrated with LASSO and SVM-RFE to identify stable diagnostic biomarkers for hypertrophic cardiomyopathy.',
    contextZh: '将差异表达与氧化应激基因集与 LASSO、SVM-RFE 相结合,识别肥厚型心肌病的稳定诊断标志物。',
    result: 'PRKCD, MGST1, and CA3 selected; corresponding AUC values are 0.981, 0.968, and 0.917.',
    resultZh: '选定 PRKCD、MGST1 与 CA3;对应 AUC 值分别为 0.981、0.968 与 0.917。',
    video: 'assets/video/5-web.mp4',
    report: 'assets/reports/report-5.pdf'
  }
];

const LANG_KEY = 'bioinfoysis-lang';

function getLang() {
  try { return localStorage.getItem(LANG_KEY) === 'zh' ? 'zh' : 'en'; } catch (err) { return 'en'; }
}
function isZh() { return getLang() === 'zh'; }
function pick(item, key) {
  const zhValue = item[key + 'Zh'];
  return isZh() && zhValue ? zhValue : item[key];
}

const grid = document.querySelector('#case-grid');
const dialog = document.querySelector('#case-dialog');
let current = 0;
let currentTab = 'context';

function renderGrid() {
  const zh = isZh();
  const caseLabel = zh ? '案例' : 'CASE';
  const bgLabel = zh ? '任务背景' : 'Task Background';
  const reportLabel = zh ? '浏览报告' : 'View Report';
  grid.innerHTML = cases.map((item, index) => `<article class="case-card"><video controls controlslist="nodownload noplaybackrate" disablepictureinpicture preload="metadata" playsinline oncontextmenu="return false" src="${item.video}"></video><div class="case-copy"><span class="case-index">${caseLabel} ${String(index + 1).padStart(2, '0')}</span><h2>${pick(item, 'title')}</h2><p>${pick(item, 'desc')}</p><div class="case-actions"><button class="primary-button" data-open="${index}">${bgLabel}</button><button class="secondary-button" data-open-report="${index}">${reportLabel}</button></div></div></article>`).join('');
}

const title = document.querySelector('#dialog-title');
const context = document.querySelector('#dialog-context');
const result = document.querySelector('#dialog-result');
const frame = document.querySelector('#report-frame');
const count = document.querySelector('#dialog-count');

function setTab(tabName) {
  currentTab = tabName;
  document.querySelectorAll('[data-tab]').forEach(button => button.classList.toggle('is-active', button.dataset.tab === tabName));
  document.querySelector('#context-panel').hidden = tabName !== 'context';
  document.querySelector('#report-panel').hidden = tabName !== 'report';
}

function openCase(index, tabName) {
  current = (index + cases.length) % cases.length;
  if (tabName) currentTab = tabName;
  const item = cases[current];
  document.querySelector('#dialog-kicker').textContent = `${isZh() ? '案例' : 'CASE'} ${String(current + 1).padStart(2, '0')}`;
  title.textContent = pick(item, 'title');
  context.textContent = pick(item, 'context');
  result.textContent = pick(item, 'result');
  frame.src = `${item.report}#toolbar=0&navpanes=0`;
  count.textContent = `${current + 1} / ${cases.length}`;
  setTab(currentTab);
  if (!dialog.open) dialog.showModal();
}

renderGrid();

grid.addEventListener('click', event => {
  const button = event.target.closest('[data-open], [data-open-report]');
  if (!button) return;
  const isReport = button.dataset.openReport !== undefined;
  openCase(Number(button.dataset.open ?? button.dataset.openReport), isReport ? 'report' : 'context');
});

document.querySelector('[data-close]').addEventListener('click', () => dialog.close());
document.querySelector('[data-prev]').addEventListener('click', () => openCase(current - 1));
document.querySelector('[data-next]').addEventListener('click', () => openCase(current + 1));
document.querySelectorAll('[data-tab]').forEach(button => button.addEventListener('click', () => setTab(button.dataset.tab)));
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });

let touchStartX = 0;
dialog.addEventListener('touchstart', event => { touchStartX = event.changedTouches[0].screenX; }, { passive: true });
dialog.addEventListener('touchend', event => {
  const delta = event.changedTouches[0].screenX - touchStartX;
  if (Math.abs(delta) > 55) openCase(current + (delta < 0 ? 1 : -1));
});

/* 语言切换:重新渲染案例卡片;若弹窗打开则同步刷新内容并保持当前标签页 */
window.addEventListener('langchange', () => {
  renderGrid();
  if (dialog.open) openCase(current, currentTab);
});
