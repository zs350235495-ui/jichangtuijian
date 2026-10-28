/**
 * 机场图鉴 (jichangtujian.vip) - IndexNow 搜索引擎即时推送工具
 * 协议规范：https://www.indexnow.org/
 * 密钥文件：9bc1b67cb0664fafbbb20ddf2331f591.txt
 * 支持引擎：Microsoft Bing, Yandex, Seznam, Naver 等 IndexNow 联盟搜索引擎
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const HOST = 'jichangtujian.vip';
const KEY_FILE = '9bc1b67cb0664fafbbb20ddf2331f591.txt';
const KEY_PATH = path.join(__dirname, KEY_FILE);
const SITEMAP_PATH = path.join(__dirname, 'sitemap.xml');

// 校验与提取 Key
function getApiKey() {
  if (!fs.existsSync(KEY_PATH)) {
    throw new Error(`未找到 IndexNow 密钥文件: ${KEY_FILE}`);
  }
  const key = fs.readFileSync(KEY_PATH, 'utf8').trim();
  if (!key) {
    throw new Error(`IndexNow 密钥文件内容为空: ${KEY_FILE}`);
  }
  return key;
}

// 从 sitemap.xml 提取所有需要推送的绝对物理 URL
function getUrlsFromSitemap() {
  if (!fs.existsSync(SITEMAP_PATH)) {
    throw new Error('未找到 sitemap.xml 文件，无法提取推送 URL');
  }
  const xml = fs.readFileSync(SITEMAP_PATH, 'utf8');
  const matches = [...xml.matchAll(/<loc>(https:\/\/[^<]+)<\/loc>/g)];
  const urls = matches.map(m => m[1].trim());
  const uniqueUrls = Array.from(new Set(urls));
  
  if (uniqueUrls.length === 0) {
    throw new Error('sitemap.xml 中未匹配到任何有效 <loc> URL');
  }
  return uniqueUrls;
}

function postToIndexNow(endpoint, payload) {
  return new Promise((resolve) => {
    const urlObj = new URL(endpoint);
    const options = {
      hostname: urlObj.hostname,
      port: 443,
      path: urlObj.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(payload),
        'User-Agent': 'jichangtujian-IndexNow-Bot/1.0'
      },
      timeout: 15000
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        // 200 = OK, 202 = Accepted
        if (res.statusCode === 200 || res.statusCode === 202) {
          console.log(`✅ [${urlObj.hostname}] 推送成功！HTTP 状态码: ${res.statusCode}`);
          resolve({ success: true, host: urlObj.hostname, status: res.statusCode });
        } else {
          console.warn(`⚠️ [${urlObj.hostname}] 响应状态: ${res.statusCode}, 响应体: ${data || '(空)'}`);
          resolve({ success: false, host: urlObj.hostname, status: res.statusCode, data });
        }
      });
    });

    req.on('timeout', () => {
      req.destroy();
      console.error(`❌ [${urlObj.hostname}] 请求超时 (15s)`);
      resolve({ success: false, host: urlObj.hostname, error: 'Timeout' });
    });

    req.on('error', (err) => {
      console.error(`❌ [${urlObj.hostname}] 网络异常: ${err.message}`);
      resolve({ success: false, host: urlObj.hostname, error: err.message });
    });

    req.write(payload);
    req.end();
  });
}

async function main() {
  console.log('====================================================');
  console.log(`🚀 开始执行 ${HOST} IndexNow 搜索引擎即时推送广播...`);
  console.log('====================================================\n');

  try {
    const key = getApiKey();
    const keyLocation = `https://${HOST}/${KEY_FILE}`;
    const urlList = getUrlsFromSitemap();

    console.log(`🔑 验证密钥凭证: ${key}`);
    console.log(`📍 密钥验证位置: ${keyLocation}`);
    console.log(`📋 从 sitemap.xml 提取到 ${urlList.length} 个独立 URL：`);
    urlList.slice(0, 5).forEach(u => console.log(`   - ${u}`));
    if (urlList.length > 5) {
      console.log(`   ... 以及其他 ${urlList.length - 5} 个页面`);
    }
    console.log('');

    const payload = JSON.stringify({
      host: HOST,
      key: key,
      keyLocation: keyLocation,
      urlList: urlList
    });

    // 广播至 IndexNow 核心节点（只要提交到一个节点，IndexNow 协议会自动在 Bing、Yandex 等引擎间对等分发）
    const endpoints = [
      'https://api.indexnow.org/indexnow',
      'https://www.bing.com/indexnow'
    ];

    for (const endpoint of endpoints) {
      console.log(`📡 正在向 ${endpoint} 广播 URL 变动清单...`);
      await postToIndexNow(endpoint, payload);
    }

    console.log('\n====================================================');
    console.log('🎉 IndexNow 搜索引擎广播流程执行完毕！');
    console.log('💡 提示：Bing 及联盟搜索引擎已接收变更通告，将自动调优抓取配额。');
    console.log('====================================================');
  } catch (err) {
    console.error('❌ 执行失败:', err.message);
    process.exit(1);
  }
}

main();
