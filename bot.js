import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { createClient } from '@supabase/supabase-js';

// Conexão com o banco
const supabase = createClient(
  'https://tiarimiqqqakaagodlou.supabase.co', 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpYXJpbWlxcXFha2FhZ29kbG91Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4NTkzNTMsImV4cCI6MjA4OTQzNTM1M30.Nw00AN47e8p-8ioEuajuHLDw0xbN2B0SUep9WFoMrSI'
);

// 1. A Função "Caçadora" (Agora lida com os cookies!)
async function capturarDadosDaPagina(browser, url) {
  const page = await browser.newPage();
  
  // 🎧 TRUQUE DE MESTRE: Ouve o que o navegador está pensando e joga no terminal
  page.on('console', msg => console.log('💻 [Navegador]:', msg.text()));

  await page.setViewport({ width: 1280, height: 800 });
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');

  try {
    console.log(`🔎 Analisando: ${url}`);
    
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

    // 🍪 Lógica do pop-up
    try {
      const cookieButton = await page.waitForSelector('.adopt-accept-all-button', { timeout: 5000 });
      if (cookieButton) {
        await page.click('.adopt-accept-all-button');
        await new Promise(r => setTimeout(r, 1000));
      }
    } catch (e) {
      // Ignora se não aparecer
    }

    // ⏳ Aguarda explicitamente os títulos H2 aparecerem na tela (Garante que carregou)
    try {
      await page.waitForSelector('h2', { timeout: 15000 });
      console.log('✅ Títulos H2 encontrados na página!');
    } catch (e) {
      console.log('⚠️ Demorou muito para carregar os carros ou o site bloqueou.');
    }

    const anuncios = await page.evaluate(() => {
      console.log("Iniciando extração de dados...");
      const results = [];
      
      // 1. Pega TODOS os títulos H2 da página
      const titulos = document.querySelectorAll('h2');
      console.log(`Achei ${titulos.length} tags H2.`);
      
      titulos.forEach(h2 => {
        // 2. A partir do título, sobe na árvore do HTML para achar a "caixa" do anúncio (section ou li)
        const card = h2.closest('section') || h2.closest('li');
        
        if (card) {
          const title = h2.innerText;
          const textContent = card.innerText || '';
          
          // Busca o preço no texto da caixa
          const priceMatch = textContent.match(/R\$\s?([\d\.]+)/);
          
          // Pega o link e a imagem que estão DENTRO dessa caixa
          const linkEl = card.querySelector('a');
          const imgEl = card.querySelector('img');

          if (priceMatch && linkEl && title) {
            const priceText = priceMatch[1];
            const cleanPrice = parseFloat(priceText.replace(/\./g, ''));
            
            // Filtro anti-lixo (só carros acima de 1000 reais)
            if (cleanPrice > 1000) {
              results.push({
                model: title,
                price: cleanPrice,
                source_url: linkEl.href,
                image_url: imgEl ? imgEl.src : 'https://via.placeholder.com/300x200?text=Sem+Foto',
                year: 1990 
              });
            }
          }
        }
      });
      
      console.log(`Extração concluída. Carros válidos: ${results.length}`);
      return results;
    });

    return anuncios;
  } catch (err) {
    console.error(`❌ Erro em ${url}:`, err.message);
    return [];
  } finally {
    await page.close();
  }
}

// 2. A Função "Chefe" (Gerencia a lista, o ROI e o Supabase)
async function main() {
  // Mantive headless: false para você ver o robô trabalhando!
  const browser = await puppeteer.launch({ headless: false });
  const modelosParaBuscar = ['santana-quadrado', 'monza-tubarao', 'kadett', 'opala', 'voyage-quadrado-1.8'];
  
  for (const modelo of modelosParaBuscar) {
    const url = `https://www.olx.com.br/autos-e-pecas/carros-vans-e-utilitarios/estado-rj?q=${modelo}&pe=15000`;
    
    // Chama a caçadora
    const anuncios = await capturarDadosDaPagina(browser, url);
    console.log(`📊 Encontrados ${anuncios.length} anúncios para esta busca.`);

    if (anuncios.length === 0) {
      console.log("⚠️ Nenhum anúncio encontrado. O seletor pode estar desatualizado.");
    }

    // Processa o ROI e salva no banco
    for (const carro of anuncios) {
      const precoVendaEstimado = 22000;
      const custoRestauro = 3000;
      
      const roi = Math.round(((precoVendaEstimado - (carro.price + custoRestauro)) / (carro.price + custoRestauro)) * 100);

      const { error } = await supabase.from('cars').upsert({
        ...carro,
        roi,
        status: 'novo'
      }, { onConflict: 'source_url' });

      if (error) console.error("Erro no Supabase:", error.message);
    }
  }

  console.log("🏁 Caçada finalizada com sucesso!");
  await browser.close();
}

// 3. VIRA A CHAVE! Inicia o processo
main();