## 🚗 Lasanha Tracker
 O Lasanha Tracker é uma ferramenta de curadoria inteligente para entusiastas de carros antigos (as famosas "lasanhas"). O projeto consiste em um web scraper que monitora anúncios da OLX em busca de oportunidades específicas, calcula o ROI (Retorno sobre Investimento) estimado para restauro e exibe tudo em uma interface moderna e fácil de usar.
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
## 🛠️ Tecnologias Utilizadas
O projeto foi construído utilizando uma stack moderna focada em performance e agilidade:
- FrontEnd: React.js + Vite
- Web Scraping: Puppeteer (com stealth-plugin para evitar bloqueios)
- Banco de Dados & Backend: Supabase (PostgreSQL + Real-time)
- Linguagem: JavaScript (ES6+)
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
## ✨ Funcionalidades
- Scraping Automatizado: Busca automática por modelos específicos (Santana, Monza, Kadett, Opala, Voyage).
- Cálculo de ROI: O bot estima a lucratividade básica baseada em preço de compra, custo médio de restauro e valor de revenda de mercado.
- Filtro Anti-Lixo: Filtra anúncios com valores irreais ou categorias erradas.
- Interface de Usuário:
 - Busca por modelo em tempo real.
 - Sistema de Favoritos persistente no banco de dados.
 - Badges indicativos de "Oportunidade" (ROI > 15%).
 - Link direto para o anúncio original.
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
## 🚀 Como Rodar Localmente
Siga os passos abaixo para colocar o caçador de lasanhas para funcionar na sua máquina.

1. Pré-requisitos
- Node.js instalado (Versão 18 ou superior).
- Uma conta no Supabase (ou usar as chaves já configuradas, se disponíveis).

2. Instalação
Clone o repositório e instale as dependências:
- git clone https://github.com/LucasKronemberger/Lasanha-Tracker.git
- cd Lasanha-Tracker
- npm install

3. Configuração do Banco (Supabase)
No seu projeto Supabase, crie uma tabela chamada cars com a seguinte estrutura mínima:
- id: int8 (Primary Key)
- model: text
- price: float8
- source_url: text (Unique)
- image_url: text
- roi: int8
- favorite: boolean (default: false)
- year: int8

4. Executando o Bot (Scraper)
Para buscar novos carros e alimentar o banco de dados:
- node bot.js
Nota: O bot está configurado com headless: false, então você verá uma instância do Chrome abrindo e navegando pela OLX automaticamente.

5. Executando o Site (Frontend)
Para abrir a interface web e visualizar as oportunidades:
- npm run dev
Acesse http://localhost:5173 no seu navegador.
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
📂 Estrutura do Projeto
- /src: Contém os componentes React e a lógica da interface.
- bot.js: O "cérebro" do projeto. Script de automação que extrai os dados.
- supabaseClient.js: Configuração da conexão com o banco de dados.
- public/img: Assets visuais e logo do projeto.
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
🤝 Contribuições
Lasanheiro que é lasanheiro ajuda o outro! Sinta-se à vontade para:
1. Abrir Issues para reportar bugs ou sugerir novos modelos de busca.
2. Enviar Pull Requests com melhorias no algoritmo de ROI ou novos seletores de CSS para o scraper.
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Desenvolvido por Lucas Kronemberger 🛠️🚗
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
