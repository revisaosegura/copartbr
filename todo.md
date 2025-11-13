# Copart Clone - TODO

## Estrutura Base
- [x] Header com logo, busca, seletor de idioma/região e botões de login
- [x] Menu de navegação principal
- [x] Footer com informações da empresa
- [x] Layout responsivo

## Página Inicial
- [x] Banner de destaque laranja
- [x] Hero section com título principal
- [x] Cards de Venda Direta e Leilão
- [x] Seção de veículos em destaque (grid de cards)
- [x] Seção "Mais opções, mais vantagens" (3 cards informativos)
- [x] Seção "Quem é a Copart?"
- [x] Seção de categorias (Venda Direta, Automóveis, Caminhões, Motocicletas)
- [ ] Seção "Nossos Parceiros" (carrossel)

## Páginas de Navegação
- [x] Página "Como Funciona"
- [x] Página "Encontrar um Veículo"
- [x] Página "Leilões"
- [x] Página "Localizações"
- [x] Página "Suporte"
- [x] Página "Vender Meu Carro"
- [x] Página "Venda Direta"
- [x] Página "Achar Peças"

## Páginas de Autenticação
- [x] Página de Registro
- [x] Página de Login
- [ ] Página de Comprador/Arrematante
- [ ] Página de Comitente

## Funcionalidades
- [x] Sistema de busca funcional
- [x] Seletor de idioma (Português/English)
- [ ] Seletor de região (múltiplos países)
- [x] Cards de veículos clicáveis
- [x] Página de detalhes do veículo
- [x] Navegação entre páginas funcionando
- [x] Animações e transições suaves

## Estilo e Design
- [x] Paleta de cores (azul escuro, laranja/amarelo, branco)
- [x] Tipografia consistente
- [x] Ícones e imagens
- [x] Design responsivo para mobile/tablet/desktop

## Sincronização em Tempo Real com Site Original
- [ ] Analisar APIs e endpoints do site Copart real
- [ ] Adicionar backend com servidor (upgrade para web-db-user)
- [ ] Implementar sistema de scraping/proxy para capturar dados reais
- [ ] Sistema de cache para armazenar dados
- [ ] Atualização automática em tempo real dos dados
- [ ] Sincronizar fotos dos veículos
- [ ] Sincronizar informações dos leilões
- [ ] Sincronizar preços e lances atuais
- [ ] Sincronizar catálogo completo de veículos
- [ ] Sincronizar localizações e pátios
- [ ] Sistema de polling ou websockets para atualizações

## Personalização de Contatos
- [x] Substituir todos os telefones por: +55 11 91471-9390
- [x] Substituir todos os emails por: contato@copartbr.com.br
- [x] Adicionar widget flutuante do WhatsApp
- [x] Widget deve direcionar para: https://wa.me/5511914719390
- [x] Widget fixo no canto inferior direito
- [x] Design atrativo e profissional do widget

## Sistema de Dados Simulados
- [x] Criar gerador de dados realistas de veículos
- [x] Sistema de atualização automática dos dados
- [x] Dados simulados para leilões
- [x] Dados simulados para preços e lances
- [x] Imagens realistas de veículos

## Melhorias de Design
- [x] Ajustar para ficar 100% idêntico ao site original
- [x] Verificar todas as cores e espaçamentos
- [x] Garantir tipografia idêntica
- [x] Animações e transições similares

## Painel Administrativo
- [x] Fazer upgrade do projeto para web-db-user (backend + banco de dados)
- [x] Criar estrutura do banco de dados
- [x] Dashboard com estatísticas do site
- [x] Visualização de total de veículos
- [x] Visualização de total de acessos
- [ ] Gráficos de estatísticas
- [ ] Controle de atualizações automáticas
- [ ] Ativar/desativar atualizações automáticas
- [ ] Configurar intervalo de atualização
- [x] Logs de sincronização
- [ ] Histórico de atualizações
- [ ] Registro de mudanças de preços
- [ ] Gerenciamento de conteúdo
- [x] CRUD de veículos (backend)
- [ ] Interface de CRUD de veículos (frontend)
- [ ] Edição de informações de contato
- [ ] Gerenciamento de banners
- [x] Interface amigável
- [x] Design responsivo do painel
- [x] Navegação intuitiva
- [x] Sistema de autenticação para admin

## Correções de Erros
- [x] Corrigir erro de importação das páginas Registrar e Entrar
- [x] Verificar todas as rotas funcionando
- [x] Testar navegação completa

## Análise de API Copart
- [x] Identificar endpoints de API para veículos
- [x] Documentar estrutura de requisições
- [x] Documentar estrutura de respostas
- [x] Testar endpoints identificados

## Integração Stripe
- [ ] Adicionar recurso Stripe ao projeto
- [ ] Configurar chaves de API do Stripe
- [ ] Criar endpoints de pagamento no backend
- [ ] Implementar checkout para lances
- [ ] Implementar checkout para compra direta
- [ ] Adicionar histórico de pagamentos
- [ ] Testar fluxo completo de pagamento

## Correção de Bug
- [x] Corrigir erro de tags <a> aninhadas na página AcharPecas

## Integração API de Leilão
- [x] Pesquisar APIs de leilão disponíveis
- [x] Avaliar APIs encontradas
- [ ] Selecionar melhor API (Bidlogix comercial ou sistema customizado)
- [ ] Integrar API ao backend
- [ ] Implementar sistema de lances em tempo real
- [ ] Criar interface de leilão no frontend
- [ ] Testar funcionalidades de leilão

## Logo
- [x] Adicionar logo da Copart no header

## Integração APIs de Leilão
- [x] Analisar API auction-api.app
- [x] Analisar API Apify
- [x] Testar endpoints das APIs
- [x] Criar serviço de integração Apify no backend
- [x] Adicionar token Apify nas variáveis de ambiente
- [x] Implementar função de busca de dados do Apify
- [x] Implementar processamento e salvamento de veículos
- [x] Sincronizar imagens dos veículos
- [x] Configurar cron job para atualização a cada 4 horas
- [x] Atualizar frontend para usar dados reais
- [x] Testar sincronização completa

## Análise Completa do Site Real
- [x] Mapear todos os menus e sub-menus do header
- [x] Listar todas as páginas existentes
- [x] Analisar estrutura da listagem de veículos
- [x] Identificar filtros e funcionalidades de busca
- [x] Documentar layout e design de cada página

## Atualização de Menus
- [x] Implementar menu "Início" com sub-menus
- [x] Implementar menu "Como Funciona" com sub-menus
- [x] Implementar menu "Encontrar um Veículo" com sub-menus
- [x] Implementar menu "Leilões" com sub-menus
- [x] Implementar menu "Localizações"
- [x] Implementar menu "Suporte" com sub-menus
- [x] Implementar menu "Vender Meu Carro"
- [x] Implementar menu "Venda Direta" com sub-menus
- [x] Implementar menu "Achar Peças"

## Páginas Faltantes
- [x] Lista de Vendas
- [x] Favoritos
- [x] Pesquisas Salvas
- [x] Alerta de Veículos
- [x] Leilões de Hoje
- [x] Calendário de Leilões
- [x] Como Comprar
- [x] Perguntas Comuns
- [x] Vídeos
- [x] Precisa de Ajuda?
- [x] Veja as Ofertas (Venda Direta)
- [x] O que é Venda Direta?

## Listagem de Veículos
- [x] Implementar grid de veículos idêntico ao original
- [x] Adicionar todos os filtros de busca
- [x] Implementar paginação
- [x] Adicionar ordenação de resultados etc.)
- [ ] Implementar visualização em grid/lista

## Ajustes de Design
- [ ] Garantir cores exatas do original
- [ ] Ajustar tipografia para ser idêntica
- [ ] Replicar espaçamentos e margens
- [ ] Garantir responsividade idêntica

## Melhorias Solicitadas
- [x] Atualizar página inicial para ficar 100% idêntica ao original
- [x] Adicionar cards "Venda Direta" e "Leilão" com checkboxes
- [x] Implementar seção "Veículos em destaque" com dados reais
- [x] Adicionar seção "Mais opções, mais vantagens" com 3 cards
- [x] Adicionar seção "Quem é a Copart?"
- [x] Adicionar seção de categorias (Venda Direta, Automóveis, Caminhões, Motocicletas)
- [x] Conectar listagem de veículos aos dados reais do Apify
- [x] Implementar filtros funcionais na listagem
- [x] Implementar sistema de lances em tempo real com Socket.IO
- [x] Adicionar notificações de lances

## Análise de Diferenças com Site Real
- [x] Comparar página inicial com original
- [x] Comparar header e menus com original
- [x] Identificar elementos faltantes
- [x] Documentar diferenças de design

## Elementos Faltantes Identificados
- [x] Adicionar links "Comprador/Arrematante" e "Comitente" no header (já existia)
- [x] Implementar seletor de idioma funcional (Português/English) (já existia)
- [x] Adicionar seção de categorias com ícones (Venda Direta, Automóveis, Caminhões, Motocicletas) (já existia)
- [x] Adicionar seção "Nossos Parceiros" com carrossel de logos

## Análise Detalhada Site Real vs Clone
- [x] Analisar página inicial em detalhes
- [x] Analisar página de listagem de veículos
- [x] Analisar página de detalhes do veículo
- [x] Analisar todas as páginas do menu
- [x] Comparar footer completo
- [x] Identificar funcionalidades JavaScript faltantes
- [x] Documentar todas as diferenças encontradas

## Implementações Finais Necessárias
- [x] Adicionar seletor de região funcional no header
- [x] Lista de países: USA, CANADA, UK, IRELAND, UAE, BAHRAIN, OMAN, GERMANY, SPAIN, FINLAND, BRAZIL
- [x] Implementar contador dinâmico de veículos conectado ao banco (já existia)
- [ ] Adicionar logos reais dos parceiros (opcional - requer imagens externas)

## Verificação Final 100%
- [x] Verificar header completo (logo, busca, idioma, região, botões)
- [x] Verificar banner laranja superior
- [x] Verificar hero section (título, contador, cards)
- [x] Verificar seção veículos em destaque
- [x] Verificar seção "Mais opções, mais vantagens"
- [x] Verificar seção "Quem é a Copart?"
- [x] Verificar seção de categorias
- [x] Verificar seção "Nossos Parceiros"
- [x] Verificar footer completo
- [x] Verificar widget WhatsApp
- [x] Verificar todas as páginas do menu
- [x] Verificar página de listagem de veículos
- [x] Verificar página de detalhes do veículo
- [x] **CRÍTICO**: Identificado problema - Token APIFY_API_TOKEN precisa ser configurado no painel Settings → Secrets
- [x] Testar navegação completa

## Otimização Mobile
- [x] Analisar problemas de responsividade no celular
- [x] Ajustar header para mobile (logo menor, botões compactos)
- [x] Otimizar hero section para mobile (tamanhos de fonte responsivos)
- [x] Ajustar cards Venda Direta e Leilão para mobile (padding reduzido)
- [x] Otimizar grid de veículos para mobile
- [x] Ajustar seções de conteúdo para mobile (espaçamentos responsivos)
- [x] Otimizar footer para mobile
- [x] Ajustar página de listagem para mobile (filtros responsivos, botão toggle)
- [x] Testar em diferentes tamanhos de tela (320px, 375px, 414px)

## Implementação de Busca
- [x] Criar procedure de busca no backend (tRPC)
- [x] Implementar busca por marca
- [x] Implementar busca por modelo
- [x] Implementar busca por chassis/VIN
- [x] Implementar busca por número do lote
- [x] Adicionar autocomplete no campo de busca do header
- [x] Criar página de resultados de busca
- [x] Testar busca em tempo real

## Ajustes Sistema de Lances
- [x] Corrigir valores de lances zerados
- [x] Garantir que todos os veículos tenham valores de lance válidos
- [x] Remover restrição de lance mínimo
- [x] Permitir qualquer valor de lance desejado pelo usuário
- [x] Testar sistema de lances ajustado

## Sistema de Notificações Personalizadas
- [x] Criar componente NotificationCenter para exibir notificações
- [x] Implementar NotificationBell no header com contador
- [x] Criar schema de notificações no banco de dados
- [x] Implementar backend tRPC para gerenciar notificações
- [x] Adicionar notificações para novos lances em veículos favoritos
- [x] Adicionar notificações para veículos salvos que tiveram alteração de preço
- [x] Adicionar notificações para leilões próximos
- [x] Implementar sistema de preferências de notificações
- [x] Adicionar notificações em tempo real via Socket.IO
- [x] Testar sistema completo de notificações

## Correções Sistema de Lances e Datas
- [x] Corrigir lógica de lances para usar currentBid do veículo como base
- [x] Ajustar BiddingPanel para mostrar lance atual correto quando não houver lances
- [x] Corrigir contador de lances
- [x] Atualizar anos dos veículos para 2025
- [x] Testar sistema de lances corrigido
